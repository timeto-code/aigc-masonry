import { useStore } from "@/store/useStore";
import styles from "@/styles/Card.module.scss";
import { CivitaiImage, FavoriteImage } from "@/types/prisma";
import Action from "./Action";

interface Props {
  img: CivitaiImage | FavoriteImage;
}

const Stats = ({ img }: Props) => {
  const statsVisible = useStore((state) => state.statsVisible);

  return (
    <div className={`flex justify-between absolute  p-1.5 w-full  transition-all duration-300 ${statsVisible ? "bottom-0" : "-bottom-10 group-hover:bottom-0"}`}>
      <div className={styles.action_bar}>
        <div className="h-full flex items-center space-x-3 pl-[6px] pr-[12px]">
          <Action emoji="👍" count={img.stats?.likeCount ?? 0} action={() => {}} />
          <Action emoji="❤️" count={img.stats?.heartCount ?? 0} action={() => {}} />
          <Action emoji="😂" count={img.stats?.laughCount ?? 0} action={() => {}} />
          <Action emoji="😢" count={img.stats?.cryCount ?? 0} action={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
