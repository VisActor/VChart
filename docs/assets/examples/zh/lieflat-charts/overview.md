---
category: examples
group: lieflat charts
title: Lieflat 信息图示例
order: -1
cover: /vchart/preview/lieflat-charts-rung-bars.png
---

# Lieflat 信息图示例

参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) 的单图系列，使用 VChart 实现 **43 个信息图示例**。保留发丝线、可数单位和编辑式留白，配色跟随当前主题，每个示例提供独立完整代码。

## 动画与使用

所有示例显式设置 `animation: true`，打开单个示例时自动入场。自定义图形的文字先出现，刻度、点阵等元素按数据顺序分批进入，整段约 1.1 秒；原生图表使用各自的入场动画。动态排名和累计增长通过原生播放器自动播放，可暂停、拖动进度，离开页面后随实例释放。总览中的封面是静态预览，点击进入示例查看动画。

静态导出可将 `animation` 设为 `false`；带播放器的示例还需将 `player.auto` 设为 `false` 并选择需要展示的时间帧。所有业务数值均为模拟数据；点面积、计数单位和百分比含义在各示例中注明。地图沿用文档站的 GeoJSON 地址，需要联网加载。

## 主题与数据解耦

43 个示例均继承当前 VChart 主题，可通过标准 `vchart.setCurrentTheme(name)` 在运行中切换，无需重建实例或重新计算业务数据。背景、主次文字、网格、分类色和 tooltip 各自使用主题角色；原生坐标轴、图例与播放器继续继承组件主题。自定义图元只在主题变化时解析色板，悬停时复用解析结果。

分类图使用 `colorScheme.default.dataScheme`；日历热力图和地图则从第一数据色到背景色生成单向渐变，保持数值强弱含义。地图图例与区域共用同一个连续比例尺，缺失数据使用网格色，与零值区分。树图的内部标签开启 `smartInvert`，随底色自动调整明暗。原来固定暗色的点阵阶梯图和环形关系图也跟随主题背景。

例如在项目中注册主题后切换当前图表（文档站已提供 `VCHART_MODULE`；项目中可使用 `import * as VCHART_MODULE from '@visactor/vchart'`）：

```javascript
// 原始纸灰风格同样作为主题注册。
VChart.ThemeManager.registerTheme('lieflat-paper', {
  colorScheme: {
    default: {
      dataScheme: ['#1c1c1a', '#4a4944', '#6a6963', '#8f8e88', '#b0afa9', '#c6c5bf'],
      palette: {
        backgroundColor: '#f0efeb',
        primaryFontColor: '#1c1c1a',
        secondaryFontColor: '#62625c',
        axisLabelFontColor: '#62625c',
        axisGridColor: '#deddd6',
        borderColor: '#b0afa9',
        popupBackgroundColor: '#f0efeb',
        disableFontColor: '#c6c5bf'
      }
    }
  }
});

// 深色主题需要先注册。
VChart.ThemeManager.registerTheme('lieflat-dark', VCHART_MODULE.darkTheme);

// 彩色主题：同时指定数据色与文字/背景角色。
VChart.ThemeManager.registerTheme('lieflat-color', {
  colorScheme: {
    default: {
      dataScheme: ['#006c67', '#d85b31', '#5b56ad', '#c18b22', '#297caf', '#a63e6e'],
      palette: {
        backgroundColor: '#fffaf0',
        primaryFontColor: '#283b3a',
        secondaryFontColor: '#566b68',
        axisLabelFontColor: '#566b68',
        axisGridColor: '#e0e6de',
        popupBackgroundColor: '#fffaf0',
        borderColor: '#d5ddd5'
      }
    }
  }
});

await vchart.setCurrentTheme('lieflat-dark');
// await vchart.setCurrentTheme('lieflat-paper');
// await vchart.setCurrentTheme('lieflat-color');
// await vchart.setCurrentTheme('light');
```

也可以在创建图表前用 `VChart.ThemeManager.setCurrentTheme(name)` 设置应用主题。示例没有在 `spec.theme` 或实例选项中锁定主题，避免覆盖应用的主题切换。自定义主题应提供可区分的数据色，以及对比清晰的文字和背景；只修改 `background` 并不等于完整的深色主题。当前封面保留原始纸灰/暗色参考外观，进入示例后按当前主题渲染。

## 预览

| Preview                                                                                                                       | Preview                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [![F1 · 阶梯柱状图](/vchart/preview/lieflat-charts-rung-bars.png)](/vchart/examples/lieflat-charts/rung-bars)                 | [![F4 · 刻度环形图](/vchart/preview/lieflat-charts-tick-donut.png)](/vchart/examples/lieflat-charts/tick-donut)              |
| [![L1 · 发布扇面图](/vchart/preview/lieflat-charts-launch-fan.png)](/vchart/examples/lieflat-charts/launch-fan)               | [![L2 · 点阵阶梯图](/vchart/preview/lieflat-charts-dot-cascade.png)](/vchart/examples/lieflat-charts/dot-cascade)            |
| [![G5 · 植树象形柱图](/vchart/preview/lieflat-charts-pictorial-forest.png)](/vchart/examples/lieflat-charts/pictorial-forest) | [![L13 · 细流漏斗图](/vchart/preview/lieflat-charts-hourglass-stream.png)](/vchart/examples/lieflat-charts/hourglass-stream) |

