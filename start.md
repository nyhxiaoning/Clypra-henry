# Clypra 项目分析与国际化启动文档

## 1. 项目是做什么的

Clypra 是一个基于 Tauri v2 + React 19 + TypeScript 的开源桌面/移动视频编辑器。
前端负责编辑器交互、媒体库、时间线、导出与设置界面；Rust/Tauri 侧负责原生平台能力、FFmpeg 编解码、文件系统与更新能力。
除桌面端外，项目还通过 Capacitor 支持 iOS/Android，目标是在保留原生性能的前提下提供跨平台视频剪辑能力。

当前代码里还没有独立的多语言抽象；项目级说明主要见 [README.md](/Users/henryheng/Code/personCode/clypra/README.md) 和 [package.json](/Users/henryheng/Code/personCode/clypra/package.json)。

## 2. 技术栈是什么

- 前端框架：React 19 + TypeScript，严格模式
- UI/样式：Tailwind CSS v4、shadcn 风格组件、lucide-react、class-variance-authority、tailwind-merge
- 状态管理：Zustand，按领域拆分多个 store，并通过 `persist` 持久化
- 构建工具：Vite 7，支持热更新与模块替换
- 桌面容器：Tauri v2，Rust 后端
- 媒体能力：FFmpeg 原生绑定、PixiJS 渲染链路、Web Worker、Canvas/OffscreenCanvas
- 移动容器：Capacitor 8，同时保留 web 开发路径
- 测试：Vitest + React Testing Library + jsdom，CI 里同时跑前端单测和 Rust 测试
- 平台适配：通过 `@tauri-apps/api`、Capacitor adapter、platform 层做运行环境抽象

相关核心入口见 [src/main.tsx](/Users/henryheng/Code/personCode/clypra/src/main.tsx:1) 和 [src/App.tsx](/Users/henryheng/Code/personCode/clypra/src/App.tsx:1)。

## 3. 目录结构如何组织

- `src/components`：UI 组件，包含 screens、settings、editor、media-tabs、ui shell 等
- `src/features`：按功能域组织的模块，如 audio-library、text-effects、transitions、video-effects
- `src/core`：编辑器核心逻辑，包括时间线、渲染、字体、历史命令、平台抽象、性能监控
- `src/lib`：通用工具与导出逻辑，如 timeline、export、media、text、debug
- `src/store`：Zustand 全局状态，按 `settingsStore`、`projectStore`、`uiStore`、`timelineStore`、`shortcutStore` 等拆分
- `src/hooks`：可复用交互逻辑，例如快捷键、自动滚动、全屏、导出
- `src/services`：独立服务层，例如 updater、dual record
- `src-tauri`：Rust 后端、构建配置、Capabilities、图标和生成代码
- `public`：静态资源
- `.github/workflows`：CI 配置，包含前端测试、Rust 测试和构建检查

更具体的入口参考 [src/store/settingsStore.ts](/Users/henryheng/Code/personCode/clypra/src/store/settingsStore.ts:1)、[src/components/ui/SettingsModal.tsx](/Users/henryheng/Code/personCode/clypra/src/components/ui/SettingsModal.tsx:1)、[src-tauri/Cargo.toml](/Users/henryheng/Code/personCode/clypra/src-tauri/Cargo.toml:1)。

## 4. 启动、构建、测试命令是什么

```bash
npm run tauri dev
npm run dev
npm run build
npm run preview
npm run test
npm run test:ui
npm run tauri
npm run mobile:sync
npm run mobile:live
```

- 前端开发：`npm run dev` 启动 Vite 开发服务器
- 前端构建：`npm run build` 先跑 TypeScript 检查，再执行 Vite 构建
- 预览构建产物：`npm run preview`
- 前端测试：`npm run test`
- 桌面应用：`npm run tauri`
- 移动同步：`npm run mobile:sync`
- 移动热更新调试：`npm run mobile:live`

