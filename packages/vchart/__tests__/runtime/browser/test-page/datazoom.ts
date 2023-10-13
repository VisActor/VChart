import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';

const run = () => {
  const data = [
    [
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 4.3,
        y: 4.3,
        type: 'I. setosa'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 5.3,
        y: 5.3,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 7,
        y: 7,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 6.9,
        y: 6.9,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 6.5,
        y: 6.5,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 5.2,
        y: 5.2,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 6.8,
        y: 6.8,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 7.1,
        y: 7.1,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 7.6,
        y: 7.6,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 7.3,
        y: 7.3,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 7.4,
        y: 7.4,
        type: 'I. virginica'
      },
      {
        x: 7.9,
        y: 7.9,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 5.9,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 5.1,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 2.9,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 4.3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 5.8,
        y: 4,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 4.1,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 4.2,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 4.5,
        y: 2.3,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 5.3,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 7,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 6.9,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 6.5,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 5.2,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 2,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 6.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 5.4,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 3.4,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 7.1,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 7.6,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 7.3,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 3.6,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 7.4,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 7.9,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 3,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 5.1,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.3,
        y: 1.1,
        type: 'I. setosa'
      },
      {
        x: 5.8,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 1,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 4.5,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 5.3,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 6.9,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 6.5,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 5.2,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 3.6,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 6.8,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 3.8,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 3.7,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 5.4,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 7.1,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 7.6,
        y: 6.6,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 4.5,
        type: 'I. virginica'
      },
      {
        x: 7.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 7.4,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 7.9,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 5.1,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 5.1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 4.3,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 5.8,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 5.7,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.5,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 5.2,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.9,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 4.5,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.6,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 4.8,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 5.1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5.3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 7,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 6.9,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 5.2,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 5.9,
        y: 1.8,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 6.4,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.6,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 6.8,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 1.7,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 5.4,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 6.7,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 5.5,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 6.1,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 5.8,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 5.6,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.2,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 5.7,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6.3,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 7.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 7.6,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 1.7,
        type: 'I. virginica'
      },
      {
        x: 7.3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 7.2,
        y: 1.6,
        type: 'I. virginica'
      },
      {
        x: 7.4,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 7.9,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 1.4,
        type: 'I. virginica'
      },
      {
        x: 7.7,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 6.8,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 6.5,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 6.2,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 1.8,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 3.5,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 2.9,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 4.3,
        type: 'I. setosa'
      },
      {
        x: 4,
        y: 5.8,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 4.1,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 4.2,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 2.3,
        y: 4.5,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 5.3,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 7,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 6.9,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 6.5,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 5.2,
        type: 'I. versicolor'
      },
      {
        x: 2,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 6.8,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5.4,
        type: 'I. versicolor'
      },
      {
        x: 3.4,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 7.1,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 7.6,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 7.3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 3.6,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 7.4,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 7.9,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.9,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 3.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 4,
        y: 4,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 4.1,
        y: 4.1,
        type: 'I. setosa'
      },
      {
        x: 4.2,
        y: 4.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 2,
        y: 2,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 3.6,
        y: 3.6,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 3,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 3.5,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 2.9,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 1.1,
        type: 'I. setosa'
      },
      {
        x: 4,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 1,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 4.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 4.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 2.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 2,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 3.6,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 3.8,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 3.7,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 3.4,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.6,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 4.5,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 3.6,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 5.1,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 3.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 2.9,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 3.9,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 0.5,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 4.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 4.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.6,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 2.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.5,
        y: 0.6,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 3.8,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.7,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 3.2,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 2,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 2.2,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 3.2,
        y: 1.8,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.7,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 2.4,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 3.4,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 3.1,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 2.6,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 2.3,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 2.7,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.9,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 2.8,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 1.7,
        type: 'I. virginica'
      },
      {
        x: 2.9,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3.6,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 1.6,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 3.8,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 2.8,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 2.6,
        y: 1.4,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 3.1,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2.7,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 3.2,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 3.3,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 3.4,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 3,
        y: 1.8,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 1.4,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 1.1,
        y: 4.3,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 5.8,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 4.5,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 5.3,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 6.9,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 6.5,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 5.2,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 3.6,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 6.8,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 3.8,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 3.7,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 5.4,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 7.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 6.6,
        y: 7.6,
        type: 'I. virginica'
      },
      {
        x: 4.5,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 7.3,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 7.4,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 7.9,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.9,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 1.4,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 2.9,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 1.1,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 1,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 4.1,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 2.3,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 2,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 3.6,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 3.8,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 3.7,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 3.4,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.6,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 4.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 3.6,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 3,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.1,
        y: 1.1,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1,
        y: 1,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 3.6,
        y: 3.6,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 3.8,
        y: 3.8,
        type: 'I. versicolor'
      },
      {
        x: 3.7,
        y: 3.7,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 6.6,
        y: 6.6,
        type: 'I. virginica'
      },
      {
        x: 4.5,
        y: 4.5,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 5.1,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 1.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.7,
        y: 0.5,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.3,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.6,
        type: 'I. setosa'
      },
      {
        x: 1.9,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 1.6,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.5,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 4.7,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 3.6,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 1.8,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.9,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 4.8,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 5,
        y: 1.7,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 3.5,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 3.8,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 3.7,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 3.9,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 5.1,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4.5,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 4.7,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.4,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 4.6,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 4,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 3.3,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 4.2,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 4.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 3,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 4.1,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 6,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 6.6,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 4.5,
        y: 1.7,
        type: 'I. virginica'
      },
      {
        x: 6.3,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 5.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 6.9,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 6.7,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 6,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 4.9,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 5.8,
        y: 1.6,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 6.4,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 1.4,
        type: 'I. virginica'
      },
      {
        x: 6.1,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 5.5,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 4.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 5.6,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 5.9,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.7,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 5.2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 5.4,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 5.1,
        y: 1.8,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 0.2,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 4.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.8,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 5.7,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 0.5,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.7,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 5.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.5,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 4.9,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 4.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 0.6,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 4.8,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 5,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6.9,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6.5,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 5.2,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 1.8,
        y: 5.9,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 6.4,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 6.6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 6.8,
        type: 'I. versicolor'
      },
      {
        x: 1.7,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 5.4,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 6,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 6.7,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 6.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 5.5,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 6.1,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 5.8,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.6,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 6.2,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 5.7,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 7.1,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 7.6,
        type: 'I. virginica'
      },
      {
        x: 1.7,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 7.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 1.6,
        y: 7.2,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 7.4,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 7.9,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 1.4,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 7.7,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.8,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 6.5,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.2,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 5.9,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 0.2,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 2.9,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 4.4,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 3.9,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 0.5,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 4.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 4.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 3.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 2.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 0.6,
        y: 3.5,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.8,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.7,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 3.3,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 2.2,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 1.8,
        y: 3.2,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 1.7,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2.4,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 3.4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 3.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 2.6,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 2.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.7,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.9,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 2.5,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 2.8,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 1.7,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 2.9,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 3.6,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 1.6,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 3.8,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 2.8,
        type: 'I. virginica'
      },
      {
        x: 1.4,
        y: 2.6,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3.1,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 2.7,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3.2,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 3.3,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 3,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 3.4,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 3,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 1.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1,
        type: 'I. setosa'
      },
      {
        x: 0.5,
        y: 1.7,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.3,
        type: 'I. setosa'
      },
      {
        x: 0.6,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 1.9,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.6,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 1.4,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 3.6,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 1.8,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.9,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 4.8,
        type: 'I. versicolor'
      },
      {
        x: 1.7,
        y: 5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 3.5,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 3.8,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 3.7,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 3.9,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 5.1,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 4.5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 4.7,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 4.4,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 4.6,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 4,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 3.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.2,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.3,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 4.1,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 6.6,
        type: 'I. virginica'
      },
      {
        x: 1.7,
        y: 4.5,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 5.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.9,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 6.7,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 6,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 4.9,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 1.6,
        y: 5.8,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 6.4,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 1.4,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 6.1,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 5.5,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 4.8,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 5.6,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 5.1,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 5.9,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 5.7,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 5,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 5.2,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 5.4,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 5.1,
        type: 'I. virginica'
      }
    ],
    [
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.5,
        y: 0.5,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.1,
        y: 0.1,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.6,
        y: 0.6,
        type: 'I. setosa'
      },
      {
        x: 0.4,
        y: 0.4,
        type: 'I. setosa'
      },
      {
        x: 0.3,
        y: 0.3,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 0.2,
        y: 0.2,
        type: 'I. setosa'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1.7,
        y: 1.7,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. versicolor'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 1,
        y: 1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.2,
        y: 1.2,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 1.1,
        y: 1.1,
        type: 'I. versicolor'
      },
      {
        x: 1.3,
        y: 1.3,
        type: 'I. versicolor'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 1.7,
        y: 1.7,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 1.6,
        y: 1.6,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.2,
        y: 2.2,
        type: 'I. virginica'
      },
      {
        x: 1.5,
        y: 1.5,
        type: 'I. virginica'
      },
      {
        x: 1.4,
        y: 1.4,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      },
      {
        x: 2.1,
        y: 2.1,
        type: 'I. virginica'
      },
      {
        x: 2.4,
        y: 2.4,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 2.5,
        y: 2.5,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 1.9,
        y: 1.9,
        type: 'I. virginica'
      },
      {
        x: 2,
        y: 2,
        type: 'I. virginica'
      },
      {
        x: 2.3,
        y: 2.3,
        type: 'I. virginica'
      },
      {
        x: 1.8,
        y: 1.8,
        type: 'I. virginica'
      }
    ]
  ];

  const row = 4;
  const col = 4;
  const region = [];
  const layoutElements = [];
  const series = [];
  const axes = [];
  const rowHeight = [];
  for (let k = 0; k < row * col; k++) {
    region.push({
      id: `${k}_Region`
    });

    const seriesRow = Math.floor(k / col) + Math.floor(k / col);
    const seriesCol = k - Math.floor(k / col) * col;

    // 系列行
    layoutElements.push({
      row: seriesRow,
      col: seriesCol + seriesCol + 1,
      modelId: `${k}_Region`
    });

    series.push({
      type: 'scatter',
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      data: { id: `${k}_Data`, values: data[k] },
      // point: { style: { visible: false } },
      // line: { style: { lineWidth: 2 } },
      regionId: `${k}_Region`,
      id: `${k}_Region`,
      size: 5
    });

    axes.push({
      id: `${k}_Left`,
      orient: 'left',
      regionId: `${k}_Region`,
      seriesId: [`${k}_Region`],
      zero: false
      // range: {
      //   min: 0,
      //   max: 100
      // },
      // tick: {
      //   tickStep: 10
      // }
    });

    layoutElements.push({
      row: seriesRow,
      col: seriesCol + seriesCol,
      modelId: `${k}_Left`
    });

    axes.push({
      id: `${k}_Bottom`,
      orient: 'bottom',
      regionId: `${k}_Region`,
      seriesId: [`${k}_Region`],
      type: 'linear',
      zero: false
      // range: {
      //   min: 0,
      //   max: 20
      // },
      // tick: {
      //   tickStep: 5
      // }
    });

    layoutElements.push({
      row: seriesRow + 1,
      col: seriesCol + seriesCol + 1,
      modelId: `${k}_Bottom`
    });

    if (seriesCol === 0) {
      rowHeight.push({
        index: seriesRow + 1,
        size: 30
      });
    }
  }

  const spec = {
    type: 'bar',
    xField: ['230922161103013', '20001'],
    yField: ['10002'],
    direction: 'vertical',
    sortDataByAxis: true,
    seriesField: '20001',
    padding: 0,
    labelLayout: 'region',
    data: [
      {
        id: 'data',
        values: [
          {
            '10001': '行 ID',
            '10002': '4933854',
            '10003': '230922161103019',
            '20001': '办公-行 ID',
            '230922161103013': '小型企业',
            '230922161103019': '4933854',
            '230922174525033': '办公'
          },
          {
            '10001': '销售额',
            '10002': '837464.545838356',
            '10003': '230922161103016',
            '20001': '办公-销售额',
            '230922161103013': '小型企业',
            '230922161103016': '837464.545838356',
            '230922174525033': '办公'
          },
          {
            '10001': '行 ID',
            '10002': '14721235',
            '10003': '230922161103019',
            '20001': '办公-行 ID',
            '230922161103013': '消费者',
            '230922161103019': '14721235',
            '230922174525033': '办公'
          },
          {
            '10001': '销售额',
            '10002': '2543529.3300714493',
            '10003': '230922161103016',
            '20001': '办公-销售额',
            '230922161103013': '消费者',
            '230922161103016': '2543529.3300714493',
            '230922174525033': '办公'
          },
          {
            '10001': '行 ID',
            '10002': '4905157',
            '10003': '230922161103019',
            '20001': '技术-行 ID',
            '230922161103013': '消费者',
            '230922161103019': '4905157',
            '230922174525033': '技术'
          },
          {
            '10001': '销售额',
            '10002': '2692828.4352111816',
            '10003': '230922161103016',
            '20001': '技术-销售额',
            '230922161103013': '消费者',
            '230922161103016': '2692828.4352111816',
            '230922174525033': '技术'
          },
          {
            '10001': '行 ID',
            '10002': '8795638',
            '10003': '230922161103019',
            '20001': '办公-行 ID',
            '230922161103013': '公司',
            '230922161103019': '8795638',
            '230922174525033': '办公'
          },
          {
            '10001': '销售额',
            '10002': '1484595.9238786697',
            '10003': '230922161103016',
            '20001': '办公-销售额',
            '230922161103013': '公司',
            '230922161103016': '1484595.9238786697',
            '230922174525033': '办公'
          },
          {
            '10001': '行 ID',
            '10002': '5989411',
            '10003': '230922161103019',
            '20001': '家具-行 ID',
            '230922161103013': '消费者',
            '230922161103019': '5989411',
            '230922174525033': '家具'
          },
          {
            '10001': '销售额',
            '10002': '2788714.4288902283',
            '10003': '230922161103016',
            '20001': '家具-销售额',
            '230922161103013': '消费者',
            '230922161103016': '2788714.4288902283',
            '230922174525033': '家具'
          },
          {
            '10001': '行 ID',
            '10002': '2020565',
            '10003': '230922161103019',
            '20001': '家具-行 ID',
            '230922161103013': '小型企业',
            '230922161103019': '2020565',
            '230922174525033': '家具'
          },
          {
            '10001': '销售额',
            '10002': '1042003.6409912109',
            '10003': '230922161103016',
            '20001': '家具-销售额',
            '230922161103013': '小型企业',
            '230922161103016': '1042003.6409912109',
            '230922174525033': '家具'
          },
          {
            '10001': '行 ID',
            '10002': '3247362',
            '10003': '230922161103019',
            '20001': '技术-行 ID',
            '230922161103013': '公司',
            '230922161103019': '3247362',
            '230922174525033': '技术'
          },
          {
            '10001': '销售额',
            '10002': '1764574.614578247',
            '10003': '230922161103016',
            '20001': '技术-销售额',
            '230922161103013': '公司',
            '230922161103016': '1764574.614578247',
            '230922174525033': '技术'
          },
          {
            '10001': '行 ID',
            '10002': '3384905',
            '10003': '230922161103019',
            '20001': '家具-行 ID',
            '230922161103013': '公司',
            '230922161103019': '3384905',
            '230922174525033': '家具'
          },
          {
            '10001': '销售额',
            '10002': '1903622.758113861',
            '10003': '230922161103016',
            '20001': '家具-销售额',
            '230922161103013': '公司',
            '230922161103016': '1903622.758113861',
            '230922174525033': '家具'
          },
          {
            '10001': '行 ID',
            '10002': '1818217',
            '10003': '230922161103019',
            '20001': '技术-行 ID',
            '230922161103013': '小型企业',
            '230922161103019': '1818217',
            '230922174525033': '技术'
          },
          {
            '10001': '销售额',
            '10002': '1011620.4553604126',
            '10003': '230922161103016',
            '20001': '技术-销售额',
            '230922161103013': '小型企业',
            '230922161103016': '1011620.4553604126',
            '230922174525033': '技术'
          }
        ],
        fields: {
          '10001': {
            alias: '指标名称 '
          },
          '10002': {
            alias: '指标值 '
          },
          '20001': {
            alias: '图例项 ',
            domain: ['办公-行 ID', '技术-行 ID', '家具-行 ID', '办公-销售额', '技术-销售额', '家具-销售额'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          '230922161103013': {
            alias: '细分',
            domain: ['公司', '消费者', '小型企业'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          '230922161103016': {
            alias: '销售额'
          },
          '230922161103019': {
            alias: '行 ID'
          },
          '230922174525033': {
            alias: '类别'
          }
        }
      }
    ],
    stackInverse: true,
    axes: [
      {
        type: 'band',
        tick: {
          visible: false
        },
        grid: {
          visible: false,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: '#989999'
          }
        },
        title: {
          visible: false,
          space: 5,
          text: '细分',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        zIndex: 200,
        label: {
          visible: true,
          space: 4,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          flush: true
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        paddingInner: [0.15, 0.1],
        paddingOuter: [0.075, 0.1]
      },
      {
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'left',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        title: {
          visible: false,
          text: '行 ID',
          space: 8,
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 6,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      }
    ],
    color: {
      field: '20001',
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA'],
      specified: {},
      domain: ['办公-行 ID', '技术-行 ID', '家具-行 ID', '办公-销售额', '技术-销售额', '家具-销售额']
    },
    legends: [
      {
        type: 'discrete',
        id: 'legend-discrete',
        orient: 'right',
        position: 'start',
        layoutType: 'normal',
        visible: true,
        maxCol: 1,
        title: {
          textStyle: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        layoutLevel: 60,
        item: {
          focus: true,
          focusIconStyle: {
            size: 14
          },
          maxWidth: 324,
          spaceRow: 0,
          spaceCol: 0,
          padding: {
            top: 1,
            bottom: 2,
            left: 3,
            right: 2
          },
          background: {
            visible: false,
            style: {
              fillOpacity: 0.001
            }
          },
          label: {
            style: {
              fontSize: 12,
              fill: '#6F6F6F'
            }
          },
          shape: {
            style: {
              lineWidth: 0,
              symbolType: 'square'
            }
          }
        },
        pager: {
          layout: 'horizontal',
          padding: {
            left: -18
          },
          textStyle: {},
          space: 0,
          handler: {
            preShape: 'triangleLeft',
            nextShape: 'triangleRight',
            style: {},
            state: {
              disable: {}
            }
          }
        },
        padding: {
          top: 0,
          bottom: 0,
          left: 16,
          right: 0
        }
      }
    ],
    label: {
      visible: true,
      overlap: {
        hideOnHit: true,
        avoidBaseMark: false,
        strategy: [
          {
            type: 'moveY',
            offset: [
              -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4,
              5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            ]
          },
          {
            type: 'moveX',
            offset: [
              -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4,
              5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            ]
          }
        ],
        clampForce: true
      },
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        zIndex: 400,
        fill: null,
        strokeOpacity: 1
      },
      position: 'inside',
      smartInvert: {
        fillStrategy: 'invertBase',
        strokeStrategy: 'similarBase'
      }
    },
    tooltip: {
      handler: {}
    },
    hover: {
      enable: true
    },
    select: {
      enable: true
    },

    region: [
      {
        clip: true
      }
    ],
    bar: {
      state: {
        hover: {
          cursor: 'pointer',
          fillOpacity: 0.8,
          stroke: '#58595B',
          lineWidth: 1,
          zIndex: 500
        },
        selected: {
          cursor: 'pointer',
          fillOpacity: 1,
          stroke: '#58595B',
          lineWidth: 1
        },
        selected_reverse: {
          fillOpacity: 0.3,
          strokeWidth: 0.3
        }
      }
    },
    background: 'rgba(255, 255, 255, 0)',
    animation: false,
    brush: {
      inBrush: {
        fillOpacity: 1,
        stroke: '#58595B',
        lineWidth: 1,
        colorAlpha: 1
      },
      outOfBrush: {
        colorAlpha: 0.2,
        fillOpacity: 0.3,
        strokeWidth: 0.3
      }
    },
    hash: '9cced9bc1023adbc3768fd4a2044b75d'
  };

  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    onError: null,
    logLevel: 5
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
