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

每版结果使用宿主提供的可访问输出目录，分别交付 `visualization.html`、`visualization.request.json`、`visualization.data.json` 三个具体文件链接或附件，并确认三份文件均可访问。只交付HTML、文件夹卡片或正文磁盘路径，不能视为三文件完整交付；交付失败时指出具体缺失文件。生成器拒绝已有输出目录，每次改图选择新目录。三份文件包含使用的数据；转交产物时按原数据的分享范围处理。

在用户实际能使用的浏览器或交互预览中打开 HTML，检查真实图元、至少一个有代表性的 Tooltip 和请求的交互；打开两份JSON，核对真实内容和当前输出版本的对应关系。存在状态访问能力时核对每图 `status=rendered`；具体标准见 [输入与交互协议](input-and-interaction.md)。宿主不要求截图不代表交互已经验证。预览不执行脚本时，可在宿主支持下载的前提下交付文件并验证浏览器打开，但需说明实际使用入口；工具或宿主规则不允许检查时说明未验证环节，不把静态预览或文件存在当作验收通过。

CDN 被拦截、文件不能下载或宿主禁止脚本时，记录失败环节和已完成产物；不要临时换用未验证版本、规避宿主权限，或自动把数据部署到外部网站。截图可辅助说明，不能替代用户要求的交互 HTML。

对话改图从可访问的 request 继续，保持使用数据、ID、单位和固定条件；新字段从已知原数据补回。浏览器临时选择不会自动写回磁盘，保存当前视图需显式请求 `saveView`。跨会话文件不可访问时请用户重新提供保存的 request／原数据，不根据聊天摘要重建完整数据。
