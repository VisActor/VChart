export default {
  bandPadding: 0.5,
  data: [
    {
      name: "data",
      values: [
        [
          {
            x: "周一",
            y: 11,
            c: 0,
          },
          {
            x: "周二",
            y: 12,
            c: 0,
          },
          {
            x: "周三",
            y: 11,
            c: 0,
          },
          {
            x: "周四",
            y: 10,
            c: 0,
          },
          {
            x: "周五",
            y: 12,
            c: 0,
          },
          {
            x: "周六",
            y: 14,
            c: 0,
          },
          {
            x: "周日",
            y: 17,
            c: 0,
          },
          {
            x: "周一",
            y: 13,
            c: 1,
          },
          {
            x: "周二",
            y: 14,
            c: 1,
          },
          {
            x: "周三",
            y: 14,
            c: 1,
          },
          {
            x: "周四",
            y: 16,
            c: 1,
          },
          {
            x: "周五",
            y: 15,
            c: 1,
          },
          {
            x: "周六",
            y: 18,
            c: 1,
          },
          {
            x: "周日",
            y: 21,
            c: 1,
          },
        ],
        [
          {
            x: "周一",
            y: 22,
            c: 1,
          },
          {
            x: "周二",
            y: 23,
            c: 1,
          },
          {
            x: "周三",
            y: 21,
            c: 1,
          },
          {
            x: "周四",
            y: 20,
            c: 1,
          },
          {
            x: "周五",
            y: 22,
            c: 1,
          },
          {
            x: "周六",
            y: 24,
            c: 1,
          },
          {
            x: "周日",
            y: 27,
            c: 1,
          },
          {
            x: "周一",
            y: 22,
            c: 2,
          },
          {
            x: "周二",
            y: 23,
            c: 2,
          },
          {
            x: "周三",
            y: 21,
            c: 2,
          },
          {
            x: "周四",
            y: 20,
            c: 2,
          },
          {
            x: "周五",
            y: 22,
            c: 2,
          },
          {
            x: "周六",
            y: 24,
            c: 2,
          },
          {
            x: "周日",
            y: 27,
            c: 2,
          },
        ],
        [
          {
            10001: "数量",
            10011: 12,
            20001: "数量",
            200428181542219: "周一",
            c: 3,
          },
          {
            10001: "数量",
            10011: 16,
            20001: "数量",
            200428181542219: "周二",
            c: 3,
          },
          {
            10001: "数量",
            10011: 15,
            20001: "数量",
            200428181542219: "周三",
            c: 3,
          },
          {
            10001: "数量",
            10011: 13,
            20001: "数量",
            200428181542219: "周四",
            c: 3,
          },
          {
            10001: "数量",
            10011: 12,
            20001: "数量",
            200428181542219: "周五",
            c: 3,
          },
          {
            10001: "数量",
            10011: 21,
            20001: "数量",
            200428181542219: "周六",
            c: 3,
          },
          {
            10001: "数量",
            10011: 15,
            20001: "数量",
            200428181542219: "周日",
            c: 3,
          },
          {
            10001: "折扣",
            10012: 5,
            20001: "折扣",
            200428181542219: "周一",
            c: 4,
          },
          {
            10001: "折扣",
            10012: 14,
            20001: "折扣",
            200428181542219: "周二",
            c: 4,
          },
          {
            10001: "折扣",
            10012: 9,
            20001: "折扣",
            200428181542219: "周三",
            c: 4,
          },
          {
            10001: "折扣",
            10012: 11,
            20001: "折扣",
            200428181542219: "周四",
            c: 4,
          },
          {
            10001: "折扣",
            10012: 13,
            20001: "折扣",
            200428181542219: "周五",
            c: 4,
          },
          {
            10001: "折扣",
            10012: 16,
            20001: "折扣",
            200428181542219: "周六",
            c: 4,
          },
          {
            10001: "折扣",
            10012: 16,
            20001: "折扣",
            200428181542219: "周日",
            c: 4,
          },
        ],
      ],
      fields: {
        10001: {
          alias: "指标名称",
        },
        10011: {
          alias: "指标值(主轴)",
        },
        10012: {
          alias: "指标值(次轴)",
        },
        20001: {
          alias: "图例项",
        },
        200428181542219: {
          alias: "细分",
        },
        200428181542065: {
          alias: "数量",
        },
        200428181542401: {
          alias: "折扣",
        },
      },
    },
  ],
  labels: {
    visible: true,
    coverEnable: false,
    position: "inside-middle",
    fontSize: 12,
  },
  type: "pivotCombination",
  xField: "x",
  groupBy: "c",
  children: [
    {
      type: "line",
      dataIndex: 0,
      index: 0,
      xField: "x",
      yField: "y",
    },
    {
      type: "bar",
      dataIndex: 1,
      index: 1,
      xField: "x",
      yField: "y",
    },
    {
      type: "bar",
      dataIndex: 0,
      index: 1,
      xField: "x",
      yField: "y",
    },
    {
      type: "dualAxis",
      xField: "200428181542219",
      dataIndex: 2,
      y0: {
        type: "bar",
        yField: "10011",
      },
      y1: {
        type: "line",
        yField: "10012",
      },
      axes: [
        {
          orient: "bottom",
          title: {
            visible: false,
            text: "",
            titleFontSize: 12,
            titleColor: "#515461",
          },
          label: {
            visible: true,
            labelFontSize: 12,
            labelColor: "#9ca0b1",
            labelAngle: 0,
          },
        },
        {
          orient: "left",
          title: {
            visible: true,
            text: "数量",
            titleFontSize: 12,
            titleColor: "#515461",
          },
          label: {
            visible: true,
            labelFontSize: 12,
            labelColor: "#9ca0b1",
            labelAngle: 0,
          },
          range: {
            zero: true,
            max: 30,
          },
        },
        {
          orient: "right",
          title: {
            visible: true,
            text: "折扣",
            titleFontSize: 12,
            titleColor: "#515461",
          },
          label: {
            visible: true,
          },
          range: {
            zero: true,
            max: 30,
          },
        },
      ],
      labels: {
        visible: false,
      },
    },
  ],
};
