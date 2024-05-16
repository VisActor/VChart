import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';

export const DisAppear = () => {
  const id = 'DisAppear';

  useEffect(() => {
    try {
      const bgCharacters = [
        {
          type: 'RectComponent',
          id: 'bg-1',
          zIndex: -1,
          position: {
            top: 0,
            left: 0,
            width: 960,
            height: 600
          },
          options: {
            graphic: { fill: '#EEEEEC', stroke: '#EEEEEC' }
          }
        },
        {
          type: 'RectComponent',
          id: 'bg-2',
          zIndex: -1,
          position: {
            top: 0,
            left: 0,
            width: 960,
            height: 600
          },
          options: {
            graphic: { fill: '#CAC4B8', stroke: '#CAC4B8' }
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
              duration: 2000,
              easing: 'cubicOut',
              fade: {
                opacity: 1
              },
              move: {
                from: 'left'
              },
              wipe: {
                from: 'right'
              },
              scale: {
                ratio: 0.8
              }
            }
          }
        }
      ];

      // 第二个背景
      const bg2Actions = [
        {
          startTime: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 3000,
              effect: 'move',
              from: 'left',
              easing: 'cubicIn'
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
                  }
                  // {
                  //   characterId: 'bg-2',
                  //   characterActions: bg2Actions
                  // }
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
