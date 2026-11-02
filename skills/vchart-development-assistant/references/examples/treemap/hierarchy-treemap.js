// Convert tabular records to a hierarchy without changing business field names.
function createTreemapSpec(rows, { hierarchyFields, valueField }) {
  if (!hierarchyFields.length) throw new Error('Specify at least one hierarchy field.');
  for (const row of rows) {
    if (row[valueField] === null || row[valueField] === '' || !Number.isFinite(Number(row[valueField]))) {
      throw new Error(`Invalid numeric value for ${valueField}.`);
    }
  }
  const categoryField = hierarchyFields[hierarchyFields.length - 1];
  function nest(items, level) {
    if (level === hierarchyFields.length - 1) return items.map(row => ({ ...row, [valueField]: Number(row[valueField]) }));
    const buckets = new Map();
    for (const row of items) {
      const key = row[hierarchyFields[level]];
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(row);
    }
    return Array.from(buckets, ([key, children]) => ({ [categoryField]: key, children: nest(children, level + 1) }));
  }
  return {
    type: 'treemap', categoryField, valueField,
    data: { values: rows.length ? [{ [categoryField]: 'Total', children: nest(rows, 0) }] : [] },
    label: { visible: true },
    tooltip: { visible: true }
  };
}

// Optional: use only when the task needs custom tooltip content or formatting.
function createTreemapTooltip(categoryField, valueField) {
  function raw(node) {
    if (Array.isArray(node?.datum)) return node.datum[node.datum.length - 1] ?? node;
    return node?.datum && typeof node.datum === 'object' ? node.datum : node;
  }
  return { visible: true, mark: {
    title: { value: node => String(raw(node)[categoryField]) },
    content: [{ key: valueField, value: node => String(raw(node)[valueField]) }]
  } };
}

// Replace the sample records and mappings with the user's complete data.
const rows = [
  { segment: 'North', product: 'Alpha', sales: 8 },
  { segment: 'North', product: 'Beta', sales: 5 },
  { segment: 'South', product: 'Gamma', sales: 4 }
];
const spec = createTreemapSpec(rows, { hierarchyFields: ['segment', 'product'], valueField: 'sales' });
// When custom content is requested: spec.tooltip = createTreemapTooltip('product', 'sales');
