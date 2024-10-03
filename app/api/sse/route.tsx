import { NextRequest } from "next/server";
import { createReadStream, statSync } from "fs";
import { publicdir } from "@/lib/directories";
import path from "path";
import logger from "@/lib/logger";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filename = searchParams.get("filename");

    if (!filename) {
      return new Response("Missing filename", { status: 400 });
    }

    const encoder = new TextEncoder();

    // 模拟视频文件路径
    const videoPath = path.join(publicdir, filename);
    const videoStat = statSync(videoPath); // 获取文件的大小
    const totalSize = videoStat.size; // 文件总大小

    // 创建可读流读取视频文件
    const videoStream = createReadStream(videoPath, {
      highWaterMark: 1024 * 1024, // 每次读取1MB
    });

    let bytesRead = 0; // 已经读取的字节数

    const customReadable = new ReadableStream({
      start(controller) {
        // 监听读取数据事件
        videoStream.on("data", (chunk) => {
          bytesRead += chunk.length;

          // 模拟下载进度计算
          const progress = ((bytesRead / totalSize) * 100).toFixed(2);

          // 通过 SSE 发送下载进度
          controller.enqueue(encoder.encode(`data: ${progress}%\n\n`));

          // 模拟传输间隔，避免过快
          setTimeout(() => {}, 500); // 延迟500ms发送
        });

        // 监听流结束事件
        videoStream.on("end", () => {
          // console.log(`Download complete, total bytes read: ${bytesRead}`);

          // 下载完成，发送结束消息
          controller.enqueue(encoder.encode("data: download complete\n\n"));
          controller.close(); // 关闭流
        });

        // 监听流错误事件
        videoStream.on("error", (err) => {
          controller.error(err);
        });
      },
    });

    return new Response(customReadable, {
      // 设置 SSE 响应头
      headers: {
        Connection: "keep-alive",
        "Content-Encoding": "none",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    });
  } catch (error) {
    logger.error(`Error occurred while downloading video: ${error}`);
    return new Response("Error occurred while downloading video", { status: 500 });
  }
};
