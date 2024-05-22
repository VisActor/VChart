// @ts-nocheck
import { ICharacterSpec } from '../../../../src/story/character';
import { ISceneSpec } from '../../../../src/story/interface';

export const scene2Characters: ICharacterSpec[] = [
  {
    type: 'TextComponent',
    id: `title1`,
    zIndex: 1,
    position: {
      top: 300,
      left: 500,
      width: 500,
      height: 200
    },
    options: {
      graphic: { text: 'A BRIEF HISTORY', fontSize: 55, fontWeight: 'bold' }
    }
  },
  {
    type: 'TextComponent',
    id: `title2`,
    zIndex: 1,
    position: {
      top: 380,
      left: 500,
      width: 400,
      height: 60
    },
    options: {
      graphic: { text: 'OF CHARTS', fontSize: 55, fontWeight: 'bold' }
    }
  },
  {
    type: 'RichTextComponent',
    id: `titlesubtitle`,
    zIndex: 1,
    position: {
      top: 450,
      left: 600,
      width: 400,
      height: 80
    },
    options: {
      graphic: {
        width: 400,
        fontSize: 22,
        fontWeight: 'bold',
        textConfig: [
          {
            text: 'Powered By '
          },
          {
            text: 'VChart',
            fill: 'blue'
          }
        ]
      }
    }
  },
  {
    type: 'TextComponent',
    id: `scene2-title2`,
    zIndex: 1,
    position: {
      top: 50,
      left: 150,
      width: 200,
      height: 20
    },
    options: {
      graphic: {
        width: 400,
        fontSize: 12,
        fill: '#292729',
        text: 'DEVELOPMENT ROADMAP'
      }
    }
  }
];

export const scene2: ISceneSpec = {
  id: 'scene2',
  actions: [
    {
      characterId: `title1`,
      characterActions: [
        {
          startTime: 0,
          duration: 800,
          action: 'moveTo',
          destination: {
            x: 250,
            y: 80
          },
          payload: {
            animation: {
              duration: 800,
              easing: 'quadInOut'
            }
          }
        },
        {
          startTime: 0,
          duration: 800,
          action: 'style',
          payload: {
            graphic: {
              fontSize: 40
            },
            animation: {
              duration: 800
            }
          }
        }
      ]
    },
    {
      characterId: `title2`,
      characterActions: [
        {
          startTime: 0,
          duration: 800,
          action: 'moveTo',
          destination: {
            x: 550,
            y: 80
          },
          payload: {
            animation: {
              duration: 800,
              easing: 'quadInOut'
            }
          }
        },
        {
          startTime: 0,
          duration: 800,
          action: 'style',
          payload: {
            graphic: {
              fontSize: 40
            },
            animation: {
              duration: 800,
              easing: 'quadInOut'
            }
          }
        }
      ]
    },
    {
      characterId: `scene2-title2`,
      characterActions: [
        {
          startTime: 800,
          duration: 800,
          action: 'appear',
          payload: {
            animation: {
              duration: 800,
              easing: 'linear',
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `title1`,
      characterActions: [
        {
          startTime: 2000,
          duration: 800,
          action: 'moveTo',
          destination: {
            x: -650,
            y: 80
          },
          payload: {
            animation: {
              duration: 800,
              easing: 'quadInOut'
            }
          }
        }
      ]
    },
    {
      characterId: `title2`,
      characterActions: [
        {
          startTime: 2000,
          duration: 800,
          action: 'moveTo',
          destination: {
            x: -350,
            y: 80
          },
          payload: {
            animation: {
              duration: 800,
              easing: 'quadInOut'
            }
          }
        }
      ]
    },
    {
      characterId: `scene2-title2`,
      characterActions: [
        {
          startTime: 2000,
          duration: 800,
          action: 'moveTo',
          destination: {
            x: -750,
            y: 80
          },
          payload: {
            animation: {
              duration: 800,
              easing: 'quadInOut'
            }
          }
        }
      ]
    }
  ]
};
