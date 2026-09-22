"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { scrollController } from "@/lib/scroll";
import { sampleWorld } from "@/data/timeline";
import { clamp, lerp, smoothstep } from "@/lib/math";

/**
 * 2D→3D 转场的镜头驱动。
 * 随着 dim3d 从 0→1，摄像机绕人物（位于原点）从正面环绕约 180° 到达其背后。
 */
export default function Camera() {
  const { camera } = useThree();

  useEffect(() => {
    const off = scrollController.register(() => {
      const w = sampleWorld(scrollController.progress);
      const t = smoothstep(0.5, 1, clamp(w.dim3d, 0, 1));

      // 环绕方位角（度），0=正面(+z)，180=背后(-z)
      const azimuth = lerp(8, 188, t);
      const radius = lerp(9.5, 7.2, t); // 略推近
      // 极角微调，营造纵深渐显
      const polar = lerp(1.28, 1.42, t);

      const az = (azimuth * Math.PI) / 180;
      const x = radius * Math.sin(az) * Math.sin(polar);
      const y = radius * Math.cos(polar);
      const z = radius * Math.cos(az) * Math.sin(polar);

      camera.position.set(x, y, z);
      camera.lookAt(0, 1.2, 0);
    });
    return off;
  }, [camera]);

  return null;
}