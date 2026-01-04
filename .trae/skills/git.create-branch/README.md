## 概述
- 技能：git.create-branch（创建开发分支）
- 作用：同步基础分支、生成规范分支名并创建新分支

## 参数
- baseBranch（string，默认 develop）
- branchPrefix（string，默认 chore/trae）
- topic（string，必填）
- useDateSuffix（boolean，默认 true）

## 输出
- branch_name：创建的分支名

## 成功标准
- branch_created、clean_working_tree

## 失败案例与指引
- checkout/pull 失败：检查远程权限与网络
- 命名冲突：修改 topic 或关闭日期后缀避免重复

## 示例调用
- skill: git.create-branch { baseBranch: 'develop', branchPrefix: 'feat/chart', topic: 'v2-legend' }

## 失败返回示例
- 拉取基础分支失败：
  - 返回：`fatal: could not read from remote repository`
- 分支名冲突：
  - 返回：`fatal: A branch named '<name>' already exists`

## 修复步骤
- 检查网络与远程权限；必要时重新登录凭据或更新远程 URL
- 修改 `topic` 或关闭日期后缀以生成唯一分支名