## 数量与比较（12）

阶梯、刻度、串珠和象形单位适合榜单、差异对比与结果摘要。

| 示例                                                                   | 数据表达                                                       |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| [F1 · 阶梯柱状图](/vchart/examples/lieflat-charts/rung-bars)           | 每一档代表 $1k 月度经常性收入。                                |
| [F5 · 刻度条形图](/vchart/examples/lieflat-charts/tick-rows)           | 每根竖线代表一次发布，每五根用圆点辅助计数。                   |
| [F6 · 并列阶梯柱图](/vchart/examples/lieflat-charts/paired-rungs)      | 每个套餐两组横档，左侧为 2025，右侧为 2026。                   |
| [F7 · 堆叠阶梯柱图](/vchart/examples/lieflat-charts/stacked-rungs)     | 按产品堆叠各地区收入，每档代表 $1k。                           |
| [F9 · 阶梯瀑布图](/vchart/examples/lieflat-charts/rung-waterfall)      | 从总收入扣除成本，刻度的起止位置对应累计值。                   |
| [F12 · 串珠哑铃图](/vchart/examples/lieflat-charts/dumbbell-queue)     | 空心点为改版前、实心点为改版后；每颗珠子表示节省一分钟。       |
| [L2 · 点阵阶梯图](/vchart/examples/lieflat-charts/dot-cascade)         | 一颗小点代表两次事故，顶部圆点与数字为类目总量。               |
| [L7 · 品牌双极量表](/vchart/examples/lieflat-charts/brand-spectrum)    | 每一行的两端都是有效的品牌特征，粗点表示本品牌，细点表示竞品。 |
| [L15 · 多选刻度计数图](/vchart/examples/lieflat-charts/ballot-tally)   | 每项独立按 0–100% 编码；多选题的各项百分比不要求合计 100%。    |
| [G3 · 粗柱排名图](/vchart/examples/lieflat-charts/chunky-bars)         | 少量套餐的收入排名，以粗柱、大数字和圆角突出高低。             |
| [G10 · 正负发散条形图](/vchart/examples/lieflat-charts/diverging-bars) | 正向增长和负向流失以零基线分开，保持数值符号。                 |
| [G5 · 植树象形柱图](/vchart/examples/lieflat-charts/pictorial-forest)  | 一棵树表示 100 棵实际种植树木，逐年数量由符号数给出。          |

## 构成与目标（5）

可数单位、环形刻度和面积块适合百分比、结构占比与目标完成率。

| 示例                                                                 | 数据表达                                               |
| -------------------------------------------------------------------- | ------------------------------------------------------ |
| [F4 · 刻度环形图](/vchart/examples/lieflat-charts/tick-donut)        | 将 100% 构成拆成 100 根刻度，每根代表一个百分点。      |
| [F11 · 刻度仪表盘](/vchart/examples/lieflat-charts/tick-gauge)       | 100 根等距刻度表示目标完成率，已完成部分用主题强调色。 |
| [L14 · 百点构成图](/vchart/examples/lieflat-charts/hundred-field)    | 100 个点拆成四类，点数直接对应百分比，不模拟额外个体。 |
| [G4 · 圆点华夫图](/vchart/examples/lieflat-charts/dot-waffle)        | 100 个圆点按来源连续填充，点数对应百分比。             |
| [F13 · 嵌套矩形树图](/vchart/examples/lieflat-charts/nested-treemap) | 矩形面积表示工时，分组保留产品层级。                   |

## 时间与事件（9）

保留时间位置和事件标记，适合年度回顾、产品历程、趋势与排名故事。

| 示例                                                                      | 数据表达                                                             |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [F2 · 细线折线图](/vchart/examples/lieflat-charts/hairline-line)          | 每天一个点，周末使用空心点。                                         |
| [F3 · 细线面积图](/vchart/examples/lieflat-charts/hairline-area)          | 45 个日读数，垂线从零延伸至当天峰值。                                |
| [L3 · 日历条码棒棒糖图](/vchart/examples/lieflat-charts/barcode-lollipop) | 90 天逐日保留日历位置，圆点表示日峰值，周末为空心点。                |
| [L1 · 发布扇面图](/vchart/examples/lieflat-charts/launch-fan)             | 每条射线表示一个功能，大圆点表示发布周，点面积编码当前活跃量。       |
| [L9 · 年度气泡年鉴](/vchart/examples/lieflat-charts/bubble-almanac)       | 逐年逐产品展示工单总量，内部圆点表示升级工单。                       |
| [L11 · 功能生命周期图](/vchart/examples/lieflat-charts/trend-lineage)     | 逐行追踪功能首发、改版和休眠时间，不将事件汇总成计数。               |
| [L17 · 年度日历热力图](/vchart/examples/lieflat-charts/calendar-heat)     | 使用真实日历日期布局全年 365 天；每格为一天，连续色阶表示部署次数。  |
| [F16 · 河流面积图](/vchart/examples/lieflat-charts/stream-ribbon)         | 三组产品每周活跃账户以居中堆叠面积显示，保留总量变化。               |
| [G21 · 静态排名轨迹](/vchart/examples/lieflat-charts/rank-strip)          | 六个产品跨五期排名，每个时点的排名无重复，纵轴倒序显示第一名在顶端。 |

