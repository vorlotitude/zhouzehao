"use client";

/**
 * Lightent 的占位：目前用一盏柔和的线性光 + 环境光。
 * 未来可替换为带 HDR 的 <Environment>, 或自有光源方案。
 */
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}