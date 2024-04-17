import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';

const data0 = {
  type: 'standard',
  value:
    '{"data":[{"State":"WY","Under 5 Years":25635,"5 to 13 Years":1890,"14 to 17 Years":9314},{"State":"DC","Under 5 Years":30352,"5 to 13 Years":20439,"14 to 17 Years":10225},{"State":"VT","Under 5 Years":38253,"5 to 13 Years":42538,"14 to 17 Years":15757},{"State":"ND","Under 5 Years":51896,"5 to 13 Years":67358,"14 to 17 Years":18794},{"State":"AK","Under 5 Years":72083,"5 to 13 Years":85640,"14 to 17 Years":22153}],"columns":["State","Under 5 Years","5 to 13 Years","14 to 17 Years"],"rows":["State","WY","DC","VT","ND","AK"]}'
};

const data1 = {
  type: 'standard',
  value:
    '{"data":[{"date":"x1","a":20,"b":20},{"date":"x2","a":23,"b":24},{"date":"x3","a":26,"b":29}],"columns":["date","a","b"],"rows":["x1","x2","x3"],"originData":[{"date":"x1","a":20,"b":20},{"date":"x2","a":23,"b":24},{"date":"x3","a":26,"b":29}],"invalidCells":[]}'
};

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
            temp: 'rect',
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
            temp: 'rect',
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
            temp: 'line',
            data: data0,
            // @ts-ignore
            attribute: {}
          }
        },
        {
          type: 'chart',
          id: 'test-chart-1',
          zIndex: 0,
          widget: {
            top: 350,
            left: 100,
            width: 300,
            height: 300
          },
          config: {
            temp: 'bar',
            data: data1,
            // @ts-ignore
            attribute: {}
          }
        }
      ],
      chapters: [
        {
          id: 'default-chapter',
          elements: [
            {
              elementId: 'test-graphics-0',
              actions: [
                {
                  startTime: 1000,
                  action: 'appear',
                  payload: {
                    style: {},
                    animation: {
                      duration: 1000,
                      easing: 'linear',
                      effect: 'fadeIn'
                    } as any
                  }
                }
              ]
            },
            {
              elementId: 'test-graphics-1',
              actions: [
                {
                  startTime: 2000,
                  action: 'appear',
                  payload: {
                    style: {},
                    animation: {
                      duration: 1000,
                      easing: 'linear',
                      effect: 'fadeIn'
                    } as any
                  }
                }
              ]
            },
            {
              elementId: 'test-chart-0',
              actions: [
                {
                  startTime: 3000,
                  action: 'appear'
                }
              ]
            },
            {
              elementId: 'test-chart-1',
              actions: [
                {
                  startTime: 4000,
                  action: 'appear'
                }
              ]
            }
          ]
        }
      ]
    };
    const story = new Story(tempSpec, { dom: id });
    story.play();
    // let i = 0;
    // story.getPlayer().setCurrentChapter(0);
    // setInterval(() => {
    //   story.getPlayer().tickTo(300 * i++);
    // }, 300);
  }, []);

  return <div style={{ width: '100%', height: '100%' }} id={id}></div>;
};
