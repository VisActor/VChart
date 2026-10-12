"""Safe, self-contained HTML packaging. Library UMDs remain pinned CDN assets."""
from __future__ import annotations
import html
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from visualization_io import VERSION, json_text

def replay_request(payload):
    request = {key:payload[key] for key in ('version','title','charts','controls','presentation')}
    data = payload['dataset']
    if data is not None:
        request['dataset'] = {'source':{'records':[r['values'] for r in data['rows']]},'columns':data['columns']}
        if data['source']['idColumn']:
            request['dataset']['idColumn'] = data['source']['idColumn']
    return request

def render_html(payload, asset_root):
    assets = Path(asset_root)
    content = {name:(assets/name).read_text(encoding='utf-8') for name in
        ('page.html','page.css','statplot-controller.js','data-bindings.js','page-runtime.js')}
    esc = lambda value:html.escape(str(value), quote=True)
    cards = []
    for chart in payload['charts']:
        spec = chart.get('spec', chart.get('binding', {}))
        kind = spec['type']
        options = spec.get('options', spec)
        title = options.get('title', kind)
        source = payload['dataset']['source'] if 'binding' in chart else chart['source']
        scope = '随表格筛选重算' if 'binding' in chart else '已有结果；不随表格筛选更新'
        note = '框选只高亮观测；图例为颜色说明。' if kind == 'pairPlot' else ''
        cards.append(f'<section class="card" data-chart="{esc(chart["id"])}"><header><h2>{esc(title)}</h2>'
          f'<span class="scope">{esc(scope)}</span></header><div id="dsv-{esc(chart["id"])}" class="plot {"pair" if kind=="pairPlot" else ""}"'
          f' role="img" aria-label="{esc(title)}">图表加载中</div>'
          f'<p class="chart-meta" id="meta-{esc(chart["id"])}" role="status"></p>'
          f'<p class="chart-error" id="error-{esc(chart["id"])}" role="alert"></p>'
          f'<p class="caption">{esc(chart.get("caption", ""))} {esc(note)}</p>'
          f'<p class="source">来源：{esc(source["label"])} {esc(source.get("note", ""))}</p>'
          f'<button type="button" data-png="{esc(chart["id"])}" disabled>导出 PNG</button></section>')
    data = payload['dataset']
    provenance = f'原始观测 {data["source"]["originalN"]} 条 · SHA-256 {esc(data["source"]["sha256"])}' if data else '绘制用户提供的已有结果；结果行数不等于原始样本量。'
    replacements = {'TITLE':esc(payload['title']), 'CSS':content['page.css'], 'CARDS':''.join(cards),
      'SOURCE':provenance, 'DATA':json_text(payload).replace('<','\\u003c'), 'VERSION':VERSION,
      'CONTROLLER':content['statplot-controller.js'], 'BINDINGS':content['data-bindings.js'], 'RUNTIME':content['page-runtime.js']}
    return re.sub(r'@@([A-Z]+)@@', lambda match:replacements[match[1]], content['page.html'])

def write_outputs(payload, output_dir, asset_root):
    output = Path(output_dir).resolve()
    if output.exists():
        raise FileExistsError(f'输出目录已存在，请使用新目录: {output}')
    page = render_html(payload, asset_root)
    output.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix='.dsv-',dir=output.parent))
    names = {'html':'visualization.html','request':'visualization.request.json','data':'visualization.data.json'}
    try:
        (staging/names['html']).write_text(page,encoding='utf-8')
        (staging/names['request']).write_text(json.dumps(replay_request(payload),ensure_ascii=False,allow_nan=False,indent=2)+'\n',encoding='utf-8')
        (staging/names['data']).write_text(json_text(payload)+'\n',encoding='utf-8')
        if output.exists():
            raise FileExistsError(f'输出目录已存在: {output}')
        os.rename(staging,output)
    finally:
        if staging.exists():shutil.rmtree(staging)
    return {kind:output/name for kind,name in names.items()}
