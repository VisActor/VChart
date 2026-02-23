# VChart 仓库版本发布 Actions 技术文档

> **面向读者**：仓库维护者、版本发布执行者
> **最后更新日期**：2026-02-23

本文详细阐述 `VisActor/VChart` 仓库的自动化版本发布流程。该方案围绕 GitHub Actions 构建，旨在实现一个安全、可靠、事件驱动且高度自动化的 CI/CD 流程。

## 1. 背景与目标

旧有的发布流程存在若干痛点，促使我们进行本次重构：

- **竞态问题**：Changelog 生成与 GitHub Release 创建是并行的异步任务，经常导致站点更新时抓取到尚未完成或不完整的 Changelog 内容。
- **权限分散**：多个工作流（`pre-release.yml`, `hotfix.yml`）均需 npm 发布权限，违反了 npm OIDC (OpenID Connect) 要求的“单一可信发布入口”原则，增加了安全风险。
- **手动环节多**：Changelog 生成后需要人工修改，且多个环节依赖手动触发或校验，效率低下且易出错。

为解决上述问题，新方案（方案 A）确立了以下核心目标：

1.  **OIDC 单一入口**：将所有 npm 发布操作收敛到唯一的 `release.yml` 工作流中，并启用 `id-token: write` 权限，符合 npm 对可信发布者的最佳实践。
2.  **避免竞态**：将 Changelog 生成前置到发布流程的开端，确保后续所有环节（版本提交、npm 包、GitHub Release、站点更新）都使用同一份确定的日志内容，彻底消除数据不一致的风险。
3.  **事件驱动**：通过 `pull_request`、`push` 和 `repository_dispatch` 事件串联起整个发布链路，从代码合并到 Tag 创建，再到站点更新，全程自动化，减少人工干预。
4.  **原子提交**：在 `release.yml` 中，将 Changelog 生成、版本号更新、构建产物等变更在工作区内准备就绪后，于流程末端进行一次性的 `git commit` & `push`。这确保了只有在所有前置步骤（如构建、npm 发布）全部成功后，相关代码变更才会被推送到远程仓库，极大地降低了发布失败时引入脏数据的风险。

---

## 2. 分支策略与整体时序

新方案严格遵循 Git Flow 思想，为不同类型的发布活动定义了清晰的分支模型与生命周期。

### 分支角色

- `main`: 稳定的生产主干分支。所有正式发布的版本代码最终都会合并到此分支。`main` 分支的 HEAD 始终指向最新的正式发布版本。
- `develop`: 开发主干分支。所有新功能、修复和日常开发都在此分支上进行或合并到此分支。
- `release/*`: **正式发布分支**。例如 `release/2.10.0`。从 `develop` 分支切出，用于准备一个正式版本。在此分支上会执行版本号更新、Changelog 生成、构建和发布到 npm (打 `latest` 标签)。完成后，会创建一个指向 `main` 分支的 Pull Request。
- `pre-release/*`: **预发布分支**。例如 `pre-release/2.10.0-alpha.0`、`pre-release/2.10.0-rc.1`。用于发布非稳定的测试版本（如 alpha, beta, release candidate）。流程与 `release/*` 类似，但 npm 发布时会打上对应的 `alpha`, `beta`, `rc` 标签，并且**不会**创建指向 `main` 的 PR。
- `hotfix/*`: **热修复分支**。例如 `hotfix/2.9.1`。用于修复生产版本的紧急 Bug。流程与 `pre-release/*` 类似，npm 发布时会打 `hotfix` 标签，并且**不会**创建指向 `main` 的 PR。
- `sync/main-*`: **同步分支**。例如 `sync/main-2.10.0`。这是一个临时性的自动化分支，在 `release/*` 合并到 `main` 后，由 `sync-main-to-develop.yml` 自动创建，用于将 `main` 分支的最新代码同步回 `develop` 分支。

### 整体时序（以一次正式发布为例）

1.  **启动发布**：开发者从 `develop` 分支切出 `release/2.10.0` 分支，并将该分支推送到远程仓库。
2.  **核心发布流程 (`release.yml`)**：
    - 推送操作触发 `release.yml` 工作流。
    - 工作流自动生成 Changelog，更新版本号，执行构建，并将所有包发布到 npm（打 `latest` 标签）。
    - 所有操作成功后，将所有代码变更（版本、Changelog 等）进行一次原子 `commit & push`。
    - 自动创建一个从 `release/2.10.0` 指向 `main` 的 Pull Request。
