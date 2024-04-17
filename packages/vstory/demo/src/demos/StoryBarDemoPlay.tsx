import React, { useEffect } from 'react';
import VChart, { IChartSpec } from '@visactor/vchart';
import { ManualTicker } from '@visactor/vrender-core';
import { StoryBar } from '../../../src/dsl/story-chart';
import { StoryExecutor } from '../../../src/dsl/story-executor';

// class Player {
//   canvas: HTMLCanvasElement;
//   dpr: number;
//   width: number;
//   height: number;
//   constructor(canvas: HTMLCanvasElement, width: number, height: number) {
//     this.canvas = canvas;
//     this.dpr = window.devicePixelRatio;
//     this.width = width;
//     this.height = height;
//     this.canvas.width = width * this.dpr;
//     this.canvas.height = height * this.dpr;
//   }
//   addElements() {

//   }
//   tickTo() {

//   }
//   play() {

//   }
// }

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
      },
      animationUpdate: {
        duration: 500
      }
    };

    const chartInstance = new VChart(spec, {
      dom: id
    });

    // chartInstance.renderSync();

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

    const storyPlayer = new StoryExecutor(bar, {
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
