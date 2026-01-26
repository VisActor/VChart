import { default as VChart } from '../../../../src/index';

const values = Array.from({ length: 30 }).map((_, index) => ({
  type: `类别-${index + 1}`,
  value: (index + 1) * 10
}));

const spec = {
  type: 'pie',
  categoryField: 'type',
  valueField: 'value',
  data: [
    {
      id: 'data',
      values
    }
  ],
  legends: [
    {
      type: 'discrete',
      orient: 'bottom',
      item: {
        maxWidth: '50%'
      },
      pager: {
        handler: {}
      }
    }
  ]
};

const vchart = new VChart(spec as any, { dom: document.getElementById('chart') as HTMLElement });
vchart.renderAsync();
window['vchart'] = vchart;
