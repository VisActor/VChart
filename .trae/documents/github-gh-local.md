# GitHub CLI（gh）使用说明（创建 PR）

- 作用：指导在 macOS 上安装与登录 `gh`，并用于创建 PR；与 `GITHUB_TOKEN` 文档保持一致的权限与注意事项

## 安装与更新（macOS）

- 安装：`brew install gh`
- 更新：`brew upgrade gh`
- 验证：`gh --version`（建议使用较新版本以支持 `--body-file`）

## 登录与授权

- 交互登录：`gh auth login`
  - 选择 `GitHub.com`
  - 选择协议：推荐 `HTTPS`（SSH 仅用于 git 操作）
  - 选择登录方式：`Login with a web browser` 或 `Paste an authentication token`
  - 完成浏览器授权后返回终端，`gh` 会在本地安全存储凭据
- 组织 SSO：若目标仓库在组织下且开启 SSO，需为 `gh` 的凭据完成 SSO 授权，否则会出现 403
- 状态查看：`gh auth status`（显示当前登录主机与权限）
- 登出与切换：`gh auth logout`（可指定主机 `-h github.com`）后重新登录

## 本地凭据存储

- `gh` 会将 OAuth/PAT 凭据安全存储在 macOS Keychain 中
- 无需手动设置环境变量；与 `GITHUB_TOKEN` 互为备选方案（Job 默认优先 REST，再回退 `gh`）

## 在 Job 中的使用

- `./.trae/jobs/pr-create-from-body.md`
  - `mode: auto`：默认优先 REST（读取 `GITHUB_TOKEN`），其次使用 `gh`
  - 正文仅从文件读取：`bodyFile` 或默认 `./.trae/output/pr.body.local.md`
  - `gh` 创建命令示例：
    - `gh pr create --base <base> --head <head> --title "<title>" --body-file <path> --label <label1> --label <label2> --draft`
  - 成功输出 `pr_url`；失败输出错误信息，不展示 compare URL

## 注意事项（与 Token 文档同步）

- 最小权限原则：`gh` 登录时仅授权必要范围；组织仓库需完成 SSO 授权
- 不要将凭据写入仓库或日志；避免在聊天中粘贴敏感信息
- 定期检查与轮换凭据；遇到 401/403 优先排查授权与 SSO 状态
- 仓库识别：`gh` 默认从当前目录的 git 远程推断目标仓库（确保 `origin` 指向 GitHub 仓库）

## 常见问题排查

- 命令不可用：`gh --version` 检查是否已安装；`brew reinstall gh`
- 未登录或失效：`gh auth status`；如需重登：`gh auth logout && gh auth login`
- 403 权限不足：检查组织 SSO 授权、仓库可见性与权限范围
- `--body-file` 不生效：升级 `gh` 到较新版本；或退化为读取文件内容并传入 `--body`
- 仓库识别失败：`gh repo view` 测试当前目录是否已关联 GitHub 仓库；必要时在仓库根目录执行命令

## 快速命令示例（macOS）

- 安装与版本：
  - `brew install gh && gh --version`
- 登录（浏览器方式）：
  - `gh auth login`
- 查看状态：
  - `gh auth status`
- 创建 PR（从文件正文）：
  - `gh pr create --base develop --head chore/feature-xyz --title "feat(xyz): add auto layout" --body-file ./.trae/output/pr.body.local.md`

## 安装与使用（Windows）

### 安装与更新（Windows）

- 通过 `winget` 安装：`winget install GitHub.cli`
- 或通过 `chocolatey` 安装：`choco install gh`
- 或到官方发布页下载 MSI 安装包：`https://github.com/cli/cli/releases`
- 验证：`gh --version`

### 登录与授权（Windows）

- 执行：`gh auth login`
  - 选择 `GitHub.com`
  - 选择协议：推荐 `HTTPS`
  - 选择登录方式：`Login with a web browser` 或 `Paste an authentication token`
- 组织 SSO：若目标仓库在组织下且开启 SSO，需完成 SSO 授权
- 查看状态：`gh auth status`
- 退出/切换：`gh auth logout -h github.com`

### 本地凭据存储（Windows）

- `gh` 默认使用 Windows Credential Manager 安全存储凭据
- 无需设置环境变量；作为 `GITHUB_TOKEN` 的备选方案

### 在 Job 中的使用（Windows）

- 同 macOS，`mode: auto` 优先 REST（读取 `GITHUB_TOKEN`），其次 `gh`
- 从文件正文创建：
  - `gh pr create --base develop --head <branch> --title "<title>" --body-file ./.trae/output/pr.body.local.md`

### 常见问题排查（Windows）

- `gh` 未找到：确认已安装并检查 PATH；`winget list GitHub.cli` 或 `choco upgrade gh`
- 403：检查组织 SSO 授权与仓库权限
- `--body-file` 不生效：升级 `gh` 到较新版本；退化为 `--body` 读取文件内容
