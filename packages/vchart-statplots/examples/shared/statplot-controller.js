/* Shared browser lifecycle. Statistics and geometry belong to statplots. */
(function (global) {
  'use strict';
  function create(options) {
    const VChart = global.VChart;
    const plots = global.VChartStatPlots;
    if (typeof VChart?.default !== 'function' || typeof plots?.compileStatPlot !== 'function') {
      throw new Error('图表库加载失败，请检查网络或外部脚本限制。');
    }
    plots.registerStatPlots();
    let chart = null;
    let lastSpec = null;
    let queue = Promise.resolve();
    let closed = false;
    let releasing;
    function compile(spec) {
      const result = plots.validateStatPlot(spec);
      if (!result.valid) throw new Error(result.errors.map(e => `${e.path}: ${e.message}`).join('\n'));
      let input = spec;
      if (options.showTitle === false) {
        const { title, description, ...withoutTitle } = spec;
        input = withoutTitle;
      }
      const compiled = plots.compileStatPlot(input);
      if (options.animation !== undefined) compiled.animation = options.animation;
      if (options.confineTooltip) compiled.tooltip = { ...compiled.tooltip, confine: true };
      if (options.interactions !== undefined) {
        if (compiled.brush && !options.interactions.includes('brush')) {
          if (Array.isArray(compiled.brush)) compiled.brush = compiled.brush.map(brush => ({ ...brush, visible: false }));
          else compiled.brush = { ...compiled.brush, visible: false };
        }
        if (compiled.legends && !options.interactions.includes('legendFilter')) {
          if (Array.isArray(compiled.legends)) compiled.legends = compiled.legends.map(legend => ({ ...legend, interactive: false }));
          else compiled.legends = { ...compiled.legends, interactive: false };
        }
      }
      return compiled;
    }
    async function draw(compiled) {
      if (chart) await chart.updateSpec(compiled);
      else {
        chart = new VChart.default(compiled, { dom: options.dom, autoFit: true });
        await chart.renderAsync();
      }
    }
    function drop() { if (chart) { chart.release(); chart = null; } }
    function enqueue(action) {
      if (closed) return Promise.reject(new Error('Chart controller released'));
      const pending = queue.then(() => {
        if (closed) throw new Error('Chart controller released');
        return action();
      });
      queue = pending.catch(() => {});
      return pending;
    }
    return {
      get chart() { return chart; },
      get spec() { return lastSpec; },
      update(spec) {
        return enqueue(async () => {
          const compiled = compile(spec); // Errors here leave the previous chart untouched.
          try { await draw(compiled); }
          catch (error) {
            drop();
            if (lastSpec && !closed) {
              try { await draw(compile(lastSpec)); }
              catch (recovery) { drop(); throw new Error(`${error.message}; 恢复失败：${recovery.message}`); }
            }
            throw error;
          }
          lastSpec = spec;
        });
      },
      exportPNG(name) {
        return enqueue(async () => {
          if (!chart) throw new Error('没有已成功绘制的图表');
          await chart.exportImg(name);
        });
      },
      release() {
        if (!releasing) { closed = true; releasing = queue.then(drop); }
        return releasing;
      }
    };
  }
  global.StatPlotController = { create };
})(globalThis);
