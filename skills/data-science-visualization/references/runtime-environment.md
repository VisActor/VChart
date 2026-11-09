# 运行环境与交付

## 运行依赖

生成器需要 Python 3.11+。CSV、TSV、JSON 只用标准库；XLSX 另需 openpyxl 并指定工作表，读取的是已缓存的公式值，不计算 Excel 公式。使用现有能满足要求的解释器，不依赖 npm、Node.js、TypeScript、MCP、登录凭证或固定的技能安装目录。

生成端只读取输入及包内资源，在指定新目录写出 HTML、request 和 data。脚本不主动上传数据或请求网络。HTML 内嵌使用的数据；打开页面时会从 `unpkg.com` 加载 VChart、statplots 两个 JavaScript 库，版本由 [release.json](../release.json) 固定。因此产物不是完全离线页面，浏览器或预览宿主必须允许网络和脚本执行。页面引用的外部脚本会在页面上下文运行。

这条生成流程没有专用原生二进制或 CPU 架构分支；实际可用性取决于宿主提供的 Python、文件读写、浏览器及脚本权限。不能据此声称已通过所有系统／架构验收。技能本身不要求付费 API；宿主产品的用量和收费按用户现有环境执行。

## 选择解释器

macOS/Linux 的 shell 先检查 `python3 --version`；Windows PowerShell 先检查 `py -3 --version`。命令名不保证对应合适版本，必须查看输出。已有其他 Python 时使用其真实可执行路径，并以同一解释器检查依赖和运行生成器，不混用另一个 `pip`。

macOS/Linux 的示例，路径应替换为当前任务实际文件；有空格时保留引号：

```sh
python3 --version
python3 "/实际技能目录/scripts/generate_visualization.py" --request "/实际请求目录/request.json" --output "/实际输出目录/图表-01"
```

Windows PowerShell 使用单行命令，避免复制 POSIX 反斜杠续行：

```powershell
py -3 --version
py -3 "C:\实际技能目录\scripts\generate_visualization.py" --request "C:\实际请求目录\request.json" --output "C:\实际输出目录\图表-01"
```

若使用带空格的解释器路径，PowerShell 用调用运算符，例如 `& "C:\实际 Python 目录\python.exe" --version`。JSON 内 Windows 路径使用 `/` 或转义后的 `\\`；`dataset.source.path` 相对 request 文件所在目录解析，与命令的当前目录无关。

解释器缺失或低于 3.11 时先检查宿主已提供的其他版本。仅在当前任务允许安装依赖、且已有可用安装工具时准备运行环境；不把 uv、pip、管理员权限或下载网络视为默认存在。如果没有可用解释器或安装路径，报告具体阻塞，不反复重试原命令。宿主文件工具或命令执行通道启动失败时，记录原始工具错误；安装 Python 包不能修复执行通道故障。

## XLSX 可选依赖

先用选定解释器检查：

```sh
python3 -c "import openpyxl; print(openpyxl.__version__)"
```

仅需要读取 XLSX 且缺少依赖时，在当前任务的可写目录创建隔离环境；以下步骤要求选定的 Python 已包含可用的 venv/pip：

```sh
python3 -m venv .dsv-venv
.dsv-venv/bin/python -m pip install openpyxl
.dsv-venv/bin/python -c "import openpyxl; print(openpyxl.__version__)"
```

Windows PowerShell 对应命令：

```powershell
py -3 -m venv .dsv-venv
& ".\.dsv-venv\Scripts\python.exe" -m pip install openpyxl
& ".\.dsv-venv\Scripts\python.exe" -c "import openpyxl; print(openpyxl.__version__)"
```

随后用该虚拟环境的 Python 运行生成器。不需要激活环境或修改 PowerShell 执行策略。目录已被其他任务使用时选择新的环境目录。记录实际 openpyxl 版本；安装失败就报告原因，或由用户提供 CSV，不把扩展名改为 CSV 冒充格式转换。CSV/TSV/JSON 不需要安装 openpyxl。

## 交付与继续改图

生成器拒绝已有输出目录，每次改图选择宿主可访问的新目录。三份文件包含使用的数据；转交产物时按原数据的分享范围处理。

自检顺序与结论按 [SKILL.md](../SKILL.md#验收与继续改图)，状态含义见[输入与交互协议](input-and-interaction.md)。豆包 Mac 提供 `browser-use-automation-mac` 时，先读取其公开说明，再用它支持的浏览器能力打开本版 HTML；不要把 artifact-preview 的静态预览流程当作交互验收。普通控件先从当前页面观察取得引用后点击／选择；canvas 图元按最新截图定位悬停，随后观察真实 Tooltip。下拉选项以实际标签／值为准，选择失败时重新观察；若只能设置 value 并派发 change，报告程序验证结果，真实控件操作仍标为未验证。图例点击后核对可见点，再点击恢复；未观察到状态变化不记通过。具体 API 和坐标单位以当前宿主说明为准，不跨宿主照搬。

自检后使用宿主的产物交付工具，按当前工具说明将 `visualization.html`、`visualization.request.json`、`visualization.data.json` 三个实际文件分别列为交付条目。豆包当前公开技能说明使用 `present_files`；以当前可用工具及其参数契约为准，不猜造 HTML 专用参数或把 HTML 源码改成另一套图表。核对工具回执是否实际包含三项；只有两个 JSON 成功时，HTML 仍未交付。支持检查时逐项打开最终入口，核对文件版本和内容；缺少回执或无法检查的部分如实注明。

HTML 的具体文件卡片／附件与浏览器预览分开确认：浏览器能打开并不表示用户已收到文件入口。宿主若对 HTML 有专用交付通道，依其公开契约使用并检查结果；只返回路径、正文文件名、文件夹或打开浏览器不能算完整交付。入口缺失时点明缺失文件，不声称三文件均已交付。

CDN 被拦截、文件不能下载或宿主禁止脚本时，记录失败环节和已完成产物；不要临时换用未验证版本、规避宿主权限，或自动把数据部署到外部网站。截图可辅助说明，不能替代用户要求的交互 HTML。

对话改图从可访问的 request 继续，保持使用数据、ID、单位和固定条件；新字段从已知原数据补回。浏览器临时选择不会自动写回磁盘，保存当前视图需显式请求 `saveView`。跨会话文件不可访问时请用户重新提供保存的 request／原数据，不根据聊天摘要重建完整数据。
