import { mockData } from './data-mock';

export const getSpec = categoryCount => {
  return {
    type: 'pie',
    point: {
      visible: false
    },
    label: {
      visible: true
    },
    data: [
      {
        name: 'pie',
        values: mockData({
          x: {
            count: categoryCount
          },
          y: {
            linear: true
          }
        })
      }
    ],
    categoryField: 'x',
    valueField: 'y'
  };
};
