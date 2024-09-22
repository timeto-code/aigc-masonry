import { useStore } from "@/store/useStore";
import { CloudDownload } from "lucide-react";
import ProgressCircle from "../ProgressCircle";

export type DOWNLOAD_STATUS = "Started" | "Downloading" | "Completed" | "Error" | "None";

export const downloadImage = async (url: string, setProgress: (progress: number) => void, setStatus: (status: DOWNLOAD_STATUS) => void) => {
  try {
    setStatus("Started");
    setProgress(0);

    const searchParams = new URLSearchParams();
    searchParams.append("link", url);
    const eventSource = new EventSource("/api/image/download" + "?" + searchParams.toString());

    // 监听事件
    eventSource.onmessage = (event) => {
      const message = event.data;

      if (message.includes("download complete")) {
        setStatus("Completed");
        setProgress(100);
        // 关闭连接
        eventSource.close();
      } else {
        setStatus("Downloading");
        setProgress(parseFloat(message));
      }
    };

    // 错误处理
    eventSource.onerror = (err) => {
      setStatus("Error");
      eventSource.close();
    };
  } catch (error) {
    // 下载失败
  }
};

interface Props {
  url: string;
  progress: number;
  setProgress: (progress: number) => void;
  status: DOWNLOAD_STATUS;
  setStatus: (status: DOWNLOAD_STATUS) => void;
}

const Download = ({ url, progress, setProgress, status, setStatus }: Props) => {
  const downloadVisible = useStore((state) => state.downloadVisible);

  return (
    <>
      {status === "None" && (
        <div className={`${downloadVisible ? "" : "opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible"}`}>
          <div className="flex justify-between absolute bottom-2.5 right-1.5">
            <button className={`mr-2 text-white/70 hover:text-sky-600`} onClick={() => downloadImage(url, setProgress, setStatus)}>
              <CloudDownload size={20} />
            </button>
          </div>
        </div>
      )}

      {status === "Error" && (
        <div className={`${downloadVisible ? "" : "opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible"}`}>
          <div className="flex justify-between absolute bottom-2.5 right-1.5">
            <button className={`mr-2 text-red-600`} onClick={() => downloadImage(url, setProgress, setStatus)}>
              <CloudDownload size={20} />
            </button>
          </div>
        </div>
      )}

      {status === "Completed" && (
        <div className={`${downloadVisible ? "" : "opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible"}`}>
          <div className="flex justify-between absolute bottom-2.5 right-1.5">
            <button className={`mr-2 text-green-600`} onClick={() => downloadImage(url, setProgress, setStatus)}>
              <CloudDownload size={20} />
            </button>
          </div>
        </div>
      )}

      {(status === "Started" || status === "Downloading") && (
        <div className="absolute bottom-[11px] right-[15px]">
          <ProgressCircle progress={progress} size={18} />
        </div>
      )}
    </>
  );
};

export default Download;
