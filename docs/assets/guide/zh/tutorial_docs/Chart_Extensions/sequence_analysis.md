# 扩展图表：时序分析图

**版本要求：** `sequenceAnalysis` 自 **VChart 2.2.0** 起由 `@visactor/vchart-extension` 提供。请使用 **2.2.0 或更高版本**，并保持 `@visactor/vchart` 与 `@visactor/vchart-extension` 版本一致。在线演示切换到不支持此图表的版本时，需要升级；主包不内置该扩展图表。

自 **2.2.0** 起，`dot`、`link` 系列也整体移至 `@visactor/vchart-extension`，主包不再导出或自动注册 `DotSeries`、`LinkSeries`、`registerDotSeries`、`registerLinkSeries`，对应的 `IDotSeriesSpec`、`ILinkSeriesSpec` 类型也从扩展包导入。`registerSequenceChart({ VChart })` 和 `registerSequenceAnalysis({ VChart })` 会注册各自需要的系列；在 `common` 图表中单独使用时，需要从扩展包导入并调用 `registerDotSeries()`、`registerLinkSeries()`。

时序分析图（Sequence Analysis）把每个用户的事件放在同一条水平线上，通过时间、步骤或介质分类对齐事件，再用连接线表达事件之间的关系。适合展示行为路径、跨用户事件关联和重复模式。

它由 `@visactor/vchart-extension` 提供，类型为 `sequenceAnalysis`，与扩展时序图 `sequence` 和用于训练过程分析的 `sequenceScatterLink` 是不同图表。

![时序分析图](/vchart/preview/sequence-analysis-step.png)

## 选择展示模式

| 配置                                    | 横轴               | 连接数据      | 呈现                                     |
| --------------------------------------- | ------------------ | ------------- | ---------------------------------------- |
| `mode: 'time', actionTarget: false`     | 毫秒时间戳         | `actionData`  | 直线连接；顶部显示各时间点的事件数量总和 |
| `mode: 'time', actionTarget: true`      | 毫秒时间戳         | `actionData`  | 直线、连接中点头像及目标端箭头           |
| `mode: 'step', mediumConnection: false` | `dots.step`        | `patternData` | 直线；顶部显示步骤的介质名称和附加数量   |
| `mode: 'step', mediumConnection: true`  | `dots.medium_type` | `patternData` | 三次贝塞尔曲线；重复端点连接使用不同曲率 |

## 注册并创建图表

安装 2.2.0 或更高版本、且与 VChart 版本一致的扩展包，在创建图表前注册。页面需要提供 `id="chart"` 的容器。

下面是完整的最小步骤示例。这里通过转换回调把纵轴头像改成用户名称，所以 `userImageMap` 可以为空；演示页沿用本地 demo 的用户头像地址。

```js
import VChart from '@visactor/vchart';
import { registerSequenceAnalysis } from '@visactor/vchart-extension';

registerSequenceAnalysis();
const spec = {
  type: 'sequenceAnalysis',
  mode: 'step',
  mediumConnection: false,
  height: 440,
  eventData: [
    {
      user_id: 'Alice',
      user_image: '',
      dots: [
        {
          node_name: 'a1',
          step: 'step_1',
          medium_type: 'IP',
          action_type: 'visit',
          time_stamp: 1767225600000,
          action_count: 2
        }
      ]
    },
    {
      user_id: 'Bob',
      user_image: '',
      dots: [
        {
          node_name: 'b1',
          step: 'step_2',
          medium_type: 'Device',
          action_type: 'login',
          time_stamp: 1767312000000,
          action_count: 1
        }
      ]
    }
  ],
  patternData: [{ from: 'a1', to: 'b1', pattern_type: 'shared' }],
  actionData: [{ from: 'a1', to: 'b1' }],
  userImageMap: {},
  stepMediumMap: {
    step_1: { medium_type: 'IP', count: 0 },
    step_2: { medium_type: 'Device', count: 1 }
  },
  customTransformSpec(converted) {
    converted.color = ['#5470c6', '#26a69a'];
    converted.axes.find(axis => axis.orient === 'left').label.formatMethod = label => label;
    converted.scrollBar.forEach(bar => {
      bar.start = 0;
      bar.end = 1;
    });
  }
};
const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderSync();
```

通过 CDN 使用时，加载两个包对应版本的 `build/index.min.js`，并把页面实际使用的 VChart 构造函数传入注册方法：

