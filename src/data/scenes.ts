import type { Scene2DData } from "@/types";

/**
 * 2D 场景内容（占位文案，后续替换只需改这里）。
 * holdWorldX 需与 timeline.ts 中对应场景"构图完成"关键帧的 worldX 一致。
 * textCenterX 为构图完成时文字中心的屏幕位置（vw），通常 50。
 */
export const SCENES_2D: Scene2DData[] = [
  {
    id: "00",
    title: "ZHOU ZEHAO",
    line: "一部用滚动讲述的数字作品",
    holdWorldX: 20,
    textCenterX: 34,
    opening: true,
  },
  {
    id: "01",
    title: "CREATOR",
    line: "三维 · 运动 · 影像",
    holdWorldX: 58,
    textCenterX: 44,
  },
  {
    id: "02",
    title: "SELECTED WORKS",
    line: "三维 · 游戏 · 摄影",
    holdWorldX: 116,
    textCenterX: 44,
  },
  {
    id: "03",
    title: "ENTER 3D",
    line: "继续滚动，走入塌陷的世界",
    holdWorldX: 168,
    textCenterX: 44,
  },
];

/** 环境视差参数 */
export type WorldLayerConfig = {
  /** 环境层水平位移（vw） */
  worldX: number;
  /** 背景视差系数（越靠近 1 越快，实现前景快、背景慢的深度） */
  bgFactor: number;
  groundFactor: number;
  dim3d: number;
  scale2d: number;
  opacity2d: number;
};