## 矩阵与分布（6）

用点、弧线、放射轮廓与山峦呈现整体模式，适合海报或专题报告中的分布对比。

| 示例                                                                     | 数据表达                                                     |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [F10 · 点阵热力图](/vchart/examples/lieflat-charts/dot-heat)             | 点面积代表工单数量；零值保留网格位置。                       |
| [L4 · 弧形气泡矩阵](/vchart/examples/lieflat-charts/arc-matrix)          | 产品与城市的二维矩阵沿弧线排布，圆面积表示付费账户数量。     |
| [L8 · 等距点阵平面](/vchart/examples/lieflat-charts/dotty-matrix)        | 四个团队各占一层，6×6 周网格的点面积表示完成任务数。         |
| [L10 · 部署放射叠层图](/vchart/examples/lieflat-charts/radial-patchwork) | 角度对应一天中的时间，半径对应部署规模，透明度叠加体现密度。 |
| [L19 · 分布山峦图](/vchart/examples/lieflat-charts/ridgeline)            | 基于各组连续观测值计算高斯核密度，以轮廓比较分布。           |
| [F14 · 阶梯直方图](/vchart/examples/lieflat-charts/rung-histogram)       | 工单解决时长按两小时分箱，一档代表一个工单。                 |

## 关系、层级与流向（7）

保留能直接看出聚类、归属或流向的布局；hover 只补充细节。

| 示例                                                                     | 数据表达                                                               |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [L5 · 放射汇聚图](/vchart/examples/lieflat-charts/radial-convergence)    | 48 个需求保留独立节点，连线汇入所属的五个主题。                        |
| [L6 · 贡献者群岛图](/vchart/examples/lieflat-charts/cluster-field)       | 中心仓库与贡献者组成群落，跨群连线表示跨仓贡献。                       |
| [L12 · 仓库归属柱廊](/vchart/examples/lieflat-charts/type-colonnade)     | 44 个仓库以独立名称保留，细线连接到 10 个负责人。                      |
| [L13 · 细流漏斗图](/vchart/examples/lieflat-charts/hourglass-stream)     | 各阶段宽度与人数成正比，每条细流代表 10 位到访者，流在未转化阶段终止。 |
| [G6 · 环形关系图](/vchart/examples/lieflat-charts/circular-network)      | 12 个节点按圆周排列，悬停突出相邻节点，点击固定或取消选择。            |
| [G7 · 横向产品树](/vchart/examples/lieflat-charts/platform-tree)         | 以三层从属关系展示平台、产品组和具体模块。                             |
| [G22 · 聚合流量桑基图](/vchart/examples/lieflat-charts/aggregate-sankey) | 来源流入套餐的带宽表示账户数量，节点值由入流或出流求和。               |

## 动态叙事（2）

跨期排名与累计增长适合动态信息图；原生播放器默认自动播放，支持暂停与拖动进度。

| 示例                                                                    | 数据表达                                             |
| ----------------------------------------------------------------------- | ---------------------------------------------------- |
| [G16 · 产品动态排名](/vchart/examples/lieflat-charts/bar-race)          | 原生播放器逐月更新数据，条形长度和分类顺序同时变化。 |
| [G18 · 描线增长与数字](/vchart/examples/lieflat-charts/draw-in-counter) | 累计收入按月绘制折线，标题随播放器同步更新累计金额。 |

## 地理分布（2）

适合区域差异、覆盖范围和全球分布故事；底图保留地理形状，不将地理面积作为数量编码。

| 示例                                                                   | 数据表达                                                               |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [M1 · 美国州级分级地图](/vchart/examples/lieflat-charts/us-choropleth) | 州界使用地理数据；连续色阶表示注册量，面积只表达地理范围，不表示人数。 |
| [M2 · 世界分级地图](/vchart/examples/lieflat-charts/world-choropleth)  | 国家轮廓与活跃账户数据按名称关联；缺失数据与零值在提示中区分。         |

## 参考与实现

参考版本：`eace082`。原生图型使用 VChart series；编辑布局使用公开的 `customMark` / `dataId` 接口。自定义图形通过 `TooltipHandler` 显示数据提示，并随实例释放；环形关系图的高亮使用图元状态。

参考项目的设计与图型命名归原作者所有，其仓库采用 [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/eace082/LICENSE)。本目录的 VChart 实现为重新编写，未分发原项目的模板源码和媒体资源。
