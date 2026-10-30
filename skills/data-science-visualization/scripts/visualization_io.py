"""Import declared columns and reproducible inputs; no statistical computation."""
from __future__ import annotations
import copy
import csv
import hashlib
import io
import json
import math
from pathlib import Path
import re

BINDING_TYPES = {'countPlot', 'missingValueMatrix', 'histogram', 'kdePlot', 'ecdfPlot', 'boxPlot',
                 'violinPlot', 'stripPlot', 'scatterPlot', 'hexbinPlot', 'correlationMatrix', 'pairPlot'}
ASSET_ROOT = Path(__file__).resolve().parents[1]

def require(condition, message):
    if not condition:
        raise ValueError(message)

def keys(value, allowed, location):
    require(isinstance(value, dict), f'{location}: 需要 object')
    require(not set(value) - set(allowed), f'{location}: 未知字段 {sorted(set(value)-set(allowed))}')

def text(value, location):
    require(isinstance(value, str) and bool(value.strip()), f'{location}: 需要非空字符串')
    return value

def choices(value, allowed, location):
    require(isinstance(value,list) and all(isinstance(v,str) and v in allowed for v in value),
            f'{location}: 需要合法枚举数组')
    require(len(set(value)) == len(value), f'{location}: 不能重复')
    return value

def json_text(value):
    return json.dumps(value, ensure_ascii=False, allow_nan=False, sort_keys=True, separators=(',', ':'))

def parse_json(value):
    def invalid(token):
        raise ValueError(f'JSON 非法数值: {token}')
    return json.loads(value, parse_constant=invalid)

def load_request(path):
    return parse_json(Path(path).read_text(encoding='utf-8-sig'))

def load_release_version(skill_root: Path) -> str:
    path = skill_root/'release.json'
    release = parse_json(path.read_text(encoding='utf-8'))
    version = release.get('version') if isinstance(release, dict) else None
    require(isinstance(version, str) and re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?', version),
            f'{path}: version 需要固定发布版本（主.次.补丁，可含预发布标识）')
    snapshot = parse_json((skill_root/'references/statplots/snapshot.json').read_text(encoding='utf-8'))
    require(snapshot['version'] == version,
            f'{path}: 库版本与参考快照不一致；请使用版本匹配的完整技能包')
    return version

def read_source(source, base_dir):
    keys(source, {'records', 'path', 'format', 'sheet'}, '/dataset/source')
    if 'records' in source:
        require(set(source) == {'records'}, 'records 与 path/format/sheet 互斥')
        records = source['records']
        require(isinstance(records, list), 'records 需要数组')
        raw = json_text(records).encode()
        return records, raw, '内嵌 records', False
    require('path' in source and 'format' in source, 'source 需要 records 或 path/format')
    path = (base_dir / text(source['path'], 'source.path')).resolve()
    raw = path.read_bytes()
    kind = source['format']
    require(kind in {'csv', 'tsv', 'json', 'xlsx'}, 'format 仅支持 csv/tsv/json/xlsx')
    if kind in {'csv', 'tsv'}:
        require('sheet' not in source, 'sheet 仅支持 xlsx')
        reader = csv.DictReader(io.StringIO(raw.decode('utf-8-sig')), delimiter='\t' if kind == 'tsv' else ',')
        require(reader.fieldnames and len(set(reader.fieldnames)) == len(reader.fieldnames), '表头缺失或重复')
        records = list(reader)
        require(all(None not in row and None not in row.values() for row in records), 'CSV 行长度与表头不一致')
        return records, raw, path.name, True
    if kind == 'json':
        require('sheet' not in source, 'sheet 仅支持 xlsx')
        return parse_json(raw.decode('utf-8-sig')), raw, path.name, False
    try:
        import openpyxl
    except ImportError as error:
        raise ValueError('XLSX 需要可选依赖：python -m pip install openpyxl；也可先导出 CSV。') from error
    sheet = text(source.get('sheet'), 'xlsx.sheet')
    book = openpyxl.load_workbook(path, read_only=True, data_only=True)
    try:
        require(sheet in book.sheetnames, f'工作表不存在: {sheet}')
        values = iter(book[sheet].values)
        headers = list(next(values, []))
        require(headers and all(isinstance(h, str) and h for h in headers) and len(set(headers)) == len(headers), 'XLSX 表头需非空唯一字符串')
        records = [dict(zip(headers, row)) for row in values]
        return records, raw, f'{path.name} / {sheet}', False
    finally:
        book.close()

