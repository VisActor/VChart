import { mockData } from './data-mock';

export const getSpec = (xCount, typeCount) => {
  return {
    type: 'area',
    point: {
      visible: false
    },
    data: [
      {
        name: 'area',
        values: mockData({
          x: {
            count: xCount
          },
          y: {
            linear: true
          },
          type: {
            count: typeCount
          }
        })
      }
    ],
    xField: 'x',
    yField: 'y',
    seriesField: 'type'
  };
};
