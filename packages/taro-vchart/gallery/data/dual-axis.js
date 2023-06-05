export default {
  type: "common",
  data: [
    {
      id: "barData",
      values: [
        {
          x: "10:00",
          y: 40,
          type: "产品1",
        },
        {
          x: "12:00",
          y: 40,
          type: "产品1",
        },
        {
          x: "14:00",
          y: 56,
          type: "产品1",
        },
        {
          x: "16:00",
          y: 40,
          type: "产品1",
        },
        {
          x: "18:00",
          y: 52,
          type: "产品1",
        },
        {
          x: "20:00",
          y: 74,
          type: "产品1",
        },
        {
          x: "22:00",
          y: 95,
          type: "产品1",
        },
      ],
    },
    {
      id: "lineData",
      values: [
        {
          x: "10:00",
          y2: 15,
          type: "产品2",
        },
        {
          x: "12:00",
          y2: 23,
          type: "产品2",
        },
        {
          x: "14:00",
          y2: 22,
          type: "产品2",
        },
        {
          x: "16:00",
          y2: 22,
          type: "产品2",
        },
        {
          x: "18:00",
          y2: 27,
          type: "产品2",
        },
        {
          x: "20:00",
          y2: 37,
          type: "产品2",
        },
        {
          x: "22:00",
          y2: 36,
          type: "产品2",
        },
      ],
    },
  ],
  axes: [
    {
      orient: "bottom",
    },
    {
      orient: "left",
      title: {
        visible: true,
        text: "支出",
        style: {
          fontSize: 12,
          fill: '#515461',
        }
      },
      zero: true,
      seriesIndex: 0,
      bandPadding: 0.5
    },
    {
      orient: "right",
      visible: true,
      title: {
        visible: true,
        text: "利润",
        style: {
          fontSize: 12,
          fill: '#515461',
        }
      },
      seriesIndex: 1
    },
  ],
  series: [
    {
      type: 'bar',
      xField: 'x',
      yField: 'y',
      dataId: 'barData',
    },
    {
      type: 'area',
      xField: 'x',
      yField: 'y2',
      dataId: 'lineData',
      stack: false,
    },
  ]
};
