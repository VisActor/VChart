# VChart 技能元数据质量优化验收

日期：2026-10-14。对应 [计划](../plans/2026-10-14-vchart-skill-metadata-quality.md)、[技能入口](../../../skills/vchart-development-assistant/SKILL.md)、[来源清单](../../../skills/vchart-development-assistant/references/metadata-sources.json)。本轮未提交、推送、创建 PR、发布或同步全局技能。

## 完成范围

- 维护工具使用真实 TypeScript 符号及模块导入链，修正方向、动画、继承/泛型/Omit 和依赖解析；保留旧消费字段，增加最终有效属性与有效 reference。
- 30 个既有元数据入口按当前源码重建，新增六个已有 3D 索引入口的元数据；pictogram 迁到扩展来源并补 topkey。
- 修复 IData 的 CSV URL 误导与类型重定义；补系列/图元动画层级说明，其他有效人工详情保留。
- 修正组合图系列属性和共享 state 的作用域，删除实际契约中不存在、没有说明的 sankey.nameKey 索引；nodeKey 入口保留。
- 补充源码声明及按模块区分的导航。所有文件来源使用相对路径或外部包名/版本，记录源码指纹、相关提交及 TypeScript 版本。
- check 重建并审查，只读报告漂移；未把 schema、维护编译工具或额外确认步骤加入用户生成图表流程。
- 图库运行时、公开接口、原 HTML 生成器、模板和工作流均未修改；与修复前技能快照逐文件核对，生成器/模板/工作流一致。

## 来源与环境

- 起点 HEAD：`de46ca24b`；分支 `codex/improve-vchart-skill-html-spec`，工作区为本轮未提交修改。
- 修复前冻结的完整技能：`/var/folders/p6/3_mdjbzd59n9q8rgt0s6h5240000gn/T/vchart-metadata-before-fwzpwf8k/vchart-development-assistant`。不使用更早的 HEAD 代替本轮基线。
- Node.js `22.23.3`，TypeScript `4.9.5`，VChart/extension `2.1.7`。维护工具复用已有依赖，没有安装或升级项目依赖。
- 浏览器使用仓库 Playwright Chromium 或本机 Chrome，验证报告记录实际 VChart 版本。3D 验收使用标准 Rollup 将当前核心和扩展 CJS 入口绑定为同一模块，避免双 Factory/渲染器；依赖是 tools/bundler 已有依赖。
- 独立任务继承默认模型设置，未覆盖 model/reasoning；不带父对话历史，不提供预期答案。新版共 10 个独立上下文，覆盖 M01–M11：M03 为 M02 的后续真实修改，M09 两轮保留真实 HTML 历史。
- 冻结版另执行 M01/M02/M06 三个独立任务。原始产物、实际浏览器记录和脚本在 `/tmp/vchart-metadata-evals/`，临时目录可能被清理，本文保留关键结论和复现命令。

## 静态审查与生成

修复前 audit 记录 442 个缺失的图型/属性组合，以及方向、动画等类型表达差异、错误来源和导航。旧版与当前表达比较也包含别名/格式等差异；同一根因在多个图型和检查项中重复计数，不能把审查总数当成独立 bug 数或运行失败数。

修复后 audit/check：**errors=0、sourceChanges=0、changed=[]、orphanMetadata=[]**。另如实记录一个公开开放契约（pictogram）和一个已证实的运行时/类型差异（bar3d）。

| 项目 | 修复前 | 修复后 |
| --- | --- | --- |
| topkey | 36 文件，170,967 bytes | 37 文件，172,558 bytes |
| type-meta | 30 文件，973,777 bytes | 36 文件，3,507,786 bytes |
| type-details | 77 文件，515,535 bytes | 78 文件，1,043,923 bytes |

元数据增加最终属性视图、出处、完整继承和扩展入口，体积增加；补充声明通过类型索引和锚点按需读取。外部类型仅保留直接声明及包版本，不递归复制外部手册。未全量语义审阅原有 77 份人工详情，不能宣称全部说明均已校正。

## 自动检查

| 检查 | 实际结果 |
| --- | --- |
| Node 维护测试 | 12/12 passed：真实模块碰撞、继承、动画正/反例、Omit 边界、缺模块拒绝、开放/扩展来源、导航、重复键、查询顺序稳定、真实 CLI 只读检查 |
| TypeScript 合法/非法用法 | reverse、animationAppear 字符串 grow 被拒绝；horizontal、preset 对象及 false 合法 |
| audit/check | passed，0 错误/属性差异/生成漂移/孤立元数据；记录开放范围和已证实契约差异 |
| Python 既有转义回归 | 1/1 passed；生成器与本轮前相同 |
| 官方 skill-creator quick_validate | passed；复用之前临时 PyYAML 环境，未改项目或全局依赖 |
| Markdown 相对文件/类型锚点 | passed，技能入口、README 和全部详情目标有效 |
| Prettier、git diff --check | 维护脚本格式检查及差异检查通过 |

