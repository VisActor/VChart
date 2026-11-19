/**
 * PR #4592 review 修复效果演示（Issue #4585 后续）
 *
 * 使用真实的美国地图（从官方 CDN 加载 usa.json），每个州中心有一个标签。
 * 缩放 / 平移 / 更新数据时，标签应始终贴在对应州的中心，不发生「二次变换 / 重复变换」偏移。
 *
 * 场景一（P1）：普通 map 图。先缩放 1.5x，再「仅更新数值、保持地理不变」。
 *   - 修复前：数据更新后标签会相对地图偏移（标签基准位置重算后又叠加残留 postMatrix）。
 *   - 修复后：标签始终停在州中心。
 *
 * 场景二（P2）：common 图，同一 geo region 放两个 map 系列 + labelLayout:'region'，
 *   两个系列共享同一标签组件。点一次「缩放 1.5x」。
 *   - 修复前：地图 1.5 倍，共享标签 2.25 倍，标签明显飞离州中心。
 *   - 修复后：标签与地图一起 1.5 倍，仍贴在州中心。
 */
import { default as VChart } from '../../../../src/index';

const GEOJSON_URL = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/usa.json';
const MAP_NAME = 'usa-demo';

const SCALE = 1.5;
const SCALE_CENTER = { x: 250, y: 250 };

// 50 州 + DC 的人口数据（与仓库现有 map.ts 用例一致）
const US_POPULATION: { name: string; value: number }[] = [
  { name: 'Alabama', value: 4822023 },
  { name: 'Alaska', value: 731449 },
  { name: 'Arizona', value: 6553255 },
  { name: 'Arkansas', value: 2949131 },
  { name: 'California', value: 38041430 },
  { name: 'Colorado', value: 5187582 },
  { name: 'Connecticut', value: 3590347 },
  { name: 'Delaware', value: 917092 },
  { name: 'District of Columbia', value: 632323 },
  { name: 'Florida', value: 19317568 },
  { name: 'Georgia', value: 9919945 },
  { name: 'Hawaii', value: 1392313 },
  { name: 'Idaho', value: 1595728 },
  { name: 'Illinois', value: 12875255 },
  { name: 'Indiana', value: 6537334 },
  { name: 'Iowa', value: 3074186 },
  { name: 'Kansas', value: 2885905 },
  { name: 'Kentucky', value: 4380415 },
  { name: 'Louisiana', value: 4601893 },
  { name: 'Maine', value: 1329192 },
  { name: 'Maryland', value: 5884563 },
  { name: 'Massachusetts', value: 6646144 },
  { name: 'Michigan', value: 9883360 },
  { name: 'Minnesota', value: 5379139 },
  { name: 'Mississippi', value: 2984926 },
  { name: 'Missouri', value: 6021988 },
  { name: 'Montana', value: 1005141 },
  { name: 'Nebraska', value: 1855525 },
  { name: 'Nevada', value: 2758931 },
  { name: 'New Hampshire', value: 1320718 },
  { name: 'New Jersey', value: 8864590 },
  { name: 'New Mexico', value: 2085538 },
  { name: 'New York', value: 19570261 },
  { name: 'North Carolina', value: 9752073 },
  { name: 'North Dakota', value: 699628 },
  { name: 'Ohio', value: 11544225 },
  { name: 'Oklahoma', value: 3814820 },
  { name: 'Oregon', value: 3899353 },
  { name: 'Pennsylvania', value: 12763536 },
  { name: 'Rhode Island', value: 1050292 },
  { name: 'South Carolina', value: 4723723 },
  { name: 'South Dakota', value: 833354 },
  { name: 'Tennessee', value: 6456243 },
  { name: 'Texas', value: 26059203 },
  { name: 'Utah', value: 2855287 },
  { name: 'Vermont', value: 626011 },
  { name: 'Virginia', value: 8185867 },
  { name: 'Washington', value: 6897012 },
  { name: 'West Virginia', value: 1855413 },
  { name: 'Wisconsin', value: 5726398 },
  { name: 'Wyoming', value: 576412 }
];

// 「仅更新数值」用的另一组数据：name/地理完全不变，只把 value 打乱，触发数据更新重编码路径
const US_POPULATION_UPDATED = US_POPULATION.map((d, i) => ({
  name: d.name,
  value: Math.round(d.value * (0.5 + ((i * 37) % 100) / 50))
}));

const colorSpec = {
  type: 'linear',
  range: ['rgb(252,250,97)', 'rgb(252,150,134)', 'rgb(87,33,15)']
};

const areaStyle = {
  style: {
    fill: { field: 'value', scale: 'color', changeDomain: 'replace' as const },
    stroke: '#fff',
    lineWidth: 0.5
  }
};

