"""Safe, self-contained HTML packaging. Library UMDs remain pinned CDN assets."""
from __future__ import annotations
import html
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from visualization_io import json_text

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
    actions = payload['presentation']['actions']
    details = payload['presentation']['details']
    controls = payload['controls']
    has_filters = bool(controls.get('filters'))
    has_editors = bool(controls.get('variableSwitch') or controls.get('parameters'))
    buttons = []
    if has_filters:
        buttons.extend(['<button type="button" id="apply" disabled>应用筛选</button>',
                        '<button type="button" id="clear" disabled>清空筛选</button>'])
    for action,ident,label in [('theme','theme','切换主题'),('exportSpec','download','下载输入配置'),
                               ('saveView','save-view','保存当前视图请求')]:
        if action in actions:
            buttons.append(f'<button type="button" id="{ident}" disabled>{label}</button>')
    summary = '<p id="summary" role="status"></p>' if has_filters or 'counts' in details else ''
    toolbar = ''
    if has_filters or has_editors or buttons:
        editor_root = '<div id="controls"></div>' if has_filters or has_editors else ''
        action_root = f'<div class="actions">{"".join(buttons)}</div>' if buttons else ''
        toolbar = f'<section class="toolbar" aria-label="图表操作">{editor_root}{action_root}{summary}</section>'
    else:
        toolbar = summary
    cards = []
    for chart in payload['charts']:
        spec = chart.get('spec', chart.get('binding', {}))
        kind = spec['type']
        options = spec.get('options', spec)
        title = options.get('title', chart['id'])
        source = payload['dataset']['source'] if 'binding' in chart else chart['source']
        heading = f'<h2>{esc(title)}</h2>' if len(payload['charts']) > 1 else ''
        scope = '<p class="scope">已有结果；不随表格筛选更新</p>' if has_filters and 'spec' in chart else ''
        meta = f'<p class="chart-meta" id="meta-{esc(chart["id"])}" role="status"></p>' if 'counts' in details else ''
        units = ''
        variables = chart.get('binding', {}).get('fields', {}).get('variables', [])
        columns = {column['name']:column for column in (payload['dataset'] or {}).get('columns', [])}
        labels = [f'{name}：{columns[name].get("label", name)}（{columns[name]["unit"]}）'
                  for name in variables if columns[name].get('unit')]
        if labels:
            units = f'<p class="units">{esc("；".join(labels))}</p>'
        caption = f'<p class="caption">{esc(chart["caption"])}</p>' if chart.get('caption') else ''
        provenance = f'<p class="source">来源：{esc(source["label"])} {esc(source.get("note", ""))}</p>' if 'provenance' in details else ''
        png = f'<button type="button" data-png="{esc(chart["id"])}" disabled>导出 PNG</button>' if 'exportPNG' in actions else ''
        cards.append(f'<section class="card" data-chart="{esc(chart["id"])}">{heading}{scope}'
          f'<div id="dsv-{esc(chart["id"])}" class="plot {"pair" if kind=="pairPlot" else ""}"'
          f' role="img" aria-label="{esc(title if heading else payload["title"])}">图表加载中</div>'
          f'{units}{meta}<p class="empty" id="empty-{esc(chart["id"])}" role="status" hidden></p>'
          f'<p class="chart-error" id="error-{esc(chart["id"])}" role="alert" hidden></p>'
          f'{caption}{provenance}{png}</section>')
    data = payload['dataset']
    provenance = ''
    if 'provenance' in details and data:
        provenance = f'<p class="provenance">来源：{esc(data["source"]["label"])} · SHA-256 {esc(data["source"]["sha256"])}</p>'
    replacements = {'TITLE':esc(payload['title']), 'CSS':content['page.css'], 'CARDS':''.join(cards),
      'SOURCE':provenance, 'TOOLBAR':toolbar, 'DATA':json_text(payload).replace('<','\\u003c'), 'VERSION':payload['libraries']['vchart'],
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
