# GitHub Token 使用说明（REST 创建 PR）

- 作用：指导如何获取并在本地配置 `GITHUB_TOKEN`，用于通过 REST API 创建 PR（仓库 Job 在 `mode: auto` 时优先使用 REST）。

## 获取 Token（网页端）

- 登录 GitHub → 右上角头像 → `Settings`
- 左侧导航底部 → `Developer settings` → `Personal access tokens`
- 建议使用 Fine-grained token（推荐）或 Classic token（简化）：
  - Fine-grained（推荐）：
    - 选择仓库：`VisActor/VChart`（或你需要的目标仓库）
    - Permissions（最小权限）：
      - 在 `Repository permissions` 列表中勾选：
        - `Pull requests` → `Read and write`
        - `Contents` → `Read`
        - `Metadata` → `Read`
      - 若看不到以上权限项，请参考下文“Fine-grained 权限项不可见的排查”
    - 设置过期时间（建议 30–90 天）与备注（如：`trae-pr-rest`），点击生成并复制 Token
  - Classic（简化）：
    - 公有仓库：勾选 `public_repo`
    - 私有仓库：勾选 `repo`
    - 设置过期时间与备注，生成并复制 Token
  
### Classic token 权限最小集合（结合组织仓库场景）

- 公有仓库（个人仓库）：`public_repo`
- 公有仓库（组织仓库）：`public_repo` + `read:org`
  - 若组织开启 SSO：必须在组织的 `Tokens` 页面为该 Token 完成 SSO 授权

#### 如何查看组织是否开启了 SSO

- 组织主页右上角 → `Settings` → `Security` → 查看 `SAML Single Sign-On` 是否为 `Enabled`
- 在 `Organization` → `People` 页面，成员列表顶部若显示 `SAML SSO is enforced`/`Requires SSO` 提示，说明已启用
- 在 `Settings` → `Developer settings` → `Personal access tokens` 中，已创建的 Token 条目旁若出现 `Enable SSO`/`Configure SSO`/`SSO authorization required` 提示，通常该组织启用了 SSO

#### 如何为 Token 进行 SSO 授权

- 路径一（Token 页面）：
  - 进入 `Settings` → `Developer settings` → `Personal access tokens`
  - 找到需使用的 Token，点击 `Enable SSO` 或 `Configure SSO`
  - 在弹出的授权面板中勾选目标组织（如：`VisActor`），点击 `Authorize`
  
 详细步骤（Fine-grained，推荐）：
  1. 登录 GitHub → 右上角头像 → `Settings`
  2. 左侧 `Developer settings` → `Personal access tokens` → `Fine-grained tokens`
  3. 点击 `Generate new token`
  4. `Token name` 与 `Expiration`（建议 30–90 天）
  5. `Resource owner` 选择目标组织（如 `VisActor`）
  6. `Repository access` 选择 `Only select repositories`，勾选 `VChart`
  7. `Repository permissions` 勾选：
     - `Pull requests` → `Read and write`
     - `Contents` → `Read`
     - `Metadata` → `Read`
  8. 点击生成并复制 `github_pat_...`
  9. 在生成完成页，点击 `Configure SSO`（若可见），选择组织并 `Authorize`
  
> 注意：Fine‑grained token 通常不会显示 `Configure SSO` 按钮。这是正常行为，因为 Fine‑grained 已在创建阶段绑定了“资源归属（组织）”与“仓库范围”。如果后续 API 访问仍出现 403，请按下方步骤排查。

#### Fine‑grained 生成后未出现 “Configure SSO” 的处理（详细）

- 验证令牌类型与绑定：
  - 令牌前缀应为 `github_pat_...`（Fine‑grained），而非 `ghp_...`（Classic）
  - 创建时 `Resource owner` 必须选择目标组织（如 `VisActor`）
  - `Repository access` 必须选择 `Only select repositories` 并勾选 `VChart`
  - `Repository permissions` 勾选：`Pull requests: Read and write`、`Contents: Read`、`Metadata: Read`
- 组织策略检查：
  - 让组织管理员在 `Organization → Settings → Policies → Personal access tokens` 确认允许成员使用 Fine‑grained PAT 访问仓库；部分组织需 Owner 审批后方可生效
  - 确认你是组织成员并已完成 SAML SSO 登录（IdP 中被分配到 GitHub 应用）
- 接口级验证：
  - 列表 PR 接口：`curl -s -o /dev/null -D - -H "Authorization: Bearer $GITHUB_TOKEN" "https://api.github.com/repos/VisActor/VChart/pulls?per_page=1" | head -n 1` 期望 `HTTP/2 200`
  - 若返回 403 且提示禁止 Classic，说明当前使用的并非 Fine‑grained 或未生效；重新导出 `github_pat_...`
  - 若返回 403 `Resource not accessible by personal access token`，通常为仓库未被选择或权限未勾选；重新检查 `Repository access/permissions`
