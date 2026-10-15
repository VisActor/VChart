# VChart 元数据依赖与类型导航修复验收

日期：2026-10-15。对应[实施计划](../plans/2026-10-14-vchart-metadata-dependency-navigation.md)。本轮以执行前工作区为基线，保留上一轮未提交改动；未提交、推送、创建 PR、发布或同步全局技能。

## 实际变更

1. 依赖内部使用规范化文件路径和符号限定名区分身份，统一 AST 与实例化依赖的归并。同名不同来源使用稳定 hash 后缀导航键，同符号不同别名去重；必要时属性提供 dependencyBindings，关联 A/B 等声明拼写和真实目标。无碰撞时保留原短键。
2. 可达类型解析校验与人工/补充/外部详情的展示策略分离。校验发生在简单类型分类之前，报告属性、类型链、符号及相关模块位置；不再因为声明所在文件包含任意缺失导入就整体拒绝。整条类型链成功后才提交校验缓存，循环链失败不留下部分成功状态。
3. 补充 typeof 查询依赖，解析导入、命名空间和枚举成员的真实来源。成员查询导航到所属枚举，避免只有孤立成员摘录。audit 同时检查属性别名绑定、补充声明内容及其传递链接；不会只凭目标文件存在判定导航有效。

实现文件为 `packages/vchart/scripts/skill-metadata/extract.mjs`、`packages/vchart/scripts/skill-metadata.test.mjs`。CLI、图库源码、公开接口、技能场景规则与应用生成工具均未修改。

## 基线与环境

- 分支 `codex/improve-vchart-skill-html-spec`，起点 HEAD 为 `de46ca24b`；不是用 HEAD 覆盖上一轮工作区资源。
- Node.js 22.23.3，TypeScript 4.9.5，VChart/extension 2.1.7；未安装或升级依赖。
- 执行前完整技能、维护脚本和文件摘要保存在临时快照中，位置记录于 `/tmp/vchart-navigation-baseline-path.txt`。
- 执行前原有 Node 测试为 12/12 passed；原有 check 无漂移。新增核心 11 组测试在冻结的旧 extractor/CLI 上全部失败，修复后全部通过。补充的跨模块属性和循环失败缓存两组回归也通过。
- CLI 夹具仅在临时目录复制工具和最小源码，使用现有依赖；Git 仅用于读取提交信息，不修改真实仓库索引或配置。macOS 临时路径使用 realpath 调用实际 CLI，避免 `/var` 与 `/private/var` 的路径别名使 CLI 入口没有执行。

## 测试与反例

最终 Node 测试 **25/25 passed**，包含原有 12 项与新增 13 项。原有逆序入口测试扩展为全部 36 个图型，独立 TS Context 抽取结果一致。

| 检查 | 实际结果 |
| --- | --- |
| 同属性 A/B 引用两模块 Item | 两个真实定义、独立导航键、别名绑定准确；调换导入顺序目标不变 |
| 同符号两个别名 | 只保留 Item 短键，A/B 均能导航 |
| 跨属性、Record 泛型、同文件命名空间 | 不拒绝合法同名类型、不覆盖不同声明 |
| 补充父类型的同名依赖 | 两个父类型及各自锚点均存在 |
| 人工详情下传递缺模块/缺导出 | 拒绝，错误含 value、Broken、Missing、模块及 middle.ts |
| 无关缺失导入 | 引用类型合法则通过；不是整文件拒绝 |
| 显式 any、索引签名、合法循环 | 保留实际公开契约；原 pictogram 开放契约测试继续通过 |
| 循环链失败后再次校验 | 再次拒绝，不使用部分成功缓存绕过错误 |
| typeof 枚举、导入、限定成员、常量对象 | 真实定义及相关链接存在；未执行应用源码 |
| typeof 同名值与缺失导入 | 不串来源；人工详情不能掩盖缺失导入 |
| 真实 DirectionType、RenderMode | 分别导航至 typings/space.ts 的 Direction 和 spec/common.ts 的 RenderModeEnum；未混入播放器方向 |
| 故意破坏别名绑定/枚举锚点 | audit 报错，避免只检查文件存在 |
| 实际 generate：先合法入口、再错误入口 | 非零退出；哨兵文件不变，不写入部分新元数据 |
| audit/check | errors=0、sourceChanges=0、changed=[]、orphanMetadata=[] |
| Python 既有生成器转义回归 | 1/1 passed |
| skill-creator quick_validate | passed，复用已有临时 Python 环境 |
| Prettier、git diff --check | passed |

