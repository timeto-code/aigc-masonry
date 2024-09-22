import Filter from "../filter/Filter";
import { ThemeToggle } from "../theme/ThemeToggle";
import Civitai from "./Civitai";
import LocalFiles from "./LocalFiles";
import Favorites from "./Favorites";
import FavoriteVisible from "./OnlyFavoriteVisible";
import StatsVisible from "./StatsVisible";

const Navbar = () => {
  return (
    <div className="fixed bottom-2 left-2 z-10 flex flex-col space-y-2">
      <Filter />
      <Civitai />
      <Favorites />
      <LocalFiles />
      <StatsVisible />
      <FavoriteVisible />
      <ThemeToggle />
    </div>
  );
};

export default Navbar;
