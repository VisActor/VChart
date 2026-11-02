# 数据科学 skill 整体审查与独立分发验证

日期：2026-10-19。环境：Node.js 22.23.3、Python 3.11.16、Chromium；Python 环境已安装 openpyxl 和 PyYAML。

## 结论与修正

完整复制 `skills/data-science-visualization` 后可以在仓库外生成、重放和打开图表，无需仓库维护目录、Node.js、npm 或 TypeScript。HTML 渲染仍需网络访问两个固定 2.2.0 UMD，这是使用文档中已明确的运行依赖。

- 未发现完整 manifest、package.json、测试、维护说明或同步脚本残留在 skill 中。
- 删除 skill 内仅用于开发的 `.gitignore`，将缓存忽略规则收敛到仓库根目录，同时覆盖已迁移的维护测试。
- 清理 skill 中实际存在的 Python 字节码缓存和 `.DS_Store`。复制时排除这类运行、系统缓存；正常执行 Python 后可能重新生成字节码缓存。
- 新增仓库维护测试 `packages/vchart-statplots/skill-maintenance/tests/test_skill_bundle.py`，覆盖整包目录边界、本地文档引用及隔离执行；增强浏览器中真实 CDN 的独立输出验证。
- 本次未修改图表运行逻辑、协议或生成参考资源；未重新同步快照。

## 文件、引用与重复维护

最终 skill 共 168 个文件、381658 字节：入口和 release 各 1 个，agents 1 个，scripts 3 个，assets 5 个，examples 7 个，references 150 个。无符号链接、缓存或仓库维护目录引用。

全部 108 处 Markdown 链接均为包内可达路径。资源检查进一步验证索引、指南、示例、声明导入闭包及来源 hash，覆盖 28 类图、28 份最小示例和 52 份变体示例；JSON 均能解析。仓库中对已删除内置 manifest/package 的现行引用仅保留在“文件必须不存在”的测试断言中，历史计划不属于使用资源。

版本字面量 `2.2.0` 在 skill 中只出现在 `release.json` 和自动生成的 `references/statplots/snapshot.json`。前者是唯一人工入口，后者用于防止库版本和参考资源错配。模板读取 payload 版本；index、variants、指南、示例和类型由同步器生成，controller 副本由来源 hash 校验，不构成两套人工维护配置。

实际加载的外部资源仅为 VChart 和 statplots 的固定版本 JavaScript UMD。许可证中的 URL 用于来源与授权归属；没有远端 Markdown/JSON、字体、样式表或图片加载依赖。许可证和使用资源保留在分发包中。

## 仓库外验证

新增隔离测试将整包复制到临时目录的 `独立 skill` 子目录，从 `/` 执行。Python 使用 `-I -S -B`，禁用 site-packages 和字节码写入，PATH 为空；审计钩子禁止原仓库文件读取、网络调用及启动外部程序。

distribution、comparison、relationships、quality、external、interactive 六份示例均生成成功；随后删除副本内原始 CSV，逐份用输出 request 重放，图表配置和数据行保持一致。此步骤只使用 Python 标准库；XLSX 的可选 openpyxl 读取另由既有单元测试覆盖。

浏览器验证七个仓库外副本（六份使用示例及一份本地变体），并覆盖全部 80 份最小/变体示例和 12 种表格绑定。大部分浏览器用例使用经过发布包 integrity 校验的 UMD 缓存；真实 CDN 用例不做请求拦截，在生成后删除整个 skill 副本和原始 CSV，再以 `file://` 打开独立 HTML，断言 rendered、真实图元、360px 布局和明暗主题切换。

## 执行结果

全部通过，0 跳过、0 失败，共 181 项测试：

| 检查 | 结果 |
| --- | --- |
| 同步器 `--check`，文件/hash/版本/引用闭包 | 通过 |
| skill-creator `quick_validate.py`、agents 元数据核对 | 通过 |
| Python 单元测试（含新增整包与隔离测试） | 28 通过 |
| Node 资源、发布回滚及表格绑定测试 | 53 通过 |
| 浏览器 catalog + portable 回归 | 100 通过，50.0 秒 |
| `git diff --check` | 通过 |

从仓库根目录运行：

```sh
export PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH
export PYTHONDONTWRITEBYTECODE=1
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
/tmp/vchart-dsv-220-validation/bin/python -B -m unittest discover -s packages/vchart-statplots/skill-maintenance/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs packages/vchart-statplots/__tests__/runtime/skill-publication.test.cjs packages/vchart-statplots/skill-maintenance/tests/data-bindings.test.cjs
/tmp/vchart-dsv-220-validation/bin/python -B /Users/bytedance/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/data-science-visualization
```

从 `packages/vchart-statplots` 运行：

```sh
DSV_PYTHON=/tmp/vchart-dsv-220-validation/bin/python ./node_modules/.bin/playwright test --config __tests__/browser/playwright.config.ts skill-catalog.spec.ts skill-portable.spec.ts
```

浏览器报告：`.vchart-statplots/report/index.html`；截图：`.vchart-statplots/dsv/screenshots/`。测试工具本身使用仓库的 Node/Playwright 环境，生成后的使用包和 HTML 不依赖该环境。

本次没有创建 PR，未执行 VChart 全量视觉基线比较；本次测试范围是技能分发及发布 UMD 的渲染回归，不能替代提交 PR 前的全量视觉检查。
