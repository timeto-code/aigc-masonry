## 运行环境

- [Node.js](https://nodejs.org/) `v20.x` 或更高版本。推荐使用 `v20.17.0 LTS` 版本。

- 能够访问 [Civitai](https://civitai.com/) 网站。无法访问的情况下，只能使用本地资源功能。

## 安装 & 运行

1. 下载应用并解压。

1. 打开终端，进入应用目录。

1. 执行 `npm install  --omit=dev` 安装依赖。

1. 执行 `npx prisma db push` 初始化数据库。

1. （可选）编辑 package.json 文件，自定义 `start` 脚本中的 `-p` 端口号，默认 80。

1. 执行 `npm start` 运行。

1. 打开浏览器，访问 `http://localhost` 或 `http://localhost:端口号`。

## 框架 & 依赖

- [Next.js](https://nextjs.org/) - React 框架。

- [Shadcn/ui](https://ui.shadcn.com/) - UI 组件库。

- [MUI](https://mui.com/) - UI 组件库。

- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架。

- [Prisma](https://www.prisma.io/) - 数据库 ORM。

- [SQLite](https://www.sqlite.org/) - 数据库。

- [TypeScript](https://www.typescriptlang.org/) - JavaScript 超集。

## API

- [Civitai API](https://github.com/civitai/civitai/wiki/REST-API-Reference/) - Images API。
