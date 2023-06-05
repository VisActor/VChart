export default {
  type: 'funnel',
  height: 500,
  width: 500,
  padding: 0,
  funnelOrient: 'left',
  isCone: false,
  gap: 10,
  legends: {
    visible: true
  },
  transform: {
    style: {
      // fill:"red"
    }
  },
  funnel: {
    style: {
      borderRadius: [0, 10, 0, 10],
      stroke: 'red',
      strokeWidth: 1
    }
  },
  label: {
    visible: true,
    // limit: Infinity,
    style: {
      // stroke: 'pink'
      // lineWidth: 40
      // text:(datum)=> `${datum.name}`
    }
  },
  outerLabel: {
    // position: 'right',
    // position:'top',
    visible: true,
    alignLabel: false,
    // spaceWidth:5,
    style: {
      limit: Infinity
    }
  },
  transformLabel: {
    visible: true
  },
  // range:{
  //   min: 0,
  //   max:100
  // },
  transformTooltip: {
    visible: true
  },
  isTransform: true,
  data: [
    {
      name: 'funnel',
      values: [
        {
          value: 100,
          name: '收入阿斯顿阿斯顿阿斯顿'
        },
        {
          value: 90,
          name: '展现展现展'
        },
        {
          value: 50,
          name: '点击'
        },
        {
          value: 30,
          name: '访问'
        },
        {
          value: 10,
          name: '咨询咨询咨询'
        },
        {
          value: 5,
          name: '订单'
        }
      ]
    }
  ],
  categoryField: 'name',
  valueField: 'value'
};
