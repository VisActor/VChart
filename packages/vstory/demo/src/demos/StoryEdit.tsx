import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import { Edit } from '../../../src/edit/edit';
import '../../../src/story/index';
import { cloneDeep } from '@visactor/vutils';
import { CommonEditComponent } from '../../../src/edit/edit-component/common';
import { BoxSelection } from '../../../src/edit/edit-component/box-selection';

Edit.registerEditComponent('common', CommonEditComponent);
Edit.registerEditComponent('box-selection', BoxSelection);

export const StoryEdit = () => {
  const id = 'storyBar';

  useEffect(() => {
    // 准备一个图表
    const tempSpec: IStorySpec = {
      characters: [
        {
          type: 'RectComponent',
          id: 'test-graphics-0',
          zIndex: 0,
          position: {
            top: 40,
            left: 50,
            width: 200,
            height: 100
          },
          options: {
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
          type: 'RectComponent',
          id: 'test-graphics-1',
          zIndex: 0,
          position: {
            top: 40,
            left: 250,
            width: 200,
            height: 100
          },
          options: {
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
          type: 'BarChart',
          id: 'test-chart-0',
          zIndex: 0,
          position: {
            top: 200,
            left: 100,
            width: 400,
            height: 400
          },
          options: {
            title: {
              text: 'Timeline Chart',
              orient: 'bottom',
              align: 'center',
              textStyle: {
                fontSize: 10,
                lineHeight: 10
              }
            },
            padding: 12,
            data: [
              {
                id: 'id0',
                values: [
                  { type: 'a', value: 0.36, value2: 0.06 },
                  { type: 'b', value: 0.66, value2: 0.26 },
                  { type: 'c', value: 0.4, value2: 0.0 },
                  { type: 'd', value: 0.6, value2: 0.2 }
                ]
              }
            ],
            direction: 'vertical',
            seriesSpec: [
              {
                matchInfo: { specIndex: 'all' },
                spec: {
                  xField: 'type',
                  yField: 'value'
                }
              }
            ]
          }
        }
      ],
      acts: [
        {
          id: 'default-chapter',
          scenes: [
            {
              id: 'scene0',
              actions: [
                {
                  characterId: 'test-graphics-0',
                  characterActions: [
                    {
                      startTime: 0,
                      duration: 0,
                      action: 'appear',
                      payload: {
                        style: {},
                        animation: {
                          duration: 0,
                          easing: 'linear',
                          effect: 'fadeIn'
                        } as any
                      }
                    }
                  ]
                },
                {
                  characterId: 'test-graphics-1',
                  characterActions: [
                    {
                      startTime: 0,
                      duration: 0,
                      action: 'appear',
                      payload: {
                        style: {},
                        animation: {
                          duration: 0,
                          easing: 'linear',
                          effect: 'fadeIn'
                        } as any
                      }
                    }
                  ]
                },
                {
                  characterId: 'test-chart-0',
                  characterActions: [
                    {
                      startTime: 0,
                      duration: 0,
                      action: 'appear'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    const story = new Story(tempSpec, { dom: id });
    story.play();
    const edit = new Edit(story);
    edit.emitter.on('startEdit', msg => {
      if (msg.type === 'commonEdit' && msg.actionInfo.character) {
        console.log(cloneDeep(msg.actionInfo.character.spec));
        msg.updateCharacter({ options: { graphic: { fill: 'green' } } });
        console.log(cloneDeep(msg.actionInfo.character.spec));
        story.play();
      }
    });
  }, []);

  return <div style={{ width: '100%', height: '100%' }} id={id}></div>;
};
