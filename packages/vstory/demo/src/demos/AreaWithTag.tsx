import React, { useEffect } from 'react';
import VChart, { IAreaChartSpec } from '@visactor/vchart';
import { StoryArea } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

const values = [
  { type: 'Nail polish', country: 'Africa', value: 4229 },
  { type: 'Nail polish', country: 'EU', value: 4376 },
  { type: 'Nail polish', country: 'China', value: 3054 },
  { type: 'Nail polish', country: 'USA', value: 12814 },
  { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
  { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
  { type: 'Eyebrow pencil', country: 'China', value: 5067 },
  { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
  { type: 'Rouge', country: 'Africa', value: 5221 },
  { type: 'Rouge', country: 'EU', value: 3574 },
  { type: 'Rouge', country: 'China', value: 7004 },
  { type: 'Rouge', country: 'USA', value: 11624 },
  { type: 'Lipstick', country: 'Africa', value: 9256 },
  { type: 'Lipstick', country: 'EU', value: 4376 },
  { type: 'Lipstick', country: 'China', value: 9054 },
  { type: 'Lipstick', country: 'USA', value: 8814 },
  { type: 'Eyeshadows', country: 'Africa', value: 3308 },
  { type: 'Eyeshadows', country: 'EU', value: 4572 },
  { type: 'Eyeshadows', country: 'China', value: 12043 },
  { type: 'Eyeshadows', country: 'USA', value: 12998 },
  { type: 'Eyeliner', country: 'Africa', value: 5432 },
  { type: 'Eyeliner', country: 'EU', value: 3417 },
  { type: 'Eyeliner', country: 'China', value: 15067 },
  { type: 'Eyeliner', country: 'USA', value: 12321 },
  { type: 'Foundation', country: 'Africa', value: 13701 },
  { type: 'Foundation', country: 'EU', value: 5231 },
  { type: 'Foundation', country: 'China', value: 10119 },
  { type: 'Foundation', country: 'USA', value: 10342 },
  { type: 'Lip gloss', country: 'Africa', value: 4008 },
  { type: 'Lip gloss', country: 'EU', value: 4572 },
  { type: 'Lip gloss', country: 'China', value: 12043 },
  { type: 'Lip gloss', country: 'USA', value: 22998 },
  { type: 'Mascara', country: 'Africa', value: 18712 },
  { type: 'Mascara', country: 'EU', value: 6134 },
  { type: 'Mascara', country: 'China', value: 10419 },
  { type: 'Mascara', country: 'USA', value: 11261 }
];

export const AreaWithTag = () => {
  const id = 'areaWithTag';

  useEffect(() => {
    // 准备一个图表
    const spec: IAreaChartSpec = {
      type: 'area',
      theme: 'dark',
      data: [
        {
          id: 'data',
          values: []
        }
      ],
      height: 500,
      padding: { left: 50, right: 50 },
      title: {
        visible: true,
        text: '100% stacked area chart of cosmetic products sales'
      },
      percent: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      axes: [
        {
          orient: 'left',
          visible: false
        },
        {
          orient: 'bottom',
          trimPadding: true
        }
      ]
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const area = new StoryArea();

    const markPoint = area.createMarkPoint(
      {
        type: 'Nail polish',
        value: 0.05
      },
      {
        itemContent: {
          offsetY: -10,
          offsetX: -30,
          type: 'text',
          autoRotate: false,
          text: {
            text: '5%',
            dx: -10,
            style: {
              fill: 'black',
              fontSize: 14,
              fontWeight: 'bold'
            },
            labelBackground: {
              padding: [5, 10, 5, 10],
              style: {
                fill: 'rgb(122,209,182)',
                cornerRadius: 20
              }
            }
          }
        },
        itemLine: {
          endSymbol: {
            visible: false
          },
          startSymbol: { visible: false },
          line: {
            style: {
              visible: false
            }
          }
        }
      }
    );

    // 数据
    const usaData = values.filter(v => v.country === 'USA');
    const chinaData = values.filter(v => v.country === 'China');
    const EUData = values.filter(v => v.country === 'EU');
    const africaData = values.filter(v => v.country === 'Africa');

    area.add({ id: 'data', values: usaData });
    area.add({ id: 'data', values: EUData });

    markPoint.flicker();

    area.add({ id: 'data', values: chinaData });
    area.add({ id: 'data', values: africaData });

    // TODO: executor 接口需要调整
    const storyPlayer = new StoryExecutor(area, {
      chartInstance,
      spec
    });

    storyPlayer.play();

    return () => {
      chartInstance.release();
    };
  }, []);

  return <div id={id}></div>;
};
