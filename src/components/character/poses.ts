/**
 * 人物占位系统的姿态计算层。
 *
 * 用一份极简的"关节参数"描述姿态，与具体渲染素材（SVG / sprite / 真人照片）解耦。
 * 交互逻辑只产出 PoseId + 插值权重 + 奔跑节拍相位；换真人素材时无需改动交互。
 */

export type Vec = [number, number];

export interface PoseDef {
  /** 骨盆高度（负值向上，0 为地面），单位：字符高度制 */
  hipY: number;
  /** 躯干前倾角（度，正值前倾） */
  torsoLean: number;
  /** 头部倾斜（度） */
  head: number;
  lThigh: number;
  lShin: number;
  rThigh: number;
  rShin: number;
  lArm: number;
  lFore: number;
  rArm: number;
  rFore: number;
}

export interface Figure {
  /** [骨盆, 肩窝] 躯干 */
  spine: [Vec, Vec];
  /** 头部圆心与半径 */
  head: [Vec, number];
  /** 左臂: 肩→肘→手；右臂: 肩→肘→手 */
  lArm: [Vec, Vec, Vec];
  rArm: [Vec, Vec, Vec];
  /** 左腿: 骨盆→膝→足；右腿: 骨盆→膝→足 */
  lLeg: [Vec, Vec, Vec];
  rLeg: [Vec, Vec, Vec];
}

/* 骨骼尺寸（字符高度 ≈ 肩部以上 + 躯干 + 腿） */
const TL = 40; // 躯干
const THIGH = 46; // 大腿
const SHIN = 46; // 小腿
const ARM = 24; // 上臂
const FOR = 22; // 前臂
const HEAD_R = 12; // 头
const DEG = Math.PI / 180;

/** 四种基准姿态（角度约定：0=垂直向下，正向=向前/向左） */
const POSES: Record<string, PoseDef> = {
  // 坐姿：左腿平直前伸撑地，右腿屈膝收拢
  sit: {
    hipY: -34,
    torsoLean: 4,
    head: -2,
    lThigh: 82,
    lShin: -6,
    rThigh: -26,
    rShin: -120,
    lArm: 14,
    lFore: 30,
    rArm: -12,
    rFore: 18,
  },
  // 起身：由坐向站过渡，腿微屈
  rise: {
    hipY: -88,
    torsoLean: 10,
    head: -4,
    lThigh: 14,
    lShin: -22,
    rThigh: 8,
    rShin: -14,
    lArm: 20,
    lFore: 12,
    rArm: -14,
    rFore: 10,
  },
  // 站立
  stand: {
    hipY: -92,
    torsoLean: 2,
    head: 0,
    lThigh: 0,
    lShin: 0,
    rThigh: 0,
    rShin: 0,
    lArm: 9,
    lFore: 4,
    rArm: -9,
    rFore: -4,
  },
  // 奔跑基准：前倾，双腿交替摆动（幅度随后续 runOffset 叠加）
  run: {
    hipY: -88,
    torsoLean: 16,
    head: -4,
    lThigh: 0,
    lShin: 0,
    rThigh: 0,
    rShin: 0,
    lArm: 0,
    lFore: 0,
    rArm: 0,
    rFore: 0,
  },
};

/** 混合两个姿态定义 */
export function blendPoseDef(a: PoseDef, b: PoseDef, w: number): PoseDef {
  const mix = (x: number, y: number) => x + (y - x) * w;
  return {
    hipY: mix(a.hipY, b.hipY),
    torsoLean: mix(a.torsoLean, b.torsoLean),
    head: mix(a.head, b.head),
    lThigh: mix(a.lThigh, b.lThigh),
    lShin: mix(a.lShin, b.lShin),
    rThigh: mix(a.rThigh, b.rThigh),
    rShin: mix(a.rShin, b.rShin),
    lArm: mix(a.lArm, b.lArm),
    lFore: mix(a.lFore, b.lFore),
    rArm: mix(a.rArm, b.rArm),
    rFore: mix(a.rFore, b.rFore),
  };
}

/** 向上取点（用于躯干/头部）：angle 0=向上，正值向前 */
function up(ox: number, oy: number, len: number, angle: number): Vec {
  const r = angle * DEG;
  return [ox + len * Math.sin(r), oy - len * Math.cos(r)];
}

/** 向下取点（用于手臂/腿）：angle 0=垂直向下，正值=向前/向左 */
function down(ox: number, oy: number, len: number, angle: number): Vec {
  const r = angle * DEG;
  return [ox + len * Math.sin(r), oy + len * Math.cos(r)];
}

/** 根据姿态 + 奔跑节拍相位，计算完整几何 */
export function buildFigure(
  def: PoseDef,
  runAmount: number,
  phase: number
): Figure {
  // 奔跑数据由 progress 驱动，相位 phase 已包含节拍；这里叠加摆动幅度
  const swing = runAmount;
  const thighSwing = 54 * swing;
  const shinSwing = 62 * swing;
  const armSwing = 30 * swing;

  const lThigh = def.lThigh + thighSwing * Math.sin(phase);
  const rThigh = def.rThigh + thighSwing * Math.sin(phase + Math.PI);
  const lShin = def.lShin + shinSwing * Math.sin(phase + Math.PI / 2);
  const rShin = def.rShin + shinSwing * Math.sin(phase + Math.PI / 2 + Math.PI);
  const lArm = def.lArm + armSwing * Math.sin(phase + Math.PI);
  const rArm = def.rArm + armSwing * Math.sin(phase);

  // 骨盆（x 固定为原点两侧微动，腿部去建立足部支撑，再由腿型决定骨盆横向摆放近似居中）
  const px = 0;
  const hipY = def.hipY; // 骨盆高度（负值向上，0 为地面）

  // 躯干 → 肩窝（向上）
  const shoulder = up(px, hipY, TL, def.torsoLean);
  // 头（向上）
  const neck = up(shoulder[0], shoulder[1], 5, def.torsoLean);
  const headC: Vec = [neck[0], neck[1]];
  // 手臂（向下）
  const elbowL = down(shoulder[0], shoulder[1], ARM, lArm);
  const handL = down(elbowL[0], elbowL[1], FOR, lArm + def.lFore);
  const elbowR = down(shoulder[0], shoulder[1], ARM, rArm);
  const handR = down(elbowR[0], elbowR[1], FOR, rArm + def.rFore);
  // 腿（向下）
  const kneeL = down(px, hipY, THIGH, lThigh);
  const footL = down(kneeL[0], kneeL[1], SHIN, lThigh + lShin);
  const kneeR = down(px, hipY, THIGH, rThigh);
  const footR = down(kneeR[0], kneeR[1], SHIN, rThigh + rShin);

  stampFoot(footL);
  stampFoot(footR);

  return {
    spine: [[px, hipY], shoulder],
    head: [headC, HEAD_R],
    lArm: [[shoulder[0], shoulder[1]], elbowL, handL],
    rArm: [[shoulder[0], shoulder[1]], elbowR, handR],
    lLeg: [[px, hipY], kneeL, footL],
    rLeg: [[px, hipY], kneeR, footR],
  };
}

/** 让足部尽量落回地面（y≤0），通过上提膝关节近似 */
function stampFoot(foot: Vec) {
  if (foot[1] > 0) foot[1] = 0;
}

/** 姿态控制函数的原子：给定姿态所处插值权重生成最终渲染参数 */
export interface PoseSample {
  defLeft: PoseDef;
  defRight: PoseDef;
  weight: number;
  runAmount: number;
  phase: number;
}

export function poseDef(id: string): PoseDef {
  return POSES[id] ?? POSES.stand;
}