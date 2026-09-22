"use client";

/**
 * 3D 人物（Character）占位。
 * 由一个抽象几何体组成，用于验证镜头环绕与灯光、阴影。
 * 未来直接替换为你的 .glb / .gltf / .fbx 模型：把 <group> 换成 <Model>（如 drei GLTF）即可。
 */
export default function Character() {
  return (
    <group>
      {/* 躯干 */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.34, 1.7, 4, 16]} />
        <meshStandardMaterial color="#151515" roughness={0.55} />
      </mesh>
      {/* 头 */}
      <mesh position={[0, 2.72, 0]} castShadow>
        <sphereGeometry args={[0.3, 24, 18]} />
        <meshStandardMaterial color="#151515" roughness={0.45} />
      </mesh>
    </group>
  );
}