import type { PoseId, SceneKeyframe } from "@/types";
import { lerp, smoothstep, clamp } from "@/lib/math";

/**
 * 世界时间线（数据驱动）。
 *
 * 关键思想：滚动进度 p(0..1) 每经过一段，就为镜头状态测出一个目标值。
 * 当相邻两个关键帧的 worldX / charX 相同（平台区），人物与文字会减速并"停住"——这就是电影镜头的构图停顿。
 */

export const WORLD_KEYFRAMES: SceneKeyframe[] = [
  // 场景 01 · 坐姿开场（platform：开场停顿）
  { p: 0.0, worldX: 0, charX: 74, pose: "sit", dim3d: 0, scale2d: 1, opacity2d: 1 },
  { p: 0.05, worldX: 1.5, charX: 74, pose: "sit", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 起身 → 站立
  { p: 0.15, worldX: 16, charX: 71, pose: "rise", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 奔跑开始
  { p: 0.2, worldX: 28, charX: 66, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 场景 01 构图完成
  { p: 0.4, worldX: 58, charX: 52, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 停顿（场景 01）
  { p: 0.46, worldX: 58, charX: 52, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 继续奔向左方，场景 02
  { p: 0.52, worldX: 84, charX: 45, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 场景 02 构图完成
  { p: 0.72, worldX: 116, charX: 33, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 停顿（场景 02）
  { p: 0.78, worldX: 116, charX: 33, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 场景 03 构图完成
  { p: 0.82, worldX: 168, charX: 22, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 停顿（场景 03，人物减速至近停）
  { p: 0.9, worldX: 168, charX: 22, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 停顿（场景 03）
  { p: 0.94, worldX: 168, charX: 22, pose: "run", dim3d: 0, scale2d: 1, opacity2d: 1 },
  // 2D → 3D 转场开始（2D 收拢淡出，镜头开始环绕）
  { p: 0.965, worldX: 168, charX: 22, pose: "stand", dim3d: 0.4, scale2d: 1.06, opacity2d: 0.85 },
  // 转场推进
  { p: 0.985, worldX: 168, charX: 22, pose: "stand", dim3d: 0.8, scale2d: 1.14, opacity2d: 0.35 },
  // 完全进入 3D
  { p: 1.0, worldX: 168, charX: 22, pose: "stand", dim3d: 1, scale2d: 1.22, opacity2d: 0 },
];

export interface WorldSample {
  worldX: number;
  charX: number;
  dim3d: number;
  scale2d: number;
  opacity2d: number;
  /** 被插值的两个姿态，weight 为从 poseLeft 到 poseRight 的比例 */
  poseLeft: PoseId;
  poseRight: PoseId;
  poseWeight: number;
  /** 当前处于奔跑段（用于驱动奔跑节拍） */
  isRunning: boolean;
}

/** 采样指定进度处的镜头状态 */
export function sampleWorld(p: number): WorldSample {
  const kfs = WORLD_KEYFRAMES;
  const clamped = clamp(p, 0, 1);
  let i = 0;
  while (i < kfs.length - 1 && kfs[i + 1].p <= clamped) i++;
  const a = kfs[i];
  const b = kfs[Math.min(i + 1, kfs.length - 1)];
  const span = Math.max(b.p - a.p, 1e-5);
  const t = smoothstep(0, 1, (clamped - a.p) / span);

  return {
    worldX: lerp(a.worldX, b.worldX, t),
    charX: lerp(a.charX, b.charX, t),
    dim3d: lerp(a.dim3d, b.dim3d, t),
    scale2d: lerp(a.scale2d, b.scale2d, t),
    opacity2d: lerp(a.opacity2d, b.opacity2d, t),
    poseLeft: a.pose,
    poseRight: b.pose,
    poseWeight: t,
    isRunning: a.pose === "run" || b.pose === "run",
  };
}