import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import Scene3ChartImage1 from '../assets/scene3/chart-1.png';

export const DisAppear = () => {
  const id = 'DisAppear';

  useEffect(() => {
    try {
      const bgCharacters = [
        {
          type: 'ImageComponent',
          id: 'bg-1',
          zIndex: -1,
          position: {
            top: 0,
            left: 0,
            width: 960,
            height: 600
          },
          options: {
            graphic: {
              image: Scene3ChartImage1
            }
          }
        },
        {
          type: 'LineComponent',
          id: 'bg-2',
          zIndex: -1,
          position: {
            top: 200,
            left: 400,
            width: 100,
            height: 15
          },
          options: {
            graphic: {
              lineWidth: 15,
              points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 }
              ]
            }
          }
        },
        {
          type: 'LineComponent',
          id: 'bg-3',
          zIndex: -1,
          position: {
            top: 400,
            left: 600,
            width: 100,
            height: 15
          },
          options: {
            graphic: {
              lineWidth: 15,
              points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 }
              ]
            }
          }
        }
      ];

      // 第一个背景
      const bg1Actions = [
        {
          startTime: 100,
          action: 'appear',
          payload: {
            animation: {
              duration: 1000,
              easing: 'cubicOut',
              scale: {
                ratio: 0.25
              }
            }
          }
        }
      ];

      // 第二个背景
      const bg2Actions = [
        {
          startTime: 100,
          action: 'appear',
          payload: {
            animation: {
              duration: 3000,
              easing: 'linear',
              scale: {
                ratio: 1
              },
              move: {
                from: 'bottom',
                isVariableSpeed: true
              }
            }
          }
        },
        {
          startTime: 3100,
          action: 'disappear',
          payload: {
            animation: {
              duration: 3000,
              easing: 'linear',
              fade: {
                opacity: 0.5
              },
              move: {
                to: 'right',
                isVariableSpeed: true
              },
              scale: {
                ratio: 0.5
              }
            }
          }
        }
      ];

      // 第三个背景
      const bg3Actions = [
        {
          startTime: 100,
          action: 'appear',
          payload: {
            animation: {
              duration: 3000,
              easing: 'linear',
              scale: {
                ratio: 1
              },
              move: {
                from: 'bottom',
                isVariableSpeed: true
              }
            }
          }
        },
        {
          startTime: 3100,
          action: 'disappear',
          payload: {
            animation: {
              duration: 3000,
              easing: 'linear',
              fade: {
                opacity: 0.5
              },
              move: {
                to: 'right',
                isVariableSpeed: true
              },
              scale: {
                ratio: 0.5
              }
            }
          }
        }
      ];

      const tempSpec = {
        characters: [
          ...bgCharacters.map(item => {
            return {
              ...item
            };
          })
        ],
        acts: [
          {
            id: 'default-chapter',
            scenes: [
              {
                id: 'scene1',
                actions: [
                  {
                    characterId: 'bg-1',
                    characterActions: bg1Actions
                  },
                  {
                    characterId: 'bg-2',
                    characterActions: bg2Actions
                  },
                  {
                    characterId: 'bg-3',
                    characterActions: bg3Actions
                  }
                ]
              }
            ]
          }
        ]
      };
      console.log('debug tempSpec', tempSpec);
      const story = new Story(tempSpec as IStorySpec, { dom: id });
      story.play();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return <div style={{ width: '100%', height: '100%' }} id={id}></div>;
};
