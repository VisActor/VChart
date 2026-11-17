# 订单实付金额分布

从逐笔订单查看金额分布与长尾，通过分箱切换比较不同粒度。

![图表预览](preview.png)

## 任务与输入

完整任务见 [prompt.md](prompt.md)，输入为 [orders.csv](inputs/orders.csv)，字段、单位和模拟来源见 [context.md](inputs/context.md)。本例为原创模拟测试材料，按本仓库 MIT 许可提供，不代表真实业务、实验或模型评估结果。

金额单位为元。0 元与重复金额均为有效观测；32 笔模拟订单中有 2 笔金额缺失，绘图使用其余 30 笔。保留完整长尾，不取对数或截断。

## 结果与打开方式

- [交互 HTML](result/visualization.html)
- [可重放请求](result/visualization.request.json)
- [使用数据及来源](result/visualization.data.json)

下拉菜单支持 5、10、20 个等宽箱，初始为 5 箱；Tooltip 显示金额区间和订单数。

HTML 内嵌使用数据，浏览器打开后不依赖原始 CSV/JSON 文件或仓库服务；需要访问 `unpkg.com` 的 VChart/statplots **2.2.2** 固定版本脚本，结果不是完全离线页面。

浏览器允许本地 HTML 和外部脚本时，可直接打开 `result/visualization.html`。也可以在本例目录启动仅监听本机的静态预览：

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory result
```

然后打开 `http://127.0.0.1:8000/visualization.html`。

## 复作与继续改图

安装完整的 `data-science-visualization` Skill，将本例 `prompt.md` 和 `inputs/` 复制到独立工作区交给 Agent，写入新的 `outputs/`。生成时需要 Python 3.11+；本例输入只需要标准库。生成前不要把本例 `result/` 或预览作为参考答案交给 Agent。

已有请求内嵌使用数据，可以独立重放和继续修改。将 `DSV_SKILL_DIR` 设置为实际安装的 Skill 目录，从本例目录执行：

```sh
python3 "$DSV_SKILL_DIR/scripts/generate_visualization.py" \
  --request result/visualization.request.json \
  --output replay
```

输出目录 `replay` 必须尚不存在。浏览器中的临时选择不会自动写回磁盘 request；改图时使用保存的请求，并生成新目录。
