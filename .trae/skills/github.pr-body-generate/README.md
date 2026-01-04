## 概述
- 技能：github.pr-body-generate（生成 PR 正文与标题建议）
- 作用：选择模板、填充内容、输出预览与本地文件

## 参数
- lang（enum: zh|en，默认 zh）、title、head、labels、rushChangesDir（默认 common/changes）、localBodyFile（默认 true）、openEditor（默认 false）

## 输出
- generated_title、generated_body_preview、generated_body_file（默认写入 ./.trae/output/pr.body.local.md）

## 成功标准
- body_generated

## 失败案例与指引
- 模板缺失：检查 .github/PULL_REQUEST_TEMPLATE 目录与路径
- 关联信息为空：保留占位，后续人工补充

## 示例调用
- skill: github.pr-body-generate { title: '[Auto] legend', lang: 'zh' }

## 失败返回示例
- 模板缺失：
  - 返回：`[ERROR] template not found: .github/PULL_REQUEST_TEMPLATE/pr_cn.md`
- 写入失败（权限/路径不可写）：
  - 返回：`[ERROR] cannot write to ./.trae/output/pr.body.local.md`

## 修复步骤
- 补齐模板文件或改用英文模板路径；确保路径正确
- 确认仓库路径可写，或变更输出路径；必要时以管理员权限运行
