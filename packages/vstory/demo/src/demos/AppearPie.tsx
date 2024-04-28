import React, { useEffect } from 'react';
import { Story } from '../../../src/story/story';
import { IStorySpec } from '../../../src/story/interface';

export const AppearPie = () => {
  const id = 'storyPie';

  useEffect(() => {
    const roles: IStorySpec['roles'] = [
      {
        type: 'pieChart',
        id: 'test-chart-0',
        zIndex: 0,
        widget: {
          top: 50,
          left: 50,
          width: 970,
          height: 600
        },
        config: {
          data: {
            type: 'standard',
            value: {
              data: [
                { State: 'WY', 'Under 5 Years': 25635, '5 to 13 Years': 1890, '14 to 17 Years': 9314 },
                { State: 'DC', 'Under 5 Years': 30352, '5 to 13 Years': 20439, '14 to 17 Years': 10225 },
                { State: 'VT', 'Under 5 Years': 38253, '5 to 13 Years': 42538, '14 to 17 Years': 15757 },
                { State: 'ND', 'Under 5 Years': 51896, '5 to 13 Years': 67358, '14 to 17 Years': 18794 },
                { State: 'AK', 'Under 5 Years': 72083, '5 to 13 Years': 85640, '14 to 17 Years': 22153 }
              ],
              columns: ['State', 'Under 5 Years', '5 to 13 Years', '14 to 17 Years'],
              rows: ['State', 'WY', 'DC', 'VT', 'ND', 'AK']
            }
          },
          attribute: {
            theme: undefined,
            layout: undefined,
            color: [],
            moduleSpec: [],
            zIndex: 0
          }
        }
      }
    ];

    const acts: IStorySpec['acts'] = [
      {
        id: 'default-chapter',
        scenes: [
          [
            {
              roleId: 'test-chart-0',
              actions: [
                // 3种appear
                {
                  startTime: 1000,
                  action: 'appear',
                  payload: {
                    animation: {
                      effect: 'growAngle',
                      duration: 500
                    }
                  }
                },
                {
                  startTime: 1500,
                  action: 'appear',
                  payload: {
                    animation: {
                      effect: 'growRadius',
                      duration: 500
                    }
                  }
                },
                {
                  startTime: 2000,
                  action: 'appear',
                  payload: {
                    animation: {
                      effect: 'fade',
                      duration: 500
                    }
                  }
                },
                // oneByOne
                {
                  startTime: 2500,
                  action: 'appear',
                  payload: {
                    animation: {
                      effect: 'growAngle',
                      duration: 200,
                      oneByOne: true
                    }
                  }
                },
                {
                  startTime: 3500,
                  action: 'appear',
                  payload: {
                    animation: {
                      effect: 'growRadius',
                      duration: 200,
                      oneByOne: true
                    }
                  }
                },
                {
                  startTime: 4500,
                  action: 'appear',
                  payload: {
                    animation: {
                      effect: 'fade',
                      duration: 200,
                      oneByOne: true
                    }
                  }
                }
              ]
            }
          ]
        ]
      }
    ];

    const story = new Story(
      { roles, acts },
      {
        dom: document.querySelector(`#${id}`)
      }
    );

    story.play();
    return () => {};
  }, []);

  return <div id={id} style={{ width: '100%', height: '100%' }}></div>;
};
