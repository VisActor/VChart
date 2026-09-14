# Lynx

Lynx 是字节跳动开源的高性能跨端框架，基于 Web 技术栈构建原生视图。VChart 提供了面向字节内部 Lynx 环境的渲染适配。

## 适用范围

**根据截至 2026-09-14 的公开文档和源码核查，开源原生 Lynx 尚未公开提供本文所需的 Canvas 接入能力。** 安装 `@visactor/vchart` 不会为宿主补充 Canvas 能力。开源进展请参考 [Lynx 官方文档](https://lynxjs.org/)及 [Lynx 图表需求讨论](https://github.com/lynx-family/lynx/issues/6230#issuecomment-4729040590)。

本文说明 VChart 侧的环境注册和参数要求，适用于已经具备 Canvas 能力的内部 Lynx 宿主。宿主的画布创建、视图绑定、模板、生命周期和事件接入方式，需要以对应宿主及版本的接入文档为准。本页不提供经过宿主运行验证的完整示例。

如果使用内部 ReactLynx 组件封装，请参阅 [ReactLynx 文档](/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react-lynx)。该封装依赖内部包 `@dp/lynx-vchart`，同样需要宿主提供 Canvas 能力。

## 获取 VChart

在满足上述宿主要求的项目中安装：

```bash
npm install @visactor/vchart
```

## VChart 环境适配

### 注册环境

创建图表前注册 Lynx 环境：

```ts
import { registerLynxEnv } from '@visactor/vchart';

registerLynxEnv();
```

此调用注册 VChart 所需的 Lynx 渲染适配，不负责安装或启用宿主的 Canvas 组件。

### 初始化参数

以下是 VChart 侧的参数要求；具体值需由已完成接入的宿主提供。

| 配置位置                       | 说明                                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 构造选项 `mode`                | 设置为 `'lynx'`。                                                                                                      |
| 构造选项 `renderCanvas`        | 指定宿主提供的画布实例或标识，用于绑定当前图表的绘制画布。                                                             |
| 图表 spec 的 `width`、`height` | 提供图表在宿主中的绘制尺寸。                                                                                           |
| 构造选项 `dpr`                 | 提供宿主的设备像素比。                                                                                                 |
| 构造选项 `modeParams`          | 传入宿主提供的环境能力，如 `pixelRatio`、`lynx` / `runtime` 或 `canvasFactory`；这些能力应适用于同一环境中的多个图表。 |

新接入应通过 `renderCanvas`、图表尺寸和 `dpr` 指定单个图表的画布信息，不依赖旧示例中的 `domref`、`canvasIdLists` 或 `freeCanvasIdx`。这些旧参数不能替代宿主的 Canvas 能力。

交互还需要对应宿主的画布事件接入。完成集成后，应在该宿主及版本中验证首屏渲染和触摸交互；仅注册环境不能验证接入是否可用。

## 按需加载

VChart 的图表和组件按需注册方式请参阅[按需加载教程](/vchart/guide/tutorial_docs/Load_on_Demand)。在 Lynx 中使用时，还需要调用 `registerLynxEnv()`，并使用适合原生 Canvas 环境的组件，例如 Canvas Tooltip。

`<VChartSimple />` 等标签属于内部 ReactLynx 组件封装，其用法请参阅 [ReactLynx 文档](/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react-lynx)。
