import { CommonChartSpecTransformer } from '@visactor/vchart';
import type { EventData } from './interface';

export class SequenceAnalysisChartSpecTransformer extends CommonChartSpecTransformer<any> {
  transformSpec(spec: any): void {
    // 类型配置
    delete spec.type;
    spec.type = 'common';

    // 数据配置
    spec.data = [
      {
        id: 'eventData',
        values: spec.eventData
      },
      {
        id: 'actionData',
        values: spec.actionData
      },
      {
        id: 'patternData',
        values: spec.patternData
      }
    ];
    const { eventData } = spec;
    // delete spec.eventData;
    // delete spec.actionData;
    // delete spec.patternData;

    // 系列配置
    const { mode, mediumConnection = false, actionTarget = false, stepMediumMap } = spec;
    spec.series = [
      {
        type: 'link',
        dataId: mode === 'time' ? 'actionData' : 'patternData',
        dotSeriesIndex: 1,
        fromField: 'from',
        toField: 'to',
        seriesField: 'pattern_type',
        imageLabelField: mode === 'time' && actionTarget ? 'user_image' : '',
        allowExtend: mode === 'step' && !mediumConnection,
        linkType: mode === 'step' && mediumConnection ? 'curve' : 'line',
        arrow: {
          style: {
            visible: mode === 'time' && actionTarget
            // fill: 'grey'
          }
        },
        link: {
          state: {
            custom_unSelected: {
              strokeOpacity: 0.5,
              stroke: 'grey'
            }
          },
          style: {
            // stroke: 'grey',
            visible: mode === 'step' || actionTarget
          }
        },
        imageLabel: {
          visible: mode === 'time' && actionTarget,
          style: {
            width: 40,
            height: 40
          }
        }
      },
      {
        type: 'dot',
        xField: mode === 'time' ? 'time_stamp' : mediumConnection ? 'medium_type' : 'step',
        yField: 'user_id',
        titleField: 'user_id',
        seriesField: 'action_type',
        linearMode: mode === 'time',
        dataIndex: 0,
        highLightSeriesGroup: '',
        title: {
          visible: false,
          style: {
            fill: 'rgba(46, 47, 50)'
          }
        },
        grid: {
          style: {
            visible: false
          }
        },
        dot: {
          state: {
            custom_unSelected: {
              fillOpacity: 0.5,
              fill: 'grey'
            }
          }
        },
        symbol: {
          visible: false
        }
      }
    ];
    spec.series.forEach((s: any) => {
      if (s.type === 'link') {
        s.dotSeriesSpec = spec.series[s.dotSeriesIndex];
      }
    });

    // 构建轴标签
    // 时间 => 事件数量
    const tickData: { time_stamp: number; action_count: number }[] = [];
    const timeCountMap: Record<string, number> = {};
    (eventData as EventData[]).forEach(user => {
      user.dots.forEach(e => {
        if (timeCountMap[e.time_stamp]) {
          timeCountMap[e.time_stamp] += e.action_count;
        } else {
          timeCountMap[e.time_stamp] = e.action_count;
        }
      });
    });
    Object.keys(timeCountMap)
      .sort((a, b) => Number(a) - Number(b)) // 按时间戳排序
      .forEach(key => {
        tickData.push({
          time_stamp: Number(key),
          action_count: timeCountMap[key]
        });
      });

    // 轴配置
    const axes = [];
    // step 模式
    if (mode === 'step') {
      if (mediumConnection) {
        axes.push({
          orient: 'top',
          type: 'band',
          id: 'top_medium'
        });
      } else {
        axes.push({
          orient: 'top',
          type: 'band',
          id: 'top_medium',
          label: {
            formatMethod: (label: string) => {
              return {
                type: 'rich',
                text: [
                  {
                    text: `${(stepMediumMap[label] as any).medium_type}... `,
                    fontSize: 12
                  },
                  {
                    text: `+${(stepMediumMap[label] as any).count}`,
                    fontSize: 12,
                    background: 'grey',
                    backgroundOpacity: 0.4,
                    backgroundCornerRadius: 5
                  }
                ]
              };
            }
          }
        });
        axes.push({
          orient: 'bottom',
          id: 'bottom_step',
          type: 'band',
          bandPadding: 0
        });
      }
    }
    // time 模式
    else {
      axes.push({
        orient: 'top',
        // bandSize: 800,
        type: 'time',
        id: 'top_count',
        label: {
          dataFilter: (datum: any) => {
            const minData = datum[0].rawValue;
            const minValue = datum[0].value;
            const maxData = datum[datum.length - 1].rawValue;
            const maxValue = datum[datum.length - 1].value;
            return tickData
              .filter(t => t.time_stamp >= minData && t.time_stamp <= maxData)
              .map(t => ({
                id: t.time_stamp,
                label: t.action_count,
                value: ((t.time_stamp - minData) / (maxData - minData)) * (maxValue - minValue) + minValue,
                rawValue: t.time_stamp
              }));
          },
          formatMethod: (label: string, datum: any) => {
            if (datum?.rawValue) {
              return timeCountMap[datum.rawValue];
            }
            return label;
          }
        },
        tick: {
          visible: false
          // dataFilter: (datum, context) => {
          //   const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          //   const [minRange, maxRange] = context.vchart.getChart().getAllComponents()[0].getScale(0)._wholeRange;
          //   console.log(
          //     'datum-----------',
          //     datum,
          //     maxRange,
          //     max,
          //     context.vchart.getChart().getAllComponents()[0].getScale(0),
          //     tickData.map(t => ({
          //       id: t.time_stamp,
          //       label: t.time_stamp,
          //       value: (t.time_stamp - min) / (max - min),
          //       rawValue: t.time_stamp,
          //       point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          //     }))
          //   );
          //   return datum;
          //   return tickData.map(t => ({
          //     id: t.time_stamp,
          //     label: t.time_stamp,
          //     value: (t.time_stamp - min) / (max - min),
          //     rawValue: t.time_stamp,
          //     point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          //   }));
          // }
        },
        grid: {
          visible: false
        },
        innerOffset: {
          left: 50,
          right: 50
        }
      });
      axes.push({
        orient: 'bottom',
        id: 'bottom_time',
        type: 'time',
        layers: [
          {
            tickStep: 28800,
            timeFormat: '%Y%m%d'
          },
          {
            tickStep: 28800,
            timeFormat: '%H:%M'
          }
        ],
        label: {
          dataFilter: (datum: any) => {
            const minData = datum[0].rawValue;
            const minValue = datum[0].value;
            const maxData = datum[datum.length - 1].rawValue;
            const maxValue = datum[datum.length - 1].value;
            return tickData
              .filter(t => t.time_stamp >= minData && t.time_stamp <= maxData)
              .map(t => ({
                id: t.time_stamp,
                label: t.time_stamp,
                value: ((t.time_stamp - minData) / (maxData - minData)) * (maxValue - minValue) + minValue,
                rawValue: t.time_stamp
              }));
          }
        },
        tick: {
          visible: false
          // dataFilter: (datum, context) => {
          //   // console.log('context', context, datum);
          //   const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          //   const [minRange, maxRange] = context.vchart.getChart().getAllComponents()[0].getScale(0).range();
          //   // console.log('datum', datum, min, max);
          //   // return datum;
          //   return tickData.map(t => ({
          //     id: t.time_stamp,
          //     label: t.time_stamp,
          //     value: (t.time_stamp - min) / (max - min),
          //     rawValue: t.time_stamp,
          //     point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          //   }));
          // }
        },
        grid: {
          visible: false
        },
        innerOffset: {
          left: 50,
          right: 50
        }
      });
    }
    spec.axes = [
      ...axes,
      {
        orient: 'left',
        type: 'band',
        domainLine: {
          visible: false
        },
        tick: {
          visible: false
        },
        label: {
          formatMethod: label => {
            return {
              type: 'rich',
              text: [{ image: spec.userImageMap[label], width: 40, height: 40 }]
            };
          }
        },
        grid: {
          visible: true,
          style: {
            lineDash: [3, 3]
          }
        }
      }
    ];

    // 缩略轴和滚动条配置
    spec.dataZoom = [
      {
        orient: 'bottom',
        axisIndex: 0,
        filterMode: 'filter'
      }
    ];
    spec.scrollBar = [
      {
        orient: 'right',
        axisIndex: spec.axes.length - 1,
        filterMode: 'axis',
        start: 0,
        end: 0.8
      },
      {
        orient: 'bottom',
        axisIndex: 0,
        linkedAxisIndex: mediumConnection && mode === 'step' ? undefined : 1,
        filterMode: 'axis',
        start: 0,
        end: 0.8
      }
    ];
    spec.crosshair = {
      xField: {
        visible: true,
        line: {
          type: 'rect',
          width: 20,
          style: {
            fill: 'rgb(240,242,245)'
          }
        },
        bindingAxesIndex: [0, 1]
      },
      yField: {
        visible: true,
        bindingAxesIndex: [spec.axes.length - 1],
        line: {
          type: 'rect'
        }
      }
    };

    // markLine配置
    if (mode === 'time') {
      spec.markLine = tickData.map(t => ({
        zIndex: -1,
        x: t.time_stamp,
        endSymbol: {
          visible: false
        },
        label: {
          visible: false
        }
      }));
    }

    // 其他配置
    spec.tooltip = {
      visible: false
    };
    spec.animation = false;

    // 自定义配置
    spec.customTransformSpec?.(spec);

    super.transformSpec(spec);
  }
}
