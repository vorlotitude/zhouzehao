"use client";

/**
 * 后处理（PostProcessing）预留模块。
 * 目前禁用，避免不必要的开销。未来需要 Bloom / Vignette / DoF 时引入
 * @react-three/postprocessing 并把效果挂在这一层。
 */
export default function PostProcessing() {
  return null;
}