# 数据科学可视化页面简化验收

日期：2026-10-12；分支：`codex/vchart-statplots`；实现起点 `c8efd2de4`。本轮改变默认展示与请求契约，没有修改 VChart/statplots 的统计、几何或公共 TS API，也没有发布、全局安装或部署。

## 实际交付

- 默认只有一个页面标题、图表、轴标签/单位和真实 Tooltip，必要图例/色标为静态表达。未请求的工具栏、按钮、选择器、来源哈希、计数、技术说明和页脚不生成 DOM。
- 多图各自一个 HTML 标题；共享控制器只在技能显式 showTitle=false 时去除本次编译输入的 title/description，原语义 Spec 仍保留。pair/seasonal 按无标题的公共布局编译，不留下隐藏标题余白。
- presentation.actions/details 与 Chart.interactions 严格按需声明。筛选器非空才有应用/清空；仅分箱参数时只出现一个选择器。主题、PNG、Spec、保存当前视图分别请求、分别验收。
- 固定 initialFilters 可独立于页面 filters；应用/清空其他控件保留固定范围。对话改图读取 request，保留所有使用行、ID、单位及条件，生成新目录。默认启动提示也不再主动要求筛选器。
- 原始使用数据与来源保留在 data 文件，计算后的输入数/省略数及详细失败原因保留在状态对象。单位和明确图注仍展示；默认错误简短可见，成功恢复后清除。
- 共享控制器使用标准 legend.interactive/brush.visible；未传策略的图库保持原状，技能副本由 sync 脚本生成。144 份固定发布资源字节/链接哈希保持原状，manifest 仅 workspace controller 哈希更新。固定 UMD 仍为 2.1.8-alpha.0。

## 命令与结果

环境：macOS arm64，Node 22.23.3；Python 3.11.16/3.12.14；Chromium 153.0.8010.12；Playwright 1.63.0。

| 检查 | 实际结果 |
| --- | --- |
| Python unittest | 两个版本各 23 项通过，包含实际 XLSX 与缺依赖处理路径 |
| Node runtime/bindings/resources | 14 项通过；新策略、恢复、原生默认与资源完整性均覆盖 |
| Statplots 单元 | 38 suites / 664 tests 通过 |
| 完整浏览器 | 447 项通过，5.1 分钟；日志 `.vchart-statplots/dsv/simplification-full-browser.log` |
| 定向浏览器 | 49 项通过；最小页、交互、失败、便携、在线 CDN 与规模 |
| 复制目录示例 | 六份请求实际生成；原 CSV 移除后可重放，并用 file URL 渲染 |
| 固定发布 UMD | 28 类语义 Spec 与 12 类绑定全部真实编译/渲染，完整性验证的固定字节，未用本地构建冒充 |
| 真实 CDN | 不拦截网络的 360 px 深浅主题检查通过 |
| 源码 compile / Schema | 通过 |
| catalog / examples | 28 类、89 条目录预期；28 主例、122 有效变体、36 反例通过；目录检查不是模型命中率 |
| Skill quick_validate / 资源离线 check / diff check | 通过 |
| ESLint | 0 errors、1136 warnings；包含既有与新增测试的 any/非空断言等警告，没有放宽规则 |
| 扩展测试项目 tsc | 仍有既有 confusion-matrix.spec.ts/raw-input.spec.ts 隐式 any 和 build-schema.ts 的 DefinitionOrBoolean 错误；本轮日志无 skill 文件错误，不能宣称全部类型检查通过 |
| 官方 develop 全量视觉比较 | 262 例全选，baseline 四项失败，完整比较 false；不能声明通过 |

第一轮 Jest/catalog 因本地 `packages/vutils-extension/cjs` 不存在而无法加载。上一轮正式视觉构建链调用 build:es 的 --clean 会清理这些忽略目录。本轮在浏览器退出后用标准 `npm run build --prefix packages/vutils-extension -- -f cjs` 补齐 CJS，无源码或锁文件改动；Jest/catalog/examples 重跑全部通过。初次失败日志保留，没有把依赖加载失败当作功能通过。

关键日志均在 `.vchart-statplots/dsv/simplification-*.log`，最终单元与目录结果使用 `jest-final`、`catalog-final`、`examples-final`；Python 使用 `python311`/`python312`。早期两项布局测试错误引用并不存在的 examples/specs 路径，已改为读取真实 catalog 引用，最终定向及全量均通过。

## 页面与交互证据

新增 `packages/vchart-statplots/__tests__/browser/skill-minimal.spec.ts` 登记 19 个实例，验证实际页面与图元：

- 360/420/1000/1440 px 默认页无按钮/输入/操作栏/详情、一个标题、单位正确、鼠标 Tooltip 真实可见且不越界。
- 只声明分箱参数时一个选择器、零按钮，切换后实际分箱计数改变。
- 固定地区 A 加可编辑年龄范围：应用/清空年龄仍保持 A；空范围提示可见，恢复后清除。
- 四个 action 各自单独声明，各自只有一个按钮；实际主题更新和 PNG/Spec/request 下载成功。
- 磁盘请求保留四行原始使用数据；box 改 violin 后仍 A 两条、单位元、零额外控件；通过对话移除固定范围后恢复四条。
- 真实 pair 拖动：默认无选择状态，显式 brush 后不同面板选中同一 ID 002；真实 grouped count 图例点击：默认数据不变，显式 legendFilter 后显示量减少一半。
- pair/seasonal 的真实 compiled layout 与公共 API 对无 title/description 输入的编译结果相同；原规范输入仍保留标题/描述。
- 默认 CDN 失败结束加载，无工具按钮，简短错误可见且状态保留详细原因；多图标题、必要单位和明确图注保留。

