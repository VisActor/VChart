import { STATE_HOVER_REVERSE } from './../../../../cjs/compile/mark/interface.d';
import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const spec1 = {
    type: 'sankey',
    data: [
      {
        name: 'data',
        values: [
          {
            nodes: [
              {
                // value: 100,
                name: 'A',
                children: [
                  {
                    name: 'top',
                    // value: 40,
                    children: [
                      { name: '00', value: 15 },
                      { name: '01', value: 10 },
                      { name: '02', value: 10 }
                    ]
                  },
                  {
                    name: 'middle',
                    // value: 30,
                    children: [
                      { name: '00', value: 10 },
                      { name: '01', value: 10 },
                      { name: '02', value: 10 }
                    ]
                  },
                  {
                    name: 'bottom',
                    value: 30
                  }
                ]
              },
              {
                // value: 80,
                name: 'B',
                children: [
                  {
                    name: 'top',
                    // value: 40,
                    children: [
                      { name: '00', value: 100 },
                      { name: '01', value: 40 }
                    ]
                  },
                  {
                    name: 'middle',
                    value: 10
                  },
                  {
                    name: 'bottom',
                    value: 30
                  }
                ]
              },
              {
                value: 50,
                name: 'C',
                children: [
                  {
                    name: 'top',
                    value: 20
                  },
                  {
                    name: 'middle',
                    value: 20
                  },
                  {
                    name: 'bottom',
                    value: 10
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    categoryField: 'name',
    valueField: 'value',

    nodeAlign: 'left',
    nodeGap: 8,
    nodeWidth: 10,
    minNodeHeight: 4,
    nodeKey: datum => datum.name,

    label: {
      visible: true,
      formatMethod: (text, datum) => {
        // console.log('text', text);
        // console.log('datum', datum);
        return datum.name + '-' + datum.value;
      },
      state: {
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    legends: {
      visible: true
    },

    node: {
      state: {
        hover: {
          fill: 'red'
        },
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    link: {
      state: {
        selected: {
          backgroundStyle: { fill: '#e8e8e8' }
        },
        hover: {
          stroke: '#000000'
        },
        blur: {
          fill: '#e8e8e8'
        }
      }
    },

    emphasis: {
      enable: true,
      effect: 'related'
    }
  };

  const data = [
    [
      {
        nodes: [
          {
            name: 'Berlin'
          },
          {
            name: 'Job Applications'
          },
          {
            name: 'Barcelona'
          },
          {
            name: 'Madrid'
          },
          {
            name: 'Amsterdam'
          },
          {
            name: 'Paris'
          },
          {
            name: 'London'
          },
          {
            name: 'Munich'
          },
          {
            name: 'Brussels'
          },
          {
            name: 'Dubai'
          },
          {
            name: 'Dublin'
          },
          {
            name: 'Other Cities'
          },
          {
            name: 'No Response'
          },
          {
            name: 'Responded'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Interviewed'
          },
          {
            name: 'No Offer'
          },
          {
            name: 'Declined Offer'
          },
          {
            name: 'Accepted Offer'
          }
        ],
        links: [
          {
            source: 'Berlin',
            target: 'Job Applications',
            value: 102,
            color: '#dddddd'
          },
          {
            source: 'Barcelona',
            target: 'Job Applications',
            value: 39,
            color: '#dddddd'
          },
          {
            source: 'Madrid',
            target: 'Job Applications',
            value: 35,
            color: '#dddddd'
          },
          {
            source: 'Amsterdam',
            target: 'Job Applications',
            value: 15,
            color: '#dddddd'
          },
          {
            source: 'Paris',
            target: 'Job Applications',
            value: 14,
            color: '#dddddd'
          },
          {
            source: 'London',
            target: 'Job Applications',
            value: 6,
            color: '#dddddd'
          },
          {
            source: 'Munich',
            target: 'Job Applications',
            value: 5,
            color: '#dddddd'
          },
          {
            source: 'Brussels',
            target: 'Job Applications',
            value: 4,
            color: '#dddddd'
          },
          {
            source: 'Dubai',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Dublin',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Other Cities',
            target: 'Job Applications',
            value: 12,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'No Response',
            value: 189,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'Responded',
            value: 49,
            color: 'orange'
          },
          {
            source: 'Responded',
            target: 'Rejected',
            value: 38,
            color: '#dddddd'
          },
          {
            source: 'Responded',
            target: 'Interviewed',
            value: 11,
            color: 'orange'
          },
          {
            source: 'Interviewed',
            target: 'No Offer',
            value: 8,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Declined Offer',
            value: 2,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Accepted Offer',
            value: 1,
            color: 'orange'
          }
        ]
      }
    ],
    [
      {
        nodes: [
          {
            name: 'Berlin'
          },
          {
            name: 'Job Applications'
          },
          {
            name: 'Barcelona'
          },
          {
            name: 'Madrid'
          },
          {
            name: 'Amsterdam'
          },
          {
            name: 'Paris'
          },
          {
            name: 'London'
          },
          {
            name: 'Munich'
          },
          {
            name: 'Brussels'
          },
          {
            name: 'Dubai'
          },
          {
            name: 'Dublin'
          },
          {
            name: 'Other Cities'
          },
          {
            name: 'No Response'
          },
          {
            name: 'Responded'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Interviewed'
          },
          {
            name: 'No Offer'
          },
          {
            name: 'Declined Offer'
          },
          {
            name: 'Accepted Offer'
          }
        ],
        links: [
          {
            source: 'Berlin',
            target: 'Job Applications',
            value: 102,
            color: '#dddddd'
          },
          {
            source: 'Barcelona',
            target: 'Job Applications',
            value: 39,
            color: '#dddddd'
          },
          {
            source: 'Madrid',
            target: 'Job Applications',
            value: 35,
            color: '#dddddd'
          },
          {
            source: 'Amsterdam',
            target: 'Job Applications',
            value: 15,
            color: '#dddddd'
          },
          {
            source: 'Paris',
            target: 'Job Applications',
            value: 14,
            color: '#dddddd'
          },
          {
            source: 'London',
            target: 'Job Applications',
            value: 6,
            color: '#dddddd'
          },
          {
            source: 'Munich',
            target: 'Job Applications',
            value: 5,
            color: '#dddddd'
          },
          {
            source: 'Brussels',
            target: 'Job Applications',
            value: 4,
            color: '#dddddd'
          },
          {
            source: 'Dubai',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Dublin',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Other Cities',
            target: 'Job Applications',
            value: 12,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'No Response',
            value: 189,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'Responded',
            value: 49,
            color: 'orange'
          },
          {
            source: 'Responded',
            target: 'Rejected',
            value: 8,
            color: '#dddddd'
          },
          {
            source: 'Responded',
            target: 'Interviewed',
            value: 2,
            color: 'orange'
          },
          {
            source: 'Interviewed',
            target: 'No Offer',
            value: 38,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Declined Offer',
            value: 1,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Accepted Offer',
            value: 1,
            color: 'orange'
          }
        ]
      }
    ],
    [
      {
        nodes: [
          {
            name: 'Berlin'
          },
          {
            name: 'Job Applications'
          },
          {
            name: 'Barcelona'
          },
          {
            name: 'Madrid'
          },
          {
            name: 'Amsterdam'
          },
          {
            name: 'Paris'
          },
          {
            name: 'London'
          },
          {
            name: 'Munich'
          },
          {
            name: 'Brussels'
          },
          {
            name: 'Dubai'
          },
          {
            name: 'Dublin'
          },
          {
            name: 'Other Cities'
          },
          {
            name: 'No Response'
          },
          {
            name: 'Responded'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Interviewed'
          },
          {
            name: 'No Offer'
          },
          {
            name: 'Declined Offer'
          },
          {
            name: 'Accepted Offer'
          }
        ],
        links: [
          {
            source: 'Berlin',
            target: 'Job Applications',
            value: 102,
            color: '#dddddd'
          },
          {
            source: 'Barcelona',
            target: 'Job Applications',
            value: 39,
            color: '#dddddd'
          },
          {
            source: 'Madrid',
            target: 'Job Applications',
            value: 35,
            color: '#dddddd'
          },
          {
            source: 'Amsterdam',
            target: 'Job Applications',
            value: 15,
            color: '#dddddd'
          },
          {
            source: 'Paris',
            target: 'Job Applications',
            value: 14,
            color: '#dddddd'
          },
          {
            source: 'London',
            target: 'Job Applications',
            value: 6,
            color: '#dddddd'
          },
          {
            source: 'Munich',
            target: 'Job Applications',
            value: 5,
            color: '#dddddd'
          },
          {
            source: 'Brussels',
            target: 'Job Applications',
            value: 4,
            color: '#dddddd'
          },
          {
            source: 'Dubai',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Dublin',
            target: 'Job Applications',
            value: 3,
            color: '#dddddd'
          },
          {
            source: 'Other Cities',
            target: 'Job Applications',
            value: 12,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'No Response',
            value: 189,
            color: '#dddddd'
          },
          {
            source: 'Job Applications',
            target: 'Responded',
            value: 49,
            color: 'orange'
          },
          {
            source: 'Responded',
            target: 'Rejected',
            value: 38,
            color: '#dddddd'
          },
          {
            source: 'Responded',
            target: 'Interviewed',
            value: 11,
            color: 'orange'
          },
          {
            source: 'Interviewed',
            target: 'No Offer',
            value: 80,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Declined Offer',
            value: 20,
            color: '#dddddd'
          },
          {
            source: 'Interviewed',
            target: 'Accepted Offer',
            value: 10,
            color: 'red'
          }
        ]
      }
    ]
  ];
  const createData = () => {
    return data.map(values => {
      return {
        data: {
          id: 'data',
          values: values
        }
      };
    });
  };
  const specs = createData();

  // console.log(specs, specs[0].data);

  const spec = {
    type: 'sankey',
    data: [specs[0].data],
    categoryField: 'name',
    valueField: 'value',
    sourceField: 'source',
    targetField: 'target',

    nodeAlign: 'justify',
    nodeGap: 8,
    nodeWidth: 15,
    minNodeHeight: 4,
    nodeKey: datum => datum.name,
    iterations: 20,

    title: {
      text: 'Job application process'
    },

    label: {
      visible: true,
      style: {
        fontSize: 10,
        fill: 'black'
      },
      state: {
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    node: {
      style: {
        fill: '#b9b9b9',
        stroke: 'white',
        lineWidth: 1,
        strokeOpacity: 1
      },
      state: {
        custom_unSelected: {
          fill: 'red',
          fillOpacity: 0.05
        }
      }
    },

    link: {
      style: {
        fill: data => {
          return data.color ?? data.datum.color;
        },
        fillOpacity: 1
      },
      state: {
        custom_unSelected: {
          fill: 'red',
          fillOpacity: 0.05
        }
      }
    }
  };

  const spec2 = {
    type: 'sankey',
    data: [
      {
        values: [
          {
            nodes: [
              { nodeName: "Agricultural 'waste'" },
              { nodeName: 'Bio-conversion' },
              { nodeName: 'Liquid' },
              { nodeName: 'Losses' },
              { nodeName: 'Solid' },
              { nodeName: 'Gas' },
              { nodeName: 'Biofuel imports' },
              { nodeName: 'Biomass imports' },
              { nodeName: 'Coal imports' },
              { nodeName: 'Coal' },
              { nodeName: 'Coal reserves' },
              { nodeName: 'District heating' },
              { nodeName: 'Industry' },
              { nodeName: 'Heating and cooling - commercial' },
              { nodeName: 'Heating and cooling - homes' },
              { nodeName: 'Electricity grid' },
              { nodeName: 'Over generation / exports' },
              { nodeName: 'H2 conversion' },
              { nodeName: 'Road transport' },
              { nodeName: 'Agriculture' },
              { nodeName: 'Rail transport' },
              { nodeName: 'Lighting & appliances - commercial' },
              { nodeName: 'Lighting & appliances - homes' },
              { nodeName: 'Gas imports' },
              { nodeName: 'Ngas' },
              { nodeName: 'Gas reserves' },
              { nodeName: 'Thermal generation' },
              { nodeName: 'Geothermal' },
              { nodeName: 'H2' },
              { nodeName: 'Hydro' },
              { nodeName: 'International shipping' },
              { nodeName: 'Domestic aviation' },
              { nodeName: 'International aviation' },
              { nodeName: 'National navigation' },
              { nodeName: 'Marine algae' },
              { nodeName: 'Nuclear' },
              { nodeName: 'Oil imports' },
              { nodeName: 'Oil' },
              { nodeName: 'Oil reserves' },
              { nodeName: 'Other waste' },
              { nodeName: 'Pumped heat' },
              { nodeName: 'Solar PV' },
              { nodeName: 'Solar Thermal' },
              { nodeName: 'Solar' },
              { nodeName: 'Tidal' },
              { nodeName: 'UK land based bioenergy' },
              { nodeName: 'Wave' },
              { nodeName: 'Wind' }
            ],
            links: [
              { from: 0, to: 1, value: 124.729 },
              { from: 1, to: 2, value: 0.597 },
              { from: 1, to: 3, value: 26.862 },
              { from: 1, to: 4, value: 280.322 },
              { from: 1, to: 5, value: 81.144 },
              { from: 6, to: 2, value: 35 },
              { from: 7, to: 4, value: 35 },
              { from: 8, to: 9, value: 11.606 },
              { from: 10, to: 9, value: 63.965 },
              { from: 9, to: 4, value: 75.571 },
              { from: 11, to: 12, value: 10.639 },
              { from: 11, to: 13, value: 22.505 },
              { from: 11, to: 14, value: 46.184 },
              { from: 15, to: 16, value: 104.453 },
              { from: 15, to: 14, value: 113.726 },
              { from: 15, to: 17, value: 27.14 },
              { from: 15, to: 12, value: 342.165 },
              { from: 15, to: 18, value: 37.797 },
              { from: 15, to: 19, value: 4.412 },
              { from: 15, to: 13, value: 40.858 },
              { from: 15, to: 3, value: 56.691 },
              { from: 15, to: 20, value: 7.863 },
              { from: 15, to: 21, value: 90.008 },
              { from: 15, to: 22, value: 93.494 },
              { from: 23, to: 24, value: 40.719 },
              { from: 25, to: 24, value: 82.233 },
              { from: 5, to: 13, value: 0.129 },
              { from: 5, to: 3, value: 1.401 },
              { from: 5, to: 26, value: 151.891 },
              { from: 5, to: 19, value: 2.096 },
              { from: 5, to: 12, value: 48.58 },
              { from: 27, to: 15, value: 7.013 },
              { from: 17, to: 28, value: 20.897 },
              { from: 17, to: 3, value: 6.242 },
              { from: 28, to: 18, value: 20.897 },
              { from: 29, to: 15, value: 6.995 },
              { from: 2, to: 12, value: 121.066 },
              { from: 2, to: 30, value: 128.69 },
              { from: 2, to: 18, value: 135.835 },
              { from: 2, to: 31, value: 14.458 },
              { from: 2, to: 32, value: 206.267 },
              { from: 2, to: 19, value: 3.64 },
              { from: 2, to: 33, value: 33.218 },
              { from: 2, to: 20, value: 4.413 },
              { from: 34, to: 1, value: 4.375 },
              { from: 24, to: 5, value: 122.952 },
              { from: 35, to: 26, value: 839.978 },
              { from: 36, to: 37, value: 504.287 },
              { from: 38, to: 37, value: 107.703 },
              { from: 37, to: 2, value: 611.99 },
              { from: 39, to: 4, value: 56.587 },
              { from: 39, to: 1, value: 77.81 },
              { from: 40, to: 14, value: 193.026 },
              { from: 40, to: 13, value: 70.672 },
              { from: 41, to: 15, value: 59.901 },
              { from: 42, to: 14, value: 19.263 },
              { from: 43, to: 42, value: 19.263 },
              { from: 43, to: 41, value: 59.901 },
              { from: 4, to: 19, value: 0.882 },
              { from: 4, to: 26, value: 400.12 },
              { from: 4, to: 12, value: 46.477 },
              { from: 26, to: 15, value: 525.531 },
              { from: 26, to: 3, value: 787.129 },
              { from: 26, to: 11, value: 79.329 },
              { from: 44, to: 15, value: 9.452 },
              { from: 45, to: 1, value: 182.01 },
              { from: 46, to: 15, value: 19.013 },
              { from: 47, to: 15, value: 289.366 }
            ]
          }
        ]
      }
    ],
    categoryField: 'nodeName',
    valueField: 'value',
    sourceField: 'from',
    targetField: 'to',

    nodeAlign: 'justify',
    nodeGap: 8,
    nodeWidth: 10,
    minNodeHeight: 4,

    title: {
      text: 'How energy is converted or transmitted before being consumed or lost',
      subtext: 'Data: Department of Energy & Climate Change via Tom Counsell',
      subtextStyle: {
        fontSize: 12
      }
    },

    label: {
      visible: true,
      style: {
        fontSize: 10
      }
    },

    node: {
      state: {
        hover: {
          stroke: '#333333'
        },
        selected: {
          fill: '#dddddd',
          stroke: '#333333',
          lineWidth: 1,
          brighter: 1,
          fillOpacity: 1
        }
      }
    },

    link: {
      state: {
        hover: {
          fillOpacity: 1
        },
        selected: {
          fill: '#dddddd',
          stroke: '#333333',
          lineWidth: 1,
          brighter: 1,
          fillOpacity: 1
        }
      }
    }
  };

  const data1 = [
    {
      nodes: [
        { name: 'Bight of Benin', category: 'Bight' },
        { name: 'Brazil', category: 'Brazil' },
        { name: 'Bight of Biafra and Gulf of Guinea islands', category: 'Bight' },
        { name: 'Gold Coast', category: 'Gold' },
        { name: 'Others Dep.', category: 'Others' },
        { name: 'Senegambia and offshore Atlantic', category: 'Senegambia' },
        { name: 'Sierra Leone e Windward Coast', category: 'Sierra' },
        { name: 'Southeast Africa and Indian Ocean islands', category: 'Southeast' },
        { name: 'West Central Africa and St. Helena', category: 'West' },
        { name: 'Caribbean', category: 'Caribbean' },
        { name: 'Mainland North America', category: 'Mainland' },
        { name: 'Others Arr', category: 'Others' },
        { name: 'Spanish American Mainland', category: 'Spanish' }
      ],
      links: [
        { target: 'Brazil', source: 'Bight of Benin', value: 733769 },
        { target: 'Brazil', source: 'Bight of Biafra and Gulf of Guinea islands', value: 98256 },
        { target: 'Brazil', source: 'Gold Coast', value: 40507 },
        { target: 'Brazil', source: 'Others Dep.', value: 18627 },
        { target: 'Brazil', source: 'Senegambia and offshore Atlantic', value: 86001 },
        { target: 'Brazil', source: 'Sierra Leone e Windward Coast', value: 5409 },
        { target: 'Brazil', source: 'Southeast Africa and Indian Ocean islands', value: 232940 },
        { target: 'Brazil', source: 'West Central Africa and St. Helena', value: 1818611 },
        { target: 'Caribbean', source: 'Bight of Benin', value: 494753 },
        { target: 'Caribbean', source: 'Bight of Biafra and Gulf of Guinea islands', value: 678927 },
        { target: 'Caribbean', source: 'Gold Coast', value: 517280 },
        { target: 'Caribbean', source: 'Others Dep.', value: 192389 },
        { target: 'Caribbean', source: 'Senegambia and offshore Atlantic', value: 144125 },
        { target: 'Caribbean', source: 'Sierra Leone e Windward Coast', value: 284412 },
        { target: 'Caribbean', source: 'Southeast Africa and Indian Ocean islands', value: 57138 },
        { target: 'Caribbean', source: 'West Central Africa and St. Helena', value: 793963 },
        { target: 'Mainland North America', source: 'Bight of Benin', value: 7153 },
        { target: 'Mainland North America', source: 'Bight of Biafra and Gulf of Guinea islands', value: 39389 },
        { target: 'Mainland North America', source: 'Gold Coast', value: 26918 },
        { target: 'Mainland North America', source: 'Others Dep.', value: 12532 },
        { target: 'Mainland North America', source: 'Senegambia and offshore Atlantic', value: 49118 },
        { target: 'Mainland North America', source: 'Sierra Leone e Windward Coast', value: 40366 },
        { target: 'Mainland North America', source: 'Southeast Africa and Indian Ocean islands', value: 3958 },
        { target: 'Mainland North America', source: 'West Central Africa and St. Helena', value: 62966 },
        { target: 'Others Arr', source: 'Bight of Benin', value: 40607 },
        { target: 'Others Arr', source: 'Bight of Biafra and Gulf of Guinea islands', value: 34687 },
        { target: 'Others Arr', source: 'Gold Coast', value: 2108 },
        { target: 'Others Arr', source: 'Others Dep.', value: 1499 },
        { target: 'Others Arr', source: 'Senegambia and offshore Atlantic', value: 8435 },
        { target: 'Others Arr', source: 'Sierra Leone e Windward Coast', value: 12793 },
        { target: 'Others Arr', source: 'Southeast Africa and Indian Ocean islands', value: 9924 },
        { target: 'Others Arr', source: 'West Central Africa and St. Helena', value: 50046 },
        { target: 'Spanish American Mainland', source: 'Bight of Benin', value: 15822 },
        { target: 'Spanish American Mainland', source: 'Bight of Biafra and Gulf of Guinea islands', value: 13700 },
        { target: 'Spanish American Mainland', source: 'Gold Coast', value: 5030 },
        { target: 'Spanish American Mainland', source: 'Others Dep.', value: 5155 },
        { target: 'Spanish American Mainland', source: 'Senegambia and offshore Atlantic', value: 44889 },
        { target: 'Spanish American Mainland', source: 'Sierra Leone e Windward Coast', value: 326 },
        { target: 'Spanish American Mainland', source: 'Southeast Africa and Indian Ocean islands', value: 14327 },
        { target: 'Spanish American Mainland', source: 'West Central Africa and St. Helena', value: 131837 }
      ],
      units: 'Escravos'
    }
  ];

  const spec3 = {
    type: 'sankey',
    data: [
      {
        name: 'data',
        values: data1
      }
    ],
    categoryField: 'name',
    valueField: 'value',
    sourceField: 'source',
    targetField: 'target',
    colorField: 'type',
    nodeKey: datum => datum.name,

    label: {
      visible: true,
      style: {
        fontSize: 12,
        fill: '#000000',
        limit: 10000
      }
    },

    node: {
      state: {
        hover: {
          fill: 'red'
        },
        blur: {
          fill: '#e8e8e8',
          fillOpacity: 0.15
        }
      }
    },

    link: {
      style: {
        fillOpacity: 0.1
      },
      state: {
        hover: {
          fillOpacity: 0.4
        },
        blur: {
          fill: '#e8e8e8'
        }
      }
    },
    emphasis: {
      enable: true,
      trigger: 'selected',
      effect: 'adjacency'
    },
    title: {
      text: 'From Where in Africa Were the Slaves Who Landed in Va.?',
      subtext: 'Source: https://observablehq.com/@luiztheodoro/sankey-d3',
      subtextStyle: {
        fontSize: 12
      }
    }
  };

  const spec4 = {
    type: 'sankey',
    data: [
      {
        name: 'sankeyChart',
        values: [
          {
            id: 'nodes',
            values: [
              { nodeName: "Agricultural 'waste'" },
              { nodeName: 'Bio-conversion' },
              { nodeName: 'Liquid' },
              { nodeName: 'Losses' },
              { nodeName: 'Solid' },
              { nodeName: 'Gas' },
              { nodeName: 'Biofuel imports' },
              { nodeName: 'Biomass imports' },
              { nodeName: 'Coal imports' },
              { nodeName: 'Coal' },
              { nodeName: 'Coal reserves' },
              { nodeName: 'District heating' },
              { nodeName: 'Industry' },
              { nodeName: 'Heating and cooling - commercial' },
              { nodeName: 'Heating and cooling - homes' },
              { nodeName: 'Electricity grid' },
              { nodeName: 'Over generation / exports' },
              { nodeName: 'H2 conversion' },
              { nodeName: 'Road transport' },
              { nodeName: 'Agriculture' },
              { nodeName: 'Rail transport' },
              { nodeName: 'Lighting & appliances - commercial' },
              { nodeName: 'Lighting & appliances - homes' },
              { nodeName: 'Gas imports' },
              { nodeName: 'Ngas' },
              { nodeName: 'Gas reserves' },
              { nodeName: 'Thermal generation' },
              { nodeName: 'Geothermal' },
              { nodeName: 'H2' },
              { nodeName: 'Hydro' },
              { nodeName: 'International shipping' },
              { nodeName: 'Domestic aviation' },
              { nodeName: 'International aviation' },
              { nodeName: 'National navigation' },
              { nodeName: 'Marine algae' },
              { nodeName: 'Nuclear' },
              { nodeName: 'Oil imports' },
              { nodeName: 'Oil' },
              { nodeName: 'Oil reserves' },
              { nodeName: 'Other waste' },
              { nodeName: 'Pumped heat' },
              { nodeName: 'Solar PV' },
              { nodeName: 'Solar Thermal' },
              { nodeName: 'Solar' },
              { nodeName: 'Tidal' },
              { nodeName: 'UK land based bioenergy' },
              { nodeName: 'Wave' },
              { nodeName: 'Wind' }
            ]
          },
          {
            id: 'links',
            values: [
              { source: 0, target: 1, value: 124.729 },
              { source: 1, target: 2, value: 0.597 },
              { source: 1, target: 3, value: 26.862 },
              { source: 1, target: 4, value: 280.322 },
              { source: 1, target: 5, value: 81.144 },
              { source: 6, target: 2, value: 35 },
              { source: 7, target: 4, value: 35 },
              { source: 8, target: 9, value: 11.606 },
              { source: 10, target: 9, value: 63.965 },
              { source: 9, target: 4, value: 75.571 },
              { source: 11, target: 12, value: 10.639 },
              { source: 11, target: 13, value: 22.505 },
              { source: 11, target: 14, value: 46.184 },
              { source: 15, target: 16, value: 104.453 },
              { source: 15, target: 14, value: 113.726 },
              { source: 15, target: 17, value: 27.14 },
              { source: 15, target: 12, value: 342.165 },
              { source: 15, target: 18, value: 37.797 },
              { source: 15, target: 19, value: 4.412 },
              { source: 15, target: 13, value: 40.858 },
              { source: 15, target: 3, value: 56.691 },
              { source: 15, target: 20, value: 7.863 },
              { source: 15, target: 21, value: 90.008 },
              { source: 15, target: 22, value: 93.494 },
              { source: 23, target: 24, value: 40.719 },
              { source: 25, target: 24, value: 82.233 },
              { source: 5, target: 13, value: 0.129 },
              { source: 5, target: 3, value: 1.401 },
              { source: 5, target: 26, value: 151.891 },
              { source: 5, target: 19, value: 2.096 },
              { source: 5, target: 12, value: 48.58 },
              { source: 27, target: 15, value: 7.013 },
              { source: 17, target: 28, value: 20.897 },
              { source: 17, target: 3, value: 6.242 },
              { source: 28, target: 18, value: 20.897 },
              { source: 29, target: 15, value: 6.995 },
              { source: 2, target: 12, value: 121.066 },
              { source: 2, target: 30, value: 128.69 },
              { source: 2, target: 18, value: 135.835 },
              { source: 2, target: 31, value: 14.458 },
              { source: 2, target: 32, value: 206.267 },
              { source: 2, target: 19, value: 3.64 },
              { source: 2, target: 33, value: 33.218 },
              { source: 2, target: 20, value: 4.413 },
              { source: 34, target: 1, value: 4.375 },
              { source: 24, target: 5, value: 122.952 },
              { source: 35, target: 26, value: 839.978 },
              { source: 36, target: 37, value: 504.287 },
              { source: 38, target: 37, value: 107.703 },
              { source: 37, target: 2, value: 611.99 },
              { source: 39, target: 4, value: 56.587 },
              { source: 39, target: 1, value: 77.81 },
              { source: 40, target: 14, value: 193.026 },
              { source: 40, target: 13, value: 70.672 },
              { source: 41, target: 15, value: 59.901 },
              { source: 42, target: 14, value: 19.263 },
              { source: 43, target: 42, value: 19.263 },
              { source: 43, target: 41, value: 59.901 },
              { source: 4, target: 19, value: 0.882 },
              { source: 4, target: 26, value: 400.12 },
              { source: 4, target: 12, value: 46.477 },
              { source: 26, target: 15, value: 525.531 },
              { source: 26, target: 3, value: 787.129 },
              { source: 26, target: 11, value: 79.329 },
              { source: 44, target: 15, value: 9.452 },
              { source: 45, target: 1, value: 182.01 },
              { source: 46, target: 15, value: 19.013 },
              { source: 47, target: 15, value: 289.366 }
            ]
          }
        ]
      }
    ],

    categoryField: 'nodeName',
    valueField: 'value',
    sourceField: 'source',
    targetField: 'target',

    nodeAlign: 'justify',
    nodeGap: 8,
    nodeWidth: 10,
    minNodeHeight: 4,

    title: {
      text: 'How energy is converted or transmitted before being consumed or lost',
      subtext: 'Data: Department of Energy & Climate Change via Tom Counsell',
      subtextStyle: {
        fontSize: 12
      }
    },

    label: {
      visible: true,
      style: {
        fontSize: 10
      }
    },

    node: {
      state: {
        hover: {
          stroke: '#333333'
        },
        selected: {
          fill: '#dddddd',
          stroke: '#333333',
          lineWidth: 1,
          brighter: 1,
          fillOpacity: 1
        }
      }
    },

    link: {
      state: {
        hover: {
          fillOpacity: 1
        },
        selected: {
          fill: '#dddddd',
          stroke: '#333333',
          lineWidth: 1,
          brighter: 1,
          fillOpacity: 1
        }
      }
    }
  };

  const vChart = new VChart(spec4, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  vChart.renderAsync();
  window['vchart'] = vChart;
  // 监听点击事件
  // vChart.on('click', { level: 'mark' }, ctx => {
  //   console.log('mark', ctx);
  //   vChart.updateState({
  //     // 名称与上方配置要对应
  //     custom_unSelected: {
  //       filter: datum => {
  //         // 数据 type 不相等的进入这个状态
  //         console.log('datum', datum);
  //         return datum.source !== ctx.datum.key && datum.target !== ctx.datum.key;
  //       }
  //     }
  //   });
  // });

  // setTimeout(() => {
  //   console.log(111, data[2]);
  //   vChart.updateData('data', data[2]);
  // }, 2000);

  // vChart.on('click', ctx => {
  //   console.log('click-ctx', ctx);
  //   vChart.updateData('data', [
  //     {
  //       name: 'data',
  //       values: [
  //         {
  //           nodes: [
  //             {
  //               // value: 80,
  //               name: 'B',
  //               children: [
  //                 {
  //                   name: 'top',
  //                   // value: 40,
  //                   children: [
  //                     { name: '00', value: 100 },
  //                     { name: '01', value: 40 }
  //                   ]
  //                 },
  //                 {
  //                   name: 'middle',
  //                   value: 10
  //                 },
  //                 {
  //                   name: 'bottom',
  //                   value: 30
  //                 }
  //               ]
  //             },
  //             {
  //               value: 50,
  //               name: 'C',
  //               children: [
  //                 {
  //                   name: 'top',
  //                   value: 20
  //                 },
  //                 {
  //                   name: 'middle',
  //                   value: 20
  //                 },
  //                 {
  //                   name: 'bottom',
  //                   value: 10
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]);
  // });
};
run();
