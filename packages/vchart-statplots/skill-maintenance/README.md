# 数据科学 skill 维护

本目录保存 [data-science-visualization](../../../skills/data-science-visualization/SKILL.md) 的完整资源清单和维护测试。使用者只需完整技能包及 Python 3.11+，无需复制本目录或运行仓库同步器。

## 版本与资源边界

- skill 根目录 `release.json` 是唯一人工库版本入口。
- skill 内 `references/statplots/snapshot.json` 由同步器生成，只记录已生成参考资源的版本；Python 核对两者一致后才生成 HTML。
- 本目录 `manifest.json` 为 formatVersion=3 的完整生成清单。files 键相对 skill 的 references/statplots 根目录，登记来源、源文件与输出 hash、转换规则、生成器/选择器 hash，以及 controller 副本信息。
- 维护检查核对 release、snapshot、manifest 的版本，以及文件清单、类型闭包、本地文档导航、变体 type/options 和引用完整性。
- 同步器不复制发布包 package.json；variants.json、类型、指南、最小/变体示例及许可证随 skill 分发。来源 URL 留在本目录清单中，HTML JavaScript 使用固定 CDN。

## 同步与升级

使用 Node.js 22，从仓库根目录执行：

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
```

升级只修改 skill 的 release.json，指定已经发布的 VChart/statplots 同版本组合，再执行上述命令及相关测试。同步器验证 npm tarball integrity，从同版本发布物复制声明与示例，提取指南。不要手改生成文件、snapshot 或 hash，不从 workspace 其他版本填补发布内容；新版本的类型、章节或示例不满足检查时先审查并适配。

先等待同步完成，再运行校验与测试；资源目录替换期间不要并行复制该目录或启动资源回归。

controller 的源文件是 [examples/shared/statplot-controller.js](../examples/shared/statplot-controller.js)。在上游修改后经同步器生成 skill/assets 副本，不直接维护两份实现。

临时输出必须显式指定独立的外置清单，且清单不能位于资源目录内：

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --root /tmp/dsv/resources --manifest /tmp/dsv/manifest.json
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --root /tmp/dsv/resources --manifest /tmp/dsv/manifest.json --check
```

这些是维护端选项，不影响使用者的 Python 生成命令。发布 UMD 测试缓存位于 .vchart-statplots/dsv/published，其 manifest 属于独立缓存，不是本目录的来源清单。

## 发布与失败处理

同步先构建资源目录和独立清单的暂存副本，并完成离线核验。然后备份旧资源、旧外置清单，安装新资源/清单，更新 controller，再检查最终状态。

最终检查通过前出现异常时，恢复已备份的资源、清单和 controller。首次从旧内置 manifest 布局迁移失败时，恢复旧目录完整内容；首次创建失败时移除部分输出。暂存文件放在各自目标同级，不假设不同目录处于同一文件系统。

回滚中某个目标恢复失败时，继续尝试恢复其他目标，报告 AggregateError 并保留尚未恢复的备份。最终检查通过后再清理备份；此时清理失败会报告错误，已验证的新资源保留。该流程处理可捕获异常，不提供断电或进程强杀下的多目标原子性保证。

## 测试与验收

从仓库根目录运行，Python 使用已有 3.11+ 环境。XLSX 测试需要 openpyxl，技能结构校验需要 PyYAML；缺依赖导致跳过或无法运行应如实记录。

```sh
python3.11 -m unittest discover -s packages/vchart-statplots/skill-maintenance/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs packages/vchart-statplots/__tests__/runtime/skill-publication.test.cjs packages/vchart-statplots/skill-maintenance/tests/data-bindings.test.cjs
```

从 packages/vchart-statplots 运行发布 UMD 与复制分发回归：

```sh
DSV_PYTHON=python3.11 ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-portable.spec.ts
```

涉及页面交互时补运行 skill-interactions.spec.ts 等相关用例。每图检查 rendered、真实图元与所请求的状态变化；文件或 canvas 存在不足以证明成功。确认 skill 副本不包含完整 manifest、包元数据或维护测试，也不依赖仓库路径。

`test_skill_bundle.py` 检查整个技能包的使用端目录、本地 Markdown 链接及 JSON，并在仓库外、中文空格路径下使用 `-I -S -B` 禁用 site-packages 和字节码写入，清空 PATH，拒绝原仓库文件读取、网络及子进程调用。六份示例生成后删除原始 CSV，再逐份重放并核对图表与数据行。浏览器回归还会在生成后删除技能副本，使用真实 CDN 打开独立 HTML。

复制技能时排除 `__pycache__`、`.DS_Store` 等运行或系统缓存；维护用 Git 忽略规则放在仓库根目录，不随技能分发。

再次同步时比较使用资源树、外置 manifest 和 controller 的字节，不能只比较一个目录。变体示例应与同版本发布物原字节一致；默认按需读取，不扩大模型的首次必读资源。

创建 PR 前按仓库 AGENTS.md 运行全量视觉基线比较并审查报告：

```sh
node packages/vchart/scripts/visual-test.mjs
```

技能单元/浏览器回归不能替代这项比较；阻断、执行错误和视觉差异都应记录并处理。
