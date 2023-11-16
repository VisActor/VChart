import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    type: 'common',
    region: [
      {
        clip: true,
        id: 'mainRegion'
      },
      {
        id: 'subRegion'
      }
    ],
    series: [
      {
        id: 'mainSeries',
        type: 'bar',
        yField: '231106154809097',
        xField: '10011',
        seriesField: '20001',
        direction: 'horizontal',
        regionId: 'mainRegion',
        data: {
          id: 'mainSeriesData',
          values: [
            {
              '10001': '销售额',
              '10003': '231106154809100',
              '10011': '8025072.194172859',
              '20001': '销售额',
              '231106154809097': '消费者',
              '231106154809100': '8025072.194172859'
            },
            {
              '10001': '销售额',
              '10003': '231106154809100',
              '10011': '5152793.296570778',
              '20001': '销售额',
              '231106154809097': 'aaaa',
              '231106154809100': '5152793.296570778'
            },
            {
              '10001': '销售额',
              '10003': '231106154809100',
              '10011': '2891088.6421899796',
              '20001': '销售额',
              '231106154809097': '小型企业',
              '231106154809100': '2891088.6421899796'
            }
          ],
          fields: {
            '10001': {
              alias: '指标名称 '
            },
            '10011': {
              alias: '指标值(主轴) '
            },
            '10012': {
              alias: '指标值(次轴) '
            },
            '20001': {
              alias: '图例项 ',
              domain: ['销售额', '折扣'],
              sortIndex: 0
            },
            '231106154809097': {
              alias: '细分',
              domain: ['aaaa', '消费者', '小型企业'],
              sortIndex: 0
            },
            '231106154809100': {
              alias: '销售额'
            },
            '231106154809103': {
              alias: '折扣'
            }
          }
        },
        label: {
          visible: false,
          offset: 0,
          overlap: {
            hideOnHit: true,
            avoidBaseMark: false,
            strategy: [
              {
                type: 'position',
                position: []
              },
              {
                type: 'moveX',
                offset: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              },
              {
                type: 'moveY',
                offset: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              }
            ],
            clampForce: true
          },
          style: {
            fontSize: 12,
            fontWeight: 'normal',
            zIndex: 400,
            lineHeight: '100%',
            fill: '#363839',
            lineWidth: 1,
            strokeOpacity: 1
          },
          position: 'inside',
          smartInvert: {
            fillStrategy: 'invertBase',
            strokeStrategy: 'similarBase',
            outsideEnable: false
          }
        },
        hover: {
          enable: true
        },
        select: {
          enable: true
        },
        bar: {
          state: {
            hover: {
              cursor: 'pointer',
              fillOpacity: 0.8,
              stroke: '#58595B',
              lineWidth: 1,
              zIndex: 500
            },
            selected: {
              cursor: 'pointer',
              fillOpacity: 1,
              stroke: '#58595B',
              lineWidth: 1
            },
            selected_reverse: {
              fillOpacity: 0.3,
              strokeWidth: 0.3
            }
          }
        },
        animation: false
      },
      {
        id: 'subSeries',
        type: 'bar',
        yField: '231106154809097',
        xField: '10012',
        seriesField: '20001',
        direction: 'horizontal',
        regionId: 'subRegion',
        data: {
          id: 'subSeriesData',
          values: [
            {
              '10001': '折扣',
              '10003': '231106154809103',
              '10012': '548.0500084906816',
              '20001': '折扣',
              '231106154809097': '消费者',
              '231106154809103': '548.0500084906816'
            },
            {
              '10001': '折扣',
              '10003': '231106154809103',
              '10012': '338.50000517070293',
              '20001': '折扣',
              '231106154809097': 'aaaa',
              '231106154809103': '338.50000517070293'
            },
            {
              '10001': '折扣',
              '10003': '231106154809103',
              '10012': '173.15000263601542',
              '20001': '折扣',
              '231106154809097': '小型企业',
              '231106154809103': '173.15000263601542'
            }
          ],
          fields: {
            '10001': {
              alias: '指标名称 '
            },
            '10011': {
              alias: '指标值(主轴) '
            },
            '10012': {
              alias: '指标值(次轴) '
            },
            '20001': {
              alias: '图例项 ',
              domain: ['销售额', '折扣'],
              sortIndex: 0
            },
            '231106154809097': {
              alias: '细分',
              domain: ['aaaa', '消费者', '小型企业'],
              sortIndex: 0
            },
            '231106154809100': {
              alias: '销售额'
            },
            '231106154809103': {
              alias: '折扣'
            }
          }
        },
        label: {
          visible: false,
          offset: 0,
          overlap: {
            hideOnHit: true,
            avoidBaseMark: false,
            strategy: [
              {
                type: 'position',
                position: []
              },
              {
                type: 'moveX',
                offset: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              },
              {
                type: 'moveY',
                offset: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              }
            ],
            clampForce: true
          },
          style: {
            fontSize: 12,
            fontWeight: 'normal',
            zIndex: 400,
            lineHeight: '100%',
            fill: '#363839',
            lineWidth: 1,
            strokeOpacity: 1
          },
          position: 'inside',
          smartInvert: {
            fillStrategy: 'invertBase',
            strokeStrategy: 'similarBase',
            outsideEnable: false
          }
        },
        hover: {
          enable: true
        },
        select: {
          enable: true
        },
        bar: {
          state: {
            hover: {
              cursor: 'pointer',
              fillOpacity: 0.8,
              stroke: '#58595B',
              lineWidth: 1,
              zIndex: 500
            },
            selected: {
              cursor: 'pointer',
              fillOpacity: 1,
              stroke: '#58595B',
              lineWidth: 1
            },
            selected_reverse: {
              fillOpacity: 0.3,
              strokeWidth: 0.3
            }
          }
        },
        animation: false
      }
    ],
    padding: 0,
    labelLayout: 'region',
    layout: {
      type: 'grid',
      row: 2,
      col: 3,
      elements: [
        {
          modelId: 'mainRegion',
          col: 0,
          row: 0
        },
        {
          modelId: 'dimensionAxis',
          col: 1,
          row: 0
        },
        {
          modelId: 'subRegion',
          col: 2,
          row: 0
        },
        {
          modelId: 'measureAxisLeft',
          col: 0,
          row: 1
        },
        {
          modelId: 'measureAxisRight',
          col: 2,
          row: 1
        },
        {
          modelId: 'legend-discrete',
          col: 0,
          colSpan: 3,
          row: 2
        }
      ]
    },
    data: [
      {
        id: 'data',
        values: [
          {
            '10001': '销售额',
            '10003': '231106154809100',
            '10011': '8025072.194172859',
            '20001': '销售额',
            '231106154809097': '消费者',
            '231106154809100': '8025072.194172859'
          },
          {
            '10001': '销售额',
            '10003': '231106154809100',
            '10011': '5152793.296570778',
            '20001': '销售额',
            '231106154809097': 'aaaa',
            '231106154809100': '5152793.296570778'
          },
          {
            '10001': '销售额',
            '10003': '231106154809100',
            '10011': '2891088.6421899796',
            '20001': '销售额',
            '231106154809097': '小型企业',
            '231106154809100': '2891088.6421899796'
          },
          {
            '10001': '折扣',
            '10003': '231106154809103',
            '10012': '548.0500084906816',
            '20001': '折扣',
            '231106154809097': '消费者',
            '231106154809103': '548.0500084906816'
          },
          {
            '10001': '折扣',
            '10003': '231106154809103',
            '10012': '338.50000517070293',
            '20001': '折扣',
            '231106154809097': 'aaaa',
            '231106154809103': '338.50000517070293'
          },
          {
            '10001': '折扣',
            '10003': '231106154809103',
            '10012': '173.15000263601542',
            '20001': '折扣',
            '231106154809097': '小型企业',
            '231106154809103': '173.15000263601542'
          }
        ],
        fields: {
          '10001': {
            alias: '指标名称 '
          },
          '10011': {
            alias: '指标值(主轴) '
          },
          '10012': {
            alias: '指标值(次轴) '
          },
          '20001': {
            alias: '图例项 ',
            domain: ['销售额', '折扣'],
            sortIndex: 0
          },
          '231106154809097': {
            alias: '细分',
            domain: ['aaaa', '消费者', '小型企业'],
            sortIndex: 0
          },
          '231106154809100': {
            alias: '销售额'
          },
          '231106154809103': {
            alias: '折扣'
          }
        }
      }
    ],
    axes: [
      {
        id: 'dimensionAxis',
        type: 'band',
        tick: {
          visible: false
        },
        grid: {
          visible: false,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'left',
        visible: true,
        domainLine: {
          visible: false
        },
        title: {
          visible: false,
          space: 5,
          text: '细分',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        zIndex: 200,
        label: {
          visible: true,
          space: 16,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            direction: 'horizontal',
            maxLineWidth: 174
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          flush: true,
          containerAlign: 'center'
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        paddingInner: 0.35,
        paddingOuter: 0.2,
        maxWidth: 190,
        inverse: true,
        offsetX: 8,
        regionId: ['mainRegion', 'subRegion'],
        seriesId: ['mainSeries', 'subSeries']
      },
      {
        id: 'measureAxisLeft',
        type: 'linear',
        tick: {
          visible: false,
          tickMode: 'd3',
          style: {
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        title: {
          visible: false,
          text: '销售额',
          space: 8,
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 4,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true,
        regionId: 'mainRegion',
        seriesId: 'mainSeries',
        inverse: true
      },
      {
        id: 'measureAxisRight',
        type: 'linear',
        tick: {
          visible: false,
          tickMode: 'd3',
          style: {
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        title: {
          visible: false,
          text: '折扣',
          space: 8,
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 4,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true,
        regionId: 'subRegion',
        seriesId: 'subSeries'
      }
    ],
    seriesField: '20001',
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A'],
      specified: {},
      domain: ['销售额', '折扣']
    },
    legends: [
      {
        type: 'discrete',
        visible: false
      }
    ],
    tooltip: {
      handler: {}
    },
    background: 'rgba(255, 255, 255, 0)',
    crosshair: {
      yField: {
        visible: true
      },
      gridZIndex: 100
    },
    hash: 'fc02c70af13af155615aea8c375c931b'
  };

  // const spec = {
  //   type: 'bar',
  //   data: [
  //     {
  //       id: 'barData',
  //       values: [
  //         { month: 'Monday', sales: 22 },
  //         { month: 'Tuesday', sales: 13 },
  //         { month: 'Wednesday', sales: 25 },
  //         { month: 'Thursday', sales: 29 },
  //         { month: 'Friday', sales: 38 }
  //       ]
  //     }
  //   ],
  //   xField: 'month',
  //   yField: 'sales'
  // };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
