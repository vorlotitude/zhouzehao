# assets —— 素材占位目录

> 所有大型二进制素材统一放置于此，**不要**把它们转成 Base64 或写进 JS/TS 文件。
> 替换时只需放入对应文件并更新 `src/lib/assets.ts` 中的配置，无需重写交互逻辑。

## 目录说明

```
public/assets/
├── character/   人物素材（2D 占位图、最终 3D 模型等）
├── models/      3D 模型（.glb / .gltf / .fbx，备用）
├── images/      普通图片
├── textures/    纹理贴图
├── audio/       音效 / 背景音乐
└── video/       视频
```

## character/ 预留文件名

| 文件 | 用途 | 接入位置 |
| --- | --- | --- |
| `character-2d.png` | 2D 人物主图（透明背景） | 替换 `CharacterPlaceholder` 渲染 |
| `character-2d.webp` | 2D 人物主图的 WebP 版本（若体积更优） | 同上 |
| `character-mask.png` | 人物遮罩 | 预留 |
| `character-shadow.png` | 地面阴影 | `CharacterPlaceholder` 阴影属性 |
| `zhouzehao.glb` | **最终 3D 人物模型**（含骨架/材质/动画） | `Scene3D/Character` 经 `assets.ts` 加载 |

## 接入最终 3D 人物（两步）

1. 将 `zhouzehao.glb` 放入 `public/assets/character/`
2. 在 `src/lib/assets.ts` 中把 `glbModel.ready` 置为 `true`

模型未就绪时，3D 场景自动以代号几何体占位；就绪后自动加载模型与动画，无需改任何交互代码。

## 开发参考素材（不进生产）

人物三视图等开发参考资料存放于项目根目录 `assets-reference/character/`，
已被 `.gitignore` 排除，**不会**进入 GitHub 仓库或 GitHub Pages 公开站点。
如需建立人物设计的完整规范，见 `docs/character-design-spec.md`。