def convert(value, column, csv_input, missing, location):
    if value is None or (csv_input and value in missing):
        return None
    kind = column['type']
    if kind == 'string':
        require(isinstance(value, str), f'{location}: string 列不隐式转换数值')
        return value
    if kind == 'boolean':
        if csv_input:
            require(value.lower() in {'true', 'false'}, f'{location}: boolean 仅接受 true/false')
            return value.lower() == 'true'
        require(type(value) is bool, f'{location}: 需要 boolean')
        return value
    require(type(value) is not bool and (csv_input or type(value) in {int, float}), f'{location}: number 不接受字符串/boolean')
    try:
        number = float(value)
    except (ValueError, TypeError) as error:
        raise ValueError(f'{location}: 非法 number {value!r}') from error
    require(math.isfinite(number), f'{location}: 数值必须有限')
    return number

def check_plot_budget(spec):
    kind = spec.get('type')
    variables = spec.get('variables', [])
    data = spec.get('data', [])
    rows = data.get('observations', []) if isinstance(data, dict) else data
    require(isinstance(rows, list), 'spec.data/observations 需要数组')
    if kind in {'pairPlot', 'missingValueMatrix', 'correlationMatrix'}:
        require(isinstance(variables, list), 'variables 需要数组')
        limit = 4 if kind == 'pairPlot' else 20
        require(len(variables) <= limit, f'{kind} 最多 {limit} 个变量')
        if kind == 'pairPlot':
            require(len(rows)*len(variables)*(len(variables)-1) <= 120000, 'pairPlot 超过 120000 点预算；减少变量或明确采样')
        if kind == 'missingValueMatrix':
            require(len(rows)*len(variables) <= 200000, 'missingValueMatrix 超过 200000 网格预算')
    if kind in {'kdePlot', 'violinPlot'}:
        groups = {(r.get('category') if kind == 'violinPlot' else None, r.get('series')) for r in rows}
        require(len(groups) <= 20, f'{kind} 最多 20 个分组，请明确范围')

