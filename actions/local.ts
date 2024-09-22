"use server";

import { ApiResponse, ERROR_CODES, ExifTags, handleApiData, handleApiError, handleLocalError, VideoType } from "@/lib/api";
import { localdir } from "@/lib/directories";
import ExifReader from "exifreader";
import fs from "fs/promises";
import path from "path";

/**
 * 读取指定目录，返回该目录下的所有图片文件路径。
 *
 * 该函数会遍历指定的目录，查找符合条件的图片文件（扩展名为 .jpg, .jpeg, .png）。
 * 它只会返回文件路径，不包括子目录中的文件。
 *
 * @param {string} directoryPath - 需要读取的目录路径。
 * @returns 该目录下的所有图片文件路径。
 */
const readDir = async (directoryPath: string): Promise<string[]> => {
  const images: string[] = [];
  const validExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ...Object.values(VideoType)]);

  try {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);
      // const stats = await fs.stat(filePath);

      if (file.isFile()) {
        const fileExtension = path.extname(file.name).toLowerCase();
        if (validExtensions.has(fileExtension)) {
          images.push(filePath);
        }
      } else if (file.isDirectory()) {
        // 如果是目录，递归读取
      }
    }
  } catch (error) {
    handleLocalError(ERROR_CODES.READ_DIR_ERROR, error);
  }

  return images;
};

/**
 * 从指定文件路径读取 EXIF 数据，并返回文件的基本信息。
 *
 * 该函数使用 ExifReader 读取文件的 EXIF 数据，返回图像的宽度、高度、类型等基本信息。
 * 如果读取不到图像宽度或高度，或者出现任何错误，将返回 null。
 *
 * @param {string} filePath - 需要读取 EXIF 信息的文件路径。
 * @returns 包含文件 EXIF 信息的对象，读取失败时返回 null。
 */
const readExif = async (filePath: string): Promise<ExifTags | null> => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    const isVideo = Object.values(VideoType).includes(fileExtension as VideoType);

    let url = "";
    let width = 0;
    let height = 0;
    let type = "Unknown";

    const api = "/api/local";

    if (!isVideo) {
      const tags = await ExifReader.load(filePath);

      const { "Image Width": imageWidth, "Image Height": imageHeight, FileType: fileType } = tags;
      if (!imageWidth || !imageHeight) {
        return null;
      }

      url = filePath.replace(localdir, api).replace(/\\/g, "/");
      width = imageWidth.value;
      height = imageHeight.value;
      type = fileType?.value || type;
      type = "image";
    } else {
      url = filePath.replace(localdir, api).replace(/\\/g, "/");
      width = 320;
      height = 0;
      // type = fileExtension.split(".").pop() || type;
      type = "video";
    }
    const exifTags = { url, width, height, type };

    return exifTags;
  } catch (error) {
    handleLocalError(ERROR_CODES.READ_EXIF_ERROR, error);
    return null;
  }
};

/**
 * 获取本地下载目录下的所有图片的 EXIF 信息。
 *
 * 该函数会从指定的下载目录（`public/downloads`）中读取所有图片文件，提取它们的 EXIF 数据并返回。
 * 如果读取或提取 EXIF 过程中发生错误，函数会捕获错误并返回处理后的错误响应。
 *
 * @returns 返回包含 EXIF 信息的数组。
 */
export const getLocalImages = async (): Promise<ApiResponse<ExifTags[] | null>> => {
  try {
    const images = await readDir(localdir);

    const exifTags = await Promise.all(images.map((image) => readExif(image)));

    const validExifTags = exifTags.filter((tag): tag is ExifTags => tag !== null);

    return handleApiData(validExifTags);
  } catch (error) {
    return handleApiError(ERROR_CODES.GET_LOCAL_IMAGES_ERROR, error);
  }
};
