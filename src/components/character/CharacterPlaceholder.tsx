"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { buildFigure, blendPoseDef } from "./poses";
import type { PoseDef } from "./poses";

export interface CharacterPlaceholderHandle {
  update: (frame: {
    defLeft: PoseDef;
    defRight: PoseDef;
    weight: number;
    runAmount: number;
    phase: number;
  }) => void;
}

function toD(points: [number, number][], closed = false): string {
  if (points.length === 0) return "";
  const [sx, sy] = points[0];
  let d = `M ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d + (closed ? " Z" : "");
}

interface Props {
  /** 粗细视觉（线型 / 剪影），可留 0 使用默认 */
  weight?: number;
}

/** 极简黑体人物占位（结构化关节 + SVG 渲染）。未来替换成真人素材时，仅需更换此组件的渲染实现。 */
const CharacterPlaceholder = forwardRef<CharacterPlaceholderHandle, Props>(
  function CharacterPlaceholder({ weight = 1 }, ref) {
    const torsoRef = useRef<SVGPathElement>(null);
    const headRef = useRef<SVGCircleElement>(null);
    const legsRef = useRef<SVGPathElement>(null);
    const armsRef = useRef<SVGPathElement>(null);

    useImperativeHandle(ref, () => ({
      update(frame) {
        const def = blendPoseDef(frame.defLeft, frame.defRight, frame.weight);
        const fig = buildFigure(def, frame.runAmount, frame.phase);
        // 视图坐标即世界坐标：viewBox 的 y 为负向上，无需翻转
        const toSvg = (v: [number, number]): [number, number] => v;
        torsoRef.current?.setAttribute(
          "d",
          toD([toSvg(fig.spine[0]), toSvg(fig.spine[1])])
        );
        const h = toSvg(fig.head[0]);
        headRef.current?.setAttribute("cx", h[0].toFixed(2));
        headRef.current?.setAttribute("cy", h[1].toFixed(2));
        headRef.current?.setAttribute("r", (fig.head[1] * weight).toFixed(2));
        legsRef.current?.setAttribute(
          "d",
          toD([toSvg(fig.lLeg[0]), toSvg(fig.lLeg[1]), toSvg(fig.lLeg[2])]) +
            " " +
            toD([toSvg(fig.rLeg[0]), toSvg(fig.rLeg[1]), toSvg(fig.rLeg[2])])
        );
        armsRef.current?.setAttribute(
          "d",
          toD([toSvg(fig.lArm[0]), toSvg(fig.lArm[1]), toSvg(fig.lArm[2])]) +
            " " +
            toD([toSvg(fig.rArm[0]), toSvg(fig.rArm[1]), toSvg(fig.rArm[2])])
        );
      },
    }));

    return (
      <svg
        className="character-figure"
        viewBox="-150 -200 300 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        {/* 阴影（占位，后续替换为 character-shadow.png） */}
        <ellipse
          className="character-shadow"
          cx="0"
          cy="1"
          rx="34"
          ry="3.5"
          fill="#111"
          opacity="0.08"
        />
        <path
          ref={armsRef}
          className="cf cf-limbs"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={11 * weight}
        />
        <path
          ref={legsRef}
          className="cf cf-limbs"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={13 * weight}
        />
        <path
          ref={torsoRef}
          className="cf cf-torso"
          fill="none"
          strokeLinecap="round"
          strokeWidth={21 * weight}
        />
        <circle
          ref={headRef}
          className="cf-head"
          cx="0"
          cy="-160"
          r={12 * weight}
        />
      </svg>
    );
  }
);

export default CharacterPlaceholder;