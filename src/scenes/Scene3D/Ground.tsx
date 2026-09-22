"use client";

/**
 * 地面（Ground）占位。
 * 简单的规则网格 + 胶片般灰阶平面，验证镜头运动与阴影投影。
 * 未来可换成你自己的 .gltf / .fbx 场景地面。
 */
export default function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#f2f2ef" roughness={0.95} />
      </mesh>
      <gridHelper args={[40, 40, "#1a1a1a", "#cfcfcb"]} position={[0, 0.001, 0]} />
    </>
  );
}