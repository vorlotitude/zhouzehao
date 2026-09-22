/** 共享类型定义 */

/** 人物姿态 ID：坐姿 → 起身 → 站立 → 奔跑 */
export type PoseId = "sit" | "rise" | "stand" | "run";

/** 一帧的关节姿态（人物占位系统与真人素材解耦的中间层） */
export interface JointFrame {
  rootX: number;
  hipY: number;
  torsoLean: number; // 前倾角度 deg
  headTilt: number;
  // 手臂：上臂角 + 前臂角
  lArm: number;
  lFore: number;
  rArm: number;
  rFore: number;
  // 腿部：大腿角 + 小腿角
  lThigh: number;
  lShin: number;
  rThigh: number;
  rShin: number;
  rootRot: number; // 整个身体微倾
}

/**
 * 2D → 3D 世界关键帧。
 * 以"滚动归一化进度 p(0-1)"驱动，p 轴的平台区即电影镜头的"停顿"。
 * 所有平移单位为 viewport宽度的百分比（vw）。
 */
export interface SceneKeyframe {
  /** 归一化滚动进度 0..1 */
  p: number;
  /** 2D 环境层位移（向右为正，模拟人物左奔时的相对运动） */
  worldX: number;
  /** 人物在屏幕上的水平中心位置 vw */
  charX: number;
  pose: PoseId;
  /** 2D→3D 混合 0..1 */
  dim3d: number;
  /** 2D 世界缩放（转场时收拢） */
  scale2d: number;
  /** 2D 世界不透明度 */
  opacity2d: number;
}

/** 单个 2D 场景的内容与布局定义 */
export interface Scene2DData {
  id: string; // "01" / "02" / "03"
  title: string;
  line: string;
  /** 该场景构图完成时对应的 worldX 值 */
  holdWorldX: number;
  /** 文字在构图完成时的期望水平中心 vw */
  textCenterX: number;
  /** 是否为开场大字（样式稍异） */
  opening?: boolean;
}