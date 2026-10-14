# StatPlots 数值边界与生成物生命周期

用户已确认：修复 SHAP 溢出、workflow 权限和包名编码；Schema 与校验器改为构建生成、不再跟踪 Git，同时保持开发、测试、发布可用。

## 设计

- SHAP 保留普通区间的计算方式；仅当有限端点的区间相减溢出时，先将端点和值除以 2，再计算相对值。缺失值和常量色保持现有契约。
- StatPlots workflow 显式声明 `contents: read`；npm 元数据 URL 使用 `encodeURIComponent` 编码完整包名。
- TS 类型及生成脚本是唯一来源。`schema/` 和 `src/generated/` 从 Git 移除并忽略，发布包继续包含 Schema 和编译后的 standalone 校验器。
- `compile`、单测、浏览器测试、开发服务、单独 UMD 构建和依赖生成物的检查先运行生成脚本。标准 build 通过 compile 完成一次生成；prepack 调用标准 build，保证发布时使用当前类型及版本。
- CI 验证生成物一致性，并检查生成路径没有被 Git 跟踪，替代对已提交生成物的 diff 检查。
- 生成器只原子替换内容变化的文件，避免开发服务重载及并行读取不完整校验器。
- 源码 README 说明生成资源的位置；发布文档保留包内相对 Schema 链接。

## 取舍

保留 Git 生成物违背本次要求；改成运行时编译 Schema 会增加启动成本及 CSP 约束。因此保留离线生成，接入现有 npm/Rush 入口，不引入额外运行时依赖。

## 验收

1. 宽区间、普通区间、窄区间、缺失和常量的 SHAP 单测；浏览器核对真实填充色、更新和 resize。
2. 生成物一致性、完整 StatPlots 单测、相关浏览器回归、类型编译及修改文件 lint。
3. 没有生成文件的检出中，测试和开发服务能自行生成；npm pack 经 prepack 构建，tarball 包含 29 份 Schema 以及 ESM/CJS 校验器。
4. 工作区生成物被忽略，Git 不再跟踪；现有 release workflow 验证通过。
