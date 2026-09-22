"use client";

/**
 * 后方背景（Background）占位。
 * 一块低对比的大屏障，用于调节画面纵深后的气氛。可替换或删除。
 */
export default function Background() {
  return (
    <mesh position={[0, 6, -22]}>
      <planeGeometry args={[60, 40]} />
      <meshStandardMaterial color="#ddddd9" roughness={1} />
    </mesh>
  );
}