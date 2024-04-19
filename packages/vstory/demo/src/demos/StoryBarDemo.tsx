import React, { useEffect } from 'react';
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryBar } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

export const StoryBarDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const dataId = 'data';
    const data = {
      id: dataId,
      values: []
    };
    const spec: IChartSpec = {
      type: 'common',
      series: [
        {
          type: 'bar',
          data: data,
          yField: 'y',
          xField: 'x'
        }
      ],
      axes: [
        {
          orient: 'left'
        },
        {
          orient: 'bottom'
        }
      ]
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const bar = new StoryBar();
    bar.setInstance(chartInstance);

    // 数据
    const values = new Array(9).fill(0).map((_, i) => {
      return {
        x: i + 1,
        y: i + 1
      };
    });

    values.forEach(val => {
      bar.add({
        id: 'data',
        values: val
      });
    });

    values.forEach(val => {
      bar.barStyle(val, {
        fill: 'red',
        scaleZ: 0.1,
        texture: 'horizontal-line',
        textureColor: '#eee'
      });
    });

    const storyPlayer = new StoryExecutor(bar, {
      chartInstance: bar.getInstance(),
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
