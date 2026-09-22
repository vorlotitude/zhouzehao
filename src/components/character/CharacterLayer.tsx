"use client";

import { useEffect, useRef } from "react";
import { scrollController } from "@/lib/scroll";
import { sampleWorld } from "@/data/timeline";
import { smoothstep, clamp } from "@/lib/math";
import { poseDef } from "./poses";
import CharacterPlaceholder, {
  type CharacterPlaceholderHandle,
} from "./CharacterPlaceholder";

const RUN_RATE = 0.094; // 奔跑节拍：约每移动 1vw 世界距离推进该弧度数

export default function CharacterLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<CharacterPlaceholderHandle>(null);
  const phaseRef = useRef(0);
  const prevWorldXRef = useRef<number | null>(null);
  const halfWRef = useRef(0); // 图层半宽（px），用于以人物中心为基准定位

  useEffect(() => {
    const measure = () => {
      if (layerRef.current) halfWRef.current = layerRef.current.offsetWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const off = scrollController.register((s) => {
      const world = sampleWorld(s.progress);
      const el = layerRef.current;
      if (!el) return;

      // 进场（右入 + 轻微下落 + 淡入）
      const enterT = smoothstep(0, 0.035, s.progress);
      const settleY = (1 - enterT) * 9; // vh

      // 奔跑状态系数：在奔跑段为 1，做空/停顿段回落
      const runAmount =
        (world.poseLeft === "run" ? 1 - world.poseWeight : 0) +
        (world.poseRight === "run" ? world.poseWeight : 0);

      // 奔跑节拍由"位移"驱动：世界水平位移越大节拍越快，停顿/减速时自然止步
      const prev = prevWorldXRef.current ?? world.worldX;
      const dWorldX = world.worldX - prev;
      prevWorldXRef.current = world.worldX;
      if (runAmount > 0.05 && Math.abs(dWorldX) > 1e-4) {
        phaseRef.current += dWorldX * RUN_RATE;
      }

      // 奔跑整体轻微上下起伏
      const bob = runAmount * Math.abs(Math.sin(phaseRef.current)) * 1.2; // vh

      // 图层位移动画（transform，GPU）：以人物中心为基准（减半宽后方为正心）
      const tx = clamp(world.charX, 4, 96);
      const halfW = halfWRef.current || 0;
      el.style.transform = `translate3d(calc(${tx}vw - ${halfW}px), calc(${bob}vh + ${settleY}vh), 0)`;
      el.style.opacity = String(enterT);

      // 更新人物关节（姿态由关键帧动态决定）
      if (charRef.current) {
        charRef.current.update({
          defLeft: poseDef(world.poseLeft),
          defRight: poseDef(world.poseRight),
          weight: world.poseWeight,
          runAmount,
          phase: phaseRef.current,
        });
      }
    });

    return off;
  }, []);

  return (
    <div className="character-layer" ref={layerRef} style={{ opacity: 0 }}>
      <CharacterPlaceholder ref={charRef} />
    </div>
  );
}