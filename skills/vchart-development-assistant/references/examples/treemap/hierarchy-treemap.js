let treemapLabelMeasureContext;

function fitTreemapLabel(text, node, options = {}) {
  const { fontSize = 14, fontFamily = 'sans-serif', fontWeight = 'normal', lineHeight = 18, padding = 6 } = options;
  const width = Math.abs(node.x1 - node.x0) - padding * 2;
  const height = Math.abs(node.y1 - node.y0) - padding * 2;
  const lines = Array.isArray(text) ? text.map(String) : String(text).split('\n');
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height < lines.length * lineHeight) return '';
  treemapLabelMeasureContext ??= document.createElement('canvas').getContext('2d');
  treemapLabelMeasureContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  if (lines.some(line => treemapLabelMeasureContext.measureText(line).width > width)) return '';
  // VRender uses an array of strings for multiple lines, not a newline in one string.
  return lines.length > 1 || Array.isArray(text) ? lines : String(text);
}

function createTreemapSpec(rows, options) {
  const { hierarchyFields, valueField, groupField, palette } = options;
  if (!hierarchyFields.length) throw new Error('Specify at least one hierarchy field.');
  for (const row of rows) {
    if (row[valueField] === null || row[valueField] === '' || !Number.isFinite(Number(row[valueField]))) {
      throw new Error(`Invalid numeric value for ${valueField}.`);
    }
    if (!Object.hasOwn(palette, row[groupField])) throw new Error(`Missing palette for ${groupField}: ${row[groupField]}`);
  }
  const categoryField = hierarchyFields[hierarchyFields.length - 1];
  const total = rows.reduce((sum, row) => sum + Number(row[valueField]), 0);
  function nest(items, level) {
    if (level === hierarchyFields.length - 1) return items.map(row => ({ ...row, [valueField]: Number(row[valueField]) }));
    const buckets = new Map();
    for (const row of items) {
      const key = row[hierarchyFields[level]];
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(row);
    }
    return Array.from(buckets, ([key, items]) => ({
      [categoryField]: key,
      [groupField]: items[0][groupField],
      children: nest(items, level + 1)
    }));
  }
  function raw(node) {
    if (Array.isArray(node?.datum)) return node.datum[node.datum.length - 1] ?? node;
    return node?.datum && typeof node.datum === 'object' ? node.datum : node;
  }
  const share = row => `${(total > 0 ? Number(row[valueField]) / total * 100 : 0).toFixed(0)}%`;
  function text(node) {
    const row = raw(node);
    return `${row[categoryField]} ${share(row)}`;
  }
  return {
    type: 'treemap', animation: false, categoryField, valueField, splitType: 'binary',
    data: { id: 'hierarchy', values: rows.length ? [{ [categoryField]: 'Total', children: nest(rows, 0) }] : [] },
    nodePadding: 0, gapWidth: 0,
    leaf: { style: { fill: node => palette[raw(node)[groupField]], stroke: '#ffffff', lineWidth: 1 }, state: { hover: { stroke: '#111827', lineWidth: 3, fillOpacity: 0.82 } } },
    nonLeafLabel: { visible: false },
    label: { visible: true, formatMethod: (_text, node) => fitTreemapLabel(text(node), node), style: { fill: '#ffffff', fontSize: 14, fontFamily: 'sans-serif', fontWeight: 'normal', lineHeight: 18 } },
    tooltip: { visible: true, mark: { title: { value: node => String(raw(node)[categoryField]) }, content: [
      { key: groupField, value: node => String(raw(node)[groupField]) },
      { key: valueField, value: node => String(raw(node)[valueField]) },
      { key: 'Share', value: node => share(raw(node)) }
    ] } }
  };
}

// Replace this example input and options with the user's complete data/mappings.
const rows = [
  { segment: 'North', product: 'Alpha', sales: 8 },
  { segment: 'North', product: 'Beta', sales: 5 },
  { segment: 'South', product: 'Gamma', sales: 4 },
  { segment: 'South', product: 'Delta', sales: 3 },
];
const spec = createTreemapSpec(rows, {
  hierarchyFields: ['segment', 'product'], valueField: 'sales', groupField: 'segment',
  palette: { North: '#2563eb', South: '#ea580c' },
});
