import React from "react";

interface Props {
  emoji: string;
  count: number;
  action: () => void;
}

const Action = ({ emoji, count, action }: Props) => {
  // 将数量格式化为 K
  let newCount = count.toString();
  if (count >= 1000) {
    let formattedNum = (count / 1000).toFixed(1);
    // 如果小数部分为0，则去掉小数部分
    if (formattedNum.endsWith(".0")) {
      formattedNum = Math.round(count / 1000).toString();
    }
    newCount = formattedNum + "K";
  }

  return (
    <button className="rounded" onClick={action} disabled>
      <div className="h-full align-middle space-x-0.5 pb-0.5">
        <span className="text-[14px]">{emoji}</span>
        <span className="text-[12px] font-semibold text-white">{count}</span>
      </div>
    </button>
  );
};

export default Action;
