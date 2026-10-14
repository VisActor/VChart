# spec 生成示例

这些是演示数据，不能替代用户真实数据。完整生成和修改后交付遵循 [spec 工作流](../../workflows/scenario-2-spec-generation.md)。

| 文件 | 表达目标与数据 | 格式与边界 |
| --- | --- | --- |
| [weekly-bar.json](weekly-bar.json) | 比较四天数值 12、25、18、32，保留星期顺序；未给业务单位 | 可序列化 JSON；xField=day、yField=value，无宿主包装 |
| [composition-pie.json](composition-pie.json) | 同一总体 A=30、B=70，总量 100；展示部分与整体 | JSON；categoryField=category、valueField=value；不是两份不同分母的百分比 |
| [callback-label.js](callback-label.js) | 周数据柱图标签显示“星期: 数值” | JS；formatMethod 按 (text, datum) 签名，不可丢函数转换成 JSON；同类效果先查询声明式 formatter 能力 |

JSON 示例可直接解析。JS 示例仅声明 spec；实例创建由宿主或临时验收页面负责。临时 HTML 用于真实渲染验证，不代替配置产物。组合交付的页面应使用同一份配置。
