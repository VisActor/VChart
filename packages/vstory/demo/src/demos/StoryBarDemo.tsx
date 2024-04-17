import React, { useEffect } from 'react';
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryBar } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

export const StoryBarDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const spec: IChartSpec = {
      type: 'bar',
      data: [
        {
          id: 'data',
          values: []
        }
      ],
      xField: 'name',
      yField: 'value',
      bar: {
        state: {
          updateStyle: {}
        }
      },
      animationUpdate: {
        duration: 500
      },
      animationAppear: {
        duration: 500
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
      bar.add(val, {});
    });

    data.forEach(val => {
      bar.updateStyle(val, {
        style: {
          fillOpacity: 0.5
        }
      });
    });

    data.forEach(val => {
      bar.updateStyle(val, {
        style: {
          fillOpacity: 1,
          fill: 'red'
        }
      });
    });

    data.forEach(val => {
      bar.updateStyle(val, {
        style: {
          fillOpacity: 0.1,
          fill: 'blue'
        }
      });
    });

    bar.updateStyle(data[3], {
      style: {
        dy: -100
      }
    });

    const storyPlayer = new StoryExecutor(bar, {
      chartInstance,
      spec
    });

    console.log(bar.exportSnapshot());
    storyPlayer.play();

    return () => {
      chartInstance.release();
    };
  }, []);

  return <div id={id}></div>;
};