def build_payload(request, base_dir):
    keys(request, {'version', 'title', 'dataset', 'charts', 'controls', 'presentation'}, '/')
    require(type(request.get('version')) is int and request['version'] == 1, 'version 必须为 1')
    title = text(request.get('title'), 'title')
    display = request.get('presentation', {})
    keys(display, {'actions','details'}, 'presentation')
    presentation = {
        'actions': choices(display.get('actions', []), {'theme','exportPNG','exportSpec','saveView'}, 'presentation.actions'),
        'details': choices(display.get('details', []), {'counts','provenance'}, 'presentation.details')}
    charts = request.get('charts')
    require(isinstance(charts, list) and 1 <= len(charts) <= 8, 'charts 需要 1–8 张图')
    version = load_release_version(ASSET_ROOT)
    catalog = parse_json((ASSET_ROOT/'references/statplots/index.json').read_text())
    types = {entry['type'] for entry in catalog}
    needed, chart_ids = set(), set()
    for chart in charts:
        keys(chart, {'id', 'binding', 'spec', 'source', 'caption', 'interactions'}, '/charts')
        ident = chart.get('id')
        require(isinstance(ident, str) and re.fullmatch(r'[a-zA-Z][a-zA-Z0-9_-]*', ident), 'chart.id 需要合法唯一 ID')
        require(ident not in chart_ids, f'重复 chart.id: {ident}')
        chart_ids.add(ident)
        require(('binding' in chart) != ('spec' in chart), f'{ident}: binding 与 spec 二选一')
        if 'caption' in chart:
            require(isinstance(chart['caption'], str), f'{ident}.caption 需要字符串')
        if 'binding' in chart:
            require('source' not in chart, 'binding 图使用 dataset 来源')
            binding = chart['binding']
            keys(binding, {'type', 'fields', 'options'}, f'{ident}.binding')
            require(binding.get('type') in BINDING_TYPES, '该 type 尚无表格绑定；请使用规范 spec 入口')
            require(isinstance(binding.get('fields'), dict), 'binding.fields 需要对象')
            for field in binding['fields'].values():
                refs = field if isinstance(field, list) else [field]
                require(bool(refs) and all(isinstance(f, str) and f for f in refs), 'fields 需要列名或非空列名数组')
                needed.update(refs)
            require(isinstance(binding.get('options', {}), dict), 'binding.options 需要对象')
            require(not {'type', 'data', 'variables'} & set(binding.get('options', {})), 'options 不能覆盖 type/data/variables')
            check_plot_budget({'type':binding['type'], 'variables':binding['fields'].get('variables', []), 'data':[]})
        else:
            require(isinstance(chart['spec'], dict) and chart['spec'].get('type') in types, 'spec.type 不在固定目录')
            keys(chart.get('source'), {'label', 'note'}, 'chart.source')
            text(chart['source'].get('label'), 'chart.source.label')
            if 'note' in chart['source']:
                require(isinstance(chart['source']['note'], str), 'source.note 需要字符串')
            check_plot_budget(chart['spec'])
        kind = chart.get('binding', chart.get('spec', {}))['type']
        interactions = choices(chart.get('interactions', []), {'brush','legendFilter'}, f'{ident}.interactions')
        require('brush' not in interactions or kind == 'pairPlot', 'brush 仅支持 pairPlot')
        require('legendFilter' not in interactions or kind != 'pairPlot', 'pairPlot 图例仅说明颜色')
    controls = request.get('controls', {})
    keys(controls, {'filters', 'initialFilters', 'variableSwitch', 'parameters'}, 'controls')
    for name in controls:
        require(isinstance(controls[name], list), f'controls.{name} 需要数组')
    for control in controls.get('filters', []):
        keys(control, {'field', 'kind'}, 'filter')
        require(control.get('kind') in {'category', 'range'}, 'filter.kind 需要 category/range')
        needed.add(text(control.get('field'), 'filter.field'))
    declarations = {(c['field'],c['kind']) for c in controls.get('filters', [])}
    require(len(declarations) == len(controls.get('filters', [])), '筛选控件不能重复')
    initial_seen = set()
    for control in controls.get('initialFilters', []):
        keys(control, {'field','kind','value'}, 'initialFilters')
        needed.add(text(control.get('field'), 'initialFilters.field'))
        require(control.get('kind') in {'category','range'}, 'initialFilters.kind 需要 category/range')
        signature = (control.get('field'),control.get('kind'))
        require(signature not in initial_seen, 'initialFilters 不能重复')
        initial_seen.add(signature)
        require('value' in control, 'initialFilters 需要 value')
        value = control['value']
        if control['kind'] == 'category':
            require(value is None or isinstance(value,str), '初始类别需要 string 或 null（全部）')
        else:
            require(isinstance(value,list) and len(value)==2 and any(v is not None for v in value), '初始范围需要两个边界，至少一端有限；null 表示无界')
            require(all(v is None or (type(v) in {int,float} and math.isfinite(v)) for v in value), '初始边界需有限数值或 null')
            require(value[0] is None or value[1] is None or value[0] <= value[1], '初始范围下界不能大于上界')
    by_id = {c['id']: c for c in charts}
    for control in controls.get('variableSwitch', []):
        keys(control, {'chartId', 'role', 'candidates'}, 'variableSwitch')
        chart = by_id.get(control.get('chartId'), {})
        binding = chart.get('binding', {})
        role = control.get('role')
        require(role in {'value', 'x', 'y'} and role in binding.get('fields', {}), 'variableSwitch 仅支持已有 value/x/y 表格角色')
        candidates = control.get('candidates')
        require(isinstance(candidates, list) and candidates and all(isinstance(c, str) for c in candidates), 'candidates 需要非空列名数组')
        require(binding['fields'][role] in candidates and len(set(candidates)) == len(candidates), 'candidates 需包含当前列且唯一')
        needed.update(candidates)
    allowed_parameters = {('histogram','binning.binCount'),('histogram','statistic'),('correlationMatrix','method')}
    for control in controls.get('parameters', []):
        keys(control, {'chartId', 'path', 'values'}, 'parameter')
        binding = by_id.get(control.get('chartId'), {}).get('binding', {})
        require((binding.get('type'), control.get('path')) in allowed_parameters, '不支持的参数控件')
        values = control.get('values')
        require(isinstance(values, list) and values, 'parameters.values 需要非空数组')
        if control['path'] == 'binning.binCount':
            require(all(type(v) is int and 1 <= v <= 200 for v in values), 'binCount 需要 1–200 整数')
        elif control['path'] == 'statistic':
            require(all(v in {'count','proportion','density'} for v in values), '非法 histogram statistic')
        else:
            require(all(v in {'pearson','spearman','kendall'} for v in values), '非法 correlation method')
    dataset = None
    if 'dataset' in request:
        data = request['dataset']
        keys(data, {'source','columns','missingTokens','idColumn'}, 'dataset')
        columns = data.get('columns')
        require(isinstance(columns, list) and columns, 'columns 需要非空声明')
        column_map = {}
        for col in columns:
            keys(col, {'name','type','label','unit'}, 'column')
            name = text(col.get('name'), 'column.name')
            require(name not in column_map and col.get('type') in {'number','string','boolean'}, '列名重复或类型非法')
            for key in {'label','unit'} & col.keys(): text(col[key], f'column.{key}')
            column_map[name] = col
        if 'idColumn' in data:
            needed.add(data['idColumn'])
            require(column_map.get(data['idColumn'], {}).get('type') == 'string', 'idColumn 需要声明 string')
        require(needed <= column_map.keys(), f'引用了不存在的列: {sorted(needed-column_map.keys())}')
        for control in controls.get('filters', []) + controls.get('initialFilters', []):
            expected = 'number' if control['kind'] == 'range' else 'string'
            require(column_map[control['field']]['type'] == expected, f'{control["field"]}: 筛选列需要 {expected}')
        for control in controls.get('variableSwitch', []):
            require(all(column_map[c]['type'] == 'number' for c in control['candidates']), '变量切换需要数值列')
        records, raw, label, csv_input = read_source(data.get('source'), Path(base_dir))
        require(isinstance(records, list) and all(isinstance(r, dict) for r in records), '数据需要 records 对象数组')
        missing = data.get('missingTokens', [''])
        require(isinstance(missing, list) and all(isinstance(v, str) for v in missing), 'missingTokens 需要字符串数组')
        selected = [c for c in columns if c['name'] in needed]
        rows, ids = [], set()
        for index, record in enumerate(records):
            require(needed <= record.keys(), f'第 {index+1} 行缺少列: {sorted(needed-record.keys())}')
            values = {c['name']:convert(record[c['name']], c, csv_input, missing, f'row {index+1}/{c["name"]}') for c in selected}
            ident = values[data['idColumn']] if 'idColumn' in data else f'row-{index+1}'
            require(isinstance(ident, str) and ident.strip() and ident not in ids, f'第 {index+1} 行 ID 缺失或重复')
            ids.add(ident)
            rows.append({'id':ident,'values':values})
        dataset = {'columns':selected,'rows':rows,'source':{'label':label,'sha256':hashlib.sha256(raw).hexdigest(),
            'originalN':len(records),'missingTokens':missing if csv_input else [],
            'conversions':[f'{c["name"]}: CSV → {c["type"]}' for c in selected] if csv_input else [],
            'idColumn':data.get('idColumn')}}
        for initial in controls.get('initialFilters', []):
            if initial['kind'] == 'category' and initial['value'] is not None:
                require(any(row['values'][initial['field']] == initial['value'] for row in rows), '初始类别不在数据中')
        for chart in charts:
            if 'binding' in chart:
                binding = chart['binding']
                check_plot_budget({'type':binding['type'],'variables':binding['fields'].get('variables', []),
                                   'data':{'observations':rows}})
    else:
        require(not needed, '表格绑定或控件需要 dataset')
    payload = {'version':1,'title':title,'libraries':{'vchart':version,'statplots':version},
               'dataset':dataset,'charts':copy.deepcopy(charts),'controls':copy.deepcopy(controls),
               'presentation':copy.deepcopy(presentation)}
    require(len(json_text(payload).encode()) <= 10*1024*1024, '内嵌 payload 超过 10 MiB，请明确选择范围')
    return payload
