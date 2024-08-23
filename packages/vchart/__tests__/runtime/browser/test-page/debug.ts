import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = async () => {
  const spec = {
    type: 'bar',
    data: {
      values: [
        {
          country: 'USA',
          visits: 23725
        },
        {
          country: 'China',
          visits: 1882
        },
        {
          country: 'Japan',
          visits: 1809
        },
        {
          country: 'Germany',
          visits: 1322
        },
        {
          country: 'UK',
          visits: 1122
        },
        {
          country: 'France',
          visits: 1114
        },
        {
          country: 'India',
          visits: 984
        },
        {
          country: 'Spain',
          visits: 711
        },
        {
          country: 'Netherlands',
          visits: 665
        },
        {
          country: 'Russia',
          visits: 580
        },
        {
          country: 'South Korea',
          visits: 443
        },
        {
          country: 'Canada',
          visits: 441
        }
      ]
    },
    xField: 'country',
    yField: 'visits',
    axes: [
      {
        orient: 'left',
        // breaks: [
        //   {
        //     range: [2100, 22900]
        //   },
        //   {
        //     range: [700, 900]
        //   }
        // ],
        domainLine: {
          visible: true
        },
        max: 24000,
        tick: {
          tickCount: 10
        }
      }
    ]
  };

  // const spec = {
  //   type: 'line',
  //   data: [
  //     {
  //       name: 'line',

  //       values: [
  //         {
  //           x: '回合1',
  //           y: 15,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合1',
  //           y: 13,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合2',
  //           y: 41,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合2',
  //           y: 10,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合3',
  //           y: 19,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合3',
  //           y: 15,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合4',
  //           y: 24,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合4',
  //           y: 38,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合5',
  //           y: 87,
  //           c: '绿水灵'
  //         },
  //         {
  //           x: '回合5',
  //           y: 66,
  //           c: '飘飘猪'
  //         },
  //         {
  //           x: '回合6',
  //           y: 480,
  //           c: '绿水灵',
  //           latest: true
  //         },
  //         {
  //           x: '回合6',
  //           y: 490,
  //           c: '飘飘猪',
  //           latest: true
  //         }
  //       ]
  //     }
  //   ],

  //   axes: [
  //     {
  //       orient: 'left',
  //       domain: true,
  //       domainWidth: 1,
  //       breaks: [
  //         {
  //           visible: true,
  //           range: [100, 470]
  //         }
  //       ],
  //       zero: true,
  //       nice: true
  //     },
  //     {
  //       orient: 'bottom'
  //     }
  //   ],
  //   xField: 'x',
  //   yField: 'y',
  //   seriesField: 'c',
  //   width: 539,
  //   height: 377.8
  // };
  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();
  window['vchart'] = vchart;
};
run();
