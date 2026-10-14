# VChart Skill 教程图片修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 issue #4700，使《VChart Skill 使用》中英文教程的 5 张图片可显示，且图片访问不再依赖到期签名。

**Architecture:** 从教程原始参考文章恢复同一资源 ID 的 5 张 WebP 图片，保存到 `docs/public/vchart/guide/skill-usage/`。中英文 Markdown 共用 `/vchart/guide/skill-usage/` 下的静态资源，沿用其他教程已有的资源发布方式。

**Tech Stack:** Markdown、WebP、现有 Vite 文档预览、Python 3 一次性资源检查、Node.js 22、现有视觉测试工具。

## Global Constraints

- 当前项目文档优先使用中文编写。
- 使用 Node.js 22。
- 每次提交 PR 前运行全量：`node packages/vchart/scripts/visual-test.mjs`。
- 视觉差异需要审查和说明，执行错误必须解决；无法运行时如实记录，不得写成通过，不跳过用例或放宽阈值。
- 修复范围为 5 张图片及中英文 10 处引用；不调整教程正文、导航、渲染器、依赖或其他历史图床引用。
- 使用原文同一资源 ID 的图片；保留原始 WebP 字节，不改水印、不重绘、不做无必要的格式转换。
- 不新增永久下载器、运行时代理、失效回退逻辑或图片 CI 检查。临时签名链接防再发检查作为独立后续任务。
- 执行清单在当前会话逐项完成即可；本计划不要求启动额外 agent。

---

## 已验证事实与来源

- Issue：https://github.com/VisActor/VChart/issues/4700
- 原文：https://juejin.cn/post/7605535884939526195
- 原文来源记录：`specs/001-vchart-skill-tutorial/spec.md:6`。
- 中文教程 5 张图片目前返回 `403 text/html`；首图普通 GET 携带官网 Referer 复查仍为 403。
- 链接 `x-expires=1773307752` 对应北京时间 2026-03-12 17:29:12，已经过期；通用 403 响应不足以证明唯一拒绝原因。
- 2026-10-14 从原文获取了同资源 ID 的最新地址，5 个地址均返回 `206 image/webp`，响应前缀符合 WebP 文件头。这是部分响应验证，执行时仍需下载完整文件并验证解码。
- 静态资源先例：`docs/assets/guide/zh/tutorial_docs/Self-adaption/Media_Query.md:24` 引用 `/vchart/guide/media-query/0.png`，对应文件位于 `docs/public/vchart/guide/media-query/0.png`，线上抽查成功返回图片。
- 其他文档同时使用 CMS 图床及 jsDelivr；本次使用仓库静态资源，不依赖另行申请图床上传能力。
- 当前默认 Node 为 24.19.0，已安装 Node 22.23.3；执行文档启动及视觉测试前运行 `nvm use 22`。

## 文件范围及资源映射

| 原资源 ID | 用途 | 新文件（相对于仓库根目录） | 中文原行号 | 英文原行号 |
|---|---|---|---:|---:|
| `030e176313614ac087853aca647b55df` | 安装示意 | `docs/public/vchart/guide/skill-usage/installation.webp` | 36 | 24 |
| `e3cd80683fb34e21a02d371b1bc360c9` | skills 目录 | `docs/public/vchart/guide/skill-usage/directory.webp` | 47 | 33 |
| `fc55630c49a94d84bd3d7e3a5ca59da1` | 生成图表 | `docs/public/vchart/guide/skill-usage/generate-chart.webp` | 64 | 50 |
| `3cec7ac8dc11486ca9a61eb157ac478d` | 调整样式 | `docs/public/vchart/guide/skill-usage/style-chart.webp` | 81 | 65 |
| `bb4911d4db814a7ca3b777f7549cf69e` | 修复配置 | `docs/public/vchart/guide/skill-usage/fix-config.webp` | 98 | 80 |

修改文件：

- `docs/assets/guide/zh/tutorial_docs/VChart_Skill_Usage.md`
- `docs/assets/guide/en/tutorial_docs/VChart_Skill_Usage.md`

计划文件：`docs/superpowers/plans/2026-10-14-fix-skill-tutorial-images.md`。

## Task 1：恢复图片并同步替换中英文引用

**输入：** 原文页面及上表中的 5 个资源 ID。

**输出：** 5 个可解码的本地 WebP 文件，中英文教程各 5 处静态引用。

