export default {
  type: "indicator",
  data: [
    {
      name: "indicator",
      values: [
        {
          前日: 122,
          昨日: 124,
          今日: 130,
          指标: "9999.9",
        },
      ],
    },
  ],
  indicatorField: {
    field: "指标",
    keyVisible: true,
    keyStyle: {
      fontWeight: "normal",
      fontSize: 12,
    },
    valueStyle: {
      fontWeight: "bold",
      fontSize: 36,
      fontFamily: "Nunito for Arco",
    },
  },
  secondaryIndicators: [
    {
      field: "前日",
      tagPosition: "right",
      decisionValue: 125,
      negativeTagColor: "#86DF6C",
      positiveTagColor: "#EE5C3D",
      tagSize: 1.5,
      tagOffset: {
        x: 10,
      },
      positiveTag:
        "M 0.15 -5.14 L 5.05 0.46 L 1.85 -0.14 L 1.75 -0.14 L 1.75 0.16 C 1.25 2.76 -0.65 4.86 -3.15 5.46 C -2.35 4.46 -2.05 4.26 -1.75 2.76 C -1.55 1.86 -1.45 0.86 -1.45 -0.14 L -1.45 -0.14 L -1.45 -0.14 L -4.75 0.46 L 0.15 -5.14 Z",
      negativeTag:
        "M -4.05 2.86 L -4.15 -4.44 L -2.05 -2.04 L -2.05 -2.04 L -1.85 -2.14 C 0.25 -3.94 3.15 -4.44 5.45 -3.44 C 4.15 -3.14 3.75 -3.14 2.65 -2.14 C 1.85 -1.54 1.15 -0.84 0.45 -0.04 L 0.45 -0.14 L 0.45 -0.04 L 3.45 1.46 L -4.05 2.86 Z",
      keyStyle: {
        fontSize: 12,
        color: "#4E5969",
      },
      valueStyle: {
        fontSize: 14,
        color: "#51BE6F",
        fontWeight: 500,
      },
    },
    {
      field: "昨日",
      tagPosition: "right",
      decisionValue: 125,
      negativeTagColor: "#86DF6C",
      positiveTagColor: "#EE5C3D",
      tagSize: 1.5,
      tagOffset: {
        x: 10,
      },
      positiveTag:
        "M 0.15 -5.14 L 5.05 0.46 L 1.85 -0.14 L 1.75 -0.14 L 1.75 0.16 C 1.25 2.76 -0.65 4.86 -3.15 5.46 C -2.35 4.46 -2.05 4.26 -1.75 2.76 C -1.55 1.86 -1.45 0.86 -1.45 -0.14 L -1.45 -0.14 L -1.45 -0.14 L -4.75 0.46 L 0.15 -5.14 Z",
      negativeTag:
        "M -4.05 2.86 L -4.15 -4.44 L -2.05 -2.04 L -2.05 -2.04 L -1.85 -2.14 C 0.25 -3.94 3.15 -4.44 5.45 -3.44 C 4.15 -3.14 3.75 -3.14 2.65 -2.14 C 1.85 -1.54 1.15 -0.84 0.45 -0.04 L 0.45 -0.14 L 0.45 -0.04 L 3.45 1.46 L -4.05 2.86 Z",
      keyStyle: {
        fontSize: 12,
        color: "#4E5969",
      },
      valueStyle: {
        fontSize: 14,
        color: "#51BE6F",
        fontWeight: 500,
      },
    },
    {
      field: "今日",
      tagPosition: "right",
      decisionValue: 125,
      negativeTagColor: "#86DF6C",
      positiveTagColor: "#EE5C3D",
      tagSize: 1.5,
      tagOffset: {
        x: 10,
      },
      positiveTag:
        "M 0.15 -5.14 L 5.05 0.46 L 1.85 -0.14 L 1.75 -0.14 L 1.75 0.16 C 1.25 2.76 -0.65 4.86 -3.15 5.46 C -2.35 4.46 -2.05 4.26 -1.75 2.76 C -1.55 1.86 -1.45 0.86 -1.45 -0.14 L -1.45 -0.14 L -1.45 -0.14 L -4.75 0.46 L 0.15 -5.14 Z",
      negativeTag:
        "M -4.05 2.86 L -4.15 -4.44 L -2.05 -2.04 L -2.05 -2.04 L -1.85 -2.14 C 0.25 -3.94 3.15 -4.44 5.45 -3.44 C 4.15 -3.14 3.75 -3.14 2.65 -2.14 C 1.85 -1.54 1.15 -0.84 0.45 -0.04 L 0.45 -0.14 L 0.45 -0.04 L 3.45 1.46 L -4.05 2.86 Z",
      keyStyle: {
        fontSize: 12,
        color: "#4E5969",
      },
      valueStyle: {
        fontSize: 14,
        color: "#EE5C3D",
        fontWeight: 500,
      },
    },
  ],
};
