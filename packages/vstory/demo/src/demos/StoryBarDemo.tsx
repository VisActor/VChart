import React, { useEffect } from 'react';
import { IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import Scene3ChartImage1 from '../assets/scene3/chart-1.png';

export const StoryBarDemo = () => {
  const id = 'DisAppear';

  useEffect(() => {
    try {
      const tempSpec = {
        characters: [
          {
            type: 'BarChart',
            id: `bar`,
            zIndex: 1,
            position: {
              top: 50,
              left: 50,
              width: 300,
              height: 240
            },
            panel: {
              fill: 'white',
              shadowColor: 'rgba(0, 0, 0, 0.05)',
              shadowBlur: 10,
              shadowOffsetX: 4,
              shadowOffsetY: 4
            },
            options: {
              title: {
                text: 'BarChart',
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
                  id: 'data',
                  values: [
                    {
                      x: '1',
                      y: 100,
                      type: 'Category1'
                    },
                    {
                      x: '2',
                      y: 100,
                      type: 'Category1'
                    },
                    {
                      x: '3',
                      y: 100,
                      type: 'Category1'
                    },
                    {
                      x: '4',
                      y: 100,
                      type: 'Category1'
                    },
                    {
                      x: '1',
                      y: 100,
                      type: 'Category2'
                    },
                    {
                      x: '2',
                      y: 100,
                      type: 'Category2'
                    },
                    {
                      x: '3',
                      y: 100,
                      type: 'Category2'
                    },
                    {
                      x: '4',
                      y: 100,
                      type: 'Category2'
                    }
                  ]
                }
              ],
              seriesSpec: [
                {
                  matchInfo: { specIndex: 'all' },
                  spec: {
                    xField: ['x', 'type'],
                    yField: 'y',
                    seriesField: 'type',
                    bar: {
                      style: {
                        fill: {
                          gradient: 'linear',
                          stops: [
                            {
                              offset: 1
                            },
                            {
                              offset: 0,
                              opacity: 0.6
                            }
                          ]
                        }
                      },
                      state: {
                        selected: {
                          stroke: '#000',
                          strokeWidth: 1
                        }
                      }
                    },
                    label: {
                      style: {
                        visible: false
                      }
                    }
                  }
                }
              ],
              componentSpec: [
                {
                  specKey: 'axes',
                  matchInfo: { orient: 'bottom' },
                  spec: {
                    tick: { visible: false },
                    label: { visible: false },
                    grid: { visible: false }
                  }
                },
                {
                  specKey: 'axes',
                  matchInfo: { orient: 'left' },
                  spec: {
                    tick: { visible: false },
                    label: { visible: false },
                    grid: { visible: false }
                  }
                }
              ],
              color: ['#4CC9E4', '#4954E6'],
              attribute: {}
            }
          }
        ],
        acts: [
          {
            id: 'default-chapter',
            scenes: [
              {
                id: 'scene1',
                actions: [
                  {
                    characterId: 'bar',
                    characterActions: [
                      {
                        action: 'appear',
                        startTime: 1000,
                        payload: {
                          animation: {
                            duration: 1000,
                            easing: 'cubicOut',
                            effect: 'grow',
                            fade: {
                              opacity: 1,
                              isBaseOpacity: true,
                              easing: 'linear'
                            }
                          }
                        }
                      },
                      {
                        action: 'update'
                      }
                    ]
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
