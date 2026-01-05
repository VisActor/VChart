# GitHub Token 核心指南

为了让 `pr-body-generate` 和 `pr-create-from-body` 等技能能够与 GitHub 交互（例如，拉取 Issue 标题、创建 PR），你需要一个具有适当权限的个人访问令牌 (Personal Access Token, PAT)。

## 获取与配置

1.  **生成 Token**:
    *   前往 GitHub [**Developer settings**](https://github.com/settings/tokens) > **Personal access tokens** > **Fine-grained tokens**。
    *   创建一个新 Token，将其权限范围限定到 `VisActor/VChart` 仓库。
    *   **必须权限**:
        *   `Pull requests`: **Read and write**
        *   `Contents`: **Read**

2.  **配置环境变量**:
    *   将获取到的 Token (通常以 `github_pat_` 开头) 设置为本地环境变量 `GITHUB_TOKEN`。
    *   **macOS/Linux**: `export GITHUB_TOKEN="your_token_here"`
    *   **Windows**: `$env:GITHUB_TOKEN = "your_token_here"`
    *   为使其永久生效，请将此命令添加到你的 shell 配置文件中 (如 `.zshrc`, `.bash_profile` 或 PowerShell 的 `$PROFILE`)。

## SSO (单点登录)

如果 `VisActor` 组织开启了 SSO，你的 Token 必须经过授权才能访问组织资源。

*   **Fine-grained Token**: 在创建时，将 `Resource owner` 设置为 `VisActor` 组织，即可自动关联 SSO。
*   **Classic Token**: 创建后，你可能需要在 Token 列表中找到它，并点击 `Enable SSO` 或 `Configure SSO` 来完成授权。

## 安全须知

- **最小权限**: 始终为 Token 授予完成任务所需的最小权限。
- **保护 Token**: 绝不要将 Token 硬编码到代码、提交记录或日志中。环境变量是推荐的安全存储方式。
- **定期轮换**: 为你的 Token 设置一个合理的过期时间（如 30-90 天），并定期更换。