- 无需额外 SSO 按钮：
  - Fine‑grained 场景下，一般不需要在 Token 列表页额外执行 `Configure SSO`；只需确保组织成员身份、完成组织 SSO 登录，以及令牌绑定到组织与仓库并具备所需权限
  10. 在终端设置环境变量：`export GITHUB_TOKEN="github_pat_..."` → `source ~/.zshrc`
  11. 验证：
      - `curl -s -o /dev/null -D - -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/VisActor/VChart/pulls?per_page=1 | head -n 1` 期待 `HTTP/2 200`
      - 若为 `403` 且提示禁止 Classic，则说明未正确使用 Fine-grained 或未完成组织授权
- 路径二（组织页面）：
  - 进入目标组织主页 → `Settings` → `Security` → `SAML Single Sign-On`
  - 在 `Authorized credentials`/`Tokens` 区域选择你的 Token，点击授权
  
 详细步骤（Classic，若组织允许）：
  1. 确认组织策略未禁止 Classic PAT；若禁止将出现 403 并提示使用 Fine-grained
  2. 在 `Personal access tokens (classic)` 中创建包含 `repo`、`read:org` 的 Token（`ghp_...`）
  3. 返回 Token 列表，若条目旁出现 `Enable SSO`/`Configure SSO`，点击并为组织授权
  4. 若按钮不可见，使用以下方式触发授权链接：
     - `curl -s -D - -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/orgs/<组织名> | grep -i "X-GitHub-SSO"`
     - 从响应头复制 `url=https://github.com/orgs/<组织名>/sso?...`，在浏览器打开并完成授权
  5. 验证接口同上；若依旧 403，说明组织策略禁止 Classic 或 SSO 未完成
- CLI 辅助（可选）：
  - 使用 `gh` 进行授权刷新：`gh auth refresh -h github.com -s read:org -s repo -s workflow`
  - 浏览器会弹出 SSO 授权流程，完成后本地凭据具备组织访问权限
  
 详细步骤（CLI）：
  1. 本机安装并登录 GitHub CLI：`gh auth login`
  2. 触发组织权限刷新：`gh auth refresh -h github.com -s read:org -s repo -s workflow`
  3. 浏览器弹出 SSO 页，选择目标组织并确认授权；完成后返回终端成功提示
  4. 若希望优先使用本机 CLI 凭据而非环境变量 Token，执行命令时加前缀：`env -u GITHUB_TOKEN`
  5. 示例：`env -u GITHUB_TOKEN gh pr create --base develop --head <branch> --title "<title>" --body-file ./.trae/output/pr.body.local.md`

#### 看不到 “Enable SSO/Configure SSO” 按钮时的处理

- 先确认前置条件：
  - 你是目标组织成员；组织已启用并强制 SAML SSO（见上文“如何查看组织是否开启了 SSO”）
  - 该 Token 为 Classic token（前缀通常为 `ghp_...`），且作用域包含会访问组织资源的权限（如：`repo`、`read:org`）。仅 `public_repo` 往往不会显示授权入口
- 使用接口触发授权链接：
  - 运行：`curl -s -D - -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/orgs/<组织名> | head -n 20`
  - 若组织启用 SSO，响应头会包含 `X-GitHub-SSO: required; url=https://github.com/orgs/<组织名>/sso?authorization_request=...`
  - 复制该 `url` 在浏览器打开，按页面提示为当前 Token 完成 SSO 授权
- 使用 CLI 触发授权：
  - `gh auth refresh -h github.com -s read:org -s repo` 后跟随浏览器流程为组织授权
- 常见原因与修复：
  - 组织未启用或未强制 SSO → 按组织设置页确认；未启用时不会出现授权入口
  - 不是组织成员 → 先加入组织，或让管理员邀请
  - Token 作用域不足（仅 `public_repo`）→ 重新生成包含 `repo` 与 `read:org` 的 Classic token，并完成 SSO 授权
  - 已授权过该 Token → 授权入口不再显示，可在组织 SSO 的 `Authorized credentials/Tokens` 区查看
- 私有仓库（个人/组织）：`repo`
  - 若为组织仓库：额外需要 `read:org`，并完成 SSO 授权（如启用）
- 使用 GitHub CLI（gh）进行 PR/工作流相关操作：建议额外授予 `workflow`

说明：在组织仓库中，仅有 `public_repo` 往往无法通过 REST 或 gh 创建 PR，常见报错为权限不足（Missing scopes: `repo`, `read:org`）。为确保最小可用，请按上面矩阵配置。
- 若目标仓库在组织（Org）下且开启 SSO，请在 Org 的 `Tokens` 页面对该 Token 进行 SSO 授权，否则 REST 会返回 403。

