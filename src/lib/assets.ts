/**
 * Asset Manager —— 素材资产管理层。
 *
 * 网站未来将使用由三视图定型的人物模型（zhouzehao.glb）。
 * 本模块集中管理所有大型素材的路径与"是否已提供"状态，
 * 组件层只依赖此处的配置，未来替换素材时无需改动任何组件代码。
 *
 * 约定：
 * - 所有大型素材放置于 /public/assets/（分类子目录）。
 * - GLB 模型路径固定为 /assets/character/zhouzehao.glb，放入即可替换。
 * - isReady 开关用于标记素材"尚未提供"（占位态）or"已提供"（实装态），
 *   关闭时组件回退到占位实现，绝不伪造模型存在。
 */

export interface AssetDescriptor {
  /** 素材相对 public/ 的路径 */
  path: string;
  /** 是否已实际提供（false = 占位 / 未提供） */
  ready: boolean;
  /** 备注 */
  note?: string;
}

/** 人物相关素材配置 */
export const CHARACTER_ASSETS = {
  /** 最终 3D 人物模型（含骨架/材质/动画）。未来放入此路径并置 ready=true 即可替换。 */
  glbModel: {
    path: "/assets/character/zhouzehao.glb",
    ready: false,
    note: "未来由用户提供 GLB/LTF，替换人物与场景",
  } satisfies AssetDescriptor,

  /** 2D 人物立绘（未来替换 SVG 占位） */
  sprite2d: {
    path: "/assets/character/character-2d.png",
    ready: false,
    note: "已预留，当前由 CharacterPlaceholder(SVG) 占位",
  } satisfies AssetDescriptor,
} as const;

/**
 * 读取 3D 人物模型路径。当尚未提供时返回 null，组件应回退到占位几何体。
 * 替换模型仅需：放入 /public/assets/character/zhouzehao.glb 并将 ready 置 true。
 */
export function getCharacterModelPath(): string | null {
  return CHARACTER_ASSETS.glbModel.ready ? CHARACTER_ASSETS.glbModel.path : null;
}