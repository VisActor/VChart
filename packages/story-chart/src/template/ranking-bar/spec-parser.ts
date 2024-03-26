import { IRankingBarSpec } from 'src/template/ranking-bar/interface';
import { isValid } from '@visactor/vutils';
import { IBarChartSpec } from '@visactor/vchart';

export function specParser(spec: IRankingBarSpec) {
  const { xField, yField, timeField, data, topN = 10, icon } = spec;

  // 数据处理
  const timeNodes = new Set<string>();
  const timeData = new Map();

  data.sort((d1, d2) => Number(d2[xField]) - Number(d1[xField]));

  data.forEach(d => {
    const time = d[timeField];
    if (isValid(time)) {
      timeNodes.add(time);
    }
    if (!timeData.has(time)) {
      timeData.set(time, []);
    }
    const currentData = timeData.get(time);
    if (currentData.length < topN) {
      const _d = { ...d };
      if (icon && icon[_d[yField]]) {
        _d['icon'] = icon[_d[yField]];
      }
      currentData.push(_d);
    }
  });

  // 配置处理
  const vchartSpec = templateSpec(spec, { timeNodes: Array.from(timeNodes).sort(), timeData });
  return { timeData, timeNodes, vchartSpec };
}

function templateSpec(
  { xField, yField, icon }: IRankingBarSpec,
  data: { timeNodes: string[]; timeData: Map<string, any> }
): IBarChartSpec {
  const duration = 1000;
  const exchangeDuration = 400;
  const { timeData, timeNodes } = data;
  const spec: IBarChartSpec = {
    type: 'common',
    region: [{ clip: true }],
    data: [
      {
        id: 'timeData',
        values: timeData.get(timeNodes[0])
      },
      {
        id: 'time',
        values: [{ time: timeNodes[0] }]
      }
    ],
    series: [
      {
        type: 'bar',
        id: 'ranking-bar',
        dataId: 'timeData',
        direction: 'horizontal',
        yField,
        xField,
        seriesField: yField,
        extensionMark: [],
        label: {
          visible: true,
          overlap: false,
          style: {
            fill: `rgb(64, 64, 64)`
          },
          animationUpdate: [
            {
              duration: exchangeDuration,
              easing: 'cubicInOut',
              channel: ['y']
            },
            {
              options: { excludeChannels: ['y'] },
              easing: 'linear',
              duration
            }
          ]
        }
      }
    ],
    axes: [
      { orient: 'left', type: 'band', inverse: true },
      { orient: 'bottom', type: 'linear' }
    ],
    player: {
      type: 'continuous',
      // visible: false,
      auto: true,
      loop: true,
      dx: 80,
      position: 'middle',
      interval: duration,
      specs: timeNodes.map(time => ({
        data: [
          { id: 'timeData', values: timeData.get(time) },
          { id: 'time', values: [{ time }] }
        ]
      }))
    },
    tooltip: { visible: false },
    customMark: [
      {
        type: 'text',
        dataId: 'time',
        style: {
          textBaseline: 'bottom',
          fontSize: 200,
          textAlign: 'right',
          fontWeight: 600,
          text: (datum: any) => datum.time,
          x: (datum: any, ctx: any) => {
            return ctx.vchart.getChart().getCanvasRect()?.width - 50;
          },
          y: (datum: any, ctx: any) => {
            return ctx.vchart.getChart().getCanvasRect()?.height - 80;
          },
          fill: 'grey',
          fillOpacity: 0.5
        }
      }
    ],
    animationAppear: false,
    animationUpdate: {
      bar: [
        {
          type: 'update',
          options: { excludeChannels: ['y'] },
          easing: 'linear',
          duration
        },
        {
          channel: ['y'],
          easing: 'circInOut',
          duration: exchangeDuration
        }
      ],
      axis: {
        duration: exchangeDuration,
        easing: 'circInOut'
      }
    },
    animationEnter: {
      bar: [
        {
          type: 'moveIn',
          duration: exchangeDuration,
          easing: 'circInOut',
          options: {
            direction: 'y',
            orient: 'negative'
          }
        }
      ]
    },
    animationExit: {
      bar: [
        {
          type: 'moveOut',
          duration: exchangeDuration,
          easing: 'cubicInOut',
          options: {
            direction: 'y',
            orient: 'negative'
          }
        }
      ]
    }
  };
  if (icon) {
    const iconSpec = IConMark(spec, icon);
    iconSpec.animationUpdate = [
      {
        type: 'update',
        options: { excludeChannels: ['y'] },
        easing: 'linear',
        duration
      },
      {
        channel: ['y'],
        easing: 'circInOut',
        duration: exchangeDuration
      }
    ];
    spec.series[0].extensionMark.push(iconSpec);
  }
  return spec;
}

function IConMark(spec: IBarChartSpec, icon: IRankingBarSpec['icon']) {
  return {
    type: 'symbol',
    dataId: 'timeData',
    style: {
      symbolType: 'circle',
      size: (data: any, ctx: any) => {
        const vchart = ctx.vchart;
        const series = vchart.getChart()?.getSeriesInIndex(0)[0];
        if (vchart && series) {
          const bandwidth = series.getYAxisHelper().getBandwidth(0) ?? 0;
          return Math.max(bandwidth - 4, 0);
        }
      },
      background: (data: any) => data.icon,
      x: (data: any, ctx: any) => {
        const vchart = ctx.vchart;
        const series = vchart.getChart()?.getSeriesInIndex(0)[0];
        if (vchart && series) {
          const bandwidth = series.getYAxisHelper().getBandwidth(0) ?? 0;
          return vchart.getChart()?.getSeriesInIndex(0)[0]?.dataToPositionX(data) - bandwidth / 2;
        }
      },
      y: (data: any, ctx: any) => {
        const vchart = ctx.vchart;
        const series = vchart.getChart()?.getSeriesInIndex(0)[0];
        if (vchart && series) {
          const bandwidth = series.getYAxisHelper().getBandwidth(0) ?? 0;
          return vchart.getChart()?.getSeriesInIndex(0)[0]?.dataToPositionY(data) + bandwidth / 2;
        }
      }
    }
  };
}
