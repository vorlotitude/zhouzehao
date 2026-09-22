"use client";

/**
 * 场景物品（Objects）占位。
 * 预留给未来可交互的周边物体。目前仅放一个纤细的圆环，帮助感知 3D 空间纵深与镜头运动。
 */
export default function Objects() {
  return (
    <group>
      <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.5, 0.015, 8, 64]} />
        <meshStandardMaterial color="#8a8a86" roughness={0.7} />
      </mesh>
    </group>
  );
}