"use client";

/**
 * 环境（Environment）占位。
 * 暂用纯色背景代替环境贴图，避免运行时拉取外部 HDR 资源。
 * 若需要 PBR 反射，可在此引入 drei 的 <Environment preset="..." />
 */
export default function Environment() {
  return <color attach="background" args={["#e8e8e6"]} />;
}