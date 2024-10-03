"use server";

import { ApiResponse, ERROR_CODES, handleApiData, handleApiError } from "@/lib/api";
import prisma from "@/lib/db";
import { NSFW } from "@/store/useFilterStore";
import { CivitaiImage, FavoriteImage } from "@/types/prisma";

/**
 * 根据 `nextIndex` 和 `nsfw` 过滤条件获取收藏的图片列表。
 *
 * @param {number} nextIndex - 从该索引之后获取下一个收藏的图片集。
 * @param {NSFW} nsfw - NSFW 过滤条件：NSFW.Only（仅限 NSFW），NSFW.None（无 NSFW），或 NSFW 等级。
 * @returns 返回包含收藏图片列表的 `ApiResponse` 对象。
 */
export const getFavoritesByFilter = async (nextIndex: number, nsfw: NSFW, take: number): Promise<ApiResponse<FavoriteImage[] | null>> => {
  try {
    const where: { isFavor: boolean; index: { gt: number }; nsfw?: boolean; nsfwLevel?: NSFW } = {
      isFavor: true,
      index: { gt: nextIndex },
    };

    if (nsfw === NSFW.Only) {
      where.nsfw = true;
    } else if (nsfw === NSFW.None) {
      where.nsfw = false;
    } else if (nsfw === NSFW.All) {
      // do nothing
    } else {
      where.nsfwLevel = nsfw;
    }

    const favorites: FavoriteImage[] = await prisma.favorite.findMany({
      include: {
        stats: true,
        meta: true,
      },
      where,
      orderBy: {
        index: "asc",
      },
      take,
    });

    return handleApiData(favorites);
  } catch (error) {
    return handleApiError(ERROR_CODES.GET_FAVORITES_BY_FILTER_ERROR, error);
  }
};

/**
 * 获取所有收藏的图片。
 *
 * @returns 返回包含所有收藏图片列表的 `ApiResponse` 对象。
 */
export const getAllFavorites = async (): Promise<ApiResponse<FavoriteImage[] | null>> => {
  try {
    const favorites: FavoriteImage[] = await prisma.favorite.findMany({
      where: {
        isFavor: true,
      },
      include: {
        stats: true,
        meta: true,
      },
      orderBy: { index: "asc" },
    });

    return handleApiData(favorites);
  } catch (error) {
    return handleApiError(ERROR_CODES.GET_ALL_FAVORITES_ERROR, error);
  }
};

/**
 * 收藏或取消收藏图片。
 *
 * @param {number} civitaiId - 要收藏或取消收藏的图片的 civitaiId。
 * @param {boolean} isFavorite - 如果为 true，则将图片加入收藏；如果为 false，则取消收藏。
 * @returns 返回包含收藏图片 ID 或 null 的 ApiResponse 对象的 Promise。
 */
export const favoriteImage = async (civitaiId: number, isFavorite: boolean): Promise<ApiResponse<number | null>> => {
  try {
    let image: FavoriteImage | CivitaiImage | null = await prisma.favorite.findFirst({
      where: { civitaiId },
    });

    if (!image) {
      image = await prisma.image.findUnique({
        where: { civitaiId },
        include: { stats: true, meta: true },
      });
    }

    if (!image) {
      return handleApiError(ERROR_CODES.FAVORITE_IMAGE_ERROR, "Image not found");
    }

    if (isFavorite && Object.hasOwn(image, "isFavor")) {
      await prisma.favorite.update({
        where: { civitaiId },
        data: { isFavor: true },
      });
      return handleApiData(null);
    } else if (isFavorite) {
      const lastFavorite = await prisma.favorite.findFirst({
        where: { isFavor: true },
        orderBy: { index: "desc" },
      });
      const lastIndex = lastFavorite?.index || 0;

      const favorite = await prisma.favorite.create({
        data: {
          civitaiId: image.civitaiId,
          url: image.url,
          hash: image.hash,
          width: image.width,
          height: image.height,
          nsfw: image.nsfw,
          nsfwLevel: image.nsfwLevel,
          postId: image.postId,
          username: image.username,
          civitaiCreatedAt: image.civitaiCreatedAt,
          index: lastIndex + 1,
        },
      });

      const statsData = image.stats
        ? {
            cryCount: image.stats.cryCount,
            laughCount: image.stats.laughCount,
            likeCount: image.stats.likeCount,
            dislikeCount: image.stats.dislikeCount,
            heartCount: image.stats.heartCount,
            commentCount: image.stats.commentCount,
            favoriteId: favorite.id,
          }
        : null;

      const metaData = image.meta
        ? {
            Size: image.meta.Size ?? null,
            seed: image.meta.seed ?? null,
            Model: image.meta.Model ?? null,
            steps: image.meta.steps ?? null,
            prompt: image.meta.prompt ?? null,
            sampler: image.meta.sampler ?? null,
            cfgScale: image.meta.cfgScale ?? null,
            Clip_skip: image.meta.Clip_skip ?? null,
            Hires_upscale: image.meta.Hires_upscale ?? null,
            Hires_upscaler: image.meta.Hires_upscaler ?? null,
            negativePrompt: image.meta.negativePrompt ?? null,
            Denoising_strength: image.meta.Denoising_strength ?? null,
            favoriteId: favorite.id,
          }
        : null;

      await prisma.$transaction(async (prisma) => {
        statsData && (await prisma.favorStats.create({ data: statsData }));
        metaData && (await prisma.favorMeta.create({ data: metaData }));
      });

      return handleApiData(favorite.id);
    } else {
      await prisma.favorite.update({
        where: { civitaiId },
        data: { isFavor: false },
      });
      return handleApiData(null);
    }
  } catch (error) {
    return handleApiError(ERROR_CODES.FAVORITE_IMAGE_ERROR, error);
  }
};
