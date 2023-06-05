export default {
  description: "敌人前进路线图",
  type: "radar",
  data: [
    {
      name: "地图",
      fields: {
        category: {
          alias: "敌人",
        },
        value: {
          alias: "攻击力",
        },
      },
      values: [
        {
          key: "北",
          value: 31,
          category: "驱逐舰",
        },
        {
          key: "东北",
          value: 32,
          category: "驱逐舰",
        },
        {
          key: "东",
          value: 21,
          category: "驱逐舰",
        },
        {
          key: "东南",
          value: 15,
          category: "驱逐舰",
        },
        {
          key: "南",
          value: 50,
          category: "驱逐舰",
        },
        {
          key: "西南",
          value: 44,
          category: "驱逐舰",
        },
        {
          key: "西",
          value: 32,
          category: "驱逐舰",
        },
        {
          key: "西北",
          value: 32,
          category: "驱逐舰",
        },
        {
          key: "北",
          value: 31,
          category: "驱逐舰",
        },
        {
          key: "东北",
          value: 32,
          category: "驱逐舰",
        },
        {
          key: "东",
          value: 21,
          category: "驱逐舰",
        },
        {
          key: "东南",
          value: 40,
          category: "航母",
        },
        {
          key: "南",
          value: 25,
          category: "航母",
        },
        {
          key: "西南",
          value: 22,
          category: "航母",
        },
        {
          key: "西",
          value: 18,
          category: "航母",
        },
        {
          key: "西北",
          value: 7,
          category: "航母",
        },
        {
          key: "北",
          value: 24,
          category: "航母",
        },
        {
          key: "东北",
          value: 43,
          category: "航母",
        },
        {
          key: "东",
          value: 42,
          category: "航母",
        },
      ],
    },
  ],
  categoryField: "key",
  valueField: "value",
  seriesField: "category",
  legends: {
    visible: true,
    orient: "bottom",
  },
  label: {
    visible: false,
  },
  area: {
    visible: false,
  },
  point: {
    visible: true
  },
  radius: 0.8,
  axes: [
    {
      orient: 'angle',
      domainLine: { visible: false },
      grid: { style: { lineDash: [0] } },
      tick: {
        visible: false,
      },
      label: {
        space: 20
      }
    },
    {
      orient: 'radius',
      tick: {
        visible: false,
        tickCount: 3,
      },
      label: {
        visible: false
      },
      grid: { visible: true, smooth: false, style: { lineDash: [0] } }
    }
  ]
};
