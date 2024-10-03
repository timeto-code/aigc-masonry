/**
 * alpha-test 初始化脚本
 *
 * 1. 修改当前目录 .env 文件的 NEXT_PUBLIC_ENV 变量为 production
 * 2. 当前目录执行 npm run build
 * 3. 在当前目录上级目录创建名为 <当前文件夹名-alpha-test> 的文件夹
 * 4. 复制当前目录 .next 文件夹包含内容到 <当前文件夹名-alpha-test> 文件夹下
 * 5. 复制当前目录 prisma 文件夹包含内容到 <当前文件夹名-alpha-test> 文件夹下
 * 6. 复制当前目录 .env 文件到 <当前文件夹名-alpha-test> 文件夹下
 * 7. 恢复当前目录 .env 文件的 NEXT_PUBLIC_ENV 变量为 development
 * 8. 复制当前目录 package.json 文件到 <当前文件夹名-alpha-test> 文件夹下
 * 9. 复制当前目录 package-lock.json 文件到 <当前文件夹名-alpha-test> 文件夹下
 * 10. 复制当前目录 next.config.mjs 文件到 <当前文件夹名-alpha-test> 文件夹下
 * 11. 进入 <当前文件夹名-alpha-test> 目录
 * 12. 执行 npm install --omit=dev
 * 13. 执行 npx prisma db push
 * 14. 在终端打印 "alpha-test 初始化完成，请手动迁移 public 目录内容..."
 */

import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

// 获取当前工作目录
const currentDir = process.cwd();
const currentDirName = path.basename(currentDir);
const parentDir = path.resolve(currentDir, "..");
const targetDir = path.join(parentDir, `${currentDirName}-alpha-test`);

// 修改当前目录 .env 文件的 NEXT_PUBLIC_ENV 变量为 production
const envFilePath = path.join(currentDir, ".env");
let envContent = fs.readFileSync(envFilePath, "utf8");
const originalEnvContent = envContent; // 保存原始内容，稍后恢复
envContent = envContent.replace(/NEXT_PUBLIC_ENV=.*/g, 'NEXT_PUBLIC_ENV="production"');
fs.writeFileSync(envFilePath, envContent);

// 当前目录执行 npm run build
console.log("执行 npm run build...");
execSync("npm run build", { stdio: "inherit" });

// 在当前目录上级目录创建名为 <当前文件夹名-alpha-test> 的文件夹
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
  console.log(`创建文件夹: ${targetDir}`);
}

// 复制当前目录 .next 文件夹包含内容到 <当前文件夹名-alpha-test> 文件夹下
console.log("复制 .next 文件夹...");
fs.copySync(path.join(currentDir, ".next"), path.join(targetDir, ".next"));

// 复制当前目录 prisma 文件夹包含内容到 <当前文件夹名-alpha-test> 文件夹下
console.log("复制 prisma 文件夹...");
fs.copySync(path.join(currentDir, "prisma"), path.join(targetDir, "prisma"));

// 复制当前目录 .env 文件到 <当前文件夹名-alpha-test> 文件夹下
console.log("复制 .env 文件到目标文件夹...");
fs.copySync(envFilePath, path.join(targetDir, ".env"));

// 恢复当前目录 .env 文件的 NEXT_PUBLIC_ENV 变量为 development
console.log("恢复 .env 文件中的 NEXT_PUBLIC_ENV 为 development...");
fs.writeFileSync(envFilePath, originalEnvContent);

// 复制当前目录 package.json 文件到 <当前文件夹名-alpha-test> 文件夹下
console.log("复制 package.json 文件...");
fs.copySync(path.join(currentDir, "package.json"), path.join(targetDir, "package.json"));

// 复制当前目录 package-lock.json 文件到 <当前文件夹名-alpha-test> 文件夹下
console.log("复制 package-lock.json 文件...");
fs.copySync(path.join(currentDir, "package-lock.json"), path.join(targetDir, "package-lock.json"));

// 复制当前目录 next.config.mjs 文件到 <当前文件夹名-alpha-test> 文件夹下
console.log("复制 next.config.mjs 文件...");
fs.copySync(path.join(currentDir, "next.config.mjs"), path.join(targetDir, "next.config.mjs"));

// 进入 <当前文件夹名-alpha-test> 目录
console.log(`进入文件夹: ${targetDir}`);
process.chdir(targetDir);

// 执行 npm install --omit=dev
console.log("执行 npm install --omit=dev...");
execSync("npm install --omit=dev", { stdio: "inherit" });

// 执行 npx prisma db push
console.log("执行 npx prisma db push...");
execSync("npx prisma db push", { stdio: "inherit" });

// 在终端打印 "alpha-test 初始化完成，请手动迁移 public 目录内容..."
console.log("alpha-test 初始化完成，请手动迁移 public 目录内容... \n");

// 打开目标文件夹
if (process.platform === "win32") {
  execSync(`explorer ${targetDir.replace(/\//g, "\\")}`);
} else {
  execSync(`open ${targetDir}`);
}
