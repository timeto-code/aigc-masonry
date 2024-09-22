declare type CivitaiImageDto = {
  id: number;
  url: string;
  hash?: string;
  width: number;
  height: number;
  nsfw: boolean;
  nsfwLevel: string;
  postId?: number;
  username?: string;
  createdAt?: string;
  stats?: {
    cryCount?: number;
    laughCount?: number;
    likeCount?: number;
    dislikeCount?: number;
    heartCount?: number;
    commentCount?: number;
  };
  meta?: {
    Size?: string;
    seed?: number;
    Model?: string;
    steps?: number;
    prompt?: string;
    sampler?: string;
    cfgScale?: number;
    "Clip skip"?: string;
    "Hires upscale"?: string;
    "Hires upscaler"?: string;
    negativePrompt?: string;
    "Denoising strength"?: string;
  };
};
