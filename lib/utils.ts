import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCardPlaceholder = (
  width: number,
  height: number
): {
  placeholderHeight: number;
  color1: string;
  color2: string;
} => {
  // 计算保持比例的高度
  const placeholderHeight = Math.round((320 / width) * height);

  // 生成同一色系但亮度不同的两种颜色
  const getShadedColor = (hue: number, saturation: number, lightness: number, shade: number) => {
    return `hsl(${hue}, ${saturation}%, ${Math.max(lightness - shade, 0)}%)`;
  };

  // 选择一个基础色相和饱和度
  const baseHue = Math.floor(Math.random() * 360); // 随机色相
  const baseSaturation = 60; // 中等饱和度

  // 生成两种不同亮度的颜色，基础亮度更低
  const color1 = getShadedColor(baseHue, baseSaturation, 40, 0); // 较暗的基础亮度
  const color2 = getShadedColor(baseHue, baseSaturation, 40, 20); // 更暗

  return { placeholderHeight, color1, color2 };
};
