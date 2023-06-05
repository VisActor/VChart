export default {
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
  type: 'pie',
  valueField: 'value',
  categoryField: 'name',
  radius: 0.6,
  innerRadius: 0.5,
  color: ['#87DBDD', '#FF8406', '#468DFF'],
  pie: {
    state: {
      hover: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1
      },
      selected: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1
      }
    }
  },
  label: {
    visible: true
  },
  legends: {
    visible: true,
    orient: 'bottom',
    title: {
      visible: false
    },
    item: {
      visible: true
    }
  }
}