3.  **合并到主干 (`main`)**：
    - 仓库维护者审查并合并该 PR 到 `main` 分支。
4.  **同步到开发分支 (`develop`)**：
    - PR 合并事件触发 `sync-main-to-develop.yml` 工作流。
    - 该工作流自动创建 `sync/main-2.10.0` 分支，并向 `develop` 分支发起一个 PR。
5.  **完成同步**：
    - 仓库维护者审查并合并同步 PR 到 `develop` 分支。
6.  **发送同步完成信号**：
    - 同步 PR 合并事件触发 `develop-synced-dispatch.yml` 工作流。
    - 该工作流向仓库发送一个 `repository_dispatch` 事件，类型为 `develop-synced`，并携带版本号 `2.10.0`。
7.  **创建 Git Tag 与 GitHub Release (`post-release.yml`)**：
    - `develop-synced` 事件触发 `post-release.yml` 工作流。
    - 该工作流读取 `develop` 分支上对应版本的 Changelog 内容。
    - 创建一个指向 `main` 分支 HEAD 的 Git Tag (`v2.10.0`)。
    - 创建一个正式的 GitHub Release，其内容就是刚读取的 Changelog。
8.  **触发站点更新**：
    - GitHub Release 的创建事件通过 Webhook 通知 `visactor_develop_server` 服务。
    - 该服务进一步触发 `chartspace-site` 站点的 `auto-release` 流程，完成文档和示例的更新。

这个时序确保了从代码到 npm 包，再到 GitHub Release 和最终站点的所有产物，都拥有一致且确定的版本信息和更新日志。

---

## 3. 工作流总览

新方案由四个核心的 GitHub Actions 工作流组成，它们通过事件驱动的方式协同工作。

| 工作流文件名                  | 触发事件                                                                     | 核心职责与产出                                                                                                                            | 关键权限与配置                       |
| ----------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `release.yml`                 | `push` 到 `release/*`、`pre-release/*`、`hotfix/*` 分支                      | **核心发布流程**：生成 Changelog、更新版本、构建、发布到 npm、创建指向 `main` 的 PR。是**唯一的 npm 发布入口**。                          | `id-token: write`, `contents: write` |
| `sync-main-to-develop.yml`    | `pull_request` (closed & merged) 到 `main` 分支，且源分支为 `release/*`      | **同步主干到开发**：当 `release` PR 合并后，创建 `sync/main-*` 分支并向 `develop` 提交 PR，确保 `develop` 分支包含已发布的生产代码。      | `contents: write`                    |
| `develop-synced-dispatch.yml` | `pull_request` (closed & merged) 到 `develop` 分支，且源分支为 `sync/main-*` | **发送同步完成信号**：当同步 PR 合并后，发送一个 `repository_dispatch` 事件 (`type: develop-synced`)，通知下游流程 `develop` 分支已就绪。 | `contents: read`                     |
| `post-release.yml`            | `repository_dispatch` (type: `develop-synced`)                               | **创建最终产物**：接收到同步完成信号后，读取 `develop` 分支的 Changelog，创建 Git Tag 和正式的 GitHub Release（指向 `main` 的 HEAD）。    | `contents: write`                    |

---

## 4. `release.yml` 详解（单一 OIDC 发布入口）

`release.yml` 是整个发布流程的核心，它整合了 Changelog 生成、版本更新、构建和 npm 发布等关键步骤，并作为唯一的 OIDC 发布入口。

### 4.1 触发规则与分支约定

工作流由 `push` 事件触发，并严格匹配以下分支命名模式：

- `release/[0-9]+\.[0-9]+\.[0-9]+` (e.g., `release/2.10.0`)
- `hotfix/[0-9]+\.[0-9]+\.[0-9]+` (e.g., `hotfix/2.9.1`)
- `pre-release/[0-9]+\.[0-9]+\.[0-9]+-(alpha|beta|rc|hotfix)\.[0-9]+` (e.g., `pre-release/2.10.0-alpha.0`)

这种约定使得工作流能从分支名中直接解析出版本号和发布类型，从而决定 npm `dist-tag`（`latest`, `hotfix`, `alpha`, `rc` 等）以及是否创建 PR。

### 4.2 Permissions 与 npm Provenance

```yaml
permissions:
  id-token: write
  contents: write
  pull-requests: write
```

