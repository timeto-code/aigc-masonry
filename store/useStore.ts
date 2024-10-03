import { ExifTags } from "@/lib/api";
import { CivitaiImage, FavoriteImage } from "@/types/prisma";
import { create } from "zustand";

type Store = {
  isFetching: boolean;
  setIsFetching: (isFetching: boolean) => void;
  onlyFavoriteVisible: boolean;
  setOnlyFavoriteVisible: (onlyFavoriteVisible: boolean) => void;
  favoriteVisible: boolean;
  setFavoriteVisible: (favoriteVisible: boolean) => void;
  statsVisible: boolean;
  setStatsVisible: (statsVisible: boolean) => void;
  downloadVisible: boolean;
  setDownloadVisible: (downloadVisible: boolean) => void;
  setVisible: (visible: boolean) => void;

  lightboxVisible: boolean;
  setLightboxVisible: (lightboxVisible: boolean) => void;
  lightboxImage: CivitaiImage | FavoriteImage | ExifTags | null;
  setLightboxImage: (lightboxImage: CivitaiImage | FavoriteImage | ExifTags | null) => void;

  showRestoreScrollButton: boolean;
  setShowRestoreScrollButton: (showRestoreScrollButton: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  isFetching: false,
  setIsFetching: (isFetching) => set({ isFetching }),
  onlyFavoriteVisible: true,
  setOnlyFavoriteVisible: (onlyFavoriteVisible) => set({ onlyFavoriteVisible }),
  favoriteVisible: false,
  setFavoriteVisible: (favoriteVisible) => set({ favoriteVisible }),
  statsVisible: false,
  setStatsVisible: (statsVisible) => set({ statsVisible }),
  downloadVisible: false,
  setDownloadVisible: (downloadVisible) => set({ downloadVisible }),
  setVisible: (visible) => set({ favoriteVisible: visible, statsVisible: visible, downloadVisible: visible }),

  lightboxVisible: false,
  setLightboxVisible: (lightboxVisible) => set({ lightboxVisible }),
  lightboxImage: null,
  setLightboxImage: (lightboxImage) =>
    set(() => {
      if (lightboxImage) {
        return { lightboxImage, lightboxVisible: true };
      } else {
        return { lightboxImage, lightboxVisible: false };
      }
    }),

  showRestoreScrollButton: false,
  setShowRestoreScrollButton: (showRestoreScrollButton) => set({ showRestoreScrollButton }),
}));
