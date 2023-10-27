# 快速上手

@VisActor/VChart提供从数据到展现的全流程解决方案，以“可视化叙事”及“智能化”为核心竞争力。大语言模型强大的生成能力为VChart提供了一个自然语言的交互接口，允许我们通过自然语言直接调用VChart的各项能力，简单、快速、高质量地完成图表生成与编辑。
@VisActor/VMind是基于VChart和大语言模型的图表智能模块，提供图表智能推荐、智能配色、对话式图表编辑等能力，能够极大地降低VChart的使用门槛，提高用户创作数据可视化作品的效率。
在本教程中，我们将介绍如何使用 VMind 组件 生成一个简单的图表。

## 获取 VMind

### 使用 NPM 包

首先，你需要在项目根目录下使用以下命令安装 VMind

```sh
# 使用 npm 安装
npm install @visactor/vmind

# 使用 yarn 安装
yarn add @visactor/vmind
```

VMind需要配合VChart一起使用。为了进行图表绘制，你还需要在项目中引入VChart。具体教程详见 [快速上手](http://www.visactor.io/vchart/guide/tutorial_docs/Getting_Started)

## 引入 VMind

### 通过 NPM 包引入

在 JavaScript 文件顶部使用 `import` 引入 VMind

```js
import VMind from '@visactor/vmind';
```

## 初始化VMind实例
首先我们需要初始化一个VMind实例，并用它完成后续操作。VMind目前仅支持OpenAI GPT-3.5模型，你需要提供[OpenAI API key](https://platform.openai.com/account/api-keys)才能使用。未来我们将支持更多的大模型，并允许用户自定义调用大模型的方法。
使用以下代码初始化一个VMind实例：
```js
const vmind = new VMind(openAIKey); //传入您的openAI key
```

## 图表智能生成模块
在传统的图表生成步骤中，为了制作一个完整的图表，你需要完成以下步骤：
1. 首先准备一份想要进行展示的数据
2. 指定一个图表类型（图表推荐）
3. 描述数据中的字段如何映射到图表的视觉通道上（字段映射）
4. 对各个元素进行样式修改，并设置图表色板（智能配色）

而使用VMind生成一张图表，你仅需要：
1. 提供一份想要展示的数据（csv格式）
2. 描述你对图表的要求，例如想在图表中展示哪些信息，使用何种风格的配色等等

例如，我们想使用下面的商品销售额数据，展示不同区域各商品销售额：

| 商品名称 | region | 销售额 |
|  ----  | ----  | ---- |
| 可乐 | south | 2350 |
| 可乐 | east | 1027 |
| 可乐 | west | 1027 |
| 可乐 | north | 1027 |
| 雪碧 | south | 215 |
| 雪碧 | east | 654 |
| 雪碧 | west | 159 |
| 雪碧 | north | 28 |
| 芬达 | south | 345 |
| 芬达 | east | 654 |
| 芬达 | west | 2100 |
| 芬达 | north | 1679 |
| 醒目 | south | 1476 |
| 醒目 | east | 830 |
| 醒目 | west | 532 |
| 醒目 | north | 498 |

使用以下代码，获得图表spec：
```typescript

const csvData=`商品名称,region,销售额
可乐,south,2350
可乐,east,1027
可乐,west,1027
可乐,north,1027
雪碧,south,215
雪碧,east,654
雪碧,west,159
雪碧,north,28
芬达,south,345
芬达,east,654
芬达,west,2100
芬达,north,1679
醒目,south,1476
醒目,east,830
醒目,west,532
醒目,north,498`
const describe='帮我展示不同区域各商品销售额'
const { spec, time } = await (vmind.generateChart(csvData, describe)); //图表智能生成，传入您的csv格式的数据和图表描述，返回图表spec和图表动画时长
```

接下来，我们就可以使用VChart绘制生成的图表。
在绘图前我们需要为 VChart 准备一个具备高宽的 DOM 容器。

```html
<body>
  <!-- 为 vchart 准备一个具备大小（宽高）的 DOM，当然你也可以在 spec 配置中指定 -->
  <div id="chart" style="width: 600px;height:400px;"></div>
</body>
```

接下来，我们创建一个 `VChart` 实例，传入刚刚生成的spec和 DOM 容器的 ID：

```ts
// 创建 vchart 实例
const vchart = new VChart(spec, { dom: 'chart' });
// 绘制
vchart.renderAsync();
```
生成的图表如下：

![柱状图](<https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/bar.gif>)

我们还可对图表提更多的要求，例如：
```typescript
const describe='帮我展示不同区域各商品销售额，使用折线图，region做x轴'
const { spec, time } = await (vmind.generateChart(csvData, describe)); //图表智能生成，传入您的csv格式的数据和图表描述，返回图表spec和图表动画时长
```
生成的图表如下：

![折线图](<https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/line.gif>)

## 导出GIF和视频
VMind支持将生成的图表导出为GIF格式的动画和视频，随时随地进行分享。
下面将展示如何获得图表GIF和视频的ObjectURL：
```typescript
//导出视频
const videoSrc = await vmind.exportVideo(spec, time); //传入图表spec和视频时长，返回ObjectURL
//导出GIF图片
const gifSrc = await vmind.exportGIF(spec, time); //传入图表spec和GIF时长，返回ObjectURL
```
一旦获得图表的ObjectURL，我们可以将其保存为文件。以保存视频文件为例：
```typescript
//创建dom元素，实现文件下载
  const a = document.createElement('a')
  a.href = videoSrc
  a.download = `${filename}.mp4` //设置保存的文件名
  a.dispatchEvent(new MouseEvent('click')) //保存文件
```


## 总结

本章介绍了如何安装并使用VMind进行图表生成，并演示了如何将生成的图表保存为GIF和视频。VMind目前支持柱状图、饼图、折线图、散点图、词云、动态条形图，更多图表类型正在开发中。VMind能够根据用户数据和展示意图，推荐合适的图表类型，并将字段映射到合适的视觉通道上，自动生成符合用户需求的色板，降低用户进行数据可视化的门槛，帮助您轻松完成数据叙事。