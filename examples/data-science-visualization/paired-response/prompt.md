请用一张配对比较图展示 inputs/measurements.json 中同一设备升级前后的响应时间，阶段顺序固定为升级前→升级后，按 device_id 连线。保留未配对设备的单点，不补值、不按行序配对，不改为两个组均值。单位为毫秒，Tooltip 能定位设备与阶段，说明模拟观测本身不能证明升级因果。无需其他交互控件。

请使用已安装的 data-science-visualization Skill 和固定生成器完成任务。输入口径见 inputs/context.md。每行和每个重复值均按其真实含义保留，不采样、不伪造观测或模型结果。只生成上述一张图，页面使用中文，保留必要的标题、单位、图例/色标与真实 Tooltip；不要添加分析面板或未请求的控件。

已授权从检查输入、选择配置到生成交付端到端完成，无需等待计划确认。最终文件放在新的 outputs/ 目录，交付 visualization.html、visualization.request.json 和 visualization.data.json 三个具体入口。请按 Skill 要求实际打开图表、悬停代表图元、操作本任务明确要求的交互并恢复初始状态，核对两份 JSON，并简短报告实际操作与观察结果。工具或环境不支持的项目如实标为未验证。不要读取验收说明或参考答案。
