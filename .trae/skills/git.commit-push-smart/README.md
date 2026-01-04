## 概述
- 技能：git.commit-push-smart（智能提交并可选推送）
- 作用：检测工作树、生成提交信息、执行 commit 与 push（可选）

## 参数
- head（string，默认 ''）：目标分支；为空时自动推导当前分支
- commitAllowEmpty（boolean，默认 false）：允许空提交
- pushAfterCommit（boolean，默认 true）：提交后推送当前分支
- commitMessageStrategy（enum: auto|manual，默认 auto）：提交信息生成策略
- message（string，默认 ''）：手动消息（当 strategy=manual 或用于覆盖自动主题）

## 输出
- commit_message：实际提交信息
- pushed_branch：推送分支名（当 pushAfterCommit=true）

## 成功标准
- commit_created_or_skipped：当工作树为空且不允许空提交时，视为“跳过但成功”

## 失败案例与指引
- 无 git/仓库未初始化：请在仓库根目录执行，确保已安装 git 且有有效远程
- commitlint 不通过（如后续校验触发）：调整 message 或使用自动策略生成
- 推送失败（权限/网络）：检查远程权限与网络代理；必要时稍后重试

## 示例调用
- skill: git.commit-push-smart { pushAfterCommit: true, commitMessageStrategy: 'auto' }

## 失败返回示例
- 工作树为空且不允许空提交：
  - 返回：commit_created_or_skipped
  - 日志示例：
    - `[INFO] working tree clean, skip commit`
- 推送失败（远程拒绝）：
  - 返回：错误信息（非零退出）
  - 日志示例：
    - `! [rejected] HEAD -> origin/HEAD (fetch first)`

## 修复步骤
- 若需强制提交：设置 `commitAllowEmpty: true` 或在工作树中加入实际变更
- 推送被拒绝：先执行 `git pull --rebase` 或 `git fetch && git merge`，解决冲突后再推送
- 无远程权限：检查凭据与网络代理，确保 `origin` 指向可写仓库
