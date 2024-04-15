import React, { useEffect } from 'react';
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryBar } from '../../../src/dsl/story-chart';
import { StoryPlayer } from '../../../src/dsl/story-player';

export const StoryBarDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const spec: IChartSpec = {
      type: 'bar',
      data: [
        {
          id: 'data',
          values: [{ value: 80, name: 'A' }]
        }
      ],
      xField: 'name',
      yField: 'value',
      bar: {
        state: {
          updateStyle: {}
        }
      }
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const bar = new StoryBar();

    // 数据
    const data = [
      { key: 'a', value: 80, name: 'B' },
      { key: 'b', value: 120, name: 'C' },
      { key: 'c', value: 100, name: 'D' },
      { key: 'd', value: 300, name: 'E' }
    ];

    data.forEach(val => {
      bar.add(val, {
        style: {
          fillOpacity: 0.5
        }
      });
    });

    data.reverse().forEach(val => {
      bar.updateStyle(val, {
        style: {
          fill: 'red'
        }
      });
    });

    const storyPlayer = new StoryPlayer(bar, {
      chartInstance,
      spec
    });

    storyPlayer.play();
  }, []);

  return <div id={id}></div>;
};
