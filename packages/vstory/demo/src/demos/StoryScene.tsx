import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';

export const StorySceneDemo = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const tempSpec: IStorySpec = {
      elements: [
        {
          type: 'graphics',
          id: 'test-graphics-0',
          zIndex: 0,
          widget: {
            top: 40,
            left: 50,
            width: 200,
            height: 100
          },
          config: {
            type: 'rect',
            graphic: {
              fill: 'red'
            },
            text: {
              text: 'haha',
              fill: 'black'
            },
            angle: 0,
            shapePoints: []
          }
        },
        {
          type: 'graphics',
          id: 'test-graphics-1',
          zIndex: 0,
          widget: {
            top: 40,
            left: 250,
            width: 200,
            height: 100
          },
          config: {
            type: 'rect',
            graphic: {
              fill: 'red',
              visible: false
            },
            text: {
              text: 'title2',
              fill: 'black'
            },
            angle: 0,
            shapePoints: []
          }
        },
        {
          type: 'chart',
          id: 'test-chart-0',
          zIndex: 0,
          widget: {
            top: 200,
            left: 100,
            width: 300,
            height: 300
          },
          config: {
            temp: 'line'
          }
        },
        {
          type: 'chart',
          id: 'test-chart-1',
          zIndex: 0,
          widget: {
            top: 500,
            left: 100,
            width: 300,
            height: 300
          },
          config: {
            temp: 'bar'
          }
        }
      ],
      chapter: []
    };
    new Story(tempSpec, { dom: id });
  }, []);

  return <div style={{ width: '100%', height: '100%' }} id={id}></div>;
};
