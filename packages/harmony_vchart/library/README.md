# Harmony-VChart

VChart 是 VisActor 可视化系统中的图表组件库。它基于可视化语法库 VGrammar 和基于可视化渲染引擎 VRender 的组件封装，封装了基于可视化语法库的图表逻辑。其核心能力如下：

**跨平台**：自动适应桌面、H5 和多个小程序环境
**叙事**：全面的注释、动画、流程控制、叙事模板等增强功能，用于视觉叙事
**场景**：将视觉叙事能力传递给最终用户，提高开发者的生产力

Harmony-VChart 是 VChart 针对 HarmonyOS 平台进行原生兼容的版本，目前支持 HarmonyOS API 11 以上的版本，最低支持 HarmonyOS API 9

## 效果展示

<div style="text-align: center;">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-dualaxis.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-funnel.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-scatter.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-area.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-ring.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-rose.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-sankey.png" alt="Harmony VChart示例">
  <img style="width: 160px; height: 360px;" crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-example-wordcloud.png" alt="Harmony VChart示例">
  <img crossorigin="anonymous" src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/harmony-vchart-demo-low-quality.gif" alt="Harmony VChart示例">
</div>

## 🔨 使用

### 📦 安装

```bash
# ohpm
ohpm install @visactor/harmony-vchart
```

### 📊 图表示例

<img src="https://user-images.githubusercontent.com/135952300/246996854-95cf0db3-42a2-41f9-8f15-8b7bbec1794c.png" style="width: 500px">

```typescript
import { VChart } from '@visactor/harmony-vchart';

// arkts中直接定义json会报类型错误，需要转成类类型，但是spec的类类型太过复杂
// 这里暂时先用字符串规避
const spec = '{"type":"bar","data":[{"id":"barData","values":[{"month":"Monday","sales":22},{"month":"Tuesday","sales":13},{"month":"Wednesday","sales":25},{"month":"Thursday","sales":29},{"month":"Friday","sales":38}]}],"xField":"month","yField":"sales","crosshair":{"xField":{"visible":true}}}';

@Entry
@Component
struct Chart {
  build() {
    Row() {
      Column() {
        VChart({
          JSON.parse(spec), w: 300, h: 300,
          onChartInitCb: () => {},
          onChartReadyCb: () => {}
        });
      }
      .width('100%')
    }
    .height('100%')
  }
}
```

## ⌨️ 开发

首先，安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)

```bash
$ npm i --global @microsoft/rush
```

然后克隆仓库:

```bash
# clone
$ git clone git@github.com:VisActor/VChart.git
$ cd VChart
# install dependencies
$ rush update
# start vchart development server
$ rush build
```

然后进入 harmony_vchart 目录调试，目前 Harmony 使用的是 VChart 的打包产物文件，代码热更新的开发方式正在开发中...欢迎攻坚

## 🔗 相关链接

- [Homepage](https://www.visactor.io/vchart)
- [VCharts Gallery](https://www.visactor.io/vchart/example)
- [VChart Tutorials](https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Website_Guide)
- [VChart Options](https://www.visactor.io/vchart/option/)
- [VChart API](https://www.visactor.io/vchart/api/API/vchart)
- [VGrammar](https://www.visactor.io/vgrammar)
- [VRender](https://www.visactor.io/vrender)
- [FAQ](https://www.visactor.io/vchart/guide/tutorial_docs/FAQ)
- [CodeSandbox Template](https://codesandbox.io/s/the-template-of-visactor-vchart-vl84ww?file=/src/index.ts) for bug reports
