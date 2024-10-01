"use server";

/**
 * 获取当前 session 的已搜索 Civitai 图片记录。
 *
 * @returns 返回包含 CivitaiImage 列表或 null 的 ApiResponse 对象的 Promise。
 */
import { ApiResponse, ERROR_CODES, handleApiData, handleApiError } from "@/lib/api";
import prisma from "@/lib/db";
import { NSFW } from "@/store/useFilterStore";
import { CivitaiImage } from "@/types/prisma";

export const getCivitaiHistory = async (nsfw: NSFW): Promise<ApiResponse<CivitaiImage[] | null>> => {
  try {
    const where: {
      nsfw?: boolean;
      nsfwLevel?: {
        in: NSFW[];
      };
    } = {};

    if (nsfw === NSFW.Only) {
      where.nsfw = true;
    } else if (nsfw === NSFW.None) {
      where.nsfw = false;
    } else if (nsfw === NSFW.Soft) {
      where.nsfwLevel = { in: [NSFW.None, NSFW.Soft] };
    } else if (nsfw === NSFW.Mature) {
      where.nsfwLevel = { in: [NSFW.None, NSFW.Soft, NSFW.Mature] };
    } else if (nsfw === NSFW.X) {
      where.nsfwLevel = { in: [NSFW.None, NSFW.Soft, NSFW.Mature, NSFW.X] };
    }

    const images: CivitaiImage[] = await prisma.image.findMany({
      where,
      include: {
        stats: true,
        meta: true,
      },
      orderBy: {
        sort: "asc",
      },
    });

    return handleApiData(images);
  } catch (error) {
    return handleApiError(ERROR_CODES.GET_CIVITAI_HISTORY_ERROR, error);
  }
};

/**
 * 根据传入的数据创建或更新 Civitai 图片记录。
 * 如果图片已存在，则更新其数据；如果图片不存在，则创建新记录。
 * 同时更新或创建相关的统计数据 (stats) 和元数据 (meta)。
 *
 * @param {CivitaiImageDto[]} data - 包含 Civitai 图片信息的 DTO 数据列表。
 * @returns 返回包含创建或更新后的 CivitaiImage 列表或 null 的 ApiResponse 对象的 Promise。
 */
export const createCivitaiHistory = async (data: CivitaiImageDto[]): Promise<ApiResponse<CivitaiImage[] | null>> => {
  try {
    const images: CivitaiImage[] = [];

    // 获取 image 总数
    const total = await prisma.image.count();

    const imageOperations = data.map(async (img, index) => {
      const existingImage = await prisma.image.findUnique({
        where: { civitaiId: img.id },
        include: { stats: true, meta: true },
      });

      let upsertedImage: CivitaiImage;

      if (existingImage) {
        upsertedImage = (await prisma.image.update({
          where: { civitaiId: img.id },
          data: {
            url: img.url,
            hash: img.hash,
            width: img.width,
            height: img.height,
            nsfw: img.nsfw,
            nsfwLevel: img.nsfwLevel,
            postId: img.postId,
            username: img.username,
            civitaiCreatedAt: img.createdAt + "s",
          },
        })) as CivitaiImage;

        // 更新 Stats
        if (img.stats) {
          const updatedStats = await prisma.stats.update({
            where: { imageId: existingImage.id },
            data: { ...img.stats },
          });
          upsertedImage.stats = updatedStats;
        }

        // 更新 Meta
        if (img.meta) {
          const updatedMeta = await prisma.meta.update({
            where: { imageId: existingImage.id },
            data: transformMetaData(img.meta),
          });
          upsertedImage.meta = updatedMeta;
        }
      } else {
        // 如果图片不存在，创建新图片
        upsertedImage = (await prisma.image.create({
          data: {
            civitaiId: img.id,
            url: img.url,
            hash: img.hash,
            width: img.width,
            height: img.height,
            nsfw: img.nsfw,
            nsfwLevel: img.nsfwLevel,
            postId: img.postId,
            username: img.username,
            civitaiCreatedAt: img.createdAt + "s",
            sort: total + index,
          },
        })) as CivitaiImage;

        // 创建 Stats
        if (img.stats) {
          const newStats = await prisma.stats.create({
            data: {
              ...img.stats,
              imageId: upsertedImage.id,
            },
          });
          upsertedImage.stats = newStats;
        }

        // 创建 Meta
        if (img.meta) {
          const newMeta = await prisma.meta.create({
            data: {
              ...transformMetaData(img.meta),
              imageId: upsertedImage.id,
            },
          });
          upsertedImage.meta = newMeta;
        }
      }

      images.push(upsertedImage);
    });

    await Promise.all(imageOperations);

    // 根据 sort 字段排序
    images.sort((a, b) => a.sort! - b.sort!);

    return handleApiData(images);
  } catch (error) {
    return handleApiError(ERROR_CODES.CREATE_CIVITAI_HISTORY_ERROR, error);
  }
};

/**
 * 清空 Civitai 图片搜索记录。
 *
 * @returns 返回包含 null 的 ApiResponse 对象的 Promise。
 */
export const clearCivitaiHistory = async (): Promise<ApiResponse<null>> => {
  try {
    await prisma.image.deleteMany();

    return handleApiData(null);
  } catch (error) {
    return handleApiError(ERROR_CODES.CLEAR_CIVITAI_HISTORY_ERROR, error);
  }
};

// 工具函数：处理 Meta 数据的格式化
const transformMetaData = (meta: CivitaiImageDto["meta"]) => ({
  Size: meta?.Size ?? null,
  seed: meta?.seed ?? null,
  Model: meta?.Model ?? null,
  steps: meta?.steps ?? null,
  prompt: meta?.prompt ?? null,
  sampler: meta?.sampler ?? null,
  cfgScale: meta?.cfgScale ?? null,
  Clip_skip: meta?.["Clip skip"] ?? null,
  Hires_upscale: meta?.["Hires upscale"] ?? null,
  Hires_upscaler: meta?.["Hires upscaler"] ?? null,
  negativePrompt: meta?.negativePrompt ?? null,
  Denoising_strength: meta?.["Denoising strength"] ?? null,
});
