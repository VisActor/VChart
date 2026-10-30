# Python 脚本常见问题排除指南

## 通用故障排除

### ❌ 模板不存在错误

**错误信息示例**：

```
❌ 模板不存在: template/diagnosis.html
❌ 模板不存在: template/demo.html
❌ 模板不存在: template/diagnosis-react.html
```

**原因**：安装目录缺少模板，或脚本与模板版本不一致。脚本按自身位置读取模板，不要求切换工作目录。

核对实际 Skill 安装目录下的 `scripts/` 与 `template/` 来自同一版本，检查报错中的绝对路径。用完整脚本路径调用，输入/输出相对路径仍基于当前工作目录。

---

### ❌ 输出目录问题

**症状**：

- 生成的 HTML 文件无法打开
- 提示权限错误
- 找不到输出文件

**原因**：输出目录不存在或权限不足

**解决步骤**：

1. 创建输出目录（脚本通常会自动创建）：

   ```bash
   mkdir -p output
   ```

2. 检查目录权限：

   ```bash
   ls -la output/
   ```

3. 验证文件是否生成：

   ```bash
   ls -la output/*.html
   ```

4. 使用本地服务器打开（推荐）：
   ```bash
   python3 -m http.server 8000
   # 在浏览器访问 http://localhost:8000/output/xxx.html
   ```

---

### ❌ 模板占位符缺失错误

**错误信息示例**：

```
❌ 模板中未找到 {{CONFIG_BLOCK}} 占位符
❌ 模板中未找到 {{INITIAL_CODE}} 占位符
```

**原因**：模板文件被意外修改或损坏

**解决步骤**：

1. 检查模板文件是否包含必需占位符：

   ```bash
   # 检查 diagnosis.html
   cat template/diagnosis.html | grep "{{CONFIG_BLOCK}}"

   # 检查 demo.html
   cat template/demo.html | grep "{{INITIAL_CODE}}"

   # 检查 diagnosis-react.html
   cat template/diagnosis-react.html | grep "{{CONFIG_BLOCK}}"
   ```

2. 如果标记缺失，从版本控制恢复原始模板：

   ```bash
   git checkout template/diagnosis.html
   git checkout template/demo.html
   git checkout template/diagnosis-react.html
   ```

3. 确保没有手动编辑过模板文件

**💡 提示**：模板文件是只读的，不要手动修改其中的标记注释。

---

## 回调代码含模板字符串时页面空白

演示生成器将完整源码序列化为 JSON 字符串，并转义 `<`，避免回调中的模板字符串被提前插值或字符串中的 HTML 标签截断 script。若出现此类错误，检查脚本和模板是否来自同一版本；不要删除回调、只截取 spec 对象或通过 JSON 往返丢掉函数。诊断模板的代码字符串须另外按其输入格式转义。

## 按脚本分类故障排除

### generate_diagnosis_html.py

#### ❌ 配置文件不存在：config.js

**错误信息**：

```
❌ 配置文件不存在: config.js
```

**原因**：配置文件路径错误或文件未创建

**解决步骤**：

1. 检查文件是否存在：

   ```bash
   ls -la config.js
   ```

2. 检查文件路径（相对于当前运行目录）：

   ```bash
   # 如果文件在子目录
   ls -la output/config.js
   ```


3. 创建配置文件示例：

   ```bash
   cat > config.js << 'EOF'
   const problemReview = {
     specCode: "const spec = { type: 'bar', data: { values: [] } };"
   };

   const diagnosis = {
     problem: "图表显示问题",
     cause: "配置项错误"
   };

   const solutions = [
     {
       title: "修复方案",
       description: "修改配置",
       specCode: "const spec = { type: 'bar', data: { values: [{x:1,y:2}] } };"
     }
   ];
   EOF
   ```

4. 使用正确路径运行脚本：
   ```bash
   python3 scripts/generate_diagnosis_html.py --config-file config.js
   ```

#### 配置文件格式错误

**症状**：HTML 生成成功但无法正确显示


1. 验证配置文件是否为有效 JavaScript：

   ```bash
   node -c config.js
   ```

2. 确保配置文件包含三个必需对象：
   - `problemReview`（包含 `specCode` 字段）
   - `diagnosis`（包含 `problem` 和 `cause` 字段）
   - `solutions`（数组，每个元素包含 `title`、`description`、`specCode`）

3. 检查特殊字符是否正确转义（尤其是引号和反引号）

---

### generate_demo_html.py

#### ❌ Spec 文件不存在：spec.js

**错误信息**：

```
❌ Spec 文件不存在: spec.js
```

**原因**：Spec 文件路径错误或文件未创建

**解决步骤**：

1. 检查文件是否存在：

   ```bash
   ls -la spec.js
   ```

2. 创建 Spec 文件示例：

   ```bash
   cat > spec.js << 'EOF'
   const spec = {
     type: "bar",
     data: {
       values: [
         { category: "A", value: 10 },
         { category: "B", value: 20 },
         { category: "C", value: 15 }
       ]
     },
     xField: "category",
     yField: "value",
     label: { visible: true }
   };
   EOF
   ```

3. 使用正确路径运行脚本：
   ```bash
   python3 scripts/generate_demo_html.py --spec-file spec.js --output output/demo.html
   ```

#### 生成的 HTML 无法运行或显示空白

**原因**：Spec 代码有语法错误或数据格式不正确

**解决步骤**：

1. 验证 Spec 代码语法（使用 Node.js）：

   ```bash
   node -c spec.js
   ```