CI 侧还包含 `npm test -- --run`、`npx tsc --noEmit`、`cargo test` 与 `cargo clippy`，参考 [.github/workflows/ci.yml](/Users/henryheng/Code/personCode/clypra/.github/workflows/ci.yml:1)。


### 打包说明
```
npm run build：产出 vite 静态资源（移动端、桌面端共用前端包）
npm run mobile:sync：将 vite 打包产物同步到安卓 /iOS 原生工程目录
npm run mobile:live：移动端热调试（开发用，不打包）

第一步：构建静态资源
无论打包桌面还是移动端，都需要先构建前端静态资源
- npm run build


第二步：打包命令

1. 基础打包命令
npm run tauri build

2.常用打包参数（按需加）
# 仅打包 Windows 安装包
npx tauri build --target windows
# 仅打包 macOS
npx tauri build --target macos
# 输出未签名便携版（mac 开发测试）
npx tauri build --no-sign
# 自定义输出目录
npx tauri build --output ./dist-desktop
# 启用最小压缩、优化体积
npx tauri build --features tiny






```

## 5. 新增一个页面应该从哪里开始

- 若走“页面”概念，当前更像是“屏幕级切换”：`LaunchScreen` 与 `EditorScreen` 在 [src/App.tsx](/Users/henryheng/Code/personCode/clypra/src/App.tsx:1) 中做顶层入口切换
- 编辑区实际页面/布局拆分在 [src/components/editor/EditorLayout.tsx](/Users/henryheng/Code/personCode/clypra/src/components/editor/EditorLayout.tsx:1)
- 建议新增页面优先放在 `src/components/screens/` 下，并在 [src/App.tsx](/Users/henryheng/Code/personCode/clypra/src/App.tsx:1) 注册
- 若新页面带独立设置，可同步在 [src/store/settingsStore.ts](/Users/henryheng/Code/personCode/clypra/src/store/settingsStore.ts:1) 扩展持久化状态
- 若新页面属于某个功能域，优先考虑放到 `src/features/` 下，再由对应 feature 接入，而不是全部堆到 `components`

## 6. 当前项目有哪些明显维护风险

- 中文可见字符串已较多，但全项目没有 `i18n` 层；新增页面和组件继续硬编码文案会显著抬高后续翻译成本
- 前端 `src` 体量很大，组件内聚度偏低，像 [src/App.tsx](/Users/henryheng/Code/personCode/clypra/src/App.tsx:1) 和多个 settings 组件承担了较多交互和字符串
- 存在多个运行时平台分支：Tauri desktop、Capacitor mobile、浏览器 dev；每次改 UI 或存储行为都要考虑三端兼容
- Rust/前端耦合较深：编解码、路径、导出、更新、原生对话框都跨两端，错误文案和状态文案目前分散在前端各组件里
- 多个 store 使用 `zustand persist` 直接写 localStorage/持久化，schema 演进时缺少显式迁移策略
- 仍能看到不少 `TODO`、`@ts-ignore` 和临时注释，说明部分工程债尚未收敛
- CI 只覆盖前端测试、Rust 测试和构建检查，缺少更系统的 UI 回归、 bundle/性能 或 i18n 覆盖

## 7. 关键帧、画中画、蒙版功能现状

### 7.1 关键帧 (Keyframes)

**现状：底层引擎已就绪，但无用户界面。**

- 核心求值引擎位于 [src/core/evaluation/animation.ts](/Users/henryheng/Code/personCode/clypra/src/core/evaluation/animation.ts:1)，支持：
  - 三次贝塞尔曲线插值（Newton-Raphson 数值求解）
  - 缓动函数：linear / ease-in / ease-out / ease-in-out / cubic-bezier
  - 数值插值与颜色插值（HEX、RGB、RGBA）
