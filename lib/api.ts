import axios from "axios";
import logger from "./logger";

export interface ApiResponse<T> {
  code: number;
  data: T | null;
}

export const handleApiData = <T>(data: T): ApiResponse<T> => {
  return { code: 1, data };
};

export const handleApiError = (code: number, error: any): ApiResponse<null> => {
  // 更加明确区分网络错误
  if (typeof error === "string") {
    logger.error(`Client error: ${error}`);
  } else if (axios.isAxiosError(error)) {
    logger.error(`Axios error: ${error.message}`);
    if (error.response) {
      logger.error(`Response data: ${error.response.data}`);
    } else if (error.request) {
      logger.error(`Request not received: ${error.request}`);
    }
  } else if (error instanceof AggregateError) {
    logger.error(`AggregateError: ${error.message}`);
  } else {
    logger.error(`Unexpected error: ${error.message}`);
  }

  return { code, data: null };
};

export const handleLocalError = (code: number, error: any): void => {
  logger.error(`Local error: ${error}`);
};

// 错误码
export const ERROR_CODES = {
  GET_LOCAL_IMAGES_ERROR: 2,
  READ_DIR_ERROR: 3,
  READ_EXIF_ERROR: 4,
  FAVORITE_IMAGE_ERROR: 5,
  CREATE_CIVITAI_HISTORY_ERROR: 6,
  CLEAR_CIVITAI_HISTORY_ERROR: 7,
  GET_CIVITAI_HISTORY_ERROR: 8,
  GET_FAVORITES_BY_FILTER_ERROR: 9,
  GET_ALL_FAVORITES_ERROR: 10,

  // next api error
  API_IMAGE_ERROR: 11,
  API_IMAGE_DOWNLOAD_ERROR: 12,
  API_READ_LOCAL_RESOURCE_ERROR: 13,
};

export interface ExifTags {
  url: string;
  width: number;
  height: number;
  type: string;
}

// 视频格式
export enum VideoType {
  MP4 = ".mp4",
  WEBM = ".webm",
  OGG = ".ogg",
}
