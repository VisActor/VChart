import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    type: 'pie',
    data: {
      values: [
        {
          业务: 'Lark Global',
          需求数量: '1'
        },
        {
          业务: 'Admin',
          需求数量: '12'
        },
        {
          业务: '专项',
          需求数量: '6'
        },
        {
          业务: 'Lark Messenger 基础技术',
          需求数量: '5'
        },
        {
          业务: 'Meego',
          需求数量: '1'
        },
        {
          业务: 'People',
          需求数量: '5'
        },
        {
          业务: 'Security and Compliance',
          需求数量: '27'
        },
        {
          业务: '开放平台',
          需求数量: '4'
        },
        {
          业务: 'Trust and Safety',
          需求数量: '3'
        },
        {
          业务: 'KA',
          需求数量: '1'
        },
        {
          业务: 'Lark Middle Platform',
          需求数量: '1'
        },
        {
          业务: 'UX',
          需求数量: '1'
        },
        {
          业务: 'Mail',
          需求数量: '5'
        },
        {
          业务: 'Calendar',
          需求数量: '4'
        },
        {
          业务: 'Lingo & Search',
          需求数量: '15'
        },
        {
          业务: 'CCM',
          需求数量: '11'
        },
        {
          业务: 'IM',
          需求数量: '73'
        },
        {
          业务: 'Base',
          需求数量: '2'
        },
        {
          业务: 'VC',
          需求数量: '4'
        }
      ]
    },
    categoryField: '业务',
    valueField: '需求数量',
    axes: [
      {
        label: {
          autoHide: true,
          autoRotate: true
        },
        orient: 'bottom',
        sampling: true
      },
      {
        orient: 'left',
        title: {
          text: '单位（万）',
          visible: true
        }
      }
    ],
    line: {
      style: {
        curveType: 'monotone'
      }
    },
    point: {
      visible: false
    }
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
