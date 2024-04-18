import React, { useEffect } from 'react';
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryBar } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

export const StoryBarDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const spec: IChartSpec = {
      type: 'common',
      series: [
        {
          type: 'bar',
          data: {
            id: 'data',
            values: []
          },
          seriesField: 'type',
          xField: ['name', 'type'],
          yField: 'value'
        }
      ],
      axes: [
        {
          orient: 'left',
          type: 'linear'
        },
        {
          orient: 'bottom',
          type: 'band'
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
    const data = [
      { key: 'a', value: 80, name: 'n1', type: 'TypeA' },
      { key: 'b', value: 120, name: 'n2', type: 'TypeA' },
      { key: 'c', value: 100, name: 'n3', type: 'TypeB' },
      { key: 'd', value: 300, name: 'n4', type: 'TypeB' }
    ];

    bar.add({
      id: 'data',
      data: data[0]
    });

    bar.add({
      id: 'data',
      data: data[1]
    });

    bar.add({
      id: 'data',
      data: data.slice(2)
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
