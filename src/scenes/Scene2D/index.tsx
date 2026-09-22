"use client";

import { useEffect, useRef } from "react";
import { scrollController } from "@/lib/scroll";
import { sampleWorld } from "@/data/timeline";
import { SCENES_2D } from "@/data/scenes";
import { clamp } from "@/lib/math";
import CharacterLayer from "@/components/character/CharacterLayer";

/** 背景视差系数：背景比前景慢，制造深度 */
const BG_PARALLAX = 0.42;
/** 文字显现窗口（worldX 距离，vw） */
const TEXT_WINDOW = 14;

export default function Scene2D() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const off = scrollController.register((s) => {
      const world = sampleWorld(s.progress);
      const scene = sceneRef.current;
      if (scene) {
        scene.style.opacity = String(world.opacity2d);
        scene.style.transform = `scale(${world.scale2d})`;
      }
      const wrap = wrapRef.current;
      if (wrap) wrap.style.transform = `translate3d(${world.worldX}vw, 0, 0)`;
      const bg = bgRef.current;
      if (bg) bg.style.transform = `translate3d(${-world.worldX * BG_PARALLAX}vw, 0, 0)`;
      // 场景文字：随各自构图点显现 / 隐去
      SCENES_2D.forEach((sc, i) => {
        const el = textRefs.current[i];
        if (!el) return;
        const d = Math.abs(world.worldX - sc.holdWorldX);
        const o = clamp(1 - d / TEXT_WINDOW, 0, 1);
        el.style.opacity = String(o * o * (3 - 2 * o));
      });
    });
    return off;
  }, []);

  return (
    <div className="scene-2d" ref={sceneRef}>
      <div className="world-wrap" ref={wrapRef}>
        <div className="bg-field" ref={bgRef} />
        <div className="ground-field" />
        {SCENES_2D.map((sc, i) => (
          <div
            key={sc.id}
            className={`scene-text${sc.opening ? " scene-text--opening" : ""}`}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            style={{
              left: `${sc.textCenterX - sc.holdWorldX}vw`,
            }}
          >
            <span className="scene-text__index">{sc.id}</span>
            <h2 className="scene-text__title">{sc.title}</h2>
            <p className="scene-text__line">{sc.line}</p>
          </div>
        ))}
      </div>
      <CharacterLayer />
    </div>
  );
}