```js
// sequenceAnalysis 自 VChart 2.2.0 起支持；请加载同版本的 @visactor/vchart-extension。
// 在线 demo 按方法是否存在注册；使用此图表仍需选择上述支持的版本。
if (typeof VChartExtension !== 'undefined' && typeof VChartExtension.registerSequenceAnalysis === 'function') {
  VChartExtension.registerSequenceAnalysis({ VChart: VChart.default });
}
const vchart = new VChart.default(spec, { dom: 'chart' });
vchart.renderSync();
```

## 准备事件与连接数据

`eventData` 是逐用户数组，每行包含 `user_id`、`user_image` 和嵌套的 `dots`，不要提前把 dots 展平。每个事件提供 `node_name`、`step`、`medium_type`、`action_type`、`time_stamp` 和 `action_count`，完整字段说明见[配置项](/vchart/option/sequenceAnalysisChart)。

- `node_name` 必须在所有用户之间全局唯一；所有连接的 `from`、`to` 都必须能找到对应事件。
- time 模式使用 `actionData`；step 模式使用 `patternData`。没有连接时传入空数组。
- dot 颜色按 `action_type` 分组，模式连接颜色按 `pattern_type` 分组。
- `time_stamp` 单位为毫秒。顶部时间轴按时间戳汇总所有用户的 `action_count`，不等于简单的事件行数。
- `stepMediumMap` 的值是 `{ medium_type, count }` 对象，`count` 是业务提供的附加数量，不是时间轴的 action_count 汇总。零计数也会显示；普通 step 模式需覆盖全部步骤，另外两类横轴可以传 `{}`。

## 用户头像与目标头像

默认纵轴使用 `userImageMap[user_id]`；事件行里的 user_image 不会自动转为该映射。

时间模式开启 actionTarget 后，连接中点使用 `actionData.user_image`。只填写 `actionData.user_id` 不会自动查找头像地址。关闭 actionTarget 只隐藏连接头像和箭头，仍保留连接线。

头像可以使用可访问的图片 URL 或 data URL；[查看时间模式 + 目标头像示例](/vchart/demo/extension-chart/sequence-analysis-target)。

## 定制样式与缩放

转换器自动生成 dot/link 系列、横纵轴、底部 DataZoom 和横纵 ScrollBar。底部滚动条在存在两根横轴时同步它们的窗口比例；默认滚动条范围为 `[0, 0.8]`。动画和 tooltip 默认关闭。

通过 customTransformSpec 原地修改生成的 common 配置。返回值不会替代该配置：

```js
customTransformSpec(converted) {
  const connection = converted.series.find(series => series.type === 'link');
  connection.link.style = { stroke: '#5470c6', lineWidth: 2 };
  connection.link.state = { custom_unSelected: { strokeOpacity: 0.25 } };
  converted.color = ['#5470c6', '#26a69a', '#f6bd16'];
  converted.scrollBar.forEach(bar => { bar.start = 0; bar.end = 1; });
}
```

直线和曲线都使用 link 的 visible、style、state，不需要配置 curveLink。接口中的 colors 尚未接入转换逻辑，设置色板请使用上面的标准 color 配置。

DataZoom 与 ScrollBar 新增的 linkedAxisId / linkedAxisIndex 仅在 filterMode 为 axis 时同步窗口比例，不复制另一根轴的数据域。[联动轴配置](/vchart/option/commonChart-scrollBar-linkedAxisIndex)。

## 更新数据与当前限制

保存创建图表时的原始扩展 spec；不要把已经转换成 common 的 getSpec() 结果作为原始输入。

当前 time 模式的时间计数标签与 markLine 在 spec 转换阶段生成。单独 updateDataSync('eventData', ...) 或 updateFullDataSync(...) 会更新事件，但不会重建这些派生配置，可能留下旧标签或标记线。

使用完整 updateSpecSync 更新。以下代码也展示如何从步骤模式切换到时间模式；该方式会重建计数标签和标记线：

```js
const nextEvents = spec.eventData.map(user => ({
  ...user,
  dots: user.dots.map(event => ({
    ...event,
    time_stamp: event.time_stamp + 24 * 60 * 60 * 1000,
    action_count: event.action_count + 1
  }))
}));
vchart.updateSpecSync({ ...spec, mode: 'time', eventData: nextEvents });
```

若删除或重命名事件，需在同一次完整 spec 更新中同步 actionData / patternData；用户变化时同时更新 userImageMap，步骤变化时同时更新 stepMediumMap。

## 完整示例与配置项

- [步骤模式](/vchart/demo/extension-chart/sequence-analysis-step)
- [介质曲线连接](/vchart/demo/extension-chart/sequence-analysis-medium)
- [时间模式 + 目标头像](/vchart/demo/extension-chart/sequence-analysis-target)
- [全部配置项](/vchart/option/sequenceAnalysisChart)
