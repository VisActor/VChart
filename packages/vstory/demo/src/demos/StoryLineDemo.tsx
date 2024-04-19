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
    const values = [
      {
        time: '2:00',
        value: 8
      },
      {
        time: '4:00',
        value: 9
      },
      {
        time: '6:00',
        value: 11
      },
      {
        time: '8:00',
        value: 14
      },
      {
        time: '10:00',
        value: 16
      },
      {
        time: '12:00',
        value: 17
      },
      {
        time: '14:00',
        value: 17
      },
      {
        time: '16:00',
        value: 16
      },
      {
        time: '18:00',
        value: 15
      }
    ];
    const data = {
      id: dataId,
      values: values
    };
    const spec = {
      type: 'line',
      data: data,
      xField: 'time',
      yField: 'value'
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const line = new StoryLine();
    line.setInstance(chartInstance as IVChart);

    values.forEach((val, index) => {
      line.symbolStyle(val, {
        size: 15 + 10 * index,
        fill: 'red',
        fillOpacity: Math.random()
      });
    });

    line.lineStyle(values[1], {
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