> 组织仓库最小权限提示：公有仓库至少需要 `public_repo + read:org`；私有仓库需要 `repo + read:org`；若使用 gh 并涉及工作流，建议加上 `workflow`。

### Fine-grained 权限项不可见的排查

1. 选择资源归属：在创建 Fine-grained token 时，`Resource owner` 需选择目标组织（如 `VisActor`），而非个人账户；否则无法选择组织仓库与权限项
2. 仓库访问范围：在 `Repository access` 选择 `Only select repositories` 并勾选 `VChart`；选择 `All repositories` 在部分组织策略下会隐藏或限制可用权限
3. 组织策略限制：组织可能限制 Fine-grained token 的可用权限或需要 Owner 审批；若权限列表不出现或出现“需要审批”提示，请联系组织管理员在 `Organization → Settings → Policies → Personal access tokens` 开启并允许仓库访问
4. 成员与 SSO：需为组织成员且完成 SSO 绑定；非成员或未完成 SSO 时，权限项可能不可用或后续调用被 403 拒绝
5. 页面刷新与账号切换：确保使用目标 GitHub 账号登录；切换后刷新页面并重新选择组织与仓库

验证：创建完成后在终端执行 `curl -s -o /dev/null -D - -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/VisActor/VChart/pulls?per_page=1 | head -n 1`，期待 `HTTP/2 200`。若为 403 且信息提示使用 Fine-grained，则说明当前 Token 未具备所需仓库权限或未完成组织授权。

## 在本地存储与加载（macOS）

- 临时（当前终端会话）：
  - `export GITHUB_TOKEN="<你的 Token>"`
- 永久（所有新终端）：
  - 编辑 `~/.zshrc`，追加一行：
    - `export GITHUB_TOKEN="<你的 Token>"`
  - 使其生效：
    - `source ~/.zshrc`
- 验证：
  - `echo $GITHUB_TOKEN` 应有值（不应为空）
  - `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user` 返回 200/用户信息即正常

## 在本地存储与加载（Windows）

- 临时（当前 PowerShell 会话）：
  - `$env:GITHUB_TOKEN = "<你的 Token>"`
- 永久（用户环境变量）：
  - `setx GITHUB_TOKEN "<你的 Token>"`
  - 注意：`setx` 对当前会话不生效，需重启终端或重新登录
- PowerShell 配置文件（可选）：
  - 将以下命令加入 `$PROFILE`：
    - `[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "<你的 Token>", "User")`
- Git Bash（可选）：
  - 在 `~/.bashrc` 中追加：`export GITHUB_TOKEN="<你的 Token>"`
- 验证：
  - `echo $Env:GITHUB_TOKEN` 应有值
  - `curl -H "Authorization: Bearer $Env:GITHUB_TOKEN" https://api.github.com/user` 返回 200/用户信息即正常
  - 或使用 PowerShell：
    - `Invoke-WebRequest -Headers @{ Authorization = "Bearer $Env:GITHUB_TOKEN" } https://api.github.com/user`

## 在 Job 中的使用

- `./.trae/jobs/pr-create-from-body.md`：
  - `mode: auto` 默认优先 REST（读取 `GITHUB_TOKEN`），其次 `gh` CLI
  - 正文仅从文件读取：`bodyFile` 或默认 `./.trae/output/pr.body.local.md`
  - 成功输出 `pr_url`；失败输出错误信息，不展示 compare URL

## 注意事项

- 切勿将 Token 写入仓库文件、提交记录或日志；不要粘贴到聊天或截图
- 仅授予最小权限：优先使用 Fine-grained 并限定到具体仓库与必要权限
- 设置合理过期时间并定期轮换；过期后需重新生成并替换本地配置
- 组织仓库需完成 SSO 授权；否则会出现 403（权限不足）
- 新开终端需确保 `~/.zshrc` 已被加载（`source ~/.zshrc`）

## 常见问题排查

- 401 未授权：检查 `GITHUB_TOKEN` 是否为空、是否过期
- 403 权限不足：
  - 组织仓库缺少 `read:org` 或未完成 SSO 授权
  - Classic token 缺少必要作用域：公有仓库缺 `public_repo`；私有/组织仓库缺 `repo`
  - Fine-grained token 权限不足：确认 `Pull requests: Read and write`、`Contents: Read`、`Metadata: Read`
- REST 错误：查看 Job 输出中的错误信息；必要时用 `curl` 测试接口是否返回正常用户/仓库信息

## 快速命令示例（macOS）

- 设置环境变量（一次性）：
  - `export GITHUB_TOKEN="ghp_xxx..."`
- 永久配置：
  - `echo 'export GITHUB_TOKEN="ghp_xxx..."' >> ~/.zshrc && source ~/.zshrc`
- 验证：
  - `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user`
