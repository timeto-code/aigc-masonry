import { clearCivitaiHistory } from "@/actions/civitai";
import CivitaiMasonry from "@/components/masonry/CivitaiMasonry";

const page = () => {
  // // 清空历史记录
  // clearCivitaiHistory();

  return <CivitaiMasonry />;
};

export default page;
