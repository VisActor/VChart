export default {
  type: 'pie',
  data: [
    {
      id: 'id0',
      values: [{"value":"832","type":"Aris","stack":"A"},{"value":"669","type":"Blank","stack":"A"},{"value":"723","type":"Constraint","stack":"A"},{"value":"632","type":"Dominate","stack":"A"}]
    }
  ],
  radius: 0.8,
  innerRadius: 0.4,
  valueField: 'value',
  categoryField: 'type',
  legends: {
    visible: true,
    orient: 'bottom',
    title: {
      visible: false
    },
    item: {
      visible: true,
      shape: {
        state: {
          unSelected: {
            fill: 'gray'
          }
        }
      },
      label: {
        state: {
          selectedHover: {
            fill: 'red'
          }
        }
      }
    }
  },
  indicator: {
    visible: true,
    // fixed: false,
    trigger: 'hover',
    // gap: 16,
    // offset: { y: 100 },
    title: {
      visible: true,
      field: 'type',
      autoFit: true,
      // fitPercent: 1,
      style: {
        fontSize: 42,
        // text: 'TITLE',
        fill: 'red'
      }
    },
    content: [
      {
        visible: true,
        style: {
          fontSize: 16,
          text: 'CONTENT0'
        }
      },
      {
        autoLimit: true,
        style: {
          fontSize: 16,
          text: 'CONTENT111111111111111111111111111111111111111',
          fill: 'blue',
          fontWeight: 'bolder'
        }
      }
    ]
  }
};
