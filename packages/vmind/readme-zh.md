# @visactor/vmind

<div align="center">

[English](README.md) | 简体中文

</div>

`@visactor/vmind` 是由 [VisActor](https://www.visactor.io/) 为您提供的基于大模型的图表智能组件，包括对话式的图表智能生成与编辑能力。它提供了一个自然语言交互接口，仅需一句话，您就能够轻松使用`@visactor/vmind` 创建图表叙事作品，并通过连续的对话进行编辑，极大地提高您创作数据可视化作品的效率。

`@visactor/vmind` 的主要特点包括：

- **易于使用**：仅需提供您期望展示的数据+一句话描述您想要展示的信息，`@visactor/vmind`会自动帮您完成图表生成。在现有图表的基础上，一句话描述您想对图表做出的修改，`@visactor/vmind`会帮您实现您想要的效果。
- **扩展性强**：`@visactor/vmind` 的组件可以轻松地扩展和定制，可以根据需要添加新的功能和特性。默认使用OpenAI GPT模型，您可将轻松将其替换为任何一个文本大模型。
- **轻松叙事**：基于`@visactor/vchart`强大的图表叙事能力，`@visactor/vmind` 支持生成多种类型的图表，包括折线图、柱状图、饼图等，还可生成动态条形图等动态图表，方便您进行数据叙事。更多图表类型正在接入中。您还可以使用对话式编辑功能轻易修改图表样式和动画效果，方便您进行叙事创作。
- **一键导出**：`@visactor/VMvmindind` 内置了图表导出模块，您可将所创建的图表叙事导出为视频或GIF进行展示。


## 使用说明

### 📦 安装

```bash
# npm
$ npm install @visactor/vmind

# yarn
$ yarn add @visactor/vmind
```

### 📊 使用示例

#### 图表智能生成

```typescript
import VMind from '@visactor/vmind'

const vmind = new VMind(openAIKey) //传入您的openAI key

const { spec, time } = await (vmind.generateChart(csv, describe)); //图表智能生成，传入您的csv格式的数据和图表描述，返回图表spec和图表动画时长

```

#### 图表导出
```typescript
//导出视频
const src = await vmind.exportVideo(spec, time); //传入图表spec和视频时长，返回ObjectURL
//导出GIF图片
const src = await vmind.exportGIF(spec, time); //传入图表spec和GIF时长，返回ObjectURL
```
#### 对话式编辑
开发中，敬请期待

### 效果展示
#### 动态条形图
![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-2.gif)

#### 柱状图
![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-1.gif)

#### 饼图
![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-3.gif)





