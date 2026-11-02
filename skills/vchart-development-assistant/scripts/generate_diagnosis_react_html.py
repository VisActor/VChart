#!/usr/bin/env python3
"""
生成 React-VChart 诊断 HTML 文件脚本

使用方式：
python3 generate_diagnosis_react_html.py \\
  --problem-code "原始代码" \\
  --problem-title "问题标题" \\
  --cause "原因分析" \\
  --suggestion "修复建议" \\
  --solution-1-title "方案标题" \\
  --solution-1-desc "方案描述" \\
  --solution-1-code "修复代码" \\
  --output-dir ./chart-output
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import Dict, List

from artifact_paths import resolve_output_path


def get_script_dir() -> Path:
    return Path(__file__).parent.resolve()


def escape_js_string(s: str) -> str:
    """转义 JavaScript 字符串中的特殊字符"""
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "\\r")
    s = s.replace("\t", "\\t")
    return s


def generate_solutions_config(solutions: List[Dict[str, str]]) -> str:
    """生成 solutions 数组配置"""
    if not solutions:
        return "const solutions = [];"
    
    config = "const solutions = [\n"
    for i, sol in enumerate(solutions):
        config += "  {\n"
        config += f'    title: "{sol["title"]}",\n'
        config += f'    description: "{escape_js_string(sol["desc"])}",\n'
        config += f'    code: `{sol["code"]}`\n'
        config += "  }"
        if i < len(solutions) - 1:
            config += ",\n"
        else:
            config += "\n"
    config += "];"
    return config


def generate_config_block(
    problem_code: str,
    problem_title: str,
    cause: str,
    suggestion: str = None,
    solutions: List[Dict[str, str]] = None
) -> str:
    """生成诊断页面所需的配置块"""
    
    if solutions is None:
        solutions = []
    
    config = "      // 问题回顾配置\n"
    config += "      const problemReview = {\n"
    config += f"        code: `{problem_code}`\n"
    config += "      };\n\n"
    
    config += "      // 诊断分析配置\n"
    config += "      const diagnosis = {\n"
    config += f'        problem: "{escape_js_string(problem_title)}",\n'
    config += f'        cause: "{escape_js_string(cause)}"'
    
    if suggestion:
        config += f',\n        suggestion: "{escape_js_string(suggestion)}"'
    
    config += "\n      };\n\n"
    
    config += "      // 解决方案配置\n"
    config += generate_solutions_config(solutions) + "\n"
    
    return config


def main():
    parser = argparse.ArgumentParser(
        description="生成 React-VChart 诊断 HTML 文件",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  python3 generate_diagnosis_react_html.py \\
    --problem-code "const ChartComponent = () => {...}" \\
    --problem-title "图表不显示" \\
    --cause "数据格式错误" \\
    --solution-1-title "修正数据格式" \\
    --solution-1-desc "按照 VChart 规范修改数据" \\
    --solution-1-code "const spec = {...}"
        """
    )
    
    # 基础参数
    parser.add_argument("--problem-code", required=True, help="用户问题代码（JSX 格式）")
    parser.add_argument("--problem-title", required=True, help="问题简述")
    parser.add_argument("--cause", required=True, help="问题原因分析")
    parser.add_argument("--suggestion", help="修复建议（可选）")
    parser.add_argument("--output-dir", help="输出目录：绝对路径或相对于当前工作目录的路径")
    parser.add_argument("--output", default="output/diagnosis_react.html", help="输出 HTML 文件路径")
    
    # 解析动态参数（支持多个解决方案）
    args, unknown = parser.parse_known_args()
    
    # 提取解决方案参数
    solutions = {}
    solution_pattern = r"--solution-(\d+)-(title|desc|code)"
    
    for i in range(len(unknown)):
        arg = unknown[i]
        match = re.match(solution_pattern, arg)
        if match:
            sol_num = int(match.group(1))
            sol_type = match.group(2)
            
            if sol_num not in solutions:
                solutions[sol_num] = {}
            
            if i + 1 < len(unknown) and not unknown[i + 1].startswith("--"):
                solutions[sol_num][sol_type] = unknown[i + 1]
    
    # 检查模板文件
    template_path = get_script_dir().parent / "template" / "diagnosis-react.html"
    if not template_path.exists():
        raise FileNotFoundError(f"❌ 模板不存在: {template_path}\n💡 请检查 skill 目录结构或使用正确的脚本路径")
    
    # 读取模板
    html = template_path.read_text(encoding="utf-8")
    
    # 生成解决方案列表
    solutions_list = []
    for sol_num in sorted(solutions.keys()):
        sol = solutions[sol_num]
        if "title" in sol and "desc" in sol and "code" in sol:
            solutions_list.append({
                "title": sol["title"],
                "desc": sol["desc"],
                "code": sol["code"]
            })
    
    # 生成新的配置块
    new_config = generate_config_block(
        problem_code=args.problem_code,
        problem_title=args.problem_title,
        cause=args.cause,
        suggestion=args.suggestion,
        solutions=solutions_list
    )
    
    if "{{CONFIG_BLOCK}}" not in html:
        raise ValueError("❌ 模板中未找到 {{CONFIG_BLOCK}} 占位符\n💡 请检查模板文件: template/diagnosis-react.html")

    # 替换模板中的配置块
    html = html.replace("{{CONFIG_BLOCK}}", new_config)
    
    # 创建输出目录
    output_path = resolve_output_path(args.output, args.output_dir, "diagnosis_react.html")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 写入输出文件
    output_path.write_text(html, encoding="utf-8")
    print(str(output_path))


if __name__ == "__main__":
    main()
