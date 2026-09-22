# zhouzehao

Zhou Zehao 的个人作品集网站 —— 一段由**滚动驱动**的 2D → 3D 数字叙事。

网站不是传统模板式的作品集（无 Hero / About / Skills / Contact 骨架），而是一个
**黑白极简、编辑部视觉、电影化镜头节奏**的数字艺术作品：人物自右侧进场、坐姿开场，
随滚动起身、向左奔跑，穿越三个 2D 场景（每处减速、停顿构成摄影式构图），最后在
「2D → 3D 转场」中由平面进入三维世界。

## 技术栈

- **Next.js 16**（App Router，静态预渲染）+ Turbopack
- **TypeScript**
- **React 19**
- **CSS**（原生模块，无样式库依赖）
- **Three.js / @react-three/fiber / @react-three/drei**（仅 3D 场景使用，按需懒加载）
- 动画由**自研 rAF 滚动驱动** + 数据驱动关键帧时间线完成（无额外动画库）

## 启动方式

```bash
npm install
npm run dev        # 开发，http://localhost:3000
npm run lint       # ESLint
npm run build      # 生产构建（静态导出）
npm run start      # 生产预览
```

使用滚轮 / 触控板 / 触摸滑动驱动整段叙事。总计约 6 倍屏高的滚动长度。

## 核心设计

- **电影式停顿**：滚动不再线性。人物与世界位移由「关键帧平台区」控制——
  相邻关键帧值相同时即构成停顿，配合阻尼平滑，形成「加速 → 减速 → 停顿」的镜头节奏。
- **人物 vs 环境的相对运动**：人物向左奔跑；背景、地面与文字整体向右滑动，形成纵深视差。
- **舞台分层**（均为固定视口内的独立图层，滚动时只改 `transform`，无 React 重渲染）：

```
stage
├─ scene-3d   （懒加载，opacity = dim3d）
└─ scene-2d   （opacity/scale = 2D 层）
   ├─ world-wrap  → 背景网格 / 地面 / 场景文字
   └─ character-layer → 人物（SVG 关节占位）
```

## 项目结构

```
src/
├─ app/                        # 入口、布局、样式、元数据、favicon
├─ components/
│  ├─ Experience.tsx           # 编排：滚动驱动启停 + 2D/3D 组装 + HUD
│  └─ character/               # 人物占位系统
│     ├─ CharacterLayer.tsx    # 定位、进场、奔跑节拍驱动
│     ├─ CharacterPlaceholder.tsx  # SVG 渲染（替换真人素材的人口）
│     └─ poses.ts              # 关节姿态（坐/起身/站立/奔跑）几何计算
├─ scenes/
│  ├─ Scene2D/index.tsx        # 2D 世界层
│  └─ Scene3D/                 # 3D 容器（占位，按模块拆分）
│     ├─ index.tsx  Camera  Lighting  Environment
│     └─ Ground  Character  Background  Objects  PostProcessing
├─ data/
│  ├─ timeline.ts              # 世界关键帧（停顿/节奏全部在此调整）
│  └─ scenes.ts                # 2D 场景文案与布局
├─ lib/
│  ├─ scroll.ts                # 全局 rAF 滚动控制器（阻尼平滑）
│  └─ math.ts                  # 缓动工具
└─ types/                      # 共享类型
public/assets/                 # 素材库（见其 README）
```

## 素材系统

所有大型二进制素材统一放于 `public/assets/`（character / models / images /
textures / audio / video），不内联进代码。详见 `public/assets/README.md`。

替换策略：

- **2D 人物**：交互逻辑只产出「姿态 + 位置 + 奔跑节拍」，与渲染无关。
  只改 `CharacterPlaceholder.tsx`（或接入 `character-2d.png` 等），交互无需重写。
- **3D 场景**：在 `src/scenes/Scene3D/` 中用自有的 `.glb/.gltf/.fbx` 替换占位
  `Character.tsx` / `Ground.tsx` 等，镜头驱动 `Camera.tsx` 保留即可。

## 未来规划

- 接入真人/角色素材（2D 精灵图或 3D 模型）
- 鼠标悬停 / 点击人物 / 点击场景物体等交互（`scroll.ts` 已集中各层帧回调，可扩展）
- 项目展示：Blender / UE / 游戏 / 摄影 / 视频
- 关于我 / 联系方式 / 社交账号
- 音效与背景音乐（音频统一复用 `public/assets/audio/`）
- 更多 3D 场景与后处理

## 性能

- 滚动只更新 `transform / opacity`，GPU 合成，不触发布局与 React 重渲染
- three.js 仅在后半段按需加载，`dpr` 封顶 1.5
- 无无限粒子、无额外纹理与真实后处理，保证 60fps