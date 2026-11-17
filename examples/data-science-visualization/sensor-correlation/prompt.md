请用一张相关矩阵展示 inputs/sensors.csv 中温度、压力、流量、参考电压四个测量变量的关系，顺序与这里一致；排除设备编号。初始使用 Pearson，提供 Pearson、Spearman、Kendall 的切换控件。按每对变量各自的有效观测计算，不先删除所有含缺失的整行。保留恒定电压产生的 NA 并区分 NA 与零相关，色标固定为 -1 到 1，Tooltip 可查看有效配对样本数。标明模拟观测，不添加因果解释或其他图。

请使用已安装的 data-science-visualization Skill 和固定生成器完成任务。输入口径见 inputs/context.md。每行和每个重复值均按其真实含义保留，不采样、不伪造观测或模型结果。只生成上述一张图，页面使用中文，保留必要的标题、单位、图例/色标与真实 Tooltip；不要添加分析面板或未请求的控件。

已授权从检查输入、选择配置到生成交付端到端完成，无需等待计划确认。最终文件放在新的 outputs/ 目录，交付 visualization.html、visualization.request.json 和 visualization.data.json 三个具体入口。请按 Skill 要求实际打开图表、悬停代表图元、操作本任务明确要求的交互并恢复初始状态，核对两份 JSON，并简短报告实际操作与观察结果。工具或环境不支持的项目如实标为未验证。不要读取验收说明或参考答案。
