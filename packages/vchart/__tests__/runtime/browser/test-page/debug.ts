import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const pieData = [
    { type: 'oxygen', value: '46.60' },
    { type: 'silicon', value: '27.72' },
    { type: 'aluminum', value: '8.13' },
    { type: 'iron', value: '5' },
    { type: 'calcium', value: '3.63' },
    { type: 'sodium', value: '2.83' },
    { type: 'potassium', value: '2.59' },
    { type: 'others', value: '3.5' }
  ];
  const spec = {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: pieData
      }
    ],
    outerRadius: 0.8,
    innerRadius: 0.5,
    padAngle: 0.6,
    valueField: 'value',
    categoryField: 'type',
    color: {
      id: 'color',
      type: 'linear',
      range: ['#1664FF', '#B2CFFF', '#1AC6FF', '#94EFFF'],
      domain: [
        {
          dataId: 'id0',
          fields: ['value']
        }
      ]
    },
    pie: {
      style: {
        cornerRadius: 10,
        fill: {
          scale: 'color',
          field: 'value'
        }
      }
    },
    legends: {
      visible: true,
      orient: 'left',
      data: (data, scale) => {
        return data.map(datum => {
          const pickDatum = pieData.find(pieDatum => pieDatum.type === datum.label);

          datum.shape.fill = scale.scale(pickDatum?.value);
          return datum;
        });
      }
    },
    label: {
      visible: true
    }
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