原交互、错误恢复、PNG、保存当前视图、相关分母、框选、便携及规模测试调整为显式请求所需能力，`tableRequest` helper 没有默认打开全部功能。gallery 原八项在控制器修改前后各通过；1440/1000/390 px 三组截图逐字节相同，结果在 `.vchart-statplots/dsv/simplification/gallery-comparison.json`。

已人工审阅最小单图、窄屏、筛选页、多图矩阵及收入分布截图。新增截图在 `.vchart-statplots/dsv/simplification/screenshots/`；六个生成示例在 `.vchart-statplots/dsv/simplification/examples/`。PNG 导出原生绘图区，HTML 标题/图注/控件不在 PNG 内；HTML 为完整页面交付。

## 规模

完整 447 项运行中的单次粗略测量，不作为 SLA：

| 场景 | 结果 |
| --- | --- |
| 10k 行四图首绘 | 303 ms |
| 筛选到 5k | 128 ms |
| 四图主题切换 | 109 ms |
| resize / release | 105 / 6 ms；release 后 canvas 为 0 |
| 浏览器 JS heap | 35.1 MB，粗粒度指标 |
| 10k 行、4 变量 pair | 120000 非对角点，首绘 744 ms |

实例复用、compile 次数及 hover/resize 不编译有真实断言；没有抽样、减行或放宽原预算。数值记录为 `.vchart-statplots/dsv/four-chart-performance.json`、`pair-performance.json`。

## 独立正向执行

依 skill-creator，由独立评估者只读取新技能和十行合成原数据，未读取父任务计划/测试预期。实际生成并在独立 Chromium 中检查收入分布、地区切换、固定东区部门箱线及改小提琴，正式四页逐图 rendered、无 pageerror；检查真实 Tooltip、数值集合、区域选择和清空。

- 十行原始数据、九条有效收入、一条省略，0 保留。
- 东四/西三/北三，清空恢复十行；西区有一处缺失，真实统计输入为两条。
- 改图保留十条完整使用行、字符串 ID、单位元与固定东区范围，无默认控件。移除固定范围后恢复九条有效输入。
- 东区两个部门仅单样本，默认小提琴无法自动估计带宽，真实 failed 正确显示；正式演示采用明确的 1000 元固定带宽并注明不能推断分布形状，不把默认失败称为通过，也未新增静默兜底。
- 回放仅包含使用列；新增地区/部门视角时评估者回到已知真实 CSV 按 ID 补回字段。不能把 request 称为完整 CSV 备份。

独立报告及浏览器脚本/契约结果在 `.vchart-statplots/dsv/simplification/forward/independent-20261012-170707/`。独立检查使用核验 SHA 的固定缓存 UMD，实际在线可达性由主任务另一条测试覆盖。宿主 IAB 预览、自动发现和全局安装不在本轮实际验收范围，未擅自安装。

## 正式视觉比较阻断

在完整 Statplots 浏览器回归退出后，实际执行 Node 22 的全量官方比较，262/262 例，没有跳例或修改阈值。官方基线 `e5426efe9e363ad4c71757aa4702baa877ead0da`（核验缓存命中）；当前干净工作区 `27a72c0627cb5b02e32490cbba258dcb435c7de5`。此后只补充本文、执行记录和协议说明，核心源码不变。

baseline 阶段 258 项执行通过、四项断言失败：

- band-axis-update-spec：主题更新后新 band axis spec 未应用。
- legend-piecewise-domain：预期 [-1,1]，实际 -1,0。
- brush-link-data-key：不同面板没有按同一观测 ID 联动。
- update-resize：更新或 resize 未生效。

CLI exit=2；最终报告 finalized=true、status=error、complete=false，counts 为 4 error/258 not_run/0 passed/0 diff，current 比较未进入。与本分支先前两轮记录相同，不能把 baseline 的 258 项执行通过当作 258 项当前对比通过，也不能把缺失三图说成已审查。

报告为 `.vchart-visual/runs/1791796768457-60c2b12b/index.html`、`agent-summary.md`、`summary.json`，日志 `.vchart-statplots/dsv/simplification-core-visual.log`。本次未用 self-compare 替代官方对比。构建链结束后已经补回本地 extension CJS，工作区无额外源码改动。

## 复现

```sh
# 仓库根目录，Node 22、Python 3.11+；Python 环境可选装 openpyxl 来跑实际 XLSX 分支。
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/*.test.cjs skills/data-science-visualization/tests/*.test.cjs
python3 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py' -v
npm run build --prefix packages/vutils-extension -- -f cjs
npm run compile --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
DSV_PYTHON=python3 npm run test:browser --prefix packages/vchart-statplots
# 等图库浏览器测试结束后再运行正式比较，不能用自比较代替。
node packages/vchart/scripts/visual-test.mjs
# 正式构建链会清理 extension 的 CJS，按需补回再跑 Jest/catalog。
npm run build --prefix packages/vutils-extension -- -f cjs
```
