import type { ICharacterSpec } from '../../../../src/story/character';
import type { ISceneSpec } from '../../../../src/story/interface';
import LeftLineDecoration from '../../assets/scene4/blocks.png';
import TitleDecoration from '../../assets/scene4/title-decoration.png';
import ChartImage from '../../assets/scene4/chart.png';
import TextEnImage from '../../assets/scene4/text-en.png';
import TextZhImage from '../../assets/scene4/text-zh.png';
import RectTexture from '../../assets/scene4/matrix.png';
import DecorationImage from '../../assets/scene4/decoration.png';
import BgDecorationImage from '../../assets/scene4/bg-decoration.png';

export const scene4Characters: ICharacterSpec[] = [
  {
    type: 'ImageComponent',
    id: 'scene4-title-decoration',
    zIndex: 1,
    position: {
      left: 200,
      top: 140,
      width: 130,
      height: 26
    },
    options: {
      graphic: {
        image: TitleDecoration
      }
    }
  },
  {
    type: 'TextComponent',
    id: 'scene4-title',
    zIndex: 1,
    position: {
      left: 200,
      top: 200,
      width: 400,
      height: 60
    },
    options: {
      graphic: {
        text: 'The First Chart',
        fontSize: 55,
        fontWeight: 'bold',
        textAlign: 'left'
      }
    }
  },
  {
    type: 'TextComponent',
    id: 'scene4-subtitle',
    zIndex: 1,
    position: {
      left: 200,
      top: 256,
      width: 300,
      height: 30
    },
    options: {
      graphic: {
        text: 'Michael van Langren',
        fontSize: 30,
        textAlign: 'left',
        fontWeight: 'bold'
      }
    }
  },
  {
    type: 'LineComponent',
    id: 'scene4-line-left',
    zIndex: 1,
    position: {
      left: 165,
      top: 0,
      width: 10,
      height: 450
    },
    options: {
      graphic: {
        lineWidth: 1,
        points: [
          { x: 5, y: 0 },
          { x: 5, y: 450 }
        ]
      }
    }
  },
  {
    type: 'ImageComponent',
    id: 'scene4-line-left-decoration',
    zIndex: 1,
    position: {
      left: 160,
      top: 460,
      width: 20,
      height: 66
    },
    options: {
      graphic: {
        image: LeftLineDecoration
      }
    }
  },
  {
    type: 'ImageComponent',
    id: 'scene4-chart-image',
    zIndex: 1,
    position: {
      left: 200,
      top: 320,
      width: 420,
      height: 104
    },
    options: {
      graphic: {
        image: ChartImage
      }
    }
  },
  {
    type: 'LineComponent',
    id: 'scene4-text-zh-line',
    zIndex: 1,
    position: {
      left: 324,
      top: 470,
      width: 10,
      height: 64
    },
    options: {
      graphic: {
        lineWidth: 1,
        points: [
          { x: 0, y: 0 },
          { x: 0, y: 64 }
        ]
      }
    }
  },
  {
    type: 'ImageComponent',
    id: 'scene4-text-zh-image',
    zIndex: 1,
    position: {
      left: 340,
      top: 470,
      width: 280,
      height: 64
    },
    options: {
      graphic: {
        image: TextZhImage
      }
    }
  },
  {
    type: 'ImageComponent',
    id: 'scene4-text-en-image',
    zIndex: 1,
    position: {
      left: 660,
      top: 600,
      width: 300,
      height: 54
    },
    options: {
      graphic: {
        image: TextEnImage
      }
    }
  },
  {
    type: 'RectComponent',
    id: 'scene4-green-rect',
    zIndex: 1,
    position: {
      left: 620,
      top: 160,
      width: 100,
      height: 90
    },
    options: {
      graphic: {
        fill: `rgba(124, 128,118,0.8)`,
        background: RectTexture,
        stroke: false
      }
    }
  },
  {
    type: 'ImageComponent',
    id: 'scene4-decoration',
    zIndex: 1,
    position: {
      left: 740,
      top: 340,
      width: 80,
      height: 120
    },
    options: {
      graphic: {
        image: DecorationImage
      }
    }
  },
  {
    type: 'RectComponent',
    id: 'scene4-grey-rect',
    zIndex: 1,
    position: {
      left: 960,
      top: 340,
      width: 300,
      height: 100
    },
    options: {
      graphic: {
        fill: `rgb(167, 160,153)`,
        stroke: false
      }
    }
  },
  {
    type: 'ImageComponent',
    id: 'scene4-bg-decoration',
    zIndex: 1,
    position: {
      left: 180,
      top: 680,
      width: 1200,
      height: 140
    },
    options: {
      graphic: {
        image: BgDecorationImage
      }
    }
  }
];

export const scene4: ISceneSpec = {
  id: 'scene4',
  actions: [
    {
      characterId: 'scene4-title-decoration',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              easing: 'easeInOutQuad',

              duration: 700,
              move: {
                from: 'top'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-title',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              easing: 'easeInOutQuad',

              duration: 700,
              move: {
                from: 'top'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-subtitle',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'top'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-line-left',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',

              move: {
                from: 'top'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-line-left-decoration',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'top'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-chart-image',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              effect: 'fade'
            }
          }
        },
        {
          // TODO: startOffset
          startTime: 1300,
          duration: 700,
          action: 'style',
          payload: {
            graphic: {
              width: 500,
              height: 120
            },
            animation: {
              duration: 700,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-text-zh-image',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          // TODO: startOffset
          startTime: 1300,
          duration: 700,
          action: 'style',
          payload: {
            graphic: {
              dx: 50,
              dy: 10
            },
            animation: {
              duration: 700,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-text-zh-line',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          // TODO: startOffset
          startTime: 1300,
          duration: 700,
          action: 'style',
          payload: {
            graphic: {
              dx: 50,
              dy: 10
            },
            animation: {
              duration: 700,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-text-en-image',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 1,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-green-rect',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 200,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'top'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-decoration',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 200,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-grey-rect',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 200,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              move: {
                from: 'right'
              }
            }
          }
        }
      ]
    },
    {
      characterId: 'scene4-bg-decoration',
      characterActions: [
        {
          // TODO: startOffset
          startTime: 0,
          duration: 700,
          action: 'appear',
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad',
              effect: 'fade'
            }
          }
        }
      ]
    }
  ]
};
