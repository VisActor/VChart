"""只使用标准库的交接示例；分箱计算位于 Python，输出纯语义 JSON。"""
import json
import sys

values = [0.1, 0.2, 0.5, 0.9, 1.2, 1.8, 2.2, 2.9]
edges = [0, 1, 3]
bins = []
for index, (start, end) in enumerate(zip(edges, edges[1:])):
    last = index == len(edges) - 2
    count = sum(start <= value < end or (last and value == end) for value in values)
    bins.append({"binStart": start, "binEnd": end, "count": count})

json.dump({"type": "histogram", "statistic": "density", "title": "Python 预计算分箱", "data": bins}, sys.stdout, ensure_ascii=False, allow_nan=False, indent=2)
sys.stdout.write("\n")
