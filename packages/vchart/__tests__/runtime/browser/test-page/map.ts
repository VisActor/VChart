/**
 * 复现 Issue #4585：开启 roam 后，缩放/平移地图时 label 不跟随。
 * 验证修复后：缩放和平移地图时 label 应该跟着 path 一起变换。
 *
 * 验证方式：
 *   1. 等图表渲染完成；
 *   2. 通过 dispatchZoom 程序触发缩放，观察 path 与 label 是否同步缩放；
 *   3. 通过 region 上的 pan 接口程序触发平移；
 *   4. 也可以直接在页面上滚轮 / 拖拽，肉眼对比 label 是否始终位于对应国家的中心。
 */
import { default as VChart } from '../../../../src/index';

const CONTAINER_ID = 'chart';

const run = async () => {
  const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/usa.json');
  const geojson = await response.json();
  VChart.registerMap('usa', geojson);

  const spec: any = {
    type: 'map',
    title: {
      text: 'Issue #4585 - map label should follow zoom/pan',
      subtext: 'wheel to zoom, drag to pan, then check whether the label sticks to its country'
    },
    color: {
      type: 'linear',
      range: ['rgb(252,250,97)', 'rgb(252,150,134)', 'rgb(87,33,15)']
    },
    area: {
      style: {
        fill: {
          field: 'value',
          scale: 'color',
          changeDomain: 'replace'
        }
      }
    },
    data: [
      {
        values: [
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
        ]
      }
    ],
    nameField: 'name',
    valueField: 'value',
    nameProperty: 'name',
    map: 'usa',
    label: {
      visible: true,
      style: {
        fontSize: 10,
        stroke: '#fff',
        lineWidth: 2
      }
    },
    region: [
      {
        roam: true,
        projection: {
          type: 'albersUsa'
        }
      }
    ],
    legends: [
      {
        visible: true,
        type: 'color',
        field: 'value',
        orient: 'bottom',
        position: 'start',
        title: { visible: true, text: 'Population' }
      }
    ]
  };

  const vchart = new VChart(spec, {
    dom: document.getElementById(CONTAINER_ID) as HTMLElement
  });
  await vchart.renderAsync();
  (window as any).vchart = vchart;

  // 提供一些便捷的快捷键 / 全局函数辅助验证
  const getLabelGraphic = () => {
    const series = (vchart as any).getChart().getAllSeries()[0];
    return series?._labelMark?.getComponent()?.getComponent();
  };
  const getPathGroup = () => {
    const series = (vchart as any).getChart().getAllSeries()[0];
    return series?.getRootMark().getProduct();
  };

  const printState = (tag: string) => {
    const labelG = getLabelGraphic();
    const pathG = getPathGroup();
    console.log(`[${tag}] pathGroup.postMatrix=`, pathG?.attribute.postMatrix);
    console.log(`[${tag}] labelGraphic.postMatrix=`, labelG?.attribute.postMatrix);
  };

  printState('initial');

  // 程序触发缩放 1.5x，便于自动化校验
  (window as any).runZoomTest = (scale = 1.5) => {
    const region = (vchart as any).getChart().getAllRegions()[0];
    const { x, y, width, height } = region.getLayoutRect
      ? { ...region.getLayoutStartPoint(), ...region.getLayoutRect() }
      : { x: 200, y: 200, width: 400, height: 400 };
    const center = { x: x + width / 2, y: y + height / 2 };
    const geoCoordinate = (vchart as any)
      .getChart()
      .getComponentsByKey('geoCoordinate')?.[0];
    if (geoCoordinate?.dispatchZoom) {
      geoCoordinate.dispatchZoom(scale, center);
      printState(`after zoom x${scale}`);
      const labelG = getLabelGraphic();
      const pathG = getPathGroup();
      const pathM = pathG?.attribute.postMatrix;
      const labelM = labelG?.attribute.postMatrix;
      const passed =
        pathM &&
        labelM &&
        Math.abs(pathM.a - labelM.a) < 1e-6 &&
        Math.abs(pathM.d - labelM.d) < 1e-6 &&
        Math.abs(pathM.e - labelM.e) < 1e-6 &&
        Math.abs(pathM.f - labelM.f) < 1e-6;
      console.log(
        `%c[Issue#4585] ${passed ? 'PASS' : 'FAIL'}: label postMatrix ${
          passed ? 'matches' : 'does NOT match'
        } path postMatrix`,
        `color: ${passed ? 'green' : 'red'}; font-weight: bold;`
      );
      return passed;
    }
    console.warn('geoCoordinate not found');
    return false;
  };

  // 默认在加载后跑一次自动校验
  setTimeout(() => {
    (window as any).runZoomTest(1.5);
    console.log(
      '可以再手动执行 window.runZoomTest(0.7) / window.runZoomTest(2)，或在画布上滚轮缩放 / 拖拽平移做肉眼验证。'
    );
  }, 500);
};

run();
