# GitHub CLI (gh) 核心指南

GitHub CLI (`gh`) 是与 GitHub 交互（尤其是创建 Pull Request）的唯一支持方式。`pr-create-from-body` 技能仅通过 `gh` 来创建 PR。

## 安装与登录

1.  **安装**:

    - **macOS**: `brew install gh`
    - **Windows**: `winget install GitHub.cli` 或 `choco install gh`
    - **Linux (Debian/Ubuntu)**: `sudo apt update && sudo apt install gh`
    - **Linux (RHEL/CentOS/Fedora)**: `sudo dnf install gh` 或 `sudo yum install gh`
    - 安装后可用 `which gh` 或 `gh --version` 验证是否在 `PATH` 中

2.  **登录**:

    - 在终端运行：`gh auth login`
    - 交互式选择：`GitHub.com` → `HTTPS` → `Login with a web browser`
    - 浏览器授权完成后，本地凭证自动保存（支持 2FA）
    - 验证登录状态：`gh auth status`，必要时刷新权限：`gh auth refresh -h github.com -s repo`

3.  **验证**:
    - 运行 `gh auth status` 检查登录状态与授权范围
    - 运行 `gh repo view` 确认当前目录识别为 GitHub 仓库（需在仓库根目录）
    - 运行 `git remote -v` 检查 `origin` 是否指向 `VisActor/VChart`

## SSO (单点登录)

如果目标仓库所属的组织强制使用 SSO，`gh` 在首次访问该组织资源时会自动触发浏览器进行 SSO 授权。只需按提示操作即可。

## 使用

`pr-create-from-body` 技能会使用本机已登录的 `gh` 命令来创建 PR。使用前请确保：

- 当前分支已推送到远程：`git push -u origin <your-branch>`
- 仓库可被识别：`gh repo view` 在项目根目录能正常输出项目信息
- 若会话存在 `GITHUB_TOKEN`，为避免走 Token 认证并导致 401，请使用本地凭证方式：`env -u GITHUB_TOKEN gh auth login`，并在创建 PR 时同样清除该变量。

**示例命令 (由技能在内部执行):**

```bash
env -u GITHUB_TOKEN gh pr create \
  --base develop \
  --head your-feature-branch \
  --title "feat: Your great feature" \
  --body-file ./.trae/output/pr.body.local.md
```

**常用参数扩展:**

- `--draft` 将 PR 设为草稿
- `--label <name>` 可多次添加标签
- `--assignee <user>` 指定受理人
- `--reviewer <user>` 指定评审人，可多次
- `--fill` 自动从提交历史生成标题与正文（本技能通常使用 `--body-file`）
- `-B`/`--base` 指定目标分支；`-H`/`--head` 指定源分支

## 常见问题

- **`gh` 命令未找到**: 确保 `gh` 已安装并且其路径已添加到系统的 `PATH` 环境变量中。
- **403 Forbidden**:
  - **权限不足**: 你的 GitHub 账户可能没有对该仓库的写权限。
  - **SSO 问题**: 运行 `gh auth status` 并检查是否已为目标组织授权。如果没有，尝试访问该组织的任一仓库页面，`gh` 可能会自动提示你重新授权。
- **404 Not Found / 仓库不可识别**:
  - 当前目录不是 Git 仓库，或 `origin` 未指向 `VisActor/VChart`；在根目录运行 `git remote -v` 与 `gh repo view`
- **422 Validation Failed**:
  - 相同的 `head`→`base` 已存在打开的 PR；可访问仓库 PR 页面确认并更新现有 PR
- **网络/代理问题**:
  - 企业网络下需设置 `HTTPS_PROXY` 或 `HTTP_PROXY` 环境变量；确保浏览器能完成 OAuth
- **分支未推送**:
  - 执行 `git push -u origin <your-branch>` 后重试 `gh pr create`