- `id-token: write`: 这是启用 npm OIDC 身份验证的关键。它允许 GitHub Actions 向 npm Registry 请求一个短期的身份令牌，用于证明本次发布是由 `VisActor/VChart` 仓库的这个特定工作流触发的。这避免了在 Secrets 中存储永久的 `NPM_TOKEN`，极大地提升了安全性。
- `contents: write`: 允许工作流向仓库推送代码（如 `commit & push` 变更）和创建 PR。

### 4.3 主要步骤分解

1.  **拉取代码与环境设置**：检出对应分支的代码，并安装 Node.js, pnpm, Rush 等必要工具。
2.  **校验与解析版本**：根据分支名，校验版本格式是否合规。
3.  **收集 Rush Changefiles**：执行脚本，遍历 `common/changes/@visactor/vchart/` 目录，收集所有 `.json` 格式的 changefile。这些文件是生成 Changelog 的唯一事实来源。
4.  **调用纯生成 API 生成 Changelog**：
    - 将收集到的 changefiles 内容、版本号、上个版本的 Tag 等信息作为请求体。
    - `POST` 请求发送至 `https://vmind.visactor.com/api/changelog/vchart/generate`。
    - 该服务是一个**纯函数**，只负责根据输入生成格式化的 Markdown 文本，**不执行任何 Git 操作**。
    - API 返回包含 `en`, `zh`, `harmony` 三个语言版本的 Changelog 文本块。
5.  **写入 Changelog 文件**：
    - 将 API 返回的英文和中文 Changelog 内容，通过 `prepend` (前插) 方式写入 `docs/assets/changelog/en/release.md` 和 `docs/assets/changelog/zh/release.md` 的文件开头。
    - 将 `harmony` 的内容 `prepend` 到 `packages/harmony_vchart/library/CHANGELOG.md`。
6.  **版本号更新**：执行 `rush version` 和 `apply-release-version.js` 等脚本，将 `package.json` 中的版本号更新到目标版本。
7.  **构建项目**：执行 `rush build`，编译所有需要发布的包。
8.  **npm 发布**：
    - 执行 `rush publish` 命令。
    - 根据分支类型，自动附加不同的 npm `dist-tag`：
      - `release/*` -> `--tag latest`
      - `pre-release/*` (rc) -> `--tag rc`
      - `pre-release/*` (beta) -> `--tag beta`
      - `pre-release/*` (alpha) -> `--tag alpha`
      - `hotfix/*` -> `--tag hotfix`
9.  **原子 Commit & Push**：
    - **这是保障流程原子性的关键一步**。
    - 在前面所有步骤（Changelog 生成、版本更新、构建、npm 发布）都成功完成后，工作流会检查工作区的文件变更。
    - 如果有变更，则执行一次 `git add .`, `git commit`, `git push`，将所有改动作为一个原子提交推送到远程的发布分支上。
    - 如果中途任何一步失败，这些变更都不会被推送，避免了“发布未成功但日志已更新”的脏数据状态。
10. **创建 Pull Request**：
    - 仅当发布分支是 `release/*` 类型时，工作流会自动创建一个从当前 `release/*` 分支指向 `main` 分支的 PR，等待维护者审查合并。

### 4.4 关键环境变量与密钥

- `VCHART_CHANGELOG_API_URL`: Changelog 纯生成服务的 API Endpoint。
- `CHANGEFILES_SERVICE_TOKEN`: 调用上述 API 所需的 `Bearer` 令牌，用于服务端的鉴权。
- **无需 `NPM_TOKEN`**: OIDC 机制通过 GitHub 与 npm 之间的信任关系自动完成认证，不再需要在仓库 Secrets 中配置静态的 `NPM_TOKEN`。

### 4.5 失败处理与幂等

- **失败阻断**：由于采用了“原子提交”策略，任何在 `git push` 之前的步骤失败，都会导致整个工作流中止，并且不会有任何变更被推送到远程仓库。发布者可以修复问题后，在本地 `rebase` 并强制推送 (`--force-with-lease`) 到发布分支，重新触发流程。
- **重试**：可以直接在 GitHub Actions 界面上重跑失败的 Job。因为 `rush publish` 会自动跳过已发布的版本，所以重试是安全的。Changelog 生成和文件写入也是可覆盖的。
- **PR 幂等**：创建 PR 的步骤会先检查是否已存在从同一源分支到 `main` 的开放 PR，如果存在则跳过，避免重复创建。

