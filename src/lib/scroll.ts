"use client";

/**
 * ScrollController —— 全局单一 rAF 驱动。
 *
 * - 使用 window 原生滚动（配合一个超高占位层），触摸滑动天然可用。
 * - 仅维护 4 个值（progress / velocity / dt / elapsed），
 *   各动画层通过 register() 订阅，在帧回调里直接写 DOM/ref，全程无 React re-render。
 * - progress 经过阻尼平滑，天然产生"加速→减速→停顿"的重量感。
 */

export interface FrameState {
  /** 平滑后的归一化滚动进度 0..1 */
  progress: number;
  /** 当前帧时间增量（秒） */
  dt: number;
  /** 自启动以来的累计时间（秒） */
  elapsed: number;
  /** 进度方向导数（粗略，用于奔跑节拍） */
  velocity: number;
  /** viewport 宽度与高度（px） */
  width: number;
  height: number;
}

type Listener = (s: FrameState) => void;

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

class ScrollControllerImpl {
  private listeners = new Set<Listener>();
  private rafId = 0;
  private running = false;
  private last = 0;
  private prevProgress = 0;

  progress = 0; // traveled to target
  private target = 0;
  elapsed = 0;
  velocity = 0;
  width = typeof window !== "undefined" ? window.innerWidth : 1920;
  height = typeof window !== "undefined" ? window.innerHeight : 1080;

  /** 阻尼系数：越小越"沉重"，越大越跟手 */
  private lambda = 4.5;

  get isRunning() {
    return this.running;
  }

  /** 恢复滚动长度并复位（缩放 / 跨页面导航时调用） */
  reset() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.target = this.readProgress();
    this.progress = this.target;
    this.prevProgress = this.target;
    this.velocity = 0;
  }

  register(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  start() {
    if (this.running || typeof window === "undefined") return;
    this.running = true;
    this.reset();
    const onResize = () => this.reset();
    window.addEventListener("resize", onResize);
    this.resizeCleanup = () => window.removeEventListener("resize", onResize);
    this.rafId = requestAnimationFrame(this.tick);
    document.documentElement.classList.add("has-scroll-driver");
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeCleanup?.();
  }

  private resizeCleanup?: () => void;

  private readProgress = (): number => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - this.height;
    if (max <= 0) return 0;
    const y = window.scrollY;
    const raw = y / max;
    return clamp(raw, 0, 1);
  };

  private tick = (t: number) => {
    if (!this.running) return;
    const dt = this.last ? Math.min((t - this.last) / 1000, 0.05) : 0.016;
    this.last = t;

    // 目标进度（原生滚动位置）→ 阻尼平滑
    this.target = this.readProgress();
    this.progress += (this.target - this.progress) * (1 - Math.exp(-this.lambda * dt));

    // 速度（次/秒），简单平滑
    const v = (this.progress - this.prevProgress) / Math.max(dt, 1e-4);
    this.velocity += (v - this.velocity) * (1 - Math.exp(-6 * dt));
    this.prevProgress = this.progress;

    this.elapsed += dt;

    const state: FrameState = {
      progress: this.progress,
      dt,
      elapsed: this.elapsed,
      velocity: this.velocity,
      width: this.width,
      height: this.height,
    };
    this.listeners.forEach((fn) => fn(state));
    this.rafId = requestAnimationFrame(this.tick);
  };
}

/** 全局单例 */
export const scrollController = new ScrollControllerImpl();