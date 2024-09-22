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
};

export const useFilterStore = create<FilterStore>((set) => ({
  period: PERIOD.AllTime,
  setPeriod: (period) => set({ period }),
  sort: SORT.MostReactions,
  setSort: (sort) => set({ sort }),
  nsfw: NSFW.None,
  setNsfw: (nsfw) => set({ nsfw }),
}));
