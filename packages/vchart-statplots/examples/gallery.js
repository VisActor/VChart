async function initGallery() {
  const response = await fetch('/docs/plot-catalog.json');
  if (!response.ok) throw new Error(`图表目录加载失败（${response.status}）`);
  const catalog = await response.json();
  const groups = [];
  for (const entry of catalog) {
    let group = groups.find(([name]) => name === entry.group);
    if (!group) {
      group = [entry.group, []];
      groups.push(group);
    }
    group[1].push([entry.type, entry.name]);
  }
  const labels = new Map(catalog.map(entry => [entry.type, entry.name]));
  const storageKey = 'vchart-statplots:last-type';
  const nav = document.getElementById('chart-nav');
  const input = document.getElementById('input');
  const error = document.getElementById('error');
  const status = document.getElementById('status');
  const preview = document.querySelector('.preview');
  const controls = document.querySelectorAll('.editor button, .editor select, #input');
  const colorControls = document.querySelectorAll('[data-color-role]');
  const colorDefaults = { categorical: 'colorblind', sequential: 'viridis', diverging: 'RdBu_r' };
  const controller = StatPlotController.create({ dom: 'plot' });
  let revision = 0;

  function typeUrl(type) {
    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    return url;
  }

  for (const [name, plots] of groups) {
    const section = document.createElement('section');
    section.className = 'nav-group';
    const heading = document.createElement('h3');
    heading.textContent = name;
    const list = document.createElement('ul');
    for (const [type, label] of plots) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'chart-link';
      link.dataset.type = type;
      link.href = typeUrl(type).href;
      const title = document.createElement('span');
      title.textContent = label;
      const code = document.createElement('code');
      code.textContent = type;
      link.append(title, code);
      item.append(link);
      list.append(item);
    }
    section.append(heading, list);
    nav.append(section);
  }

  function canonicalGalleryType(value) {
    if (labels.has(value)) return value;
    const mapped = window.statPlotLegacyTypes[value];
    return labels.has(mapped) ? mapped : undefined;
  }

  function resolveType() {
    const requested = new URL(window.location.href).searchParams.get('type');
    const requestedType = canonicalGalleryType(requested);
    if (requestedType) return requestedType;
    // 浏览器可能禁用本地存储；URL 导航仍然可用。
    try {
      const saved = localStorage.getItem(storageKey);
      const savedType = canonicalGalleryType(saved);
      if (savedType) return savedType;
    } catch {}
    return 'violinPlot';
  }

  function updateUrl(type, mode) {
    const url = typeUrl(type);
    if (url.href !== window.location.href) {
      window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
    }
  }

  function selectLink(type) {
    for (const link of nav.querySelectorAll('a[data-type]')) {
      if (link.dataset.type === type) {
        link.setAttribute('aria-current', 'page');
        // 只滚动导航，不把用户从编辑器或图表位置带走。
        const bounds = link.getBoundingClientRect();
        const navTop = nav.getBoundingClientRect().top + nav.clientTop;
        const visibleTop = navTop + nav.querySelector('.nav-heading').offsetHeight;
        const visibleBottom = navTop + nav.clientHeight;
        if (bounds.top < visibleTop) nav.scrollTop += bounds.top - visibleTop;
        else if (bounds.bottom > visibleBottom) nav.scrollTop += bounds.bottom - visibleBottom;
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  function setLoading(loading) {
    preview.setAttribute('aria-busy', String(loading));
    controls.forEach(control => {
      control.disabled = loading;
    });
  }

  async function draw(spec, current) {
    await controller.update(spec);
    if (current !== revision) return false;
    colorControls.forEach(control => {
      const value = spec.colors?.[control.dataset.colorRole] ?? colorDefaults[control.dataset.colorRole];
      control.value = Array.isArray(value) ? 'custom' : value;
    });
    status.textContent = `${spec.type} · ${
      Array.isArray(spec.data) ? spec.data.length + ' 条输入记录' : spec.data.observations.length + ' 条观测'
    } · ${spec.theme || 'light'}`;
    const entry = catalog.find(item => item.type === spec.type);
    const matchesOptions = (actual, expected) =>
      typeof expected === 'object'
        ? Object.entries(expected).every(([key, value]) => matchesOptions(actual?.[key], value))
        : actual === expected;
    const variant = entry.variants
      .filter(item => Object.entries(item.options).every(([key, value]) => matchesOptions(spec[key], value)))
      .sort((a, b) => Object.keys(b.options).length - Object.keys(a.options).length)[0];
    const displayName = variant?.name ?? entry.name;
    document.getElementById('chart-title').textContent = displayName;
    document.getElementById('chart-type').textContent = spec.type;
    document.getElementById('schema').href = `/schema/plots/${encodeURIComponent(spec.type)}.schema.json`;
    document.title = `${displayName} · VChart StatPlots`;
    selectLink(spec.type);
    try {
      localStorage.setItem(storageKey, spec.type);
    } catch {}
    return true;
  }

  async function choose(type, mode = 'push') {
    const current = ++revision;
    updateUrl(type, mode);
    selectLink(type);
    setLoading(true);
    error.textContent = '';
    status.textContent = `正在加载 ${type}…`;
    try {
      const response = await fetch(`/examples/specs/${type}.json`);
      if (!response.ok) throw new Error(`示例加载失败（${response.status}）：${type}`);
      const spec = await response.json();
      // 连续切换时，较慢的旧请求不得覆盖最后一次选择。
      if (current !== revision) return;
      input.value = JSON.stringify(spec, null, 2);
      await draw(spec, current);
    } catch (e) {
      if (current === revision) {
        error.textContent = e.message;
        status.textContent = `${type} 加载失败，请重新选择图表。`;
      }
    } finally {
      if (current === revision) setLoading(false);
    }
  }

  async function drawInput(toggleTheme = false, colorChange) {
    const current = ++revision;
    error.textContent = '';
    try {
      const spec = JSON.parse(input.value);
      if (colorChange) {
        spec.colors = { ...spec.colors, ...colorChange };
        input.value = JSON.stringify(spec, null, 2);
      }
      if (toggleTheme) {
        spec.theme = spec.theme === 'dark' ? 'light' : 'dark';
        input.value = JSON.stringify(spec, null, 2);
      }
      if (await draw(spec, current)) updateUrl(spec.type, 'push');
    } catch (e) {
      if (current === revision) error.textContent = e.message;
    }
  }

  nav.addEventListener('click', event => {
    const link = event.target.closest('a[data-type]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    choose(link.dataset.type);
  });
  document.getElementById('render').addEventListener('click', () => drawInput());
  document.getElementById('theme').addEventListener('click', () => drawInput(true));
  colorControls.forEach(control =>
    control.addEventListener('change', () => drawInput(false, { [control.dataset.colorRole]: control.value }))
  );
  document.getElementById('export').addEventListener('click', async () => {
    try { await controller.exportPNG(); } catch (e) { error.textContent = e.message; }
  });
  window.addEventListener('popstate', () => choose(resolveType(), 'replace'));
  window.addEventListener('beforeunload', () => controller.release());
  choose(resolveType(), 'replace');
}
initGallery().catch(error => {
  document.getElementById('error').textContent = error.message;
});
