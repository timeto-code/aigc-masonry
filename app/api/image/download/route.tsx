import { ERROR_CODES, handleApiData, handleApiError, VideoType } from "@/lib/api";
import { localdir } from "@/lib/directories";
import axios from "axios";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Promisify 写入流
const streamToPromise = (stream: fs.WriteStream) =>
  new Promise<void>((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

export const POST = async (req: NextRequest) => {
  try {
    const { downloadLink } = (await req.json()) as { downloadLink: string };

    if (!downloadLink) {
      return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_DOWNLOAD_ERROR, "Missing download link"));
    }

    // 确保路径的安全性，并处理下载链接中的文件扩展名
    const fileExtension = path.extname(downloadLink) || ".unknown";
    if (fileExtension.length > 10) {
      return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_DOWNLOAD_ERROR, `Invalid file extension: ${fileExtension}`));
    }
    // 只允许字母、数字和点号
    const sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9.]/g, "");
    const filepath = path.join(localdir, `${Date.now()}${sanitizedExtension}`);

    // 创建文件写入流
    const writer = fs.createWriteStream(filepath);

    // 发起下载请求
    const response = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream",
    });

    // 管道流入写入器
    response.data.pipe(writer);

    // 等待写入完成
    // await streamToPromise(writer);

    return NextResponse.json(handleApiData(null));
  } catch (error) {
    return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_DOWNLOAD_ERROR, error));
  }
};

/**
 * 下载链接资源，并通过 SSE 发送下载进度到前端
 *
 * Civitai 的下载资源连接有时虽然是以 .jpeg 结尾，但实际上是 .mp4 格式的视频文件。
 * 所以不能通过文件扩展名来判断文件类型，需要通过响应 Content-Type 来判断。
 *
 * @searchParams {string} link - 下载链接
 */
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const downloadLink = searchParams.get("link");

  if (!downloadLink) {
    return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_DOWNLOAD_ERROR, "Missing download link"));
  }

  // 确保路径的安全性，并处理下载链接中的文件扩展名
  const fileExtension = path.extname(downloadLink) || ".unknown";
  if (fileExtension.length > 10) {
    return NextResponse.json(handleApiError(ERROR_CODES.API_IMAGE_DOWNLOAD_ERROR, `Invalid file extension: ${fileExtension}`));
  }

  // 只允许字母、数字和点号
  // const sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9.]/g, "");
  let sanitizedExtension = "";
  let filepath = path.join(localdir, `${Date.now()}`);

  const encoder = new TextEncoder();

  let totalSize = 0;
  let bytesRead = 0;

  const customReadable = new ReadableStream({
    async start(controller) {
      try {
        // 发起 Axios 请求，设置 responseType 为 'stream'，获取流
        const response = await axios({
          method: "GET",
          url: downloadLink,
          responseType: "stream",
        });

        // 如果响应头中没有 Content-Type，则抛出异常
        if (!response.headers["content-type"]) {
          throw new Error("Civitai response missing [Content-Type] header");
        }

        // 如果文件扩展名为空，则根据 Content-Type 获取扩展名
        if (!sanitizedExtension) {
          // 获取响应的 Content-Type
          const contentType = response.headers["content-type"];
          if (contentType.startsWith("image/")) {
            sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9.]/g, "");
          } else if (contentType.startsWith("video/")) {
            sanitizedExtension = getSanitizedExtension(contentType);
          }
          // 拼接文件路径
          filepath += sanitizedExtension;
        }

        // 获取文件总大小
        totalSize = parseInt(response.headers["content-length"], 10);

        // 创建一个本地文件写入流
        const fileWriter = fs.createWriteStream(filepath);

        // 监听数据流，写入本地文件并计算下载进度
        response.data.on("data", (chunk: any) => {
          bytesRead += chunk.length; // 累加读取的字节数

          // 将数据写入本地文件
          fileWriter.write(chunk);

          // 计算下载进度百分比
          const progress = ((bytesRead / totalSize) * 100).toFixed(2);

          // 向前端发送下载进度
          controller.enqueue(encoder.encode(`data: ${progress}%\n\n`));
        });

        // 当文件下载完毕时
        response.data.on("end", () => {
          // 关闭文件写入流
          fileWriter.end();

          // 下载完成，发送结束消息
          controller.enqueue(encoder.encode("data: download complete\n\n"));
          controller.close(); // 关闭 SSE 流
        });

        // 监听错误事件
        response.data.on("error", (err: any) => {
          controller.error(err);
        });
      } catch (error) {
        // 捕获异常并发送错误信息
        controller.enqueue(encoder.encode(`data: error: ${error}\n\n`));
        controller.error(error);
      }
    },
  });

  return new Response(customReadable, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
};

const getSanitizedExtension = (contentType: string): string => {
  const mimeTypes: Record<string, string> = {
    "video/mp4": VideoType.MP4,
    "video/webm": VideoType.WEBM,
    "video/ogg": VideoType.OGG,
  };

  // 返回对应的扩展名，默认返回空字符串以防万一
  return mimeTypes[contentType] || "";
};