---

## 5. `sync-main-to-develop.yml` 详解

这个工作流的职责非常专一：在正式版本 (`release/*`) 合并到 `main` 分支后，自动将 `main` 的代码同步回 `develop` 分支。

### 5.1 触发条件

```yaml
on:
  pull_request:
    types: [closed]
    branches:
      - main
```

工作流会在任何指向 `main` 分支的 PR 被关闭时触发。但内部逻辑会进一步筛选：

```yaml
if: github.event.pull_request.merged == true && startsWith(github.event.pull_request.head.ref, 'release/')
```

只有当 PR 是**合并成功** (`merged == true`)，并且其源分支是以 `release/` 开头时，流程才会继续执行。这确保了只有正式版本发布才会触发同步。

### 5.2 行为

1.  **检出 `main` 分支**：获取最新的 `main` 分支代码。
2.  **读取版本号**：从 `packages/vchart/package.json` 中读取刚刚发布的版本号 (e.g., `2.10.0`)。
3.  **创建同步分支**：基于 `main` 分支的最新 HEAD，创建一个名为 `sync/main-2.10.0` 的新分支。
4.  **推送同步分支**：将 `sync/main-2.10.0` 分支推送到远程仓库。
5.  **创建 Pull Request**：自动创建一个从 `sync/main-2.10.0` 指向 `develop` 分支的 PR。这个 PR 的目的就是将生产代码安全地同步回开发主干。

---

## 6. `develop-synced-dispatch.yml` 详解

此工作流扮演“信号员”的角色。当 `main` 到 `develop` 的同步 PR 被合并后，它会发出一个明确的信号，通知下游流程 `develop` 分支已经就绪。

### 6.1 触发条件

```yaml
on:
  pull_request:
    types: [closed]
    branches:
      - develop
```

工作流会在任何指向 `develop` 分支的 PR 被关闭时触发。内部逻辑同样会做筛选：

```yaml
if: github.event.pull_request.merged == true && startsWith(github.event.pull_request.head.ref, 'sync/main-')
```

只有当 PR 是**合并成功**，并且源分支是以 `sync/main-` 开头时，流程才会执行。

### 6.2 行为

1.  **解析版本号**：从 PR 的源分支名（如 `sync/main-2.10.0`）中提取出版本号 `2.10.0`。
2.  **发送 `repository_dispatch` 事件**：
    - 调用 GitHub API，向仓库自身发送一个自定义事件。
    - `event_type`: `develop-synced`
    - `client_payload`: `{ "version": "2.10.0" }`
    - 这个事件广播了一个消息：“版本 `2.10.0` 的代码已经完全同步到 `develop` 分支了。”

---

## 7. `post-release.yml` 详解

这是发布流程的最后一环自动化，负责创建最终对用户可见的 Git Tag 和 GitHub Release。

### 7.1 触发条件

```yaml
on:
  repository_dispatch:
    types: [develop-synced]
```

工作流由 `repository_dispatch` 事件触发，并且只响应 `type` 为 `develop-synced` 的事件。这确保了它只在 `develop` 分支确认同步完成后才执行。

### 7.2 行为

1.  **读取版本号**：从事件的 `client_payload.version` 中获取需要处理的版本号。
2.  **幂等性检查**：
    - 通过 `git tag` 和 `gh release view` 命令，检查版本对应的 Git Tag (e.g., `v2.10.0`) 或 GitHub Release 是否已经存在。
    - 如果**任意一个已存在**，工作流会直接跳过后续步骤，防止重复创建。
3.  **读取 `develop` 分支的 Changelog**：
    - 工作流会直接从**远程 `develop` 分支**上拉取 `docs/assets/changelog/en/release.md` 文件的内容。
    - 使用脚本在文件中查找对应版本的 Markdown 段落 (从 `## v2.10.0` 开始，到下一个版本标题或文件结尾结束)。
4.  **创建 Git Tag**：
    - 获取 `main` 分支的最新 commit SHA。
    - 执行 `git tag v2.10.0 <main_commit_sha>`，创建一个**指向 `main` 分支 HEAD** 的 annotated tag。
    - 将该 tag 推送到远程仓库。
5.  **创建 GitHub Release**：
    - 使用 `gh release create` 命令创建一个新的 GitHub Release。
    - `tag`: `v2.10.0`
    - `target`: `main`
    - `title`: `v2.10.0`
    - `notes`: 从 `develop` 分支读取并解析出的 Changelog 内容。

