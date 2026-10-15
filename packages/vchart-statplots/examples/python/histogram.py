"""标准库交接示例：输出原始观测，由 StatPlots 分箱。"""
import json
import sys

values = [0, 1, 2, 3, 4]
json.dump({"type": "histogram", "statistic": "density", "binning": {"binCount": 2},
           "title": "Python 原始观测", "data": [{"value": value} for value in values]},
          sys.stdout, ensure_ascii=False, allow_nan=False, indent=2)
sys.stdout.write("\n")
