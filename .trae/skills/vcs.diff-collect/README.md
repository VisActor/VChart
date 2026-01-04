## 概述
- 技能：vcs.diff-collect（采集分支差异与工作树变更）
- 作用：生成结构化差异信息（文件列表与行级片段），输出 JSON

## 参数
- sinceBranch（string，默认 develop）：对比基线分支
- includeWorkingTree（boolean，默认 true）：是否包含工作树变更

## 输出
- diff_json：写入 ./.trae/output/diff.json

## 成功标准
- diff_collected：完成差异采集

## 失败案例与指引
- 无 git/远程不可用：先执行 git fetch 或确认仓库状态
- 差异为空：按需改用指定 project 的 Autotest 运行方式

## 示例调用
- skill: vcs.diff-collect { sinceBranch: 'develop' }

## 失败返回示例
- 基线分支不存在：
  - 返回：`fatal: bad revision 'develop...HEAD'`
- 差异为空：
  - 返回：`changedFiles=[]`

## 修复步骤
- 先 `git fetch --all --prune` 同步远程；确认 `sinceBranch` 存在
- 若差异为空而需继续流程：在 Autotest 中指定 `project` 明确运行目标包
