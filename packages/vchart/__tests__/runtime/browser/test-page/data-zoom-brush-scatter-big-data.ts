// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';
import { createButton } from '../../../util/dom';
import scatterData from './data/datazoom-brush-big-data.json';

const spec = {
  type: 'common',
  animationAppear: false,
  animationEnter: false,
  animationUpdate: false,
  animationDisappear: false,
  background: '#fff',
  series: [
    {
      type: 'scatter',
      xField: 'x',
      yField: 'y',
      seriesField: 'cluster_id',
      point: {
        style: {
          lineWidth: 1,
          stroke: '#fff'
        },
        state: {
          selected: {
            size: 14,
            lineWidth: 1,
            stroke: 'red',
            zIndex: 10
          }
        }
      }
    }
  ],
  brush: {
    visible: true,
    brushType: 'rect',
    inBrush: {
      colorAlpha: 1
    },
    outOfBrush: {
      colorAlpha: 0.2
    },
    // 开启后默认关联所有axis/dataZoom
    zoomAfterBrush: true,
    delayTime: 50
  },
  dataZoom: [
    {
      orient: 'left',
      start: 0,
      end: 1,
      // zoomLock: true,
      filterMode: 'axis',
      backgroundChart: {
        line: { style: { visible: false } },
        area: { style: { visible: false } }
      }
    },
    {
      orient: 'bottom',
      start: 0,
      end: 1,
      // zoomLock: true,
      filterMode: 'axis',
      backgroundChart: {
        line: { style: { visible: false } },
        area: { style: { visible: false } }
      }
    }
  ],
  crosshair: {
    trigger: ['hover', 'click'],
    yField: {
      visible: true,
      line: { visible: true, type: 'line' },
      label: {
        visible: true // label 默认关闭
      }
    },
    xField: {
      visible: true,
      line: { visible: true, type: 'line' },
      label: {
        visible: true // label 默认关闭
      }
    }
  },

  data: [
    {
      id: 'data',
      values: scatterData
    }
  ],
  axes: [
    {
      orient: 'left',
      type: 'linear',
      range: {
        min: Math.min(...scatterData.map(d => parseFloat(d.y))),
        max: Math.max(...scatterData.map(d => parseFloat(d.y)))
      },
      title: {
        visible: true,
        text: 'Y'
      },
      domainLine: {
        visible: true
      }
    },
    {
      orient: 'bottom',
      type: 'linear',
      title: {
        visible: true,
        text: 'X'
      },
      domainLine: {
        visible: true
      }
    }
  ],
  legends: {
    visible: true,
    orient: 'right',
    allowAllCanceled: true,
    item: {
      focus: true // enable focus
    }
  },

  tooltip: {
    activeType: 'mark',
    mark: {
      title: {
        visible: false
      },
      content: [
        {
          key: 'uid',
          value: (datum: any) => datum?.uid
        },
        {
          key: 'cluster_id',
          value: (datum: any) => datum?.cluster_id
        }
      ]
    },
    trigger: ['hover', 'click'],
    lockAfterClick: true,
    enterable: true,
    renderMode: 'html',
    style: {
      panel: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadow: {
          blur: 10,
          color: 'rgba(0, 0, 0, 0.1)',
          y: 4,
          x: 0,
          spread: 0
        }
      }
    }
  }
};

const run = () => {
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement
  });
  console.time('renderTime');

  cs.renderAsync();

  window['vchart'] = cs;
  console.log(cs);
};
run();
