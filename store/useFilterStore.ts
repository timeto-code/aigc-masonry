import { create } from "zustand";

export enum PERIOD {
  AllTime = "AllTime",
  Year = "Year",
  Month = "Month",
  Week = "Week",
  Day = "Day",
}

export enum SORT {
  MostReactions = "Most Reactions",
  MostComments = "Most Comments",
  Newest = "Newest",
}

export enum NSFW {
  Only = "true",
  None = "false",
  Soft = "Soft",
  Mature = "Mature",
  X = "X",
  All = "All",
}

type FilterStore = {
  period: PERIOD;
  setPeriod: (period: PERIOD) => void;
  sort: SORT;
  setSort: (sort: SORT) => void;
  nsfw: NSFW;
  setNsfw: (nsfw: NSFW) => void;
  isChanged: boolean;
  setChanged: (isChanged: boolean) => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  period: PERIOD.AllTime,
  setPeriod: (period) =>
    set((state) => {
      if (state.period !== period) {
        state.isChanged = true;
      }
      return { period };
    }),
  sort: SORT.MostReactions,
  setSort: (sort) =>
    set((state) => {
      if (state.sort !== sort) {
        state.isChanged = true;
      }
      return { sort };
    }),
  nsfw: NSFW.None,
  setNsfw: (nsfw) =>
    set((state) => {
      if (state.nsfw !== nsfw) {
        state.isChanged = true;
      }
      return { nsfw };
    }),
  isChanged: false,
  setChanged: (isChanged: boolean) => set({ isChanged }),
}));
