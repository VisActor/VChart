import { IComponentTheme } from '@visactor/vchart-types/component/interface';

export const axis: Pick<
  IComponentTheme,
  'axis' | 'axisAngle' | 'axisBand' | 'axisLinear' | 'axisRadius' | 'axisX' | 'axisY'
> = {
  axis: {
    domainLine: {
      visible: false
    },
    grid: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: { type: 'palette', key: 'axisGridColor', a: 0.15 },
        lineDash: []
      }
    },
    subGrid: {
      visible: false,
      style: {
        lineWidth: 1,
        stroke: { type: 'palette', key: 'axisGridColor', a: 0.15 },
        lineDash: [4, 4]
      }
    },
    tick: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: { type: 'palette', key: 'axisGridColor', a: 0.15 }
      }
    },
    subTick: {
      visible: false,
      style: {
        lineWidth: 1,
        stroke: { type: 'palette', key: 'axisGridColor', a: 0.15 }
      }
    },
    label: {
      visible: true,
      style: {
        fontSize: 12,
        fill: { type: 'palette', key: 'axisFontColor', a: 0.65 },
        fontWeight: 'normal',
        fillOpacity: 1
      }
    },
    title: {
      visible: false
    }
  },
  axisBand: {
    domainLine: {
      visible: false
    }
  }
};
