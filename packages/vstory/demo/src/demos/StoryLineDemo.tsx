import VChart, { ISpec, IVChart } from '@visactor/vchart';
import React, { useEffect } from 'react';
import { StoryExecutor } from '../../../src/dsl/story-executor';
import { StoryLine } from '../../../src/dsl/story-chart/line';

export const StoryLineDemo = () => {
  const id = 'line';

  useEffect(() => {
    // 准备一个图表
    const dataId = 'data';
    // 数据
    const data = [
      { key: 'a', value: 80, name: '1', type: 'A' },
      { key: 'b', value: 120, name: '2', type: 'A' },
      { key: 'b', value: 180, name: '3', type: 'A' },
      { key: 'a', value: 180, name: '1', type: 'B' },
      { key: 'b', value: 1120, name: '2', type: 'B' },
      { key: 'b', value: 1180, name: '3', type: 'B' }
    ];

    const spec: ISpec = {
      type: 'line',
      data: {
        id: dataId,
        values: data
      },
      seriesField: 'type',
      xField: 'name',
      yField: 'value'
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const line = new StoryLine();
    line.setInstance(chartInstance as IVChart);

    line.lineStyle(data[1], {
      stroke: 'red'
    });

    line.symbolStyle(data[0], {
      size: 50,
      fill: 'red'
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