类型联合排序采用 TS 语法节点，保留成员语义；不同入口顺序的新 TS Program 也产生相同属性结果。指纹包括实际源码/依赖内容、版本、来源清单与契约说明源文档，不使用当前时间或无关文档的全局 HEAD。

## 实际行为与渲染

| 场景 | 实际观察 |
| --- | --- |
| 冻结版 M01/M02/M06 | 均通过。水平柱图和 preset grow 正确，M02 查源码纠正冻结元数据误导；CSV 页面两柱正常。不能据此宣称成功率提升 |
| M01 水平 JSON | 完整配置，day/value 四天 12/25/18/32 保留；父任务确认四根正面积水平柱 |
| M02/M03 动画与关闭 | grow 采用 preset 对象；后续仅改 animationAppear=false，其他配置深度相等；两份实际配置均绘制原四柱 |
| M04 区间面积 | 三条 low/high 数据为 3/8、5/11、4/9，采用真实 minField/maxField；父任务核对三对有限且不同的面积端点，截图上/下边界对应原范围 |
| M05 雷达 | 速度70、力量60、耐力80，完整字段映射；真实三点/线及 datum 正确，父任务复核 |
| M06 CSV 文本 HTML | 两条周一12/周二25，实际两柱、原值及比例正确；未虚构网络加载 |
| M07 本地 CSV URL HTML | 真正 fetch 指定本地服务后绘制两条数据；请求/原值/柱高比例、编辑后颜色变化通过，没有业务外部请求；CDN 图库在验收时替换为同版本本地 bundle |
| M08 JS 回调 spec | formatMethod(text,datum) 显示四条“星期: 数值”；实际标签和四个原数据柱通过；无 HTML/实例代码 |
| M09 HTML 内 spec 修改 | 第二轮仍完整 HTML，仅两处内嵌 label.visible false→true；原四条数据、真实逐柱点击保留，四个标签可见，无页面错误 |
| M10 已知 JSON 宿主 | 完整 JSON，只增加 label.visible=true，原数据和格式保持；父任务实际四柱及标签渲染 |
| M11 扩展 bar3d JSON | 数据完整，不混注册/实例代码；父任务真实共享核心/扩展环境创建四个 rect3d，原 datum、有限正面积、截图及无浏览器错误通过；不是用核心二维柱替代 |

父任务读取实际配置并核对数据、增量差异，读取浏览器记录、验证脚本及截图；未只依赖 Agent 最终自述。

文档 CSV 的独立回归直接执行其原始代码块：URL 当 values 的反例为 0 柱/空数据，实际 CSV 文本示例为两柱，应用 fetch 后文本为两柱；本地服务只收到一次 GET，数据为周一12、周二25。

## 已知边界

- pictogram 当前公开类型包含 IChartExtendsSeriesSpec<any>，不能伪造闭合字段集合；系列声明和根字段转发来源明确保留。
- IBar3dSeriesSpec 继承二维 bar 类型，未声明运行时与仓库示例使用的 bar3d.style。元数据 contractNotes 明确记录说明、来源和最小样式示例，没有把文档字段伪造进类型属性。公开接口修正应单独处理；本期没有修改类型契约。
- M09 按“其他内容保持”保留初始编辑提示，其中“当前不显示数值标签”与更新后的状态不一致。数据、标签、点击和交付检查通过；未将提示文案一致性计作通过，未借此改写技能交付规则。
- 浏览器验收不代表真实宿主已验收；未进行 React 组件挂载或所有六个扩展图型的运行验收。六个扩展入口的真实来源、字段和注册关系均完成静态核对。
- 本轮未创建 PR，未重新运行图库全量视觉比较。图库、生成器、模板没有变化；未来提交 PR 前仍须运行并审查官方 develop 全量比较，不能拿上一轮 266 passed 充当本轮新结果。

## 复现入口

仓库依赖已准备、Node.js 22 在 PATH：

```sh
node --test packages/vchart/scripts/skill-metadata.test.mjs
node packages/vchart/scripts/skill-metadata.mjs audit --report /tmp/vchart-metadata-audit.json
node packages/vchart/scripts/skill-metadata.mjs check
node packages/vchart/scripts/skill-metadata/verify-examples.mjs --csv-example /tmp/vchart-csv-example-validation.json
python3 -m unittest discover -s skills/vchart-development-assistant/tests -v
```

生成候选产物再审查：

```sh
node packages/vchart/scripts/skill-metadata.mjs generate --output /tmp/vchart-metadata-generated
```

已有实际 Agent 产物时，维护验证器读取原配置，不手工补数据/字段：

```sh
node packages/vchart/scripts/skill-metadata/verify-examples.mjs --build-extension /tmp/vchart-extension-runtime.js
node packages/vchart/scripts/skill-metadata/verify-examples.mjs --artifacts /tmp/vchart-metadata-evals --case m11 --extension-bundle /tmp/vchart-extension-runtime.js
```

缺产物/缺扩展环境记为 not_run，不能算 passed。M07 所用本地 CSV 服务已在验收结束后关闭。
