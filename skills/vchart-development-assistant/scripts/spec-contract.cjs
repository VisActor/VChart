/* Narrow VChart configuration checks; rendering and visual acceptance are separate. */
(function (root) {
  function validateSpec(spec) {
    const errors = [];
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
      return {ok: false, errors: [{code: 'SPEC_OBJECT_REQUIRED', path: 'spec', message: 'Define a spec object.'}]};
    }
    // Graphic coordinates are not CSS lengths. Do not evaluate callbacks here:
    // their pixel values depend on the actual browser layout.
    function checkCustomMarks(marks, path) {
      if (!Array.isArray(marks)) return;
      marks.forEach((mark, index) => {
        if (!mark || typeof mark !== 'object') return;
        for (const axis of ['x', 'y']) {
          if (typeof mark.style?.[axis] === 'string' && mark.style[axis].trim().endsWith('%')) {
            errors.push({code: 'CUSTOM_MARK_PIXEL_COORDINATE', path: `${path}[${index}].style.${axis}`, message: 'customMark x/y are graphic coordinates, not CSS percentages. Use pixel numbers or layout callbacks returning pixels; see references/components/mark.md.'});
          }
        }
        checkCustomMarks(mark.children, `${path}[${index}].children`);
      });
    }
    checkCustomMarks(spec.customMark, 'spec.customMark');
    const legends = Array.isArray(spec.legends) ? spec.legends : spec.legends ? [spec.legends] : [];
    legends.forEach((legend, index) => {
      if (legend && (legend.type == null || legend.type === 'discrete') &&
          legend.data != null && typeof legend.data !== 'function') {
        errors.push({code: 'DISCRETE_LEGEND_DATA_FUNCTION', path: `spec.legends[${index}].data`, message: 'Discrete legend data must be a callback returning legend items, not an array. Omit data to use generated items; see references/components/legend.md.'});
      }
    });
    const charts = [{config: spec, path: 'spec'}, ...(spec.series || []).map((config, index) => ({config, path: `spec.series[${index}]`}))];
    for (const {config, path} of charts) {
      for (const key of ['label', 'nonLeafLabel']) {
        if (config[key]?.formatMethod != null && typeof config[key].formatMethod !== 'function') {
          errors.push({code: 'LABEL_FORMAT_METHOD_FUNCTION', path: `${path}.${key}.formatMethod`, message: 'formatMethod must be an executable function (text, datum), not a string or placeholder. Preserve callbacks in JS; use a supported formatter template for JSON.'});
        }
        if (typeof config[key]?.formatter === 'function') {
          errors.push({code: 'FUNCTION_FORMATTER', path: `${path}.${key}.formatter`, message: 'formatter is a template string; use formatMethod for a function.'});
        }
      }
      const data = Array.isArray(config.data) ? config.data : config.data ? [config.data] : [];
      for (const [index, entry] of data.entries()) {
        if (!entry || typeof entry !== 'object') continue;
        if ('value' in entry && !('values' in entry)) {
          errors.push({code: 'DATA_VALUES_REQUIRED', path: `${path}.data[${index}]`, message: 'Use data.values for inline data; a hierarchy root belongs inside the values array.'});
        }
        const hierarchyNode = ['treemap', 'sunburst'].includes(config.type) &&
          ('children' in entry || (typeof config.categoryField === 'string' && config.categoryField in entry));
        const dataReference = typeof entry.fromDataId === 'string' || typeof entry.fromDataIndex === 'number';
        if (hierarchyNode && !('values' in entry) && !('value' in entry) && !dataReference) {
          errors.push({code: 'DATA_VALUES_REQUIRED', path: `${path}.data[${index}]`, message: 'data contains data-source descriptors, not hierarchy nodes. Put root nodes inside data.values.'});
        }
        const parsedText = typeof entry.values === 'string' && ['csv', 'dsv', 'tsv'].includes(entry.parser?.type);
        if (['treemap', 'sunburst'].includes(config.type) && 'values' in entry && !Array.isArray(entry.values) && !parsedText) {
          errors.push({code: 'HIERARCHY_ROOT_ARRAY', path: `${path}.data[${index}].values`, message: 'Hierarchy values must be an array of root nodes, or text with a csv/dsv/tsv parser; children stay on each node.'});
        }
      }
    }
    // Resolve each series' actual data rather than treating every root dataset
    // as graph data. Combined charts may keep unrelated datasets at the root.
    const sources = data => Array.isArray(data) ? data : data ? [data] : [];
    const series = spec.series?.length ? spec.series : [spec];
    for (const [index, config] of series.entries()) {
      if ((config.type || spec.type) !== 'sankey') continue;
      const path = spec.series?.length ? `spec.series[${index}].data` : 'spec.data';
      let data = config.data;
      if (data == null && config !== spec) {
        const rootData = sources(spec.data);
        // A series without inline data uses one root dataset, first by default.
        // Unresolved explicit references are left to runtime validation.
        if (config.dataId != null) data = rootData.find(d => d?.id === config.dataId);
        else data = rootData[config.dataIndex ?? 0];
      }
      const entries = sources(data);
      for (const [i, entry] of entries.entries()) {
        if (!entry || !('values' in entry) || entry.parser || entry.transforms?.length ||
            entry.fromDataId != null || entry.fromDataIndex != null) continue;
        if (!Array.isArray(entry.values)) {
          errors.push({code: 'SANKEY_GRAPH_REQUIRED', path: `${path}[${i}].values`, message: 'Inline Sankey values must be an array containing a graph: [{nodes, links}], not a bare graph object. See references/examples/sankey/basic-sankey.md.'});
          continue;
        }
        if (entry.values.length === 0) continue;
        // Named graph records belong inside one dataset's values array.
        if (entry.values.length === 2 &&
            entry.values.some(d => d?.id === 'nodes' && Array.isArray(d.values)) &&
            entry.values.some(d => d?.id === 'links' && Array.isArray(d.values))) continue;
        const graph = entry.values[0];
        // A nodes-only hierarchy is also valid. Endpoint mapping is controlled
        // by nodeKey/sourceField/targetField, not by a fixed business schema.
        if (entry.values.length !== 1 || !graph || (!Array.isArray(graph.nodes) && !Array.isArray(graph.links))) {
          errors.push({code: 'SANKEY_GRAPH_REQUIRED', path: `${path}[${i}].values`, message: 'Sankey values must contain one graph object: [{nodes, links}], not flat edge rows. Put the requested edge data in links; derive unique nodes and set nodeKey when endpoints use names. A nodes-only hierarchy or named nodes/links records inside values is also supported.'});
        }
      }
    }
    return {ok: errors.length === 0, errors};
  }
  if (typeof module === 'object' && module.exports) module.exports = {validateSpec};
  else root.VChartSpecContract = {validateSpec};
})(typeof globalThis === 'object' ? globalThis : this);
