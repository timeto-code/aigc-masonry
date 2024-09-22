"use client";

import React, { useState } from "react";
import ProgressCircle from "./ProgressCircle";

const SSE = () => {
  const [progress, setProgress] = useState(0); // 用于存储下载进度
  const [status, setStatus] = useState("Starting...");

  const handleDownload = async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("filename", "video.mp4");

    // 初始化 EventSource，连接后端的 SSE 路径
    const eventSource = new EventSource(`/api/sse?${searchParams.toString()}`);

    // 监听事件
    eventSource.onmessage = (event) => {
      const message = event.data;

      if (message.includes("download complete")) {
        setStatus("Download complete");
        setProgress(100); // 下载完成
        sessionStorage.setItem("isDone", "true");

        // 关闭连接
        eventSource.close();
      } else {
        setStatus("Downloading...");
        setProgress(parseFloat(message)); // 解析进度并更新 state
      }
    };

    // 错误处理
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setStatus("Error occurred while downloading");
      eventSource.close();
    };
  };

  return (
    <>
      <button onClick={handleDownload}>下载</button>
      <h1>Video Download Progress</h1>
      <p>Status: {status}</p>
      <progress value={progress} max="100"></progress>
      <p>{progress}%</p>

      <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
      <ProgressCircle progress={progress} />
    </>
  );
};

export default SSE;