至此，一个包含准确代码、Changelog 和版本信息的 GitHub Release 正式完成。

---

## 8. Webhook 服务契约（纯生成 API）

为了解耦 Changelog 的生成逻辑与 Git 操作，我们提供了一个纯内容生成的 Webhook 服务。GitHub Actions 只负责调用此服务获取文本，然后自行完成文件写入和提交。

- **Endpoint**: `POST https://vmind.visactor.com/api/changelog/vchart/generate`
- **鉴权方式**: `Authorization: Bearer <TOKEN>`
  - Token 通过仓库的 `CHANGEFILES_SERVICE_TOKEN` Secret 提供。

- **请求体 (Request Body) 示例**:

  ```json
  {
    "version": "2.10.0",
    "prevVersion": "2.9.5",
    "date": "2026-02-23",
    "changefiles": [
      {
        "changes": [
          {
            "packageName": "@visactor/vchart",
            "comment": "feat: support awesome new feature",
            "type": "minor"
          }
        ],
        "packageName": "@visactor/vchart",
        "email": "developer@example.com"
      },
      {
        "changes": [
          {
            "packageName": "@visactor/vchart",
            "comment": "fix: resolve critical bug in rendering",
            "type": "patch"
          }
        ],
        "packageName": "@visactor/vchart",
        "email": "developer@example.com"
      }
    ],
    "langs": ["en", "zh"],
    "reuseHarmonyFromEn": true
  }
  ```

- **响应体 (Response Body) 示例**:

  ```json
  {
    "traceId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "version": "2.10.0",
    "blocks": {
      "en": "# v2.10.0\n\n2026-02-23\n\n**🆕 New Features**\n\n- **@visactor/vchart**: feat: support awesome new feature\n\n**🐛 Bug Fixes**\n\n- **@visactor/vchart**: fix: resolve critical bug in rendering\n\n**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.9.5...v2.10.0\n\n[more detail about v2.10.0](https://github.com/VisActor/VChart/releases/tag/v2.10.0)",
      "zh": "# v2.10.0\n\n2026-02-23\n\n**🆕 新增功能**\n\n- **@visactor/vchart**: feat: 支持超棒的新功能\n\n**🐛 问题修复**\n\n- **@visactor/vchart**: fix: 修复渲染中的关键错误\n\n**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.9.5...v2.10.0\n\n[更多 v2.10.0 的细节](https://github.com/VisActor/VChart/releases/tag/v2.10.0)"
    },
    "harmony": "# v2.10.0\n\n2026-02-23\n\n**🆕 New Features**\n\n- **@visactor/vchart**: feat: support awesome new feature\n\n**🐛 Bug Fixes**\n\n- **@visactor/vchart**: fix: resolve critical bug in rendering\n\n**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.9.5...v2.10.0\n\n[more detail about v2.10.0](https://github.com/VisActor/VChart/releases/tag/v2.10.0)"
  }
  ```

- **错误码与重试**:
  - `400 Bad Request`: 请求体格式错误或缺少必要字段。
  - `401 Unauthorized`: `Authorization` 头缺失或 Token 无效。
  - `500 Internal Server Error`: 服务端内部错误。
  - **重试策略**: `release.yml` 内置了简单的回退机制。如果 API 调用失败，工作流会使用一个本地的、带 `TODO` 标记的模板来填充 Changelog，以保证发布流程能继续进行，但会明确提示需要手动补充日志。

---

## 9. 与站点 `chartspace-site` 的联动说明

站点的更新流程由 `visactor_develop_server` 服务在接收到 GitHub Release 事件后触发。

1.  **触发点**: `post-release.yml` 成功创建并发布一个 GitHub Release。
2.  **Webhook 通知**: GitHub 向 `visactor_develop_server` 配置的 Webhook Endpoint 发送一个 `release` 事件，`action` 为 `published`。
3.  **服务处理**: `visactor_develop_server` 接收到事件后，会解析出版本号，并触发 `chartspace-site` 仓库的 `auto-release` 工作流（通常是 Codebase Pipeline）。
4.  **站点发布三步曲**:
    1.  **分支与版本更新**:
        - `auto-release` 流程首先从 `4.x` 分支（站点主干）切出一个新的发布分支。
        - 更新 `package.json` 中对 `@visactor/vchart` 及相关依赖（`@visactor/vrender`, `@visactor/vgrammar` 等）的版本号至最新发布版本。
    2.  **文档 `repoConfig` 更新**:
        - 修改 `docs/repoConfig.json` 文件，将 VChart 仓库对应的文档版本和分支更新到最新。
    3.  **同步与构建文档**:
        - 执行 `pnpm sync_documents --repo=vchart` 命令，从 VChart 仓库拉取最新的文档内容。
        - 执行 `pnpm build_documents --repo=vchart` 命令，编译生成静态文档页面。
    4.  **合并到 `4.x` 分支**:
        - 提交所有变更，并创建一个指向 `4.x` 分支的 Merge Request。
        - MR 合并后，站点的 CI/CD 会将更新部署到生产环境。

