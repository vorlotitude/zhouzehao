"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { scrollController } from "@/lib/scroll";
import { sampleWorld } from "@/data/timeline";
import Camera from "./Camera";
import Lighting from "./Lighting";
import Environment from "./Environment";
import Background from "./Background";
import Ground from "./Ground";
import Character from "./Character";
import Objects from "./Objects";
import PostProcessing from "./PostProcessing";

/**
 * 3D 场景容器（占位）。
 * - 整块容器的不透明度由 2D→3D 混合系数 dim3d 驱动，完成连续转场。
 * - Canvas 仅在滚动进入序幕后按需挂载（由上层 Experience 懒加载），避免首次访问加载 three.js。
 */
export default function Scene3D() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const off = scrollController.register((s) => {
      const w = sampleWorld(s.progress);
      const el = boxRef.current;
      if (!el) return;
      el.style.opacity = String(w.dim3d);
      el.style.pointerEvents = w.dim3d > 0.5 ? "auto" : "none";
    });
    return off;
  }, []);

  return (
    <div className="scene-3d" ref={boxRef} style={{ opacity: 0 }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows
        camera={{ fov: 40, near: 0.1, far: 100, position: [0, 3, 9] }}
      >
        <Lighting />
        <Environment />
        <Background />
        <Ground />
        <Character />
        <Objects />
        <PostProcessing />
        <Camera />
      </Canvas>
    </div>
  );
}