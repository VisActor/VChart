# 本地视觉测试用例

按主要验证目的存放，一份 case 一个位置，`index.mjs` 是唯一可执行清单。目录表示用例归属；修改源码时，由开发者或编码 Agent 判断需要测试哪些目录，工具不自动推断影响范围。

## 目录导航

| 目录                  | 用例 ID                                                  | 验证内容与边界                                      |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| `charts/bar`          | [bar-stack](./charts/bar/bar-stack.mjs)                  | 正负值堆叠和零基准线；不覆盖百分比堆叠              |
| `charts/line`         | [line-gap](./charts/line/line-gap.mjs)                   | `invalidType: 'break'` 缺失值断点；不覆盖连接缺失值 |
| `charts/scatter`      | [scatter-symbol](./charts/scatter/scatter-symbol.mjs)    | 位置、大小和 diamond 符号                           |
| `charts/waterfall`    | [waterfall](./charts/waterfall/waterfall.mjs)            | 累计、总计和连接线；不覆盖横向模式                  |
| `components/axis`     | [axis-label](./components/axis/axis-label.mjs)           | 长标签显式旋转；不覆盖自动旋转阈值                  |
| `components/label`    | [pie-label](./components/label/pie-label.mjs)            | 大小扇区的外侧标签和引导线                          |
| `components/legend`   | [legend-filter](./components/legend/legend-filter.mjs)   | 点击后选择项和实际可视数据均改变                    |
| `components/tooltip`  | [tooltip-hover](./components/tooltip/tooltip-hover.mjs)  | 悬停后 HTML tooltip 可见并含目标值                  |
| `components/datazoom` | [datazoom-drag](./components/datazoom/datazoom-drag.mjs) | 拖动后的范围和过滤结果                              |
| `api`                 | [update-resize](./api/update-resize.mjs)                 | updateData 和 resize 后的数据、画布尺寸             |

例如，测试 pie 标签应选择 `components/label`。未来 `charts/pie` 如有主体图形用例，也不会自动包含本目录的标签用例。图例和 dataZoom 的交互归对应组件，跨组件事件协作再按需建立 `interaction/`。

## 如何选择

从仓库根目录运行：

```sh
node packages/vchart/scripts/visual-test.mjs --list
node packages/vchart/scripts/visual-test.mjs
node packages/vchart/scripts/visual-test.mjs --dir components
node packages/vchart/scripts/visual-test.mjs --dir components/label
node packages/vchart/scripts/visual-test.mjs --case pie-label
```

目录相对于本文件所在的 `cases/`，递归包括子目录；目录和 case ID 互斥。不确定测试范围时运行全部本地用例。完整参数、环境准备和报告说明见 [运行说明](../README.md)。

## 编写约定

清单中填写唯一 `id`、一句话 `purpose` 和 `./目录/文件.mjs`。真实公开示例来源可填写 `sourceExample`；没有时省略。新增文件未经清单登记不会执行，不将 BugServer 内部链接或原始业务数据写入公开代码。

每个模块顶部包含以下说明，便于 Agent 文本搜索和维护者审查：

```js
/**
 * 验证目的：大小扇区混合时，外侧标签与引导线正确呈现。
 * 图表类型：pie。
 * 关键配置：label.position、label.visible。
 * 场景条件：固定合成数据，同时有大扇区和多个小扇区。
 * 最终检查：核对输入与有效绘制，比较最终页面截图。
 * 覆盖边界：不验证点击，也不代表全部自动避让分支。
 */
```

保留 `createSpec()`、可选 `exercise(page)` 和必需 `verify(page)`。交互必须检查实际结果，不能只等待固定时间；数据和文本固定，网络资源禁用。共享助手位于上级 `helpers.mjs`，根据模块深度使用正确相对路径。

新用例在同一构建下连续五轮自比较稳定，并通过针对自身目的的受控变化验证后，再作为覆盖依据。只使用过某个组件不代表验证了它的所有行为。

## 待补场景

下面是准备候选的方向，不代表已经具备用例或完成覆盖。按质量逐项补充，不生成空 case 占位。

| 方向       | 待补内容                                    |
| ---------- | ------------------------------------------- |
| 图表主体   | area、pie 等主体图形的最小检查              |
| 轴布局     | 自动旋转触发条件、标签截断、多轴            |
| 标签和标注 | 其他几何形状的标签、markLine/markPoint 定位 |
| 数据边界   | 其他缺失值策略、零值和空数据的有效预期      |
| API 与布局 | updateSpec、多区域和连续更新                |
| 样式       | 显式覆盖、主题继承                          |

需要时再建立 `data/`、`layout/`、`interaction/`、`theme/` 等专题目录。内网 BugServer 仍保留发布前全量测试职责。
