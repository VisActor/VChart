# VChart 技能知识库维护

本文供仓库维护使用，普通图表生成不需要安装仓库依赖或运行维护检查。技能入口见 [SKILL.md](../../skills/vchart-development-assistant/SKILL.md)。

## 来源与生成

[metadata-sources.json](../../packages/vchart/scripts/skill-metadata/metadata-sources.json) 是维护入口清单，登记 36 个核心/扩展图型的真实源码入口、74 个人工详情映射及扩展注册前提。源码路径按仓库根解析，详情目标按技能 references 根解析。六个 3D 图型、pictogram 及 sequence 由宿主注册，注册前提不是 spec 字段。

内部抽取模型保留源码位置、原始类型、完整继承与映射关系；类型按真实符号解析，不按同名字符串合并。复杂依赖按实际符号生成，既有人工详情不会自动覆盖。

分发投影只保留配置生成所需知识；`source/inheritedFrom/originalType/category`、继承树和维护指纹不随 JSON 分发。维护审计仍从内部模型报告属性源码位置。

## 分发格式 3

- 顶层保留 `typeName/formatVersion/vchartVersion/effectiveProperties/complexTypeDefinitions`，按需保留扩展版本、注册前提、开放契约和行为差异说明。
- 属性保留 `name/description/type/required/isSimple/dependencies`，按需保留 `defaultValue/since/deprecated/literalValues/dependencyBindings`。
- 定义保留 `typeName/reference`，外部定义保留 `package/version`。导航键及别名绑定不因移除源码路径而改变。
- `contractNotes` 保留 `description/example`；其中用于维护核查的源码位置仅存在于来源清单和内部模型。
- `since` 是原始说明文本，可能描述某个取值的新增版本，不能直接当作纯 semver 或完整兼容承诺。
- 不支持旧分发结构的回退读取；结构版本与 VChart 版本是不同概念。

## 命令

从仓库根执行，使用 Node.js 22 和仓库已安装依赖：

```sh
node packages/vchart/scripts/skill-metadata.mjs audit --report /tmp/vchart-metadata-audit.json
node packages/vchart/scripts/skill-metadata.mjs generate --output /tmp/vchart-metadata-generated
# 审查候选输出后再更新已提交产物
node packages/vchart/scripts/skill-metadata.mjs generate --write
node packages/vchart/scripts/skill-metadata.mjs check
node --test packages/vchart/scripts/skill-metadata/distribution.test.mjs packages/vchart/scripts/skill-metadata.test.mjs
```

临时路径由执行者选择，避免覆盖既有验收证据。`generate --output` 包含 type-meta 与补充声明，独立审计候选时须在完整 references 副本中替换这些产物，再传 `audit --references DIR`；该目录还需要 topkey 和人工详情。

`audit/check` 只读，差异使退出码非零。`audit --report` 的 `provenance` 记录核心/扩展版本、TypeScript 版本、输入内容指纹和相关源码提交，报告保存在指定位置，不复制到技能目录。指纹不包含当前时间或无关文档提交。

生成只更新 type-meta 和补充声明；topkey 与人工详情按源码依据维护，audit 检查字段、作用域及导航。这些检查不要求用户对生成配置执行 schema 或编译验证。