---

## 10. 权限与配置清单

要使整套流程正常工作，需要确保以下权限和配置已正确设置：

1.  **GitHub Actions Permissions**:
    - `release.yml`: `id-token: write`, `contents: write`, `pull-requests: write`
    - `sync-main-to-develop.yml`: `contents: write`
    - `develop-synced-dispatch.yml`: 默认 `contents: read` 权限即可触发 `dispatch`
    - `post-release.yml`: `contents: write`

2.  **GitHub Repository Secrets**:
    - `VCHART_CHANGELOG_API_URL`: 纯生成 API 的地址，应设为 `https://vmind.visactor.com/api/changelog/vchart/generate`。
    - `CHANGEFILES_SERVICE_TOKEN`: 调用 API 所需的 Bearer Token。

3.  **GitHub Repository Settings**:
    - **Actions > General**: 确保 Actions 已启用，并且根据需要配置 `Workflow permissions` (建议设为 `Read and write permissions` 以允许创建 PR 和推送 Tag)。
    - **Webhooks**:
      - 配置一个指向 `visactor_develop_server` 服务的 Webhook。
      - `Payload URL`: `visactor_develop_server` 提供的接收地址。
      - `Content type`: `application/json`。
      - `Secret`: 配置一个强密钥，并将其同样配置在 `visactor_develop_server` 服务端，用于校验请求来源。
      - **Events**: 勾选 `Releases` 事件。

---

## 11. 测试与演练方案（不污染 `latest`）

为了安全地测试和验证整个流程，强烈建议采用分阶段、非破坏性的演练方案。

1.  **使用 `pre-release/*` 分支进行端到端测试**:
    - **优点**: 这是最接近真实发布流程的测试方式，可以覆盖从 Changelog 生成到 npm 发布的完整链路，但不会影响 `latest` 标签。
    - **步骤**:
      1.  从 `develop` 切出一个预发布分支，例如 `pre-release/2.99.0-alpha.0`。
      2.  在该分支下添加一些测试用的 `changefiles`。
      3.  `git push` 该分支，触发 `release.yml`。
      4.  **观察 `release.yml`**:
          - 确认 Changelog 是否正确生成并写入文件。
          - 确认版本号是否正确更新为 `2.99.0-alpha.0`。
          - 确认 `rush publish` 是否成功，并且在 npm 上该包被打上了 `alpha` 标签。
          - 确认**没有**创建指向 `main` 的 PR。
    - **结论**: 此方案可以安全地验证 `release.yml` 的核心功能，尤其是 OIDC 发布和 `dist-tag` 逻辑。

2.  **使用 `--dry-run` 标志进行模拟发布**:
    - **优点**: 可以在不实际发布任何 npm 包的情况下，模拟 `rush publish` 的行为。
    - **步骤**:
      1.  临时修改 `release.yml` 中 `rush publish` 命令，追加 `--dry-run` 参数。
      2.  使用 `release/2.99.1` 这样的测试分支触发流程。
      3.  观察 Actions 日志，查看 `dry-run` 输出，确认哪些包将以哪个版本被发布。
      4.  **注意**: 此方法无法验证 OIDC 令牌的有效性，主要用于检查发布范围和版本。

3.  **分步演练完整链路 (推荐)**:
    1.  **第一步：验证 `release.yml` (不合并)**
        - 推送一个测试用的 `release/2.99.2` 分支。
        - 观察 `release.yml` 是否成功执行到“创建 PR”这一步。
        - 检查 PR 中的文件变更，确认 Changelog 和版本号都正确。**此时不要合并 PR**。
    2.  **第二步：手动模拟后续流程**
        - 手动从 `main` 创建 `sync/main-2.99.2` 分支并提 PR 到 `develop`。
        - 合并该 PR 后，手动触发 `post-release.yml` (可临时改为 `workflow_dispatch` 触发)，并传入版本号。
        - 观察 `post-release.yml` 是否能正确创建 Tag 和 Release。
    3.  **清理**: 测试完成后，删除测试分支、PR、Tag 和 Release。

