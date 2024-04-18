import VChart, { IChartSpec, IVChart } from '@visactor/vchart';
import React, { useEffect } from 'react';
import { StoryExecutor } from '../../../src/dsl/story-executor';
import { StoryLine } from '../../../src/dsl/story-chart/line';

export const StoryLineDemo = () => {
  const id = 'line';

  useEffect(() => {
    // 准备一个图表
    const dataId = 'data';
    const spec: IChartSpec = {
      type: 'line',
      data: {
        id: 'data',
        values: []
      },
      // seriesField: 'type',
      xField: ['name', 'type'],
      yField: 'value',
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
    const line = new StoryLine();
    line.setInstance(chartInstance as IVChart);

    // 数据
    const data = [
      { key: 'a', value: 80, name: 'n1', type: 'TypeA' },
      { key: 'b', value: 120, name: 'n2', type: 'TypeA' },
      { key: 'b', value: 180, name: 'n3', type: 'TypeA' }
    ];

    line.add({
      id: dataId,
      values: data
    });

    line.symbolStyle(data[0], {
      size: 50,
      fill: 'red'
    });

    line.lineStyle(data[0], {
      stroke: 'red'
    });

    const storyPlayer = new StoryExecutor(line, {
      chartInstance: line.getInstance(),
      spec
    });

    storyPlayer.play();

    return () => {
      chartInstance.release();
    };
  }, []);

  return <div id={id}></div>;
};
