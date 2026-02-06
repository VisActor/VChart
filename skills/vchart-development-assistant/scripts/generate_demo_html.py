#!/usr/bin/env python3
"""
VChart 示例 HTML 生成脚本

使用方式：
  python3 scripts/generate_demo_html.py \\
    --title "图表示例标题" \\
    --desc "图表示例描述" \\
    --feature "主要功能说明" \\
    --tips "编辑提示" \\
    --spec-file spec.js \\
    --output output/demo.html

更多信息请查看: workflows/scenario-2-generation.md
"""

from pathlib import Path
import argparse

def escape_js_string(s: str) -> str:
    """转义 JavaScript 字符串中的特殊字符"""
    s = s.replace("\\", "\\\\")
    s = s.replace("`", "\\`")
    s = s.replace("\n", "\\n")
    return s

def main():
    parser = argparse.ArgumentParser(description="Generate demo HTML from template/demo.html")
    parser.add_argument("--title", default="VChart 图表示例", help="页面标题")
    parser.add_argument("--desc", default="基于需求生成的可运行图表配置", help="页面描述")
    parser.add_argument("--feature", default="补充主要功能说明", help="主要功能说明")
    parser.add_argument("--tips", default="补充编辑提示", help="编辑提示")
    parser.add_argument("--spec-file", help="包含完整 spec 代码的文件路径")
    parser.add_argument("--output", default="output/demo.html", help="输出 HTML 文件路径")
    args = parser.parse_args()

    template_path = Path("template/demo.html")
    if not template_path.exists():
        raise FileNotFoundError(f"❌ 模板不存在: {template_path}\n💡 请确保在项目根目录运行脚本")

    html = template_path.read_text(encoding="utf-8")
    html = html.replace("{{REPORT_TITLE}}", args.title)
    html = html.replace("{{REPORT_DESC}}", args.desc)
    html = html.replace("{{FEATURE_DESC}}", args.feature)
    html = html.replace("{{EDIT_TIPS}}", args.tips)

    if args.spec_file:
        spec_path = Path(args.spec_file)
        if not spec_path.exists():
            raise FileNotFoundError(f"❌ Spec 文件不存在: {spec_path}")
        spec_code = spec_path.read_text(encoding="utf-8")
    else:
        spec_code = """const spec = {
  type: "line",
  data: {
    values: [
      { time: "2:00", value: 8 },
      { time: "4:00", value: 9 },
      { time: "6:00", value: 11 },
      { time: "8:00", value: 14 },
      { time: "10:00", value: 16 }
    ]
  },
  xField: "time",
  yField: "value"
};"""

    # 转义 spec 代码供 JavaScript 字符串使用
    initial_code_escaped = escape_js_string(spec_code.strip())

    # 填充 spec 和 initialCode 模板变量
    html = html.replace("{{SPEC_CODE}}", spec_code)
    html = html.replace("{{INITIAL_CODE}}", initial_code_escaped)
    filled = html

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(filled, encoding="utf-8")

    print(f"✅ 示例 HTML 已生成: {output_path.resolve()}")
    print(f"📊 请在浏览器中打开以查看可运行示例")

if __name__ == "__main__":
    main()