- 求值器 [src/core/evaluation/evaluator.ts](/Users/henryheng/Code/personCode/clypra/src/core/evaluation/evaluator.ts:1) 中已预留 `clip.keyframes.x`、`clip.keyframes.y`、`clip.keyframes.opacity`、`clip.keyframes.rotation` 等接口
- **但**：`Clip` 类型（[src/types/index.ts](/Users/henryheng/Code/personCode/clypra/src/types/index.ts:1)）中未声明 `keyframes` 字段，且**没有任何关键帧编辑器 UI**（无关键帧轨道、无贝塞尔曲线编辑器）
- 特效强度 keyframes 数据结构已在 `ClipEffect` 和 `AppliedEffect` 类型中定义，但同样无 UI 可编辑
- 相关类型定义：`Keyframe<T>`、`KeyframedProperty<T>`、`evaluateProperty()`

### 7.2 画中画 (Picture-in-Picture)

**现状：不支持时间线级别的画中画。**

- 唯一的 PiP 实现位于 [src/components/ui/ScreenRecordingPreviewModal.tsx](/Users/henryheng/Code/personCode/clypra/src/components/ui/ScreenRecordingPreviewModal.tsx:1)，是屏幕录制的摄像头预览浮窗
- 没有时间线叠加层轨道、没有 PiP 合成逻辑、没有 PiP 片段类型
- **替代方案**：通过多轨道 + 画布定位（x/y/width/height）+ 透明度调节，可手动实现画中画效果

### 7.3 蒙版 (Mask)

**现状：不支持用户自定义蒙版。**

- 仅存在**人体分割蒙版**（[src/features/body-effects/segmentation/](/Users/henryheng/Code/personCode/clypra/src/features/body-effects/segmentation/1)），基于 ONNX Runtime 和 MediaPipe，用于人体特效（发光/轮廓/粒子）
- `EvaluatedMask` 类型（[src/core/evaluation/types.ts](/Users/henryheng/Code/personCode/clypra/src/core/evaluation/types.ts:1)）已定义（支持矩形/圆形/多边形），但标注为 `// Phase 3` 计划中
- 合成器中有 `// TODO: Mask evaluation`（[src/core/compositor/resolver.ts](/Users/henryheng/Code/personCode/clypra/src/core/compositor/resolver.ts:1)）

### 7.4 现有动画/过渡能力对比

| 需求 | 当前状态 | 替代/相关功能 |
|------|---------|-------------|
| 片段位移动画 | 无关键帧 UI | 文字入场/退场动画（8 种预设 + 缓动） |
| 透明度动画 | 无关键帧 UI | 音频 Fade In / Fade Out |
| 缩放/旋转动画 | 无关键帧 UI | 静态 Transform 面板（x/y/w/h/rotation/opacity） |
| 滤镜强度动画 | 数据结构已定义，无 UI | 静态滤镜强度滑块 |
| 混合模式 | 14 种已定义，无 UI | 叠加层 blendMode 字段 |
| 文字动画 | 完整实现 | 入场/退场各 8 种预设（fade/slide/scale/zoom） |
| 多轨道叠加 | 支持 | 可手动实现画中画效果 |

### 7.5 若需实现上述功能的关键文件

| 功能 | 关键文件 | 需要新增/修改 |
|------|---------|--------------|
| 关键帧 UI | `src/components/editor/timeline/` | 关键帧轨道组件、贝塞尔曲线编辑器 |
| 关键帧数据模型 | `src/types/index.ts` | 为 `Clip` 添加 `keyframes` 字段 |
| 关键帧插值 | `src/core/evaluation/animation.ts` | 已有引擎，需对接 Clip 求值 |
| 画中画 | `src/types/index.ts` + 合成器 | 叠加层轨道、画布定位 UI |
| 蒙版 | `src/core/evaluation/types.ts` + 合成器 | 蒙版绘制工具、合成管线集成 |
| 混合模式 UI | `src/components/editor/properties/` | 混合模式选择器 |

## 8. 当前分析说明

本文档作为后续国际化改造和新增模块的起点文档使用。
若你要继续推进，可直接基于”模块化 `react-i18next` 方案”继续细化落地。