- [x] 请求原文完整 HTML，按上表资源 ID 提取当前图片地址。HTML 的 `&amp;`、`&#x26;` 以及内嵌数据的 `\u002F`、`\u0026` 需要按其编码恢复；不猜测 CDN 地址、不修改旧签名参数。
- [x] 使用普通 GET 下载完整图片，仅在需要时使用原文 Referer。确认响应是图片内容，检查 WebP 文件头和完整文件解码；拒绝把 HTML 错误页保存成图片。
- [x] 依次查看 5 张原图，确认内容与安装、目录、生成图表、调整样式、修复配置的语义对应，再按映射表保存。记录各文件字节数、像素尺寸和 SHA-256 到修复验证记录或 PR 描述。
- [x] 更新中文和英文的图片 URL，保留各自现有 alt 文本及其余正文。以第一张图为例：

```markdown
![vchart-skill 安装示意](/vchart/guide/skill-usage/installation.webp)
![vchart-skill installation preview](/vchart/guide/skill-usage/installation.webp)
```

- [x] 从仓库根目录执行以下一次性检查。输出应为 `PASS: 5 个静态图片、10 处双语引用`；该脚本不加入项目测试体系。

```sh
python3 - <<'PY'
from pathlib import Path
import re

names = ['installation', 'directory', 'generate-chart', 'style-chart', 'fix-config']
expected = [f'/vchart/guide/skill-usage/{name}.webp' for name in names]
for language in ('zh', 'en'):
    doc = Path(f'docs/assets/guide/{language}/tutorial_docs/VChart_Skill_Usage.md')
    text = doc.read_text()
    actual = re.findall(r'!\[[^\]]*\]\(([^)]+)\)', text)
    assert actual == expected, (str(doc), actual)
    assert 'x-expires=' not in text and 'x-signature=' not in text, str(doc)
for url in expected:
    asset = Path('docs/public') / url.lstrip('/')
    data = asset.read_bytes()
    assert data[:4] == b'RIFF' and data[8:12] == b'WEBP', str(asset)
    assert int.from_bytes(data[4:8], 'little') + 8 == len(data), str(asset)
print('PASS: 5 个静态图片、10 处双语引用')
PY
git diff --check
git diff -- docs/assets/guide/zh/tutorial_docs/VChart_Skill_Usage.md docs/assets/guide/en/tutorial_docs/VChart_Skill_Usage.md
```

此检查验证引用一致、文件存在及容器长度；完整解码由 Task 2 的浏览器检查负责。

## Task 2：验证本地文档显示及 PR 前工程检查

**输入：** Task 1 的图片文件和双语文档。

**输出：** 本地页面验收记录；如创建 PR，附全量视觉测试报告结论。

- [x] 从仓库根目录执行环境和文档预览命令：

```sh
nvm use 22
node --version
node common/scripts/install-run-rush.js docs
```

预期 Node 输出 `v22.x`。文档启动方式来自 `docs/README.zh-CN.md`；Vite 默认端口为 3020，以实际终端输出的地址为准。已安装依赖时不重复安装；若依赖缺失，按视觉测试 README 和项目贡献指南准备环境。

- [x] 打开本地 `/vchart/guide/tutorial_docs/VChart_Skill_Usage`，确认中文教程 5 张图位置、内容与显示比例正确，无空白、截断、404 或错误页。
- [x] 使用文档站现有语言切换入口检查英文教程；确认仍加载相同的 5 个静态资源，英文 alt 文本保留。
- [x] 在两个页面分别执行以下浏览器检查，确保 5 张图完成实际解码且不存在临时签名 URL：

```javascript
const images = [...document.images].filter(image =>
  new URL(image.src).pathname.startsWith('/vchart/guide/skill-usage/')
);
if (images.length !== 5) throw new Error(`图片数量错误：${images.length}`);
await Promise.all(images.map(async image => {
  await image.decode();
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    throw new Error(`图片尺寸无效：${image.src}`);
  }
  if (new URL(image.src).search) throw new Error(`图片仍带查询参数：${image.src}`);
}));
console.log('PASS: 5 张图片均完成解码');
```

- [x] 审查 `git status --short` 和指定文件 diff，确认仅有计划、5 张图片及 2 篇文档的预期改动。此修复不涉及图表源码，不新增模拟图片请求的单元测试或与此无关的图表视觉用例。
- [x] 如进入 PR 提交流程，按照 AGENTS.md 在仓库根目录执行全量视觉基线比较：

```sh
nvm use 22
node packages/vchart/scripts/visual-test.mjs --check
node packages/vchart/scripts/visual-test.mjs
```

阅读命令输出的 `agent-summary.md` 和三图 HTML；执行错误需解决，差异需审查说明。无法运行时记录真实阻断，不将 `--self-compare` 当成官方 develop 基线比较。图表视觉测试是仓库 PR 门禁，不能替代上面的文档页面验收。

## Task 3：发布后验收

**输入：** 已完成的修复以及文档站现有发布流程。