const labelStyle = {
  visible: true,
  style: { fontSize: 10, fontWeight: 'bold', fill: '#1a1a1a', stroke: '#fff', lineWidth: 2 }
};

const run = async () => {
  const geojson = await (await fetch(GEOJSON_URL)).json();
  VChart.registerMap(MAP_NAME, geojson);

  // 构建页面骨架
  const root = document.getElementById('chart') as HTMLElement;
  root.innerHTML = `
    <div style="font-family: -apple-system, sans-serif; padding: 12px;">
      <h2 style="margin:0 0 4px">PR #4592 修复效果演示（真实美国地图）</h2>
      <p style="margin:0 0 12px;color:#666;font-size:13px">
        每个州中心有一个标签，应始终停在对应州中心。也可直接在图上滚轮缩放 / 拖拽平移。
      </p>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        <div>
          <h3 style="margin:0 0 6px">场景一 (P1)：缩放后更新数据</h3>
          <div style="margin-bottom:8px">
            <button id="p1-zoom">① 缩放 1.5x</button>
            <button id="p1-update">② 仅更新数值(地理不变)</button>
            <button id="p1-reset">重置</button>
          </div>
          <div id="chart-p1" style="width:560px;height:420px;border:1px solid #ddd"></div>
        </div>
        <div>
          <h3 style="margin:0 0 6px">场景二 (P2)：两个系列共享标签</h3>
          <div style="margin-bottom:8px">
            <button id="p2-zoom">缩放 1.5x</button>
            <button id="p2-reset">重置</button>
            <span id="p2-matrix" style="font-size:12px;color:#666;margin-left:8px"></span>
          </div>
          <div id="chart-p2" style="width:560px;height:420px;border:1px solid #ddd"></div>
        </div>
      </div>
    </div>
  `;

  // ---------- 场景一：普通 map ----------
  const p1Spec: any = {
    type: 'map',
    map: MAP_NAME,
    nameField: 'name',
    valueField: 'value',
    nameProperty: 'name',
    color: colorSpec,
    area: areaStyle,
    data: [{ id: 'data', values: US_POPULATION }],
    label: labelStyle,
    region: [{ roam: true, projection: { type: 'albersUsa' } }],
    animation: false
  };
  let p1 = new VChart(p1Spec, { dom: document.getElementById('chart-p1') as HTMLElement, animation: false });
  p1.renderAsync();

  document.getElementById('p1-zoom')!.onclick = () => (p1 as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
  document.getElementById('p1-update')!.onclick = () => p1.updateDataSync('data', US_POPULATION_UPDATED);
  document.getElementById('p1-reset')!.onclick = () => {
    p1.release();
    p1 = new VChart(p1Spec, { dom: document.getElementById('chart-p1') as HTMLElement, animation: false });
    p1.renderAsync();
    (window as any).p1 = p1;
  };

  // ---------- 场景二：common 图，两个 map 系列共享标签 ----------
  const mkSeries = (i: number) => ({
    type: 'map',
    map: MAP_NAME,
    nameField: 'name',
    valueField: 'value',
    nameProperty: 'name',
    regionIndex: 0,
    color: colorSpec,
    area: areaStyle,
    data: { id: `data-${i}`, values: US_POPULATION },
    label: labelStyle
  });
  const p2Spec: any = {
    type: 'common',
    labelLayout: 'region',
    series: [mkSeries(0), mkSeries(1)],
    region: [{ coordinate: 'geo', roam: true, projection: { type: 'albersUsa' } }],
    animation: false
  };
  let p2 = new VChart(p2Spec, { dom: document.getElementById('chart-p2') as HTMLElement, animation: false });
  p2.renderAsync();

  const showP2Matrix = () => {
    const series = (p2 as any).getChart().getAllSeries()[0];
    const label = series?._labelMark?.getComponent()?.getComponent();
    const path = series?.getRootMark().getProduct();
    const lm = label?.attribute.postMatrix;
    const pm = path?.attribute.postMatrix;
    document.getElementById('p2-matrix')!.textContent =
      `地图缩放=${pm ? pm.a.toFixed(2) : '-'}  共享标签缩放=${lm ? lm.a.toFixed(2) : '-'}`;
  };
  document.getElementById('p2-zoom')!.onclick = () => {
    (p2 as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    showP2Matrix();
  };
  document.getElementById('p2-reset')!.onclick = () => {
    p2.release();
    p2 = new VChart(p2Spec, { dom: document.getElementById('chart-p2') as HTMLElement, animation: false });
    p2.renderAsync().then(showP2Matrix);
    (window as any).p2 = p2;
  };

  (window as any).p1 = p1;
  (window as any).p2 = p2;
};

run();
