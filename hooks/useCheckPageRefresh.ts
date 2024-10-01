import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const useCheckPageRefresh = () => {
  const Pathname = usePathname();
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    // 当组件挂载时，获取上一次保存的路径
    const historyPathname = sessionStorage.getItem("historyPathname");

    // console.log("historyPathname", typeof historyPathname);
    // console.log("Pathname", typeof Pathname);

    // console.log("aaa?", historyPathname === Pathname);

    // 如果路径一致，表示是刷新页面
    setIsRefresh(historyPathname === Pathname);

    // 保存当前路径
    return () => {
      sessionStorage.setItem("historyPathname", Pathname);
    };
  }, [isRefresh]);

  return { isRefresh };
};

export default useCheckPageRefresh;
