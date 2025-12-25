# Create Branch Job（Solo 使用说明）

- 入口文件：`./.trae/jobs/create-branch.md`
- 适用场景：需要在本地通过 Job 统一创建开发分支

## 参数
- `baseBranch`：默认 `develop`
- `branchPrefix`：默认 `chore/trae`
- `topic`：必填，主题描述（例如 `feature-legend`）
- `useDateSuffix`：是否追加日期后缀，默认 `true`

## 使用（Solo）
- 在聊天中发起：“执行 Create Branch Job（.trae/jobs/create-branch.md）”，并传入：
  - `topic: feature-legend`

## 输出
- `branch_name`：生成的分支名

## 人工检查
- 执行完成后：`git status` 确认当前分支与工作树状态
