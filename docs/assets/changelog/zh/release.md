# v1.10.4

2024-04-03


**🆕 新增功能**

- **@visactor/vchart**: 增强图表堆叠能力，提供 `stackSort` 以支持堆叠时的排序

**🐛 功能修复**

- **@visactor/vchart**: 修复了隐藏轴线时轴的单位错位的问题
- **@visactor/vchart**: 修复了堆叠图表中数据顺序不一致的问题
- **@visactor/vchart**: 增加了 common 图表中 markArea 和 markPoint 的类型定义
- **@visactor/vchart**: 修复了 crosshair 的 `formatMethod` 有可能执行多次的问题（提示：修复过以后，之前 crosshair label 保留两位小数的逻辑变成了默认的 formatMethod，用户替换 formatMethod 以后不再保留小数），相关[#2501](https://github.com/VisActor/VChart/issues/2501)
- **@visactor/vchart**: 修复了连续轴轴数据范围过小时，crosshair 难以移动的问题，相关[#2492](https://github.com/VisActor/VChart/issues/2492)
- **@visactor/vchart**: 修复了 `updateDataSync` 方法造成图表布局没有刷新的问题，相关[#2503](https://github.com/VisActor/VChart/issues/2503)

**🔨 功能重构**

- **@visactor/vchart**: 增加事件参数 `vchart`，会在生命周期事件中更新，相关[#2502](https://github.com/VisActor/VChart/issues/2502)

[更多详情请查看 v1.10.4](https://github.com/VisActor/VChart/releases/tag/v1.10.4)

# v1.10.3

2024-03-28


**🆕 新增功能**
- **@visactor/vchart**：支持`element-select`和`element-highlight`的交互事件
- **@visactor/vchart**：支持在地图图表中使用`showDefaultName`来显示地图数据中未匹配的名称

**🐛 功能修复**

- **@visactor/vchart**：修复Tooltip边框被裁减的问题[#2471](https://github.com/VisActor/VChart/issues/2471)
- **@visactor/vchart**：修复矩形Crosshair中`lineWidth`无效，相关[#2432](https://github.com/VisActor/VChart/issues/2432)
- **@visactor/vchart**：应该使用`series.getMarkInName`来获取总标签的计算标记，已修复[#2448](https://github.com/VisActor/VChart/issues/2448)
- **@visactor/vchart**：修复`updateSpecSync()`后事件触发次数不断增加的问题
- **@visactor/vchart**：如果未在nameMap中配置，地图数据将不会显示
- **@visactor/vchart**：在采样角度轴上缺少轴标签，相关[#2439](https://github.com/VisActor/VChart/issues/2439)
- **@visactor/vchart**：修复雷达图clipAngle动画在按需加载时的错误
- **@visactor/vchart**：修复_eventDispatcher的释放顺序问题
- **@visactor/vchart**：应该使用系列的_seriesMark来计算总标记，不是所有系列标记名称都与系列类型相同



[更多详情请查看 v1.10.3](https://github.com/VisActor/VChart/releases/tag/v1.10.3)

# v1.10.2

2024-03-26

**🆕 新增功能**
- **@visactor/vchart**：: 支持`element-select`和`element-highlight`交互事件

**🐛 功能修复**
- **@visactor/vchart**：：`lineWidth`在矩形十字准线中无效，相关[#2432](https://github.com/VisActor/VChart/issues/2432)
- **@visactor/vchart**：：应该使用 `series.getMarkInName` 来获取总标签计算的标记，修复[#2448](https://github.com/VisActor/VChart/issues/2448)
- **@visactor/vchart**：：修复`updateSpecSync()`之后事件触发计数的问题
- **@visactor/vchart**：：修复雷达图按需加载时的clipAngle动画错误

[更多详情请查看 v1.10.2](https://github.com/VisActor/VChart/releases/tag/v1.10.2)

# v1.10.0

2024-03-13

**🆕 新增功能**

- **@visactor/vchart**：柱状图支持`autoBandSize`，根据传入的配置（如`barWidth`）自动计算bandSize，从而影响轴的实际长度，相关[#2268](https://github.com/VisActor/VChart/issues/2268)
- **@visactor/vchart**：堆叠柱状图支持配置`stackCornerRadius`，用于配置堆叠柱状图组的圆角半径，相关[#2185](https://github.com/VisActor/VChart/issues/2185)
- **@visactor/vchart**：优化DataZoom在大数据场景，已经存在`Brush`的场景下的性能以及体验
- **@visactor/vchart**：DataZoom 预览图，至此采样相关功能
- **@visactor/vchart**：支持图例中的滚动条
- **@visactor/vchart**：图例主题支持在不同方向中单独配置不同主题，相关[#2216](https://github.com/VisActor/VChart/issues/2216)
- **@visactor/vchart**：react-vchart支持自定义Tooltip渲染，相关[#2288](https://github.com/VisActor/VChart/issues/2288)
- **@visactor/vchart**：主题支持配置堆叠状态下的系列主题，相关[#2331](https://github.com/VisActor/VChart/issues/2331)
- **@visactor/vchart**：主题支持自定义token，相关[#2255](https://github.com/VisActor/VChart/issues/2255)
- **@visactor/vchart**：Tooltip支持`lockAfterClick`，相关[#2352](https://github.com/VisActor/VChart/issues/2352)
- **@visactor/vchart**：Tooltip的`x`和`y`位置可以分别固定，相关[#2320](https://github.com/VisActor/VChart/issues/2320)
- **@visactor/vchart**：在图表spec配置中，`tooltip.style`中添加更多提示形状配置，相关[#2292](https://github.com/VisActor/VChart/issues/2292)
- **@visactor/vchart**：arc图元的状态样式支持`innerPadding`和`outerPadding`，相关[#2038](https://github.com/VisActor/VChart/issues/2038)
- **@visactor/vchart**：默认注册悬停/选择交互
- **@visactor/vchart**：在简单捆绑中移除高级交互

**🐛 功能修复**

- **@visactor/vchart**：可进入的提示在鼠标直接从提示移动到非图表区域时不会隐藏，相关[#2315](https://github.com/VisActor/VChart/issues/2315)
- **@visactor/vchart**：升级vgrammar版本以修复动画结束状态
- **@visactor/vchart**：在圆形进度图中`tickMask`无效，相关[#2316](https://github.com/VisActor/VChart/issues/2316)
- **@visactor/vchart**：矩形十字准线应在`lockAfterClick`为true时锁定
- **@visactor/vchart**：当区域样式为空时，不应创建`_backgroundMark`或`_foregroundMark`
- **@visactor/vchart**：修复无法监听vchart上的自定义标记事件的问题
- **@visactor/vchart**：网格组件及其子元素不应该可选
- **@visactor/vchart**：`<Bar />`上的事件不应触发两次
- **@visactor/vchart**：插件应在`release()`中释放

**🔨 功能重构**

- **react-vchart**：重构react-vchart以支持在严格模式下渲染

**🔧 项目配置**

- **@visactor/vchart**：使用`rimraf`替换`rm -rf`


[更多详情请查看 v1.10.0](https://github.com/VisActor/VChart/releases/tag/v1.10.0)

# v1.9.6

2024-03-11

**🆕 新增功能**

- **@visactor/vchart**：支持在CustomMark和ExtensionMark中设置`dataKey`
- **@visactor/vchart**：支持瀑布图总维度中的多个数据

**🐛 功能修复**

- **@visactor/vchart**：修复`animationAppear: false`不起作用的问题
- **@visactor/vchart**：修复设置Mark样式为无效值时引发错误的问题
- **@visactor/vchart**：修复重复事件注册的问题，修复[#2336](https://github.com/VisActor/VChart/issues/2336)
- **@visactor/vchart**：修复无法监听vchart上的标签和totalLabel组件事件的问题，`vchart.on('click', { level: 'model', type: 'label' })`
- **@visactor/vchart**：优化当轴反转时的总标签位置
- **@visactor/vchart**：升级vrender至0.17.27，vgrammar至0.11.15
- **scrollbar**：被可缩放组件阻止点击。修复[#2333](https://github.com/VisActor/VChart/issues/2333)



[更多详情请查看 v1.9.6](https://github.com/VisActor/VChart/releases/tag/v1.9.6)

# v1.9.5

2024-03-04


**🆕 新增功能**

- **@visactor/vchart**: 自定义Mark和拓展Mark支持`dataKey`配置，用于配置数据对应的唯一key
- **@visactor/vchart**: 瀑布图总计支持多分组数据

**🐛 功能修复**

- **@visactor/vchart**: 修复动画配置`animationAppear: false`不生效的问题
- **@visactor/vchart**: 优化坐标轴反转时，总计`label`展示位置



[更多详情请查看 v1.9.5](https://github.com/VisActor/VChart/releases/tag/v1.9.5)

# v1.9.3

2024-02-07


**🆕 新增功能**

- **@visactor/vchart**: supply pie percent data as `data._percent_`

**🐛 功能修复**

- **@visactor/vchart**: 由于收集数据导致轴零不工作。修复[#2226](https://github.com/VisActor/VChart/issues/2226)
- **@visactor/vchart**: 标记区域xy布局需要处理空坐标点的问题
- **player**: 默认属性导致布局错误。修复[#241](https://github.com/VisActor/VChart/issues/241)
- **@visactor/vchart**: 词云支持矩形形状。修复[#2220](https://github.com/VisActor/VChart/issues/2220)

[更多详情请查看 v1.9.3](https://github.com/VisActor/VChart/releases/tag/v1.9.3)

# v1.9.2

2024-02-05


**🐛 功能修复**

- **@visactor/vchart**: 当位置为'inside-bottom'或'inside-top'时，条形图标签存在问题
- **@visactor/vchart**: 在block-vchart演示中，`dpr`获取方法错误，需要实时获取
- **@visactor/vchart**: 系列可以从图表规格中读取`direction`，相关[#2181](https://github.com/VisActor/VChart/issues/2181)
- **@visactor/vchart**: dataZoom的最小和最大范围无效，相关[#2195](https://github.com/VisActor/VChart/issues/2195)
- **@visactor/vchart**: 修复关闭尾部标签后，多层轴标签不显示的问题，相关[#2179](https://github.com/VisActor/VChart/issues/2179)
- **@visactor/vchart**: 修复极地动画插值问题
- **@visactor/react-vchart**: 修复当`<VChart />`的`onClick`为null时的错误，关闭[#2186](https://github.com/VisActor/VChart/issues/2186)
- **@visactor/vchart**: 当系列类型相同但轴不同时，图表不应切换堆叠，相关[#2210](https://github.com/VisActor/VChart/issues/2210)
- **@visactor/vchart**: DOM工具提示形状的位置存在一些偏移，相关[#2188](https://github.com/VisActor/VChart/issues/2188)

**🔧 项目配置**

- **@visactor/vchart**: add react-lynx doc

[更多详情请查看 v1.9.2](https://github.com/VisActor/VChart/releases/tag/v1.9.2)

# v1.9.1

2024-01-31


**🐛 功能修复**

- **@visactor/vchart**: 自定义拓展mark运行顺序需要在所有系列mark的最后，修复[#2156](https://github.com/VisActor/VChart/issues/2156)
- **@visactor/vchart**: 通过`interactions`配置的交互能够通过配置 `option.disableTriggerEvent`关闭
- **@visactor/vchart**: 当图表有多个类目轴的时候，相同的数据在维度tooltip中只能展示一条，相关issue[#2148](https://github.com/VisActor/VChart/issues/2148)
- **@visactor/react-vchart**: 修复react-vchart在react的 `strict-mode` 报错的问题
- **@visactor/vchart**: 修复双轴图，0值没有对齐的问题，[#2167](https://github.com/VisActor/VChart/issues/2167)



[更多详情请查看 v1.9.1](https://github.com/VisActor/VChart/releases/tag/v1.9.1)

# v1.9.0

2024-01-26


**🆕 新增功能**

- **@visactor/vchart**：轴支持 `hasDimensionTooltip` 以强制指定DimensionTooltip，相关 [#1678](https://github.com/VisActor/VChart/issues/1678)
- **@visactor/vchart**：crosshiar支持定时关闭，修复 [#1676](https://github.com/VisActor/VChart/issues/1676)
- **@visactor/vchart**：条形图中的 `barBackground` 支持 `fieldLevel` 配置，指定 `barBackground` 是在group级别展示还是特定的层级展示，相关 [#1601](https://github.com/VisActor/VChart/issues/1601)
- **@visactor/vchart**：直方图图表支持条形背景，相关 [#1979](https://github.com/VisActor/VChart/issues/1979)
- **@visactor/vchart**：支持指标的 `fitStrategy`
- **liquid**：新增水波图。关闭[#1158](https://github.com/VisActor/VChart/issues/1158)
- **@visactor/vchart**：类目轴支持多层轴标签展示
- **@visactor/vchart**：面积图，支持分别配置线、面积是否支持交互响应，参见 [#1592](https://github.com/VisActor/VChart/issues/1592)
- **@visactor/vchart**：支持mark状态的 `stateSort`，修复 [#2003](https://github.com/VisActor/VChart/issues/2003)
- **@visactor/vchart**：支持在 extensionMark 中自定义 vrender 组件
- **@visactor/vchart**：Tooltip支持html类型和canvas类型的按需引用，相关 [#1397](https://github.com/VisActor/VChart/issues/1397)

**🐛 功能修复**

- **@visactor/vchart**：修复当悬停和单击都配置时，Crosshair触发的 bug，修复 [#1574](https://github.com/VisActor/VChart/issues/1574)
- **@visactor/vchart**：Tooltip支持内容区域滚动，相关 [#2001](https://github.com/VisActor/VChart/issues/2001)
- **@visactor/vchart**：在默认主题中移除标签行高，相关 [#1983](https://github.com/VisActor/VChart/issues/1983)
- **@visactor/vchart**：修复某些情况下Tooltip回调可能无效的问题，相关 [#1943](https://github.com/VisActor/VChart/issues/1943)

**🔨 功能重构**

- **@visactor/vchart**：在 react-vchart 中弃用 `useSyncRender`，统一使用同步渲染



[更多详情请查看 v1.9.0](https://github.com/VisActor/VChart/releases/tag/v1.9.0)

# v1.8.10

2024-01-25


**🆕 新增功能**

- **@visactor/vchart**: 支持 vchart 笛卡尔坐标轴的 innerOffset

**🐛 功能修复**

- **@visactor/vchart**: 修复连续颜色比例尺的问题，关闭 [#2131](https://github.com/VisActor/VChart/issues/2131)
- **@visactor/vchart**: 不返回空数据的最小值和最大值，修复 [#1711](https://github.com/VisActor/VChart/issues/1711)
- **@visactor/vchart**: 修复极坐标相对轴刻度值获取错误的问题，已修复[#2117](https://github.com/VisActor/VChart/issues/2117)
- **@visactor/vchart**: 修复标记线未按图例过滤的问题，关闭 [#2127](https://github.com/VisActor/VChart/issues/2127)
- **@visactor/vchart**: 序列图区域绑定错误，修复[#2115](https://github.com/VisActor/VChart/issues/2115)
- **@visactor/vchart**: DOM 提示框上的星形图标显示不正确，相关 [#1905](https://github.com/VisActor/VChart/issues/1905)
- **@visactor/vchart**: 旋转树图的事件错误
- **@visactor/vchart**: 关闭动画时旋转树图的事件错误



[更多详情请查看 v1.8.10](https://github.com/VisActor/VChart/releases/tag/v1.8.10)

# v1.8.9

2024-01-23


**🆕 新增功能**

- **@visactor/vchart**：`option` 支持 `supportsTouchEvents` 和 `supportsPointerEvents` 配置，修复 [#2036](https://github.com/VisActor/VChart/issues/2036)
- **@visactor/vchart**：布局类型为 `normal-inline` 元素支持 `alignSelf` 配置，修复 [#2072](https://github.com/VisActor/VChart/issues/2072)
- **@visactor/vchart**：升级 vrender

**🐛 功能修复**

- **@visactor/vchart**：修复Crosshair定时器的 bug，修复 [#2088](https://github.com/VisActor/VChart/issues/2088)
- **@visactor/vchart**：修复轴的 onZero 属性的 bug，已修复 [#2098](https://github.com/VisActor/VChart/issues/2098)，[#2099](https://github.com/VisActor/VChart/issues/2099)
- **@visactor/vchart**：更新线图动画应排除 `defined` 通道的问题



[更多详情请查看 v1.8.9](https://github.com/VisActor/VChart/releases/tag/v1.8.9)

# v1.8.8

2024-01-19


**🆕 新增功能**

- **@visactor/vchart**: 增强滚动效果，已关闭 [#2037](https://github.com/VisActor/VChart/issues/2037)
- **@visactor/vchart**: 升级 @visactor/vrender-core 至锁定版本 0.17.14
- **@visactor/vchart**: sankey 图表支持 disableTriggerEvent 配置
- **@visactor/vchart**: 支持新的布局类型 region-relative-overlap

**🐛 功能修复**

- **@visactor/vchart**: `area.interactive` 在 area series spec 中不可用，相关 [#2030](https://github.com/VisActor/VChart/issues/2030)
- **@visactor/vchart**: 修复 datazoom 改变轴后 sortDataByAxis 不工作的问题
- **@visactor/vchart**: 当轴的 `trimPadding` 为 true 时，应显示 crosshair，修复 [#2054](https://github.com/VisActor/VChart/issues/2054)
- **@visactor/vchart**: 为 dimension tooltip 计算层转换
- **@visactor/vchart**: 修复了线图点的可见配置为 false 时 activePoint 不生效的问题
- **@visactor/vchart**: 在 [#1956](https://github.com/VisActor/VChart/issues/1956) 中配置 label.overlap:true 时的不同效果
- **@visactor/vchart**: label 位置与 region indent 不正确
- **scroll**: 在 lynx 环境中的事件错误。修复[#2041](https://github.com/VisActor/VChart/issues/2041)
- **@visactor/vchart**: 在 updateSpec 或 resize 后，地图比例尺不正确
- **@visactor/vchart**: 修复 tickCount 是函数时 nice 的 bug，修复 [#2050](https://github.com/VisActor/VChart/issues/2050)

[更多详情请查看 v1.8.8](https://github.com/VisActor/VChart/releases/tag/v1.8.8)

# v1.8.7

2024-01-11

**🆕 新增功能**

- **markPoint**：标记点支持项目内容限制。修复 [#1573](https://github.com/VisActor/VChart/issues/1573)
- **@visactor/vchart**：支持区域布局缩进

**🐛 功能修复**

- **@visactor/vchart**：标记工具提示在 rangeColumn 图表中不起作用，关闭 [#1959](https://github.com/VisActor/VChart/issues/1959)
- **brush**：绘制 brush 时图元 hover 无效。修复[#1985](https://github.com/VisActor/VChart/issues/1985)
- **@visactor/vchart**：修复 indent.top 无法正常生效的问题
- **@visactor/vchart**：只有当点位于某些 x 轴和 y 轴时才应触发十字准线，修复 [#1954](https://github.com/VisActor/VChart/issues/ 1954)
- **@visactor/vchart**：修复了自定义离散图例数据后图例过滤失败的问题，已修复[#1994](https://github.com/VisActor/VChart/issues/1994)
- **@visactor/vchart**：范围柱形图的 `barMinHeight` 属性不生效，已关闭[#1999](https://github.com/VisActor/VChart/issues/1999)
- **@visactor/vchart**：工具提示值堆叠在堆叠雷达图中，相关[#450](https://github.com/VisActor/VChart/issues/450)
- **@visactor/vchart**：修复 onebyone 符号动画顺序，关闭 [#1932](https://github.com/VisActor/VChart/issues/1932)

[更多详情请查看 v1.8.7](https://github.com/VisActor/VChart/releases/tag/v1.8.7)

# v1.8.5

2024-01-04

**🆕 新增功能**

- **@visactor/vchart**：添加 zAxis 主题并将标签空间设置为 0，关闭 [#149](https://github.com/VisActor/VChart/issues/149)

**🐛 功能修复**

- **@visactor/vchart**：计算十字准线的层转置
- **@visactor/vchart**：优化漏斗 clip 动画，无需扩展标记
- **@visactor/vchart**：修复多个系列的 hover 状态，关闭 [#1899](https://github.com/VisActor/VChart/issues/1899)
- **@visactor/vchart**：waterfall.label 在 [#1897](https://github.com/VisActor/VChart/issues/1897) 中不起作用

[更多详情请查看 v1.8.5](https://github.com/VisActor/VChart/releases/tag/v1.8.5)

# v1.8.4

2024-01-02

**🐛 功能修复**

- **@visactor/vchart**：将媒体查询规范接口添加到默认图表规范
- **@visactor/vchart**：修复无有效动画时扩展标记的 bug，修复 [#1877](https://github.com/VisActor/VChart/issues/1877)

[更多详情请查看 v1.8.4](https://github.com/VisActor/VChart/releases/tag/v1.8.4)

# v1.8.3

2024-01-02

**🆕 新增功能**

- **@visactor/vchart**：添加`useSyncRender`到 react-vchart，关闭[#1685](https://github.com/VisActor/VChart/issues/1685)
- **@visactor/vchart**：支持初始化参数`disableTriggerEvent`关闭图表默认交互效果

**🐛 功能修复**

- **@visactor/vchart**：图表选项。动画不起作用
- **@visactor/vchart**：修复 react-vchart 严格模式下的错误，修复[#1669](https://github.com/VisActor/VChart/issues/1669)
- **@visactor/vchart**：媒体查询操作的图表级别修改错误
- **@visactor/vchart**：二维图表中的维度工具提示仅包含一维数据，相关[#1841](https://github.com/VisActor/VChart/issues/1841)
- **@visactor/vchart**：修复带轴没有域时布局中的错误
- **@visactor/vchart**：漏斗 ClipIn 动画对于溢出 [#1839](https://github.com/VisActor/VChart/issues/1839) 中区域范围的标记有延迟
- **@visactor/vchart**：当标记标签的填充是一个对象时，它应该起作用
- **@visactor/vchart**：tt 小程序中未定义 globalThis，请参阅 [#1854](https://github.com/VisActor/VChart/issues/1854)
  **🔨 功能重构**
- **@visactor/vchart**：优化 marker 的样式配置

[更多详情请查看 v1.8.3](https://github.com/VisActor/VChart/releases/tag/v1.8.3)

# v1.8.2

2023-12-22

**🆕 新增功能**

- **@visactor/vchart**: 支持初始化参数 disableTriggerEvent，以关闭图表的默认交互效果
  **🐛 功能修复**
- **@visactor/vchart**: 修复了图表选项中配置 `animation` 无效的问题
- **@visactor/vchart**: 修复了媒体查询操作中图表级别修改出错的问题

[更多详情请查看 v1.8.2](https://github.com/VisActor/VChart/releases/tag/v1.8.2)

# v1.8.1

2023-12-21

**🐛 功能修复**

- **@visactor/vchart**: 提高了 spec 转换器和媒体查询的稳定性
- **@visactor/vchart**: 修复了 `select.triggerOff: none` 无效的问题

[更多详情请查看 v1.8.1](https://github.com/VisActor/VChart/releases/tag/v1.8.1)

# v1.8.0

2023-12-19

**🆕 新增功能**

- **@visactor/vchart**: 在漏斗 Mark 属性上下文中添加了 `getPoints` API
- **@visactor/vchart**: 支持图表级别插件，相关 [#1784](https://github.com/VisActor/VChart/issues/1784)
- **@visactor/vchart**: 新增媒体查询插件，支持自适应图表，相关 [#1413](https://github.com/VisActor/VChart/issues/1413)
- **@visactor/vchart**: 支持优化配置，并自动将 `disableCheckGraphicWidthOutRange` 设置为 true
- **@visactor/vchart**: 移除了图例的缺省主题

**🐛 功能修复**

- **@visactor/vchart**: 修复了 API：`getComponentsByKey` 无效的问题
- **@visactor/vchart**: 支持仪表盘指针系列的动画，相关 [#1699](https://github.com/VisActor/VChart/issues/1699)
- **@visactor/vchart**: 修复了数据流的问题，已关闭 [#1760](https://github.com/VisActor/VChart/issues/1760)
  **🔨 功能重构**
- **@visactor/vchart**: 更新了数据缩放和刷子更新回调，使用事件
  **⚡ 性能优化**
- **@visactor/vchart**: 当 visible 为 false 时，不解析详细属性

[更多详情请查看 v1.8.0](https://github.com/VisActor/VChart/releases/tag/v1.8.0)

# v1.7.5

2023-12-15

**🐛 功能修复**

- **brush**: 修复更新 `spec`后，brush 组件的释放问题. 修复 [#1720](https://github.com/VisActor/VChart/issues/1720)
- **@visactor/vchart**: 修复系列配置 `morph` 没正确解析的问题
- **@visactor/vchart**: 修复 spec 类型问题，修复 [#1486](https://github.com/VisActor/VChart/issues/1486)

[更多详情请查看 v1.7.5](https://github.com/VisActor/VChart/releases/tag/v1.7.5)

# v1.7.4

2023-12-12

**🆕 新增功能**

- **@visactor/vchart**: 支持 region 对应的 group 的交互操作

**🐛 功能修复**

- **@visactor/vchart**: 修复更新主题时， 标签样式未更新的问题 [#1698](https://github.com/VisActor/VChart/issues/1698)

[更多详情请查看 v1.7.4](https://github.com/VisActor/VChart/releases/tag/v1.7.4)

# v1.7.3

2023-12-06

**🆕 新增功能**

- **@visactor/vchart**: marker 支持 `coordinatesOffset` 用于点的位置调整
- **@visactor/vchart**: markLine `x`,`y`,`y1` / `y`,`x`,`x1` / `x`,`y`,`x1`,`y1` 三种格式的位置 pei
- **@visactor/vchart**: markPoint 支持 x\y 位置
- **@visactor/vchart**: 标记的位置属性支持相对坐标
- **@visactor/vchart**: 标记的坐标属性支持回调
- **@visactor/vchart**: 直角坐标系 crosshair 矩形宽度支持回调，支持 [#1567](https://github.com/VisActor/VChart/issues/1567)
- **@visactor/vchart**: 极坐标系 crosshair 支持默认展示
- **@visactor/vchart**: 支持文本省略位置配置 `suffixPosition`
- **@visactor/vchart**: 支持 `pickStrokeBuffer` 样式属性以扩展描边选择范围

**🐛 功能修复**

- **@visactor/vchart**: 修复了带有 seriesField 的 3D 条形图问题，关闭 [#1646](https://github.com/VisActor/VChart/issues/1646)
- **@visactor/vchart**: 修复了 3D 图表 z 轴无法正常工作的问题，关闭 [#1668](https://github.com/VisActor/VChart/issues/1668)
- **@visactor/vchart**: 更新时清除 mark encode, 修复了问题 [#1630](https://github.com/VisActor/VChart/issues/1630)
- **@visactor/vchart**: 修复了跟踪标记在仪表系列中具有多个元素的问题，相关问题编号 [#1643](https://github.com/VisActor/VChart/issues/1643)
- **@visactor/vchart**: 修复了仪表指针系列不支持自定义 `innerRadius` 的问题，相关问题编号 [#1644](https://github.com/VisActor/VChart/issues/1644)
- **@visactor/vchart**: 修复了 markArea 的类型问题
- **@visactor/vchart**: 外边框的颜色默认应与标签背景的填充颜色相同
- **@visactor/vchart**: 修复 `oneByOne` 循环动画
- **@visactor/vchart**: 大小图例增加 `align` 属性, 并修复了属性赋值不生效的问题，相关问题编号 [#1553](https://github.com/VisActor/VChart/issues/1553)

**🔨 功能重构**

- **@visactor/vchart**: 在组件模型中统一 `getVRenderComponents` 方法

**⚡ 性能优化**

- **@visactor/vchart**: 仅在需要时调用 `cloneDeepSpec()`

[更多详情请查看 v1.7.3](https://github.com/VisActor/VChart/releases/tag/v1.7.3)

# v1.7.2

2023-11-30

**🐛 功能修复**

- **@visactor/vchart**: 更新时清除旧的编码，修复了问题 [#1630](https://github.com/VisActor/VChart/issues/1630)
- **@visactor/vchart**: 修复了跟踪标记在仪表系列中具有多个元素的问题，相关问题编号 [#1643](https://github.com/VisActor/VChart/issues/1643)
- **@visactor/vchart**: 修复了仪表指针系列不支持自定义 `innerRadius` 的问题，相关问题编号 [#1644](https://github.com/VisActor/VChart/issues/1644)

**🔨 功能重构**

- **@visactor/vchart**: 在组件模型中统一 `getVRenderComponents` 方法

[更多详情请查看 v1.7.2](https://github.com/VisActor/VChart/releases/tag/v1.7.2)

# v1.7.1

2023-11-30

**🐛 功能修复**

- **@visactor/vchart**: 通过 `dataId` 读取扩展标记的数据视图
- **@visactor/vchart**: 修复了仅显示 domainLine 时轴的布局尺寸不正确的问题
- **@visactor/vchart**: 修复了创建系列时规格发生变化的 bug
- **pie**: 修复了获取中心位置错误的问题，修复了 [#1610](https://github.com/VisActor/VChart/issues/1610)
- **@visactor/vchart**: 优化了 `tooltip.enterable` 的效果，使用户的指针可以轻松进入工具提示，相关问题编号 [#1598](https://github.com/VisActor/VChart/issues/1598)

[更多详情请查看 v1.7.1](https://github.com/VisActor/VChart/releases/tag/v1.7.1)

# v1.7.0

2023-11-24

**🆕 新增功能**

- **@visactor/vchart**: 支持对带类型轴的 `trimPadding`，用于去除轴两端的空白空间，已关闭 [#1174](https://github.com/VisActor/VChart/issues/1174)
- **@visactor/vchart**: 自定义标记支持动画配置
- **@visactor/vchart**: 支持自定义标记形状
- **@visactor/vchart**: 优化数据缩放的自动模式，相关问题编号 [#1416](https://github.com/VisActor/VChart/issues/1416)
- **@visactor/vchart**: 增强标记的位置能力
- **@visactor/vchart**: 标记区域应支持同时指定 x、x1、y 和 y1
- **@visactor/vchart**: 添加了 light-mobile 和 dark-mobile 主题，相关问题编号 [#1414](https://github.com/VisActor/VChart/issues/1414)
- **@visactor/vchart**: 优化计算数据的性能
- **@visactor/vchart**: 在组件布局类型中支持 none
- **@visactor/vchart**: 支持线/区域标签
- **@visactor/vchart**: 不再在 vchart 中注册移动主题
- **@visactor/vchart**: 新功能：支持注册函数表达式语法，相关问题编号 [#1187](https://github.com/VisActor/VChart/issues/1187)

**🐛 功能修复**

- **@visactor/vchart**: 切换全局主题时图表填充不会更新
- **@visactor/vchart**: 修复了数据模型中规格意外修改的问题，详细信息见 [#1514](https://github.com/VisActor/VChart/issues/1514)
- **@visactor/vchart**: 更新了 enableSegements 的实现

**🔨 功能重构**

- **@visactor/vchart**: 重构图表模块的继承结构，使布局系统独立，详细信息见 [#1428](https://github.com/VisActor/VChart/issues/1428)

**⚡ 性能优化**

- **@visactor/vchart**: 在可编译标记中不需要调用 `attrTransform()`
- **@visactor/vchart**: 移除 `getStatisticsDomain()`
- **@visactor/vchart**: 当用户指定组件的宽度/高度时不再调用边界计算

[更多详情请查看 v1.7.0](https://github.com/VisActor/VChart/releases/tag/v1.7.0)

# v1.6.7

2023-11-21

**🐛 功能修复**

- **@visactor/wx-vchart**: 修复包打包相关问题 [#1570](https://github.com/VisActor/VChart/issues/1570) , PR in [#1571](https://github.com/VisActor/VChart/issues/1571)

[更多详情请查看 v1.6.7](https://github.com/VisActor/VChart/releases/tag/v1.6.7)

# v1.6.6

2023-11-21

**🐛 功能修复**

- **@visactor/vchart**: 修复了使用 updateSpecSync 时图表屏幕仍然存在的问题，详细信息见 [#1421](https://github.com/VisActor/VChart/issues/1421)
- **@visactor/vchart**: 当鼠标点击空白区域时，悬停形状应该重置，已修复 [#1538](https://github.com/VisActor/VChart/issues/1538)

[更多详情请查看 v1.6.6](https://github.com/VisActor/VChart/releases/tag/v1.6.6)

# v1.6.5

2023-11-17

**🆕 新增功能**

- **@visactor/vchart**: 在 react-vchart 中添加了 `skipFunctionDiff`，用于跳过函数的差异

**🐛 功能修复**

- **@visactor/vchart**: 更新规格后，维度点击无效，已修复 [#1532](https://github.com/VisActor/VChart/issues/1532)

[更多详情请查看 v1.6.5](https://github.com/VisActor/VChart/releases/tag/v1.6.5)

# v1.6.4

2023-11-16

**🐛 功能修复**

- **@visactor/vchart**: 修复了在修改数据缩放轴范围后触发不合理的自动缩进的问题
- **@visactor/vchart**: 默认实时效果在滚动条和数据缩放中无效。修复 [#1462](https://github.com/VisActor/VChart/issues/1462)
- **@visactor/vchart**: 漫游时滚动条和数据缩放中的过滤模式错误。修复 [#1460](https://github.com/VisActor/VChart/issues/1460)
- **@visactor/lark-vchart**: 修复了 lark-vchart、wx-vchart 中 `options` 无法工作的问题
- **@visactor/wx-vchart**: 修复了 lark-vchart、wx-vchart 中 `options` 无法工作的问题
- **@visactor/vchart**: `legendItemHover` 和 `legendItemUnHover` 应该只触发一次，详情见 https://github.com/VisActor/VRender/pull/678

**⚡ 性能优化**

- **@visactor/vchart**: 优化了桑基图的数据流

[更多详情请查看 v1.6.4](https://github.com/VisActor/VChart/releases/tag/v1.6.4)

# v1.6.3

2023-11-10

**🐛 功能修复**

- **@visactor/vchart**: 修复更新动画在线条标记上无效的问题
- **@visactor/vchart**: 更新 vgrammar 到 ~0.8.3 以修复问题，即 vrender 在 renderAsync 期间不应自动渲染
- **@visactor/vchart**: 修复在异步渲染期间快速释放 vchart 时出现的错误
- **@visactor/vchart**: 当用户全局配置 css overflow-warp 时，强制 tooltip 值换行，相关问题 [#1446](https://github.com/VisActor/VChart/issues/1446)
- **@visactor/vchart**: 修复：svg 模型的 id 应该是唯一的，已修复 [#1422](https://github.com/VisActor/VChart/issues/1422)，[#1442](https://github.com/VisActor/VChart/issues/1442)
- **@visactor/vchart**: 修复：空字符串不应该是有效数字，修复 [#1463](https://github.com/VisActor/VChart/issues/1463)

**⚡ 性能优化**

- **@visactor/vchart**: 优化桑基图的编码性能

[更多详情请查看 v1.6.3](https://github.com/VisActor/VChart/releases/tag/v1.6.3)

# v1.6.2

2023-11-08

**🐛 功能修复**

- **@visactor/vchart**: 当用户全局配置 css overflow-warp 时，强制提示值换行，相关问题 [#1446](https://github.com/VisActor/VChart/issues/1446)

[更多详情请查看 v1.6.2](https://github.com/VisActor/VChart/releases/tag/v1.6.2)

# v1.6.1

2023-11-08

**🆕 新增功能**

- **@visactor/vchart**: 标签格式方法回调添加上下文参数以提供系列对象
- **@visactor/vchart**: 添加 react-vchart 的 `<Title />` 和 `<Indicator />` 组件，关闭 [#1424](https://github.com/VisActor/VChart/issues/1424)

**🐛 功能修复**

- **@visactor/vchart**: 地图图表中 `centroidProperty` 无效
- **@visactor/vchart**: 修复由动画引起的不正确的图例过滤结果，问题编号 [#1403](https://github.com/VisActor/VChart/issues/1403)
- **@visactor/vchart**: 如果布局项不可见，则不参与网格布局，相关问题编号 [#1425](https://github.com/VisActor/VChart/issues/1425)
- **@visactor/vchart**: 聚合返回值无穷大的问题，修复 [#1380](https://github.com/VisActor/VChart/issues/1380)'

[更多详情请查看 v1.6.1](https://github.com/VisActor/VChart/releases/tag/v1.6.1)

# v1.6.0

2023-11-03

**🆕 新增功能**

- **@visactor/vchart**: 为类似柱状系列添加柱状背景标记，相关问题编号 [#1154](https://github.com/VisActor/VChart/issues/1154)
- **@visactor/vchart**: 在提示规范中添加 `updateElement` 回调，以配置基于默认提示处理程序的自定义提示 DOM 元素，相关问题编号 [#1338](https://github.com/VisActor/VChart/issues/1338)
- **@visactor/vchart**: 在更新数据时启用退出动画
- **@visactor/vchart**: 支持在线/区域/散点/柱状系列中配置功能标签位置
- **@visactor/vchart**: 动态加载浏览器或节点环境代码
- **@visactor/vchart**: 数据方案支持通过区分系列方向进行配置，相关问题编号 [#1209](https://github.com/VisActor/VChart/issues/1209)
- **@visactor/vchart**: 数据采样和点重叠。关闭 [#460](https://github.com/VisActor/VChart/issues/460)
- **@visactor/taro-vchart**: 支持小程序

**🐛 功能修复**

- **@visactor/vchart**: 修复 react-vchart 模式无效
- **@visactor/vchart**: 优化非浏览器环境中悬停的触发
- **@visactor/vchart**: 如果系列标记为线条，当用户需要填充值时返回描边值，已修复 [#1388](https://github.com/VisActor/VChart/issues/1388)
- **@visactor/vchart**: 修复玫瑰维度提示中的角度偏移，相关问题编号 [#1263](https://github.com/VisActor/VChart/issues/1263)

**⚡ 性能优化**

- **@visactor/vchart**: 在需要时创建堆栈并计算堆栈属性

[更多详情请查看 v1.6.0](https://github.com/VisActor/VChart/releases/tag/v1.6.0)

# v1.5.4

2023-10-30

**🐛 功能修复**

- **@visactor/vchart**: 漏斗转化比例标签出现异常，见 [#1348](https://github.com/VisActor/VChart/issues/1348)
- **@visactor/vchart**: 在 Lark 小程序中，提示值标签被裁剪，相关问题编号 [#1346](https://github.com/VisActor/VChart/issues/1346)

[更多详情请查看 v1.5.4](https://github.com/VisActor/VChart/releases/tag/v1.5.4)

# v1.5.3

2023-10-27

**🆕 新增功能**

- **@visactor/vchart**: 支持 vchart 的 exportCanvas api

**🐛 功能修复**

- **@visactor/vchart**: sankey chart 下游高亮，相关问题编号 [#1269](https://github.com/VisActor/VChart/issues/1269)
- **@visactor/vchart**: 解决首次选择无效的问题。修复 [#1129](https://github.com/VisActor/VChart/issues/1129)
- **@visactor/vchart**: 圆形轴标签的新布局方法，相关问题编号 [#1123](https://github.com/VisActor/VChart/issues/1123)
- **@visactor/vchart**: 更改仪表图中轴的默认 zIndex，相关问题编号 [#1122](https://github.com/VisActor/VChart/issues/1122)
- **@visactor/vchart**: 调整数据缩放的位置错误，当调整大小时。修复 [#520](https://github.com/VisActor/VChart/issues/520)
- **@visactor/vchart**: 释放后解决事件关闭错误
- **@visactor/vchart**: 修复散点图的 invalidType 检查 x 和 y 同时出现的问题
- **@visactor/vchart**: 修复 markline 中的 min/max 聚合结果不正确的问题，见 [#1261](https://github.com/VisActor/VChart/issues/1261)
- **@visactor/vchart**: 修复地图提示标题不显示来自 nameMap 的名称的问题，见 [#1260](https://github.com/VisActor/VChart/issues/1260)
- **@visactor/vchart**: sankey 支持字符串值
- **@visactor/vchart**: 修复十字准线在 weapp 中无法触发的问题，已修复 [#1322](https://github.com/VisActor/VChart/issues/1322)

[更多详情请查看 v1.5.3](https://github.com/VisActor/VChart/releases/tag/v1.5.3)

# v1.5.2

2023-10-24

**🆕 新增功能**

- **@visactor/vchart**: 支持 vchart 的 exportCanvas api

**🐛 功能修复**

- **@visactor/vchart**: 圆形轴标签的新布局方法，相关问题编号 [#1123](https://github.com/VisActor/VChart/issues/1123)
- **@visactor/vchart**: 更改仪表图中轴的默认 zIndex，相关问题编号 [#1122](https://github.com/VisActor/VChart/issues/1122)
- **@visactor/vchart**: 调整数据缩放的位置错误，当调整大小时。修复 [#520](https://github.com/VisActor/VChart/issues/520)
- **@visactor/vchart**: 修复 markline 中的 min/max 聚合结果不正确的问题，见 [#1261](https://github.com/VisActor/VChart/issues/1261)
- **@visactor/vchart**: 修复地图提示标题不显示来自 nameMap 的名称的问题，见 [#1260](https://github.com/VisActor/VChart/issues/1260)

[更多详情请查看 v1.5.2](https://github.com/VisActor/VChart/releases/tag/v1.5.2)

# v1.5.1

2023-10-20

**🆕 新增功能**

- **@visactor/vchart**: 支持相关图表
- **@visactor/vchart**: 在布局项中添加 getGraphicBounds api 以支持获取图形大小
- **@visactor/vchart**: 优化布局中的自动缩进逻辑，确保填充效果正确
- **@visactor/vchart**: 在地图系列中支持 `centroidProperty`
- **@visactor/vchart**: 滚动条增强缩放和拖动滚动功能。关闭 [#965](https://github.com/VisActor/VChart/issues/965)
- **@visactor/vchart**: 数据缩放增强 zoomLock 和 span 配置。关闭 [#1082](https://github.com/VisActor/VChart/issues/1082)
- **@visactor/vchart**: 为 customMark 的属性回调提供 attributeContext 参数
- **@visactor/vchart**: 提供 afterLayout 事件以支持用户修改布局效果
- **@visactor/vchart**: 在 tooltip 的 `updateContent` 回调参数中提供 datum，相关 [#1244](https://github.com/VisActor/VChart/issues/1244)
- **@visactor/vchart**: 添加 markLine、markArea 和 funnel 系列的默认主题（light、dark）
- **@visactor/vchart**: 支持按需加载环境代码

**🐛 功能修复**

- **@visactor/vchart**: 优化仪表图中 `padAngle` 的显示，并将 `padAngle` 的单位更改为角度，相关 [#1215](https://github.com/VisActor/VChart/issues/1215)
- **@visactor/vchart**: 修复桑基图 'adjacency' 交互高亮效果错误，[#1121](https://github.com/VisActor/VChart/issues/1121)
- **@visactor/vchart**: 修复箱线图异常值动画会抛出错误的问题
- **@visactor/vchart**: 修复滚动条中重复的事件注册，已修复[#1241](https://github.com/VisActor/VChart/issues/1241)

**🔨 功能重构**

- **@visactor/vchart**: 添加注册函数以收集图表/系列/组件的副作用代码
- **@visactor/vchart**: 添加动画的注册函数

[更多详情请查看 v1.5.1](https://github.com/VisActor/VChart/releases/tag/v1.5.1)

# v1.4.3

2023-10-17

**🆕 新增功能**

- **@visactor/vchart**: 刷子状态代理到状态规格

**🐛 功能修复**

- **@visactor/vchart**: 修复图例项仅具有描边时无法与图形颜色一致的问题，详细信息见 [#1147](https://github.com/VisActor/VChart/issues/1147)

[更多详情请查看 v1.4.3](https://github.com/VisActor/VChart/releases/tag/v1.4.3)

# v1.4.2

2023-10-12

**🆕 新增功能**

- **@visactor/vchart**: 仪表图系列支持标签组件，相关 [#1039](https://github.com/VisActor/VChart/issues/1039)
- **@visactor/vchart**: 在 `VChart.Utils` 中添加静态工具
- **@visactor/vchart**: 支持 afterResize 和 afterRender 事件
- **@visactor/vchart**: 在提示框标签样式中添加新配置 `autoWidth`，相关 [#688](https://github.com/VisActor/VChart/issues/688)

**🐛 功能修复**

- **@visactor/vchart**: 当被 VTable 释放时，`tooltipRelease` 事件可能无效
- **@visactor/vchart**: 设置刷子时选择错误。修复 [#1129](https://github.com/VisActor/VChart/issues/1129)
- **@visactor/vchart**: 优化长提示框标题的默认性能，相关 [#688](https://github.com/VisActor/VChart/issues/688)
- **@visactor/vchart**: 如果 `markLine` 为空，如 `{}` 或 `[]`，则不应创建标记组件
- **@visactor/vchart**: 修复使用 `positions` 创建标记组件时的问题，已修复 [#1084](https://github.com/VisActor/VChart/issues/1084)
- **@visactor/vchart**: 线性轴自动可见。修复 [#1118](https://github.com/VisActor/VChart/issues/1118)

[更多详情请查看 v1.4.2](https://github.com/VisActor/VChart/releases/tag/v1.4.2)

# v1.4.1

2023-09-27

**🐛 功能修复**

- **@visactor/vchart**: 优化 updateSpec 以避免额外的主题更新
- **@visactor/vchart**: 修复 resize 后 updateViewBox api 失败的问题
- **datazoom**: 修复没有预览图表时的边界错误。修复 [#1050](https://github.com/VisActor/VChart/issues/1050)
- **@visactor/vchart**: 玫瑰图的第一个扇区的 startAngle 应该从极坐标的 startAngle 开始，修复 [#900](https://github.com/VisActor/VChart/issues/900)
- **@visactor/vchart**: 修复 `theme.fontFamily` 无法工作的问题
- **@visactor/vchart**: 修复 updateFullData 无法更新系列数据的问题

[更多详情请查看 v1.4.1](https://github.com/VisActor/VChart/releases/tag/v1.4.1)

# v1.4.0

2023-09-25

**🆕 新增功能**

**@visactor/vchart**: 添加滚动条布局规范到序列。关闭[#792](https://github.com/VisActor/VChart/issues/792)
**@visactor/vchart**: 线性轴支持`tooltipFilterRange`以配置维度提示的相对数据范围，相关[#933](https://github.com/VisActor/VChart/issues/933)
**@visactor/vchart**: 在标记函数样式的参数中添加 vchart 到上下文
**@visactor/vchart**: 为 scrollBar 添加默认的暗黑主题
**@visactor/vchart**: 为带轴的规范添加配置项`bandSize`，`maxBandSize`，`minBandSize`，相关[#263](https://github.com/VisActor/VChart/issues/263)
**@visactor/vchart**: 为条形系列支持`barMinHeight`，关联[#722](https://github.com/VisActor/VChart/issues/722)
**@visactor/vchart**: 增强默认词云出现动画，详情见[#675](https://github.com/VisActor/VChart/issues/675)
**@visactor/vchart**: 极坐标进度图表支持刻度蒙版，相关[#596](https://github.com/VisActor/VChart/issues/596)
**@visactor/vchart**: 饼图标签线支持平滑
**@visactor/vchart**: 支持 tickCount 的自定义回调，参见[#951](https://github.com/VisActor/VChart/issues/951)
**@visactor/vchart**: 支持`label.confine`用于 markLine 和 markPoint 自动调整标签位置，关联https://github.com/VisActor/VChart/issues/699
**@visactor/vchart**: 支持饼图的`minAngle`，关联[#738](https://github.com/VisActor/VChart/issues/738)
**@visactor/vchart**: 在地图系列中默认禁用标签动画
**@visactor/vchart**: 增加图表堆叠能力，提供 stackValue 支持多系列独立堆叠
**@visactor/vchart**: 增加图表堆叠能力，提供 stackInverse 支持反向堆叠
**@visactor/vchart**: 为 mark 提供`scaleCenter`属性，见[#781](https://github.com/VisActor/VChart/issues/781)
**@visactor/vchart**: 提供 updateModelSpec api，使用户可以单独更新图表模块的配置
**@visactor/vchart**: 支持删除通过处理程序传递的相应类型的所有事件而不传递
**@visactor/vchart**: 提示支持自定义形状类型，相关[#496](https://github.com/VisActor/VChart/issues/496)
**@visactor/vchart**: 提示支持每行的自定义`spaceRow`，相关[#949](https://github.com/VisActor/VChart/issues/949)
**@visactor/vchart**: 提示支持相对于光标的自定义固定位置，相关[#541](https://github.com/VisActor/VChart/issues/541)
**@visactor/vchart**: 修复仅数据更改时 updateSpec 不起作用的问题，详情见[#912](https://github.com/VisActor/VChart/issues/912)
**@visactor/vchart**: 支持 wx 环境
**@visactor/vchart**: 删除阈值的兼容性代码
**@visactor/vchart**: 在地图系列中访问标签

**🐛 功能修复**
**@visactor/vchart**: 当 stack 为 false 且没有`fieldX2`或`fieldY2`时，`dataToPositionX1`和`dataToPositionY1`应使用 0，关闭[#647](https://github.com/VisActor/VChart/issues/647)
**@visactor/vchart**: 当 stroke 设置为 null 时，标签描边应遵循默认颜色，详见[#985](https://github.com/VisActor/VChart/issues/985)
**@visactor/vchart**: `offsetX`和`offsetY`在标记组件中无法工作
**@visactor/vchart**: 桑基图支持颜色配置
**@visactor/vchart**: 设置标记悬停时样式不生效。修复[#976](https://github.com/VisActor/VChart/issues/976)
**@visactor/vchart**: 当计算机运行缓慢时，tooltipHide 事件可能无效
**@visactor/vchart**: 图表通过 serDataByAxis 配置传递到系列
**@visactor/vchart**: 调用 updateSpec 时，先前的滚动条尚未清除，关联[#1044](https://github.com/VisActor/VChart/issues/1044)
**@visactor/vchart**: 为 this.\_spec 添加保护，修复[#1045](https://github.com/VisActor/VChart/issues/1045)
**@visactor/vchart**: 修复`seriesId`在图例中不起作用的问题，关闭[#910](https://github.com/VisActor/VChart/issues/910)
**@visactor/vchart**: 锁定域时状态刻度错误。修复[#629](https://github.com/VisActor/VChart/issues/629)
**@visactor/vchart**: 通过处理程序传递时修复 unoff 事件
**@visactor/vchart**: 多次添加 userEvent
**@visactor/vchart**: 线和区域标记应默认设置 closePath，修复[#654](https://github.com/VisActor/VChart/issues/654)
**@visactor/vchart**: 修复雷达区域的 invalidType 不起作用的问题，修复[#867](https://github.com/VisActor/VChart/issues/867)
**@visactor/vchart**: 在调用 updataDataSync 后 invalidType 不起作用，详情见[#1057](https://github.com/VisActor/VChart/issues/1057)
**@visactor/vchart**: 在 updateData 后标记不渲染。修复[#882](https://github.com/VisActor/VChart/issues/882)
**@visactor/vchart**: 修复 markLine symbol.size 不起作用的问题
**@visactor/vchart**: 优化 normal-inline 的布局，修复[#989](https://github.com/VisActor/VChart/issues/989)
**@visactor/vchart**: 对 this.\_spec 进行乘积，修复[#1062](https://github.com/VisActor/VChart/issues/1062)
**@visactor/vchart**: 修复多区域进度布局的问题
**@visactor/vchart**: 当点和链接数据为空时渲染错误。修复[#1019](https://github.com/VisActor/VChart/issues/1019)
**@visactor/vchart**: fontsize renge 在没有值字段的情况下不起作用。修复[#522](https://github.com/VisActor/VChart/issues/522)
**@visactor/vchart**: 锁定十字准线标签以使其无法交互，因为它会影响轴标签的事件捕获
**@visactor/vchart**: 修复在[#915](https://github.com/VisActor/VChart/issues/915)中读取 null 选项的 onError 问题

**🔨 功能重构**

**@visactor/vchart**: 将生命周期的 updateSpec 拆分为规范转换和比较
**@visactor/vchart**: 删除未使用的代码，并将 ticks 转换转换为 vutils-extension
**@visactor/vchart**: 统一组件的清除
**@visactor/vchart**: 为更好的层控制将网格与轴分离
**@visactor/vchart**: 使用@visctor/vgrammar-core 替换@visctor/vgrammar

[更多详情请查看 v1.4.0](https://github.com/VisActor/VChart/releases/tag/v1.4.0)

# v1.3.4

2023-09-20

**🐛 功能修复**

- **@visactor/vchart**: 圆形进度图在执行`updateSpec`时可能会抛出错误，相关问题编号[#994](https://github.com/VisActor/VChart/issues/994)
- **@visactor/vchart**: 在执行`updateSpec`时，规范中的主题未正确更新，相关问题编号[#996](https://github.com/VisActor/VChart/issues/996)
- **@visactor/vchart**: 圆形进度图中规范中的`track`无法工作，相关问题编号[#600](https://github.com/VisActor/VChart/issues/600)
- **@visactor/vchart**: 修复图表执行`updateSpec`时触发的错误，已修复[#988](https://github.com/VisActor/VChart/issues/988)，[#1002](https://github.com/VisActor/VChart/issues/1002)
- **@visactor/vchart**: 修复播放器组件执行`updateSpec`的问题，已修复[#967](https://github.com/VisActor/VChart/issues/967)

[更多详情请查看 v1.3.4](https://github.com/VisActor/VChart/releases/tag/v1.3.4)

# v1.3.3

2023-09-18

**🐛 功能修复**

- **@visactor/vchart**: 修复播放器组件执行`updateSpec`的问题，已修复[#967](https://github.com/VisActor/VChart/issues/967)

[更多详情请查看 v1.3.3](https://github.com/VisActor/VChart/releases/tag/v1.3.3)

# v1.3.2

2023-09-14

**🆕 新增功能**

- **@visactor/vchart**: setDimensionIndex api 支持通过传入 null 来取消选择的能力
- **@visactor/vchart**: 在瀑布图中使用精确计算以避免标签出现意外值，详情见[#721](https://github.com/VisActor/VChart/issues/721)
- **@visactor/vchart**: 交互默认配置。

**🐛 功能修复**

- **@visactor/vchart**: 对数刻度在条形堆叠具有零基线值时，零值周围没有结果。修复[#634](https://github.com/VisActor/VChart/issues/634)
- **@visactor/vchart**: 修复 updateSpec 后用户事件监听器失效的问题
- **@visactor/vchart**: 修复更新规范时系列标记静态样式未更新的 bug
- **@visactor/vchart**: 修复更新规范时数据字段未更新的 bug，详情见[#829](https://github.com/VisActor/VChart/issues/829)
- **@visactor/vchart**: 修复通用图表中动画配置不起作用的问题，相关[#814](https://github.com/VisActor/VChart/issues/814)

**⚡ 性能优化**

- **@visactor/vchart**: 优化维度统计的性能
- **@visactor/vchart**: 仅在需要时计算维度树

[更多详情请查看 v1.3.2](https://github.com/VisActor/VChart/releases/tag/v1.3.2)

# v1.3.1

2023-09-05

**🆕 新增功能**

- **@visactor/vchart**: `lineHeight`支持字符串比例值，相关[#744](https://github.com/VisActor/VChart/issues/744)
- **@visactor/vchart**: 升级 vdataset 以在调用 updateData 时克隆源数据

**🐛 功能修复**

- **@visactor/vchart**: 将'SeriesMarkNameEnum'移动到单个文件中，解决 Codesandbox 无法工作的问题，看起来像是 Codesandbox 打包程序的错误，参见https://github.com/codesandbox/codesandbox-client/issues/6435
- **@visactor/vchart**: 修复 updateData 后 sortDataByAxis 不起作用
- **@visactor/vchart**: 修复 updateData 后图例不更新的问题，修复[#769](https://github.com/VisActor/VChart/issues/769)
- **@visactor/vchart**: 修复图例的 maxHeight 不起作用的问题
- **@visactor/vchart**: 修复饼图中的 null 值问题，已修复https://github.com/VisActor/VChart/issues/748
- **@visactor/vchart**: 修复数据全部为 0 时饼图绘制完整圆的问题，因为最后一条数据的 endAngle 被强制配置为极坐标的 endAngle
- **@visactor/vchart**: 修复离散图例中 seriesIndex 不起作用的问题，见[#732](https://github.com/VisActor/VChart/issues/732)
  [更多详情请查看 v1.3.1](https://github.com/VisActor/VChart/releases/tag/v1.3.1)