原产物仍明确记录 pictogram 开放契约与 bar3d 类型/运行时差异，没有把其范围收窄为闭合校验。

## 资源差异与场景规则

- 全部 36 份元数据的 effectiveProperties、原始/解析类型、必需项以及继承声明/映射内容保持不变；源码内容指纹也未变化。
- 4 份元数据更新导航锚点：linearProgress 的 progress/track、boxPlot 的 boxPlot、wordCloud/wordCloud3d 的 word。原因是声明身份包含所属枚举，避免同文件不同作用域同名时碰撞；属性类型、短导航键和文件大小没有变化。
- 补充声明从 580 项变为 590 项，增加所需的枚举/值来源及相关链接；该文件增加 10,648 bytes。type-meta 总计仍为 3,507,786 bytes；type-details 总计由 1,043,923 变为 1,054,571 bytes。
- 对执行前快照逐文件比较：SKILL.md、README、workflows、scripts、template、topkey、metadata-sources.json 与所有人工 type-details 均保持原字节内容。
- 连续生成及独立逆序 Context 检查稳定。维护命令未进入用户生成配置流程，未增加 schema、编译或确认步骤。

## 原场景产物复核

把上一轮实际原产物复制到 `/tmp/vchart-navigation-evals/`，配置和 HTML 内容未改写。复用原浏览器检查脚本，输出保存在副本目录，不覆盖上一轮证据。HTML 页面实际加载 VChart 2.1.7 和原 Monaco 编辑器；JS/JSON spec 使用同版本本地构建验证。

| 场景 | 本轮实际观察 |
| --- | --- |
| M06 CSV HTML | 两条真实 CSV 文本记录、两柱、12/25 柱高比例正确，浏览器无 pageerror |
| M08 JS 回调 spec | formatMethod 产生四条星期/数值标签，四根柱及原数据正确，无浏览器错误 |
| M09 HTML 内 spec 修改 | 原更新后的完整 HTML 正常运行，4 条数值标签可见；逐柱点击返回对应原 day/value，四次均通过 |
| M10 JSON 宿主配置 | 读取原 JSON，四柱和原数据匹配，无页面错误，验证报告 passed |

已查看 M09 本轮截图。其编辑提示仍有上一轮已记录的“当前不显示数值标签”旧文案，本轮未修改原产物，也未把文案一致性计作通过。

这些复核证明保留的原产物仍能运行，不等于重新执行了全部 Agent 行为评测、真实宿主集成或 React 挂载。HTML/spec 决策规则保持的直接证据是受保护文件逐字节相等。

## 复现与证据

从仓库根目录执行，使用 Node.js 22：

```sh
node --test packages/vchart/scripts/skill-metadata.test.mjs
node packages/vchart/scripts/skill-metadata.mjs audit --report /tmp/vchart-navigation-audit.json
node packages/vchart/scripts/skill-metadata.mjs check
python3 -m unittest discover -s skills/vchart-development-assistant/tests -v
git diff --check
```

本轮临时证据包括 `/tmp/vchart-navigation-red-fixed.log`、`/tmp/vchart-navigation-tests-final.log`、`/tmp/vchart-navigation-audit.json`、`/tmp/vchart-navigation-contract-comparison.json`、`/tmp/vchart-navigation-file-comparison.json` 和 `/tmp/vchart-navigation-evals/`。临时目录可能被清理；仓库内保留回归测试和关键结论。

本轮没有修改图库运行时，也未创建 PR，未重跑全量视觉比较。未来提交 PR 前仍须执行并审查官方 develop 全量视觉比较，不使用此前结果替代。
