# assets —— 素材占位目录

> 所有大型二进制素材统一放置于此，**不要**把它们转成 Base64 或写进 JS/TS 文件。
> 替换时只需放对应文件并更新 `src/data/assets.ts` 中的路径，无需重写交互逻辑。

## 目录说明

```
public/assets/
├── character/   人物素材（2D 占位图、精灵图、照片等）
├── models/      3D 模型（.glb / .gltf / .fbx）
├── images/      普通图片
├── textures/    纹理贴图
├── audio/       音效 / 背景音乐
└── video/       视频
```

## character/ 预留文件名

| 文件 | 用途 |
| --- | --- |
| `character-2d.png` | 2D 人物主图（透明背景） |
| `character-2d.webp` | 2D 人物主图的 WebP 版本（若体积更优） |
| `character-mask.png` | 人物遮罩 |
| `character-shadow.png` | 地面阴影 |
| `sprite/` | 逐帧序列（若使用 sprite sheet） |

> 当前使用内置的 SVG 关节人物占位，尚未占用以上文件。接入真人素材时建议从
> `src/components/character/CharacterPlaceholder.tsx` 入手——交互逻辑只产出
> "姿态 + 位置 + 节拍"，把它们映射到真实素材即可。