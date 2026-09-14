# Lynx

Lynx is a high-performance cross-platform framework open-sourced by ByteDance for building native views with web technologies. VChart provides a rendering adapter for ByteDance's internal Lynx environment.

## Scope

**Based on public documentation and source code reviewed on September 14, 2026, open-source native Lynx does not yet publicly provide the Canvas integration required by this guide.** Installing `@visactor/vchart` does not add Canvas support to the host runtime. For updates, see the [official Lynx documentation](https://lynxjs.org/) and the [Lynx charting discussion](https://github.com/lynx-family/lynx/issues/6230#issuecomment-4729040590).

This guide describes environment registration and parameters on the VChart side for internal Lynx hosts that already provide Canvas support. Canvas creation, view binding, templates, lifecycle hooks, and event integration depend on the documentation for the specific host and version. This page does not provide a complete example verified in a host runtime.

For the internal ReactLynx component wrapper, see the [ReactLynx guide](/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react-lynx). It depends on the internal `@dp/lynx-vchart` package and also requires Canvas support from the host.

## Get VChart

Install VChart in a project that meets the host requirements above:

```bash
npm install @visactor/vchart
```

## VChart Environment Integration

### Register the Environment

Register the Lynx environment before creating a chart:

```ts
import { registerLynxEnv } from '@visactor/vchart';

registerLynxEnv();
```

This call registers the Lynx rendering adapter required by VChart. It does not install or enable the host's Canvas component.

### Initialization Parameters

The following parameters describe the VChart side of the integration. Their values must come from a host with a working Canvas integration.

| Configuration                     | Description                                                                                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Constructor option `mode`         | Set to `'lynx'`.                                                                                                                                                        |
| Constructor option `renderCanvas` | The canvas instance or identifier supplied by the host, used to bind the drawing canvas for this chart.                                                                 |
| Chart spec `width` and `height`   | The chart's drawing dimensions in the host.                                                                                                                             |
| Constructor option `dpr`          | The host's device pixel ratio.                                                                                                                                          |
| Constructor option `modeParams`   | Host environment capabilities such as `pixelRatio`, `lynx` / `runtime`, or `canvasFactory`. These capabilities should apply to multiple charts in the same environment. |

For new integrations, use `renderCanvas`, the chart dimensions, and `dpr` to specify each chart's canvas information, without depending on `domref`, `canvasIdLists`, or `freeCanvasIdx` from older examples. Those parameters cannot supply Canvas support to the host.

Interaction also requires canvas event integration for the specific host. After integration, verify initial rendering and touch interaction in that host and version; environment registration alone does not verify that the integration works.

## On-Demand Loading

For registering individual charts and components, see the [on-demand loading guide](/vchart/guide/tutorial_docs/Load_on_Demand). In Lynx, also call `registerLynxEnv()` and use components suitable for native Canvas environments, such as Canvas Tooltip.

Tags such as `<VChartSimple />` belong to the internal ReactLynx component wrapper. See the [ReactLynx guide](/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react-lynx) for their usage.