2. 确保数据格式符合 VChart 要求：
   - 按实际图型核对数据结构，参考 [数据契约](chart/common-issues.md#图数据与层级数据)；不能把所有输入都当作平铺二维表
   - 字段映射必须对应实际数据；缺少宿主绑定时在宿主中验证

3. 验证字段映射：

   ```javascript
   // ❌ 错误：字段名不匹配
   xField: "category",  // 但数据中是 "cat"

   // ✅ 正确：字段名必须一致
   xField: "category",  // 数据中确实有 "category"
   ```

4. 在浏览器控制台查看详细错误：
   - 右键 → 检查 → Console 查看 JavaScript 错误

---

### generate_diagnosis_react_html.py

#### ❌ 特殊字符转义问题

**症状**：

- 脚本执行失败
- 生成的 HTML 中代码显示不完整
- 代码中出现多余的 `\"`

**原因**：命令行参数中包含特殊字符未正确转义

**解决步骤**：

1. 对于包含双引号的代码，使用单引号包裹或转义：

   ```bash
   # ❌ 错误：双引号冲突
   --problem-code "<Bar xField="category" />"

   # ✅ 方法1：使用单引号
   --problem-code '<Bar xField="category" />'

   # ✅ 方法2：转义双引号
   --problem-code "<Bar xField=\"category\" />"
   ```

2. 避免在命令行中直接传递复杂多行代码，改用简化版本：

   ```bash
   # ❌ 容易失败：复杂代码
   --problem-code "const Chart = () => {
     return <BarChart>...</BarChart>;
   }"

   # ✅ 建议：简化代码
   --problem-code "const Chart = () => <BarChart />"
   ```

3. 使用浏览器开发者工具检查生成的 JavaScript 是否正确：
   - 右键 → 检查 → Sources → 查看内联脚本

#### ❌ 多方案参数错误

**错误信息示例**：

```
缺少必需参数: --solution-1-title
```

**原因**：

- 参数格式不正确
- 方案编号不连续
- 缺少必需的子参数

**解决步骤**：

1. 确保每个方案包含三个必需参数：

   ```bash
   --solution-1-title "方案标题"   # 必需
   --solution-1-desc "方案描述"    # 必需
   --solution-1-code "修复代码"    # 必需
   ```

2. 确保方案编号连续（1, 2, 3...）：

   ```bash
   # ❌ 错误：跳过了 solution-2
   --solution-1-title "..." --solution-3-title "..."

   # ✅ 正确：连续编号
   --solution-1-title "..." --solution-2-title "..." --solution-3-title "..."
   ```

3. 验证参数：
   ```bash
   # 使用 echo 查看参数是否正确传递
   python3 scripts/generate_diagnosis_react_html.py \
     --problem-code "code" \
     --problem-title "title" \
     --cause "cause" \
     --solution-1-title "S1" \
     --solution-1-desc "D1" \
     --solution-1-code "C1" \
     --solution-2-title "S2" \
     --solution-2-desc "D2" \
     --solution-2-code "C2"
   ```

---

## 调试技巧

### 查看详细错误信息

所有脚本都会输出详细错误信息，包括：

- 错误类型
- 错误位置
- 建议解决方案（带 💡 图标）

### 使用 Python 调试模式

```bash
# 启用详细输出
python3 -u scripts/generate_diagnosis_html.py --config-file config.js

# 查看 Python 错误堆栈
python3 scripts/generate_diagnosis_html.py --config-file config.js 2>&1 | less
```

### 验证生成的 HTML

```bash
# 检查 HTML 文件大小（应大于 10KB）
ls -lh output/*.html

# 查看 HTML 前几行
head -n 20 output/diagnosis.html

# 在浏览器中打开
open output/diagnosis.html  # macOS
xdg-open output/diagnosis.html  # Linux
```

### 使用本地服务器（推荐）

某些浏览器限制本地文件访问，使用本地服务器可避免问题：

```bash
# 启动服务器
python3 -m http.server 8000

# 访问地址
# http://localhost:8000/output/diagnosis.html
# http://localhost:8000/output/demo.html
```

---

## 最佳实践

### ✅ 推荐做法

1. **始终在项目根目录运行脚本**

   ```bash
   cd vchart-development-assistant
   python3 scripts/generate_*.py ...
   ```

2. **使用相对路径**

   ```bash
   --config-file config.js          # ✅ 好
   --config-file ./config.js        # ✅ 好
   --config-file /abs/path/config.js # ❌ 避免绝对路径
   ```

3. **先验证源文件语法**

   ```bash
   node -c config.js  # 验证配置文件
   node -c spec.js    # 验证 Spec 文件
   ```

4. **使用版本控制跟踪配置文件**
   ```bash
   git add config.js spec.js
   git commit -m "Add chart configuration"
   ```

### ❌ 避免的做法

1. 手动编辑模板文件（template/\*.html）
2. 在命令行中传递超过 10 行的代码
3. 在非项目根目录运行脚本
4. 使用包含空格的输出路径（未加引号）

---

## 获取帮助

### 查看脚本帮助信息

```bash
python3 scripts/generate_diagnosis_html.py --help
python3 scripts/generate_demo_html.py --help
python3 scripts/generate_diagnosis_react_html.py --help
```

### 相关文档

- **诊断场景**：[scenario-1-diagnosis.md](../workflows/scenario-1-diagnosis.md)
- **生成场景**：[scenario-2-generation.md](../workflows/scenario-2-generation.md)
- **图片还原场景**：[scenario-3-image-replication.md](../workflows/scenario-3-image-replication.md)
- **React 诊断场景**：[scenario-1-react.md](../workflows/scenario-1-react.md)
- **文件命名约定**：[FILE_NAMING_CONVENTIONS.md](FILE_NAMING_CONVENTIONS.md)
- **脚本参数参考**：[SCRIPT_PARAMS_REFERENCE.md](SCRIPT_PARAMS_REFERENCE.md)
