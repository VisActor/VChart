import VChart from '../../../../src';

const spec = {
  type: 'pie',
  autoFit: false,
  data: [
    {
      name: 'data1',
      values: [
        {
          value: 348,
          name: '中介渠道: 34.8%'
        },
        {
          value: 152,
          name: '会员: 15.2%'
        },
        {
          value: 500,
          name: '散客: 50%'
        }
      ]
    }
  ],
  valueField: 'value',
  categoryField: 'name',
  radius: 0.8,
  innerRadius: 0.5,
  pie: {
    state: {
      hover: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1
      },
      selected: {
        outerRadius: 0.85,
        stroke: 'yellow',
        lineWidth: 1
      }
    }
  },
  legends: {
    visible: true,
    orient: 'right',
    title: {
      visible: false
    }
  }
};

const vchart = new VChart(spec as any, { dom: document.getElementById('chart') as HTMLElement });

vchart.renderSync();

vchart.setSelected({
  value: 348,
  name: '中介渠道: 34.8%'
});

vchart.setHovered({
  value: 152,
  name: '会员: 15.2%'
});
