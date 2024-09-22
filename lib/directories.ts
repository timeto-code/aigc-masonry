import path from "path";

export const rootdir = process.cwd();

export const publicdir = path.join(rootdir, "public");

export const localdir = path.join(publicdir, "local");

export const favoritesdir = path.join(publicdir, "favorites");
