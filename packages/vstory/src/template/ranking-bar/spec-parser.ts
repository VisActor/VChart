import type { IRankingBarSpec } from 'src/template/ranking-bar/interface';
import type { ICartesianAxisSpec, ICommonChartSpec, ILabelSpec } from '@visactor/vchart';
import { isValid } from '@visactor/vutils';

export function specParser(spec: IRankingBarSpec) {
  const { xField, yField, timeField, data, topN = 10, icon, interval: userInterval } = spec;

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

  const interval = userInterval ? userInterval : 1000;
  const exchangeDuration = Math.min(interval, 500);

  // 配置处理
  const vchartSpec = templateSpec(
    spec,
    { timeNodes: Array.from(timeNodes).sort(), timeData },
    { interval, exchangeDuration }
  );
  console.log(vchartSpec);
  return { timeData, timeNodes, vchartSpec };
}

function templateSpec(
  { xField, yField, color, icon, iconPosition, iconShape, timeLabel, label, nameLabel, xAxis, yAxis }: IRankingBarSpec,
  data: { timeNodes: string[]; timeData: Map<string, any> },
  { interval, exchangeDuration }: any
): ICommonChartSpec {
  const { timeData, timeNodes } = data;
  const spec: ICommonChartSpec = {
    type: 'common',
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
    // @ts-ignore
    color: {
      specified: {
        ...color
      }
    },
    region: [{ clip: true }],
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
        label: labelSpec(label, { ...nameLabel, yField }, { interval, exchangeDuration }) as any
      }
    ],
    axes: axisSpec(xAxis, yAxis),
    player: {
      type: 'continuous',
      // visible: false,
      auto: true,
      loop: false,
      interval,
      // slider: { visible: false },
      // controller: { visible: false },
      specs: timeNodes.map(time => ({
        data: [
          { id: 'timeData', values: timeData.get(time) },
          { id: 'time', values: [{ time }] }
        ]
      }))
    },
    tooltip: { visible: false },
    customMark: [],
    animationAppear: false,
    animationUpdate: {
      bar: [
        {
          type: 'update',
          options: { excludeChannels: ['y'] },
          easing: 'linear',
          duration: interval
        },
        {
          channel: ['y'],
          easing: 'circInOut',
          duration: exchangeDuration
        }
      ],
      axis: {
        duration: interval,
        easing: 'linear'
      }
    },
    animationEnter: {
      bar: [
        {
          type: 'moveIn',
          duration: exchangeDuration,
          easing: 'cubicInOut',
          options: {
            direction: 'y',
            orient: 'negative',
            point: (datum: any, element: any, param: any, ctx: any) => {
              return {
                y: param.groupHeight + element.getBounds().height()
              };
            }
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
  if (!timeLabel || timeLabel.visible !== false) {
    spec.customMark.push(timeLabelSpec() as any);
  }
  if (icon) {
    const icon = iconSpec(iconPosition, iconShape, { interval, exchangeDuration });
    spec.series[0].extensionMark.push(icon as any);
  }
  return spec;
}

function labelSpec(
  label: IRankingBarSpec['label'] = {},
  nameLabel: IRankingBarSpec['nameLabel'] & { yField: string },
  { interval, exchangeDuration }: any
) {
  const spec: ILabelSpec[] = [];

  if (label.visible !== false) {
    spec.push({
      visible: true,
      overlap: false,
      style: {
        // @ts-ignore
        fill: `rgb(64, 64, 64)`,
        ...label.style
      },
      smartInvert: {
        fillStrategy: label.style?.fill ? 'null' : undefined,
        strokeStrategy: label.style?.stroke ? 'null' : undefined
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
          duration: interval
        }
      ]
    });
  }

  if (nameLabel.visible) {
    spec.push({
      visible: true,
      overlap: false,
      // @ts-ignore
      style: {
        ...nameLabel.style
      },
      smartInvert: {
        fillStrategy: nameLabel.style?.fill ? 'null' : undefined,
        strokeStrategy: nameLabel.style?.stroke ? 'null' : undefined
      },
      position: nameLabel.position === 'bar-end' ? 'inside-right' : 'inside-left',
      formatter: `{${nameLabel.yField}}`,
      animationUpdate: customMarkUpdateAnimation(interval, exchangeDuration)
    });
  }

  return spec;
}

function axisSpec(xAxis: IRankingBarSpec['xAxis'] = {}, yAxis: IRankingBarSpec['yAxis'] = {}) {
  const leftAxis: ICartesianAxisSpec = {
    orient: 'left',
    type: 'band',
    inverse: true,
    // @ts-ignore
    label: { style: yAxis.label },
    domainLine: { style: yAxis.domainLine },
    // @ts-ignore
    grid: { style: yAxis.grid }
  };
  const bottomAxis: ICartesianAxisSpec = {
    orient: 'bottom',
    type: 'linear',
    nice: false,
    animation: true,
    // @ts-ignore
    label: { style: xAxis.label },
    domainLine: { style: xAxis.domainLine },
    // @ts-ignore
    grid: { style: xAxis.grid },
    // @ts-ignore
    innerOffset: { right: '10%' }
  };

  if (xAxis.label) {
    bottomAxis.label = xAxis.label;
  }
  return [leftAxis, bottomAxis];
}

function timeLabelSpec() {
  return {
    type: 'text',
    dataId: 'time',
    style: {
      textBaseline: 'bottom',
      fontSize: 200,
      textAlign: 'end',
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
  };
}

function iconSpec(
  iconPosition: IRankingBarSpec['iconPosition'] = 'bar-end',
  iconShape: IRankingBarSpec['iconShape'] = 'circle',
  { interval, exchangeDuration }: any
) {
  return {
    type: 'symbol',
    dataId: 'timeData',
    style: {
      symbolType: iconShape,
      stroke: 'white',
      lineWidth: 1,
      size: (data: any, ctx: any) => {
        const vchart = ctx.vchart;
        const series = vchart.getChart()?.getSeriesInIndex(0)[0];
        if (vchart && series) {
          const bandwidth = series.getYAxisHelper().getBandwidth(0) ?? 0;
          return Math.max(bandwidth - 4, 0);
        }
      },
      background: (data: any) => data.icon,
      // globalZIndex 有bug，会有动画闪烁和报错
      // globalZIndex: 1, // 否则会被 region 区域 clip
      x: (data: any, ctx: any) => {
        const vchart = ctx.vchart;
        const series = vchart.getChart()?.getSeriesInIndex(0)[0];
        if (vchart && series) {
          const bandwidth = series.getYAxisHelper().getBandwidth(0) ?? 0;
          if (iconPosition === 'bar-start') {
            return bandwidth / 2;
          } else if (iconPosition === 'axis') {
            return -bandwidth / 2;
          } else {
            return series.dataToPositionX(data) - bandwidth / 2;
          }
        }
      },
      y: (data: any, ctx: any) => {
        const vchart = ctx.vchart;
        const series = vchart.getChart()?.getSeriesInIndex(0)[0];
        if (vchart && series) {
          const bandwidth = series.getYAxisHelper().getBandwidth(0) ?? 0;
          return series.dataToPositionY(data) + bandwidth / 2;
        }
      },
      scaleY: iconShape === 'rect' ? 1.2 : 1
    },
    animationUpdate: customMarkUpdateAnimation(interval, exchangeDuration),
    animationEnter: [
      {
        type: 'moveIn',
        duration: exchangeDuration,
        easing: 'cubicInOut',
        options: {
          direction: 'y',
          orient: 'negative',
          point: (datum: any, element: any, param: any) => {
            return {
              y: param.groupHeight + element.getBounds().height()
            };
          }
        }
      }
    ],
    animationExit: [
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
  };
}

function customMarkUpdateAnimation(duration: number, exchangeDuration: number) {
  return [
    {
      duration: exchangeDuration,
      easing: 'cubicInOut',
      channel: ['y']
    },
    {
      options: { excludeChannels: ['y'] },
      channel: ['x', 'x2', 'x1'],
      easing: 'linear',
      duration
    }
  ];
}
