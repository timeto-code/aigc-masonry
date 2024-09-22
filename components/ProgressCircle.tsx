const ProgressCircle = ({ progress, size = 20, strokeWidth = 2 }: { progress: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2; // 半径
  const circumference = 2 * Math.PI * radius; // 圆的周长
  const offset = circumference - (progress / 100) * circumference; // 计算 stroke-dashoffset

  // 动态生成颜色，根据进度调整色相 (hue)
  const getProgressColor = (progress: number) => {
    // 色相从120°（绿色）到200°（蓝色）
    const hue = 120 + ((200 - 120) * progress) / 100; // 绿色到蓝色渐变

    // // 色相从200°（蓝色）到120°（绿色）
    // const hue = 200 - ((200 - 120) * progress) / 100; // 蓝色到绿色渐变

    return `hsl(${hue}, 100%, 50%)`; // 保持饱和度和亮度不变
  };

  return (
    <svg width={size} height={size} className="circular-progress-bar">
      <circle
        cx={size / 2} // 圆心的 x 坐标
        cy={size / 2} // 圆心的 y 坐标
        r={radius} // 半径
        strokeWidth={strokeWidth} // 圆环宽度
        fill="none"
        stroke="#e6e6e6" // 背景颜色
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        stroke={getProgressColor(progress)} // 动态生成颜色
        strokeLinecap="round" // 圆形线头
        strokeDasharray={circumference} // 设置圆的总长度
        strokeDashoffset={offset} // 设置剩余的部分
        style={{ transition: "stroke-dashoffset  0s linear" }} // 添加动画
      />
      {/* <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20px" fill="#000">
        {`${progress}%`}
      </text> */}
    </svg>
  );
};

export default ProgressCircle;
