"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { getCharacterModelPath } from "@/lib/assets";

/**
 * 3D 人物。
 *
 * 渲染策略由 AssetManager 决定：
 * - 模型未提供（getCharacterModelPath() === null）→ 渲染标准化占位几何体（当前状态）。
 * - 模型已提供 → 挂载 <Model3D/>，加载 /assets/character/zhouzehao.glb 并播放其动画。
 *
 * 未来接入最终人物：
 *   1. 将 zhouzehao.glb 放入 public/assets/character/
 *   2. 把 src/lib/assets.ts 中 glbModel.ready 置为 true
 *   无需改动本文件或任何交互逻辑。
 */

/** 占位几何体：抽象的黑体人形，验证镜头环绕与灯光、阴影。 */
function PlaceholderCharacter() {
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

/**
 * 真正的 GLB 模型挂载（延迟加载）。
 * 读取动画并播放导演指定的关键帧剪辑。文件缺失时由 Suspense 兜底回退。
 */
function Model3D({ modelPath }: { modelPath: string }) {
  const { scene, animations } = useGLTF(modelPath);
  void animations; // 未来：useAnimations 播放 idle / run 剪辑
  return <primitive object={scene} castShadow />;
}

export default function Character() {
  const modelPath = getCharacterModelPath();
  if (!modelPath) return <PlaceholderCharacter />;
  return (
    <Suspense fallback={<PlaceholderCharacter />}>
      <Model3D modelPath={modelPath} />
    </Suspense>
  );
}