# GitHub CLI (gh) 核心指南

GitHub CLI (`gh`) 是 `pr-create-from-body` 技能的备选执行器。当 `GITHUB_TOKEN` 未设置时，技能会尝试使用 `gh` 来创建 Pull Request。

## 安装与登录

1.  **安装**:
    *   **macOS**: `brew install gh`
    *   **Windows**: `winget install GitHub.cli` 或 `choco install gh`

2.  **登录**:
    *   在终端运行 `gh auth login`。
    *   按照交互式提示操作：选择 `GitHub.com` -> `HTTPS` -> `Login with a web browser`。
    *   浏览器将打开一个页面要求授权。授权后，`gh` 会在本地安全地存储你的凭证。

3.  **验证**:
    *   运行 `gh auth status` 检查你的登录状态和权限。

## SSO (单点登录)

如果目标仓库所属的组织强制使用 SSO，`gh` 在首次访问该组织资源时会自动触发浏览器进行 SSO 授权。只需按提示操作即可。

## 使用

`pr-create-from-body` 技能在 `mode: auto` 时，会优先检查 `GITHUB_TOKEN`。如果未找到，则会调用本机的 `gh` 命令来创建 PR。

**示例命令 (由技能在内部执行):**
```bash
gh pr create \
  --base develop \
  --head your-feature-branch \
  --title "feat: Your great feature" \
  --body-file ./.trae/output/pr.body.local.md
```

## 常见问题

- **`gh` 命令未找到**: 确保 `gh` 已安装并且其路径已添加到系统的 `PATH` 环境变量中。
- **403 Forbidden**:
    - **权限不足**: 你的 GitHub 账户可能没有对该仓库的写权限。
    - **SSO 问题**: 运行 `gh auth status` 并检查是否已为目标组织授权。如果没有，尝试访问该组织的任一仓库页面，`gh` 可能会自动提示你重新授权。
