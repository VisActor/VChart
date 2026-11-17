# 输入说明

每行是一条固定验证集上的模拟模型输出。sample_id 是唯一 ID；actual_kwh 为观测耗电量，predicted_kwh 为事先算好的预测耗电量，单位均为 kWh。模型为演示用 energy-model-v1，验证集标签为 holdout-demo；此处只有模拟预测，不提供训练数据。残差定义为 actual_kwh−predicted_kwh，不是标准化或学生化残差。

本例全部数据为仓库维护者自行构造的模拟测试材料，按本仓库 MIT 许可提供；不是真实业务、实验或模型评估结果。