---

## 12. 回滚与应急

尽管新流程设计了多重保障，但仍需准备应急预案。

- **撤销 Tag/Release**: 如果发布的 Tag 或 Release 有问题（例如，指向了错误的 commit），可以：
  1.  在 GitHub 界面上删除有问题的 Release。
  2.  在本地执行 `git tag -d v2.10.0` 删除本地 Tag。
  3.  执行 `git push --delete origin v2.10.0` 删除远程 Tag。
  - **风险**: 如果已有用户拉取了错误的 Tag，可能会造成困惑。删除操作应谨慎，并及时通知社区。

- **废弃 npm 包**: 如果发布的 npm 包存在严重 Bug，应立即废弃：
  - 执行 `npm deprecate @visactor/vchart@"<version>" "<message>"`。
  - Message 中应清楚说明废弃原因和建议使用的版本。
  - 废弃操作不会删除包，但会在用户安装时显示警告。
  - **注意**: 根据 npm 策略，发布 72 小时后可能无法彻底取消发布。

- **回滚 Commit**: 如果合并到 `main` 或 `develop` 的代码有严重问题，标准的回滚操作是：
  - 使用 `git revert <commit-hash>` 创建一个新的 commit，该 commit 的内容是撤销目标 commit 的变更。
  - 将 revert commit 推送到对应分支。
  - **不推荐**使用 `git reset --hard` 并强制推送，因为这会重写历史，对协作者非常不友好。

---

## 13. 附录

### 分支命名规范

- **正式发布**: `release/MAJOR.MINOR.PATCH` (e.g., `release/2.10.0`)
- **热修复**: `hotfix/MAJOR.MINOR.PATCH` (e.g., `hotfix/2.9.1`)
- **预发布**:
  - `pre-release/MAJOR.MINOR.PATCH-alpha.ITERATION` (e.g., `pre-release/2.10.0-alpha.0`)
  - `pre-release/MAJOR.MINOR.PATCH-beta.ITERATION` (e.g., `pre-release/2.10.0-beta.1`)
  - `pre-release/MAJOR.MINOR.PATCH-rc.ITERATION` (e.g., `pre-release/2.10.0-rc.0`)

### YAML 关键片段示例

**`release.yml`: 触发条件**

```yaml
on:
  push:
    branches:
      - 'release/[0-9]+\.[0-9]+\.[0-9]+'
      - 'pre-release/[0-9]+\.[0-9]+\.[0-9]+-alpha\.[0-9]+'
      # ... etc.
```

**`release.yml`: OIDC 权限**

```yaml
permissions:
  id-token: write
  contents: write
```

**`release.yml`: 条件化 npm 发布**

```yaml
- name: Publish to npm
  if: startsWith(github.ref_name, 'release/')
  run: node common/scripts/install-run-rush.js publish --publish --include-all --tag latest

- name: Publish pre-release to npm
  if: startsWith(github.ref_name, 'pre-release/') && contains(github.ref_name, '-rc.')
  run: node common/scripts/install-run-rush.js publish --publish --include-all --tag rc
```

**`post-release.yml`: `repository_dispatch` 触发**

```yaml
on:
  repository_dispatch:
    types: [develop-synced]
```

---

## 快速检查清单

在执行一次正式发布前，请使用此清单进行快速检查：

- [ ] `develop` 分支是否已包含所有计划在此次版本中发布的功能和修复？
- [ ] 是否已从 `develop` 分支切出了格式正确的 `release/x.y.z` 分支？
- [ ] `common/changes/@visactor/vchart/` 目录下是否包含了本次发布的所有变更对应的 `changefile`？
- [ ] 仓库 Secrets (`VCHART_CHANGELOG_API_URL`, `CHANGEFILES_SERVICE_TOKEN`) 是否已正确配置且有效？
- [ ] `visactor_develop_server` 服务是否正常运行，并且 Webhook 配置正确？
- [ ] （首次执行）是否已进行过一次 `pre-release` 分支的端到端演练？

完成以上检查后，即可 `git push` 你的 `release/x.y.z` 分支，启动自动化发布流程。
