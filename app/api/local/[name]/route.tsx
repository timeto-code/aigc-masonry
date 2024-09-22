import { ERROR_CODES, handleApiError } from "@/lib/api";
import { localdir } from "@/lib/directories";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const GET = async (req: NextRequest, { params }: { params: { name: string } }) => {
  const { name } = params;
  const filePath = path.join(localdir, name);

  try {
    // 检查文件是否存在以及获取文件大小
    const stats = await fs.promises.stat(filePath);

    const downloadStream = fs.createReadStream(filePath);

    const data: ReadableStream<Uint8Array> = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        downloadStream.on("end", () => {
          controller.close();
        });
        downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
      },
      cancel() {
        downloadStream.destroy();
      },
    });

    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename="${encodeURIComponent(path.basename(filePath))}"`,
        "content-type": "application/octet-stream", // 根据文件实际类型调整
        "content-length": stats.size.toString(),
        "accept-ranges": "bytes",
      }),
    });

    return res;
  } catch (error) {
    return new NextResponse(JSON.stringify(handleApiError(ERROR_CODES.API_READ_LOCAL_RESOURCE_ERROR, "File not found")), { status: 404 });
  }
};
