import { clearCivitaiHistory } from "@/actions/civitai";
import CivitaiMasonry from "@/components/masonry/CivitaiMasonry";

const page = async () => {
  // 清空历史记录
  // await clearCivitaiHistory();

  return <CivitaiMasonry />;
};

export default page;
