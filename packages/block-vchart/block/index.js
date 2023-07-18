import areaSpec from './data/area';
import barSpec from './data/bar';
import columnSpec from './data/column';
import groupColumnSpec from './data/group-column';
import pieIndicatorSpec from './data/pie-indicator';
import pieInnerLabelSpec from './data/pie-inner-label';
import pieSpec from './data/pie';
import roseSpec from './data/rose';
import scatterSpec from './data/scatter';
import stackAreaSpec from './data/stack-area';
import stackBarSpec from './data/stack-bar';
import stackColumnSpec from './data/stack-column';
import cloudSpec from './data/wordcloud';
import lineSpec from './data/line';
import funnelSpec from './data/funnel';

import VChart from './vchart/index';
import { debounce } from './utils/utils';

Block({
  data: {
    currentIndex: 0,
    chartList: [
      {
        id: 'line',
        spec: lineSpec,
        chart: undefined
      },
      {
        id: 'pie',
        spec: pieInnerLabelSpec,
        chart: undefined
      },
      {
        id: 'bar',
        spec: barSpec,
        chart: undefined
      }
    ]
  },
  onLoad(options) {
    // Block 加载完成
    // 通过 options 可以拿到宿主信息和 BlockInfo
    // console.log(options.host, options.blockInfo);

    // 关闭 Block 的 Loading，当 useStartLoading=true 时有效
    tt.hideBlockLoading();
  },
  onReady() {
    // Block 首次渲染完成
    this.data.chartList.forEach(x => {
      x.events = [
        {
          element: 'view',
          type: 'touchstart',
          handler: (...args) => {
            console.log('touchstart', args);
          }
        },
        {
          element: 'view',
          type: 'touchmove',
          handler: (...args) => {
            console.log('touchmove', args);
          }
        },
        {
          element: 'view',
          type: 'touchend',
          handler: (...args) => {
            console.log('touchend', args);
          }
        }
      ];
    });
    this.methods.initChart();

    // 通过监听容器变化，图表自适应宽高
    this.onResize = debounce(this.methods.initChart, 300);
    tt.onContainerResize(({ width, height }) => {
      this.onResize();
      console.log('容器尺寸变化 width = ', width, ' height = ', height);
    });
  },
  onShow() {
    // Block 显示
  },
  onHide() {
    // Block 隐藏
  },
  onDestroy() {
    // Block 被销毁
    this.data.chartList.forEach(x => {
      x.chart && x.chart.release();
    });
  },
  onActivate(state) {
    // 激活的生命周期
    // 激活时可以获取到上次失活保存的数据
  },
  onInactivate() {
    // 失活的生命周期
    // 失活时这里将 data 数据临时保存起来
    tt.saveState({
      state: this.data
    });
  },
  methods: {
    initChart() {
      tt.getContainerRect({
        success: res => {
          // 初始化图表库
          this.methods.init(res);
        },
        fail(res) {
          // console.log("getContainerRect 调用失败", res);
        },
        complete(res) {
          // console.log("getContainerRect 调用结束", res);
        }
      });
    },
    init() {
      this.data.chartList.forEach(item => {
        tt.createSelectorQuery()
          .select(`#${item.id}_draw_canvas`)
          .boundingClientRect(domRef => {
            if (!domRef) {
              console.error(`未找到 #${item.id} 画布`);
              return;
            }

            // will call on resize
            // release old first
            item.chart && item.chart.release();

            const chartInstance = new VChart(
              {
                width: domRef.width,
                height: domRef.height,
                ...item.spec
              },
              {
                mode: 'miniApp',
                modeParams: {
                  domref: domRef,
                  force: true,
                  canvasIdLists: [`${item.id}_draw_canvas`, `${item.id}_tooltip_canvas`],
                  tooltipCanvasId: `${item.id}_tooltip_canvas`,
                  freeCanvasIdx: 1
                },
                // Please ensure that dpr can be updated to the object in real time when it changes
                dpr: this.dpr,
                renderCanvas: `${item.id}_draw_canvas`
              }
            );
            item.chart = chartInstance;

            if (item.events) {
              item.events.forEach(event => {
                chartInstance.on(event.type, { source: event.element }, event.handler);
              });
            }

            chartInstance.renderAsync();
          })
          .exec();
      });
    },
    bindChartEvent(event) {
      const id = event.target.id.split('_')[0];
      const targetChart = this.data.chartList.find(x => x.id === id);
      const chartInstance = targetChart?.chart;
      if (chartInstance) {
        event.target = chartInstance.getCanvas(); // Tip: 必须设置
        chartInstance.getStage().window.dispatchEvent(event);
      }
    }
  }
});
