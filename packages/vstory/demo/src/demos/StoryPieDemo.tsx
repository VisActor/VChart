import React, { useEffect } from 'react';
import VChart, { IPieChartSpec } from '@visactor/vchart';
import { StoryPie } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

export const StoryPieDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 数据
    const values = new Array(10).fill(0).map((d, i) => ({
      type: i + 1,
      value: i + 1
    }));
    const dataId = 'data';
    const data = {
      id: dataId,
      values: []
    };

    // 准备一个图表
    const spec: IPieChartSpec = {
      type: 'pie',
      data: data,
      outerRadius: 0.1,
      valueField: 'value',
      categoryField: 'type',
      animationUpdate: {
        duration: 300
      },
      label: {
        visible: true
      },
      animationAppear: {
        duration: 300
      }
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    chartInstance.renderSync();

    // 创建叙事
    const pie = new StoryPie();
    pie.setInstance(chartInstance);

    values.forEach((val, index) => {
      pie.add({ id: dataId, values: val }, {});
    });

    values.forEach((val, index) => {
      pie.arcStyle(val, {
        outerRadius: 100 + index * 10
      });
    });

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
