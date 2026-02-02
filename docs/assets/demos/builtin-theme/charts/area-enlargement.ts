import { IChartInfo } from './interface';

const spec = {
  type: 'line',
  data: [
    {
      id: 'line',
      values: [
        { x: '1', y: 1 },
        { x: '2', y: 5 },
        { x: '3', y: 7 },
        { x: '4', y: 8 },
        { x: '5', y: 8.5 },
        { x: '6', y: 9 },
        { x: '7', y: 9.5 },
        { x: '8', y: 10 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  axes: [
    {
      orient: 'left',
      type: 'linear',
      customDistribution: [
        { domain: [0, 7], ratio: 0.2 },
        { domain: [7, 9], ratio: 0.6 },
        { domain: [9, 10], ratio: 0.2 }
      ]
    }
  ]
};

const areaEnlargement: IChartInfo = {
  name: 'Area Enlargement',
  spec
};

export default areaEnlargement;
