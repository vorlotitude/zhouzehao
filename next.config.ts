import type { NextConfig } from "next";

const GITHUB_PAGES_BASE = "/zhouzehao";

const nextConfig: NextConfig = {
  // 静态导出：输出到 out/，可部署到任意静态托管（如 GitHub Pages）
  output: "export",
  // GitHub Pages 子路径（站点位于 https://<user>.github.io/zhouzehao/）
  basePath: GITHUB_PAGES_BASE,
  assetPrefix: GITHUB_PAGES_BASE,
  images: { unoptimized: true },
};

export default nextConfig;
