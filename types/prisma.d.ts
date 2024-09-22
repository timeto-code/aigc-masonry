import { Image, Stats, Meta, Favorite, FavorStats, FavorMeta, Download, DownStats, DownMeta } from "@prisma/client";

export type CivitaiImage = Image & { stats?: Stats | null } & { meta?: Meta | null };

export type FavoriteImage = Favorite & { stats?: FavorStats | null } & { meta?: FavorMeta | null };

export type DownloadImage = Download & { stats?: DownStats } & { meta?: DownMeta };
