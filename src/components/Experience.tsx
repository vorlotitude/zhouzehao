"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { scrollController } from "@/lib/scroll";
import Scene2D from "@/scenes/Scene2D";

// 3D 仅在滚动进入序幕后按需加载，避免首次访问引入 three.js 体积与开销
const Scene3D = lazy(() => import("@/scenes/Scene3D"));

const SCROLL_HEIGHT = 620; // 视口高度的倍数，构成超长滚动叙事

export default function Experience() {
  const [show3d, setShow3d] = useState(false);
  const mounted3d = useRef(false);

  useEffect(() => {
    scrollController.start();
    const off = scrollController.register((s) => {
      if (s.progress > 0.6 && !mounted3d.current) {
        mounted3d.current = true;
        setShow3d(true);
      }
    });
    return () => {
      off();
      scrollController.stop();
    };
  }, []);

  return (
    <>
      {/* 超长占位层，驱动原生滚动（触摸滑动天然可用） */}
      <div
        className="scroll-spacer"
        style={{ height: `${SCROLL_HEIGHT}vh`, position: "relative" }}
      />

      <main className="stage" aria-hidden>
        {show3d && (
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        )}

        <Scene2D />

        <div className="hud">
          <span className="hud__name">ZHOU ZEHAO</span>
          <span className="hud__mark">§</span>
          <span className="hud__scroll">SCROLL</span>
        </div>
      </main>
    </>
  );
}