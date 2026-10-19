{{ target: chart-sequence-analysis }}

# sequenceAnalysisChart

时序分析扩展图表，以用户为纵轴，按时间、步骤或介质展示事件及连接。来自 `@visactor/vchart-extension`，使用前调用 `registerSequenceAnalysis()`；扩展包与 VChart 应使用相同且包含该功能的版本。

```js
import VChart from '@visactor/vchart';
import { registerSequenceAnalysis } from '@visactor/vchart-extension';
registerSequenceAnalysis();
```

[教程](/vchart/guide/tutorial_docs/Chart_Extensions/sequence_analysis) · [步骤模式](/vchart/demo/extension-chart/sequence-analysis-step) · [介质曲线连接](/vchart/demo/extension-chart/sequence-analysis-medium) · [时间模式 + 目标头像](/vchart/demo/extension-chart/sequence-analysis-target)

本图表使用以下专用数据字段，转换器会生成底层 common 图表、dot/link 系列、轴及缩放组件，无需自行配置 `data`、`series`、`xField` 或 `yField`。需要修改生成结果时使用 `customTransformSpec`。

## type(string) = 'sequenceAnalysis'

必填，固定为 `'sequenceAnalysis'`。与内置 `sequence` 图表及 `sequenceScatterLink` 扩展图表不同。

## mode(string)

必填，可选 `'time'` 或 `'step'`。

- `'time'`：横轴使用 `dots.time_stamp`，顶部显示同一时间点的 `action_count` 总和，底部显示时间；连接来自 `actionData`。
- `'step'`：默认以 `dots.step` 为横轴，连接来自 `patternData`；开启 `mediumConnection` 后改用 `dots.medium_type`。

## mediumConnection(boolean) = false

仅 step 模式生效。`false` 时使用步骤分类轴和直线，顶部标签来自 `stepMediumMap`；`true` 时使用介质分类轴和三次贝塞尔曲线，同一组端点的重复连接使用不同曲率。

## actionTarget(boolean) = false

仅 time 模式生效。`false` 时保留直线连接，不显示连接头像及箭头；`true` 时在线段中间显示 `actionData.user_image`，并在目标端显示箭头。头像来源不会根据 `user_id` 自动查找。

## eventData(Array)

必填的逐用户事件数组，保留 `{ user_id, user_image, dots: [...] }` 嵌套结构，不要在调用前展平。

当前 time 模式的计数标签和 markLine 在 spec 转换时生成。仅调用 `updateDataSync('eventData', ...)` 或 `updateFullDataSync(...)` 不会重建这些派生配置。更改时间戳或计数时，请用保存的完整扩展 spec 调用 `updateSpecSync({ ...spec, eventData: nextEvents })`，并按需一并更新连接及头像映射；不要把转换后的 `getSpec()` 当作原始扩展 spec。

### user_id(string)

用户唯一标识，也是纵轴分类值。

### user_image(string)

事件数据中的用户头像地址。默认纵轴头像实际取自 `userImageMap[user_id]`，不会自动从该字段生成映射。

### dots(Array)

该用户的事件列表。以下字段构成公开事件数据结构；建议在两种模式中均提供完整字段，便于切换。

#### node_name(string)

事件唯一标识，必须在所有用户的 dots 中全局唯一。连接的 `from` / `to` 引用该值。

#### step(string)

步骤分类，step 模式且 `mediumConnection: false` 时用作横轴。

#### medium_type(string)

介质分类，例如 `'IP'`、`'Device'`，step 模式且 `mediumConnection: true` 时用作横轴。

#### action_type(string)

事件类型，用于 dot 系列的颜色分组。

#### time_stamp(number)

事件发生的 Unix 时间戳，单位为毫秒，time 模式用作横轴。

#### action_count(number)

事件数量。time 模式顶部标签按时间戳对所有用户的该值求和。

## actionData(Array)

time 模式的事件连接数组；无连接时传入 `[]`。

### from(string)

起始事件的 `node_name`。

### to(string)

目标事件的 `node_name`。两端必须在 eventData 中存在。

### user_id(string)

可选的连接关联用户标识，不会自动解析头像地址。

### user_image(string)

连接头像地址或 data URL，`actionTarget: true` 时使用。它与纵轴使用的 userImageMap 是两个独立输入。

## patternData(Array)

step 模式的模式连接数组；无连接时传入 `[]`。

### from(string)

起始事件的 `node_name`。

### to(string)

目标事件的 `node_name`。

### pattern_type(string)

模式分类，用于 link 系列的颜色分组。

### isExtend(string)

使用 `'left'` 或 `'right'` 指定延伸侧，省略时向两侧延伸。接口中的 `'all'` 当前未按双侧处理，需要两端延伸时请省略该字段。仅 step 模式的直线连接开启 `allowExtend`：在起点或终点向分类带外侧适当延长；不改变事件的位置。曲线连接不使用此设置。

## userImageMap(Object)

用户 ID 到头像地址的映射，例如 `{ Alice: 'data:image/svg+xml,...' }`，默认纵轴标签从这里读取。应覆盖 eventData 中的所有用户。若通过 customTransformSpec 把纵轴标签改成文字，可传入空对象。

## stepMediumMap(Object)

步骤名称到 `{ medium_type: string; count: number }` 的映射，供 step 模式且 `mediumConnection: false` 的顶部标签使用。值是对象，不是字符串；`count` 可为 0。

```js
stepMediumMap: {
  step_1: { medium_type: 'IP', count: 0 },
  step_2: { medium_type: 'Device', count: 2 }
}
```

应覆盖所有 step 分类；time 模式及介质连接模式可传入 `{}`。此处的 count 是业务提供的附加数量，不会从 eventData 自动统计。

## colors(Array)

当前接口保留该字段，但转换器尚未将其映射到底层色板。请在 `customTransformSpec` 中设置标准 `color` 配置：

```js
customTransformSpec(spec) {
  spec.color = ['#5470c6', '#26a69a', '#f6bd16'];
}
```

## customTransformSpec(Function)

在专用 spec 转成 common 图表配置后、执行 common 图表规范化前调用。原地修改传入对象，无需返回值。

默认生成底部 DataZoom（filter 模式）、右侧 ScrollBar，以及底部 ScrollBar（axis 模式）。滚动条初始范围为 `[0, 0.8]`；存在两根横轴时，底部滚动条会联动第二根轴。默认关闭动画和 tooltip。

```js
customTransformSpec(spec) {
  const link = spec.series.find(series => series.type === 'link');
  link.link.style = { stroke: '#5470c6', lineWidth: 2 };
  // 直线和曲线均通过 link 配置显隐、样式和状态。
  link.link.state = { custom_unSelected: { strokeOpacity: 0.25 } };
  spec.scrollBar.forEach(bar => { bar.start = 0; bar.end = 1; });
}
```
