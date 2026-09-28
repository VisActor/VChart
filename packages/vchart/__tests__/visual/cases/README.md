# 本地视觉测试用例

一份 case 一个文件，按主要验证目的归类，`index.mjs` 是唯一可执行清单。开发者或编码 Agent 根据改动选择测试范围；工具不推断源码影响范围。当前已登记 256 个用例，具体 ID、目的和文件用 `--list` 查询，配置分支与限制见 [覆盖清单](./COVERAGE.md)。

## 目录与选择

| 目录                          | 主要目的                               | 选择示例                 |
| ----------------------------- | -------------------------------------- | ------------------------ |
| `charts/<type>`               | 图表主体、类型特有配置和数据映射       | `--dir charts/waterfall` |
| `components/<component>`      | 轴、标签、图例、标注、提示、缩放等组件 | `--dir components/label` |
| `data`                        | 数据字段、过滤与公共比例尺             | `--dir data`             |
| `layout`                      | 多区域布局、媒体查询等布局条件         | `--dir layout`           |
| `theme`                       | 主题配置、注册和切换                   | `--dir theme`            |
| `interaction`                 | 图元状态、事件及跨组件协作             | `--dir interaction`      |
| `api`（含 `update`、`state`） | 数据、spec、尺寸与状态 API             | `--dir api`              |

组件自身的交互仍放组件目录，例如图例筛选在 `components/legend`；不要按是否有鼠标动作重复存放。饼图标签在 `components/label`，只测 `charts/pie` 不会包含它。修改共享模块时应考虑多个目录，不确定范围时运行全量。

从仓库根目录执行：

```sh
node packages/vchart/scripts/visual-test.mjs --list
node packages/vchart/scripts/visual-test.mjs --dir components/label
node packages/vchart/scripts/visual-test.mjs --case pie-label
node packages/vchart/scripts/visual-test.mjs
```

目录相对于本目录，递归包含子目录；`--dir` 与 `--case` 互斥。默认比较官方 develop，运行及报告说明见 [工具 README](../README.md)。

## 新增或维护用例

1. 先查看清单、覆盖说明和相近模块，确定新增的验证目的；新功能、缺陷修复及未覆盖的有效配置均可新增回归用例。已有用例能清晰表达时优先补强，避免一个用例承载互不相关的目的。
2. 在对应目录创建 `.mjs`，在 `index.mjs` 登记唯一 `id`、一句话 `purpose`、`./目录/文件.mjs`。`sourceExample` 只填写真实公开示例的仓库相对路径，无来源则省略；未经登记的文件不会执行。
3. 实现 `createSpec()`、可选 `exercise(page)` 和必需 `verify(page)`。固定数据，每次创建新 spec；不导入当前 VChart 源码，不读取网络、Node API 或测试框架运行时代码。
4. 交互动作与最终断言分开。检查实际筛选数据、提示内容、状态、范围或尺寸，不以点击成功、固定等待或截图存在代替验证。复用 `helpers.mjs`、`interaction-helpers.mjs` 中已有定位与等待函数。
5. 运行 `--list`、`--check`，再运行 `--self-compare --case <id>` 及默认基线单例比较。新用例在相同构建下连续五轮自比较稳定，并用针对验证目的的受控变化证明它能发现问题；交互还需验证抑制动作时不能通过。故障注入仅在独立副本操作，不提交破坏性修改。
6. 开发完成后运行相关目录；提交 PR 前运行默认全量比较，检查三图或 Agent 摘要并说明差异。无法运行或基线不支持新功能时如实记录阻断，不跳过用例或将自比较当作基线通过。

静态用例检查类型、关键数据、配置和必要图元，公共检查确认有效绘制，截图负责布局差异。配置回调或确定性计算可复用 `verifySourceSpec`，普通配置可用 `verifySpec`；输入一致仍不代表目标效果成立。复用共享检查，不再编写一套布局算法。

每个模块顶部说明目的、关键条件和边界，核心函数补中文注释。独立新增模块示例（不含 BugServer ID）：

```js
/**
 * 验证目的：说明本例要防止的具体回归。
 * 图表类型：bar。
 * 关键配置：列出实际验证的 spec 字段。
 * 场景条件：说明固定数据关系和触发条件。
 * 最终检查：说明语义断言和截图分别验证什么。
 * 覆盖边界：明确未执行的动作或未覆盖的组合。
 */
```

完整模块示例见 [工具 README](../README.md#用例约定)。不得用放宽截图阈值、跳过断言或永久接受差异替代修复确定性问题。

## BugServer 来源约定

- 现有迁移项在模块头唯一维护 `BugServer case IDs: <id>, <id>`，改写保留原 ID，合并保留全部真实来源 ID。保留必要触发条件、宿主适配和覆盖边界说明，勿带入原始业务数据或内部链接。
- 后续开发者或 Agent 独立新增的用例不填写此行；不写空值、TODO、占位或虚构 ID，也不为通过检查伪造 `sourceExample`。来源注释不是执行前提。
- 后续计划将独立新增用例同步到 BugServer，确认同步成功后才补齐服务返回的真实 ID。本期不实现同步命令、任务或状态字段；缺少 ID 不影响本地测试。
- 已有 ID 不应因重命名、移动或改写用例丢失。ID 只用于追溯，不代表已与线上内容实时同步；测试无需访问 BugServer。
