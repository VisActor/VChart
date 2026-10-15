# StatPlots CodeQL 告警收敛

用户已确认上轮评审建议，并要求修复。当前提交为 `079e8ce6c`，工作区干净。

## 方案与边界

- 两处资源同步测试共用一个 fetch fixture，只接受当前版本的完整 npm 元数据 URL 及固定 tarball URL；未知请求抛错。测试不发起真实网络请求。
- 画廊 schema 链接对 `spec.type` 使用 `encodeURIComponent`。保留已有结构校验及固定同源路径，不增加 HTML 清洗依赖。
- workflow 权限和包名编码已被 GitHub 标记 fixed，本次不重复修改；将资源同步 runtime 回归接入 StatPlots CI。
- 不关闭或隐藏安全告警，不修改 VChart 核心和同步器的生产网络逻辑。

## 取舍与验收

精确匹配请求 URL 同时约束域名、协议、包路径及版本，优于只比较 hostname；未知请求抛错能暴露同步器意外新增的网络请求。

- runtime 测试覆盖元数据与 tarball 正常返回，以及伪造域名、路径、查询参数、错误版本和协议被拒绝；继续检查失败同步不改变旧快照。
- Chromium 真实编辑器输入覆盖 `javascript:`、HTML 注入及路径穿越：必须拒绝输入，schema 链接和当前图表保留，脚本不执行。
- 执行相关 runtime、画廊及颜色浏览器回归，检查格式与 diff。
- 本地成功不等于远端 CodeQL 已通过；未推送时如实报告待远端复扫。
