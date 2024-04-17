import React, { useEffect } from 'react';
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryPie } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

export const StoryPieDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 数据
    const values = new Array(10).fill(0).map((d, i) => ({
      type: i.toString(),
      value: Math.random() * 10
    }));

    // 准备一个图表
    const spec: IChartSpec = {
      type: 'pie',
      data: [
        {
          id: 'data',
          values: []
        }
      ],
      outerRadius: 0.8,
      valueField: 'value',
      categoryField: 'type',
      animationUpdate: {
        duration: 300
      },
      label: {
        visible: true
      }
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const pie = new StoryPie();

    for (let i = 0; i < values.length; i++) {
      pie.add(values[i], {});
    }

    const storyPlayer = new StoryExecutor(pie, {
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