**输出：** 线上中文、英文教程与 5 个资源的验收记录。

- [ ] 由现有文档站流程发布资源与 Markdown。仓库当前未定位到官网完整部署配置，不臆造发布命令；合并代码不能直接视为线上修复完成。
- [ ] 文档发布完成后，在 `https://visactor.com/vchart/guide/tutorial_docs/VChart_Skill_Usage` 及官网英文入口，重复 Task 2 的显示与解码检查。
- [ ] 逐个检查 `/vchart/guide/skill-usage/` 下 5 个文件：普通 GET 返回图片内容且浏览器可解码，无登录要求或到期参数。若页面仍输出旧 URL，核对实际发布版本及缓存状态后再复验。
- [ ] 修复报告分别说明本地修复、PR 检查、线上验收的实际状态；线上未发布时明确标记“待文档站发布验收”。

## 完成标准与异常处理

- 本地修复完成：5 张同源原图可解码，中英文 10 处引用一致，2 个页面各显示 5 张正确图片，修改范围符合计划。
- PR 就绪：上述检查完成，并满足仓库全量视觉测试要求；提交内容不包含临时下载缓存或其他任务文件。
- 线上问题关闭条件：文档站发布后中英文图像显示及资源访问均验收通过。
- 原文地址再次到期时：重新读取原文获取当前地址；若无法恢复，记录未恢复的资源 ID，再向原作者索取对应文件，不能以占位图宣称修复完成。
- 静态资源尚未发布时：保留已完成的本地修复，报告发布状态；不改回临时签名链接。
- 防再发建议单独立项：在文档提交检查中禁止新增临时签名图片引用，并校验项目静态资源存在，不在此次小范围修复中引入全站网络扫描。


## 执行结果（2026-10-14）

- 已恢复 5 张原文图片，原始 WebP 字节保留，总计 255,670 字节（约 249.7 KiB）。已查看全部图片并核对用途。
- 已同步替换中英文 10 处引用；正文与 alt 文本保持原样。
- 一次性资源存在、引用一致、WebP 容器长度检查通过；`git diff --check` 通过。
- 本地中文和英文教程各 5 张图片通过浏览器完整解码，真实语言切换有效，图片边界位于内容区域内，无页面异常或失败的本站资源请求。
- 5 个静态资源的普通 GET 均返回 `200 image/webp`，响应 SHA-256 与下载原文件一致。
- 文档预览限制：默认 `rush docs` 启动后出现已有包子路径别名错误（`index.ts/esm/...`），直接访问页面为空白。为了检查真实 React 文档页面，在系统临时目录使用基于原配置的预览配置，将包别名限定为精确匹配，并将依赖扫描入口限定为 `index.html`（避免扫描未安装构建产物的主题 demo）。以 Node.js 22.23.3 启动该配置完成页面验收。正式 `docs/vite.config.js`、依赖及页面源码未修改；默认预览命令不能记录为通过。
- 全量视觉测试预检通过：Playwright 1.63.0，266 个登记用例。官方 develop 基线 `704033074a29a77ac90ed7c045d4b108af36ef05` 与当前工作区完整比较通过：266 passed、0 diff、0 error、0 not_run，退出码 0，总耗时约 459 秒。已审阅 `agent-summary.md` 和 `summary.json`，无运行或清理错误。报告位于 `.vchart-visual/runs/1791949395332-54092fff/index.html`。
- 官网未发布，线上中英文页面验收待文档站发布后执行。

### 图片元数据

| 文件名 | 字节数 | 原图尺寸 | SHA-256 |
|---|---:|---|---|
| `installation.webp` | 61,056 | 1002 × 1722 | `68b85d5018fd22a256b1103a734a6a928ed131ce638469e1ca1378ba7f24690e` |
| `directory.webp` | 10,632 | 850 × 280 | `096f82ae1645c11f7244c929a996796db032b559fdcad80cadc41094010ab43c` |
| `generate-chart.webp` | 54,074 | 2178 × 1454 | `c23b892e6e00375c1c9463c79b1de664e127ab70e8a37d44e48335f8c3676f19` |
| `style-chart.webp` | 74,510 | 2170 × 1348 | `3120f0dd34cfe417044aaaf9e43b18f23d0c3c4bf902f32dcb3b23d7d14d7978` |
| `fix-config.webp` | 55,398 | 2168 × 908 | `9f7acc922726eef88e83646f83305977fa1fd47547a9594a05c1d1b1b4a69d16` |

- 本地修复与验证已完成，提交与 PR 创建按用户后续请求推进；官网仍待文档站发布验收。两个本次启动的文档预览服务已停止，视觉测试临时 worktree 已由工具清理。
