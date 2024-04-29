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
    const values = new Array(5).fill(0).map((_, i) => {
      return {
        x: i + 1,
        y: i + 1
      };
    });

    bar.add({
      id: 'data',
      values: values
    });

    bar.appear({
      animation: {
        effect: 'grow',
        duration: 100,
        oneByOne: true
      }
    });

    bar.dance(values[4], {
      duration: 100
    });

    // bar.barStyle(values[0], {
    //   fill: 'red'
    // });
    // bar.barStyle(values[1], {
    //   texture: 'circle',
    //   textureColor: '#ec12ee',
    //   fillOpacity: 0.5
    // });
    // bar.barStyle(values[2], {
    //   fill: 'green',
    //   fillOpacity: 0.5,
    //   stroke: '#eee',
    //   lineWidth: 10
    // });

    // bar.add({
    //   id: dataId,
    //   values: values[3]
    // });

    // bar.add({
    //   id: dataId,
    //   values: values[4]
    // });

    // bar.add({
    //   id: dataId,
    //   values: values[5]
    // });

    // bar.add({
    //   id: dataId,
    //   values: values[1]
    // });
    // bar.add({
    //   id: dataId,
    //   values: values[2]
    // });

    // values.forEach(val => {
    //   bar.barStyle(val, {
    //     fill: 'red',
    //     scaleZ: 0.1,
    //     texture: 'horizontal-line',
    //     textureColor: '#eee'
    //   });
    // });

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
