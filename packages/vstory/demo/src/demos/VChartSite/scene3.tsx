import type { ICharacterSpec } from '../../../../src/story/character';
import type { ISceneSpec } from '../../../../src/story/interface';

import Scene3TitleImage from '../../assets/scene3/title-image.png';
import Scene3Decoration from '../../assets/scene3/decoration.png';
import Scene3TextTop from '../../assets/scene3/text-zh.png';
import Scene3TextBottom from '../../assets/scene3/text-en.png';
import Scene3ChartImage1 from '../../assets/scene3/chart-1.png';
import Scene3ChartImage2 from '../../assets/scene3/chart-2.png';
import Scene3ChartImage3 from '../../assets/scene3/chart-3.png';
import Scene3ChartImage4 from '../../assets/scene3/chart-4.png';
import Scene3ChartImage5 from '../../assets/scene3/chart-5.png';
// @ts-ignore
export const scene3Characters: ICharacterSpec[] = [
  {
    type: 'TextComponent',
    id: `scene3-title1`,
    zIndex: 1,
    position: {
      top: 100,
      left: 200,
      width: 500,
      height: 200
    },
    options: {
      graphic: { text: 'Proto Bar', fontSize: 55, fontWeight: 'bold', textAlign: 'left' }
    }
  },
  {
    type: 'LineComponent',
    id: `scene3-line-top`,
    zIndex: 1,
    position: {
      top: 102,
      left: 100,
      width: 500,
      height: 200
    },
    options: {
      graphic: {
        lineWidth: 1,
        points: [
          { x: 100, y: 34 },
          { x: 350, y: 34 }
        ]
      }
    }
  },
  {
    type: 'LineComponent',
    id: `scene3-line-bottom`,
    zIndex: 1,
    position: {
      top: 130,
      left: 100,
      width: 500,
      height: 200
    },
    options: {
      graphic: {
        lineWidth: 1,
        points: [
          { x: 100, y: 34 },
          { x: 350, y: 34 }
        ]
      }
    }
  },
  {
    type: 'TextComponent',
    id: `scene3-title-Nicole`,
    zIndex: 1,
    position: {
      top: 150,
      left: 200,
      width: 500,
      height: 200
    },
    options: {
      graphic: { text: 'Nicole Oresme', fontSize: 12, fontWeight: 'bold', textAlign: 'left' }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-text-image-top`,
    zIndex: 1,
    position: {
      top: 160,
      left: 560,
      width: 570,
      height: 65
    },
    options: {
      graphic: {
        image: Scene3TextTop
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-text-image-top`,
    zIndex: 1,
    position: {
      top: 160,
      left: 560,
      width: 570,
      height: 65
    },
    options: {
      graphic: {
        image: Scene3TextTop
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-chart-image-1`,
    zIndex: 1,
    position: {
      top: 250,
      left: 560,
      width: 200,
      height: 160
    },
    options: {
      graphic: {
        image: Scene3ChartImage1
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-chart-image-2`,
    zIndex: 1,
    position: {
      top: 250,
      left: 780,
      width: 200,
      height: 160
    },
    options: {
      graphic: {
        image: Scene3ChartImage2
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-chart-image-3`,
    zIndex: 1,
    position: {
      top: 425,
      left: 560,
      width: 200,
      height: 160
    },
    options: {
      graphic: {
        image: Scene3ChartImage3
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-chart-image-4`,
    zIndex: 1,
    position: {
      top: 425,
      left: 780,
      width: 200,
      height: 160
    },
    options: {
      graphic: {
        image: Scene3ChartImage4
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-chart-image-5`,
    zIndex: 1,
    position: {
      top: 250,
      left: 1000,
      width: 200,
      height: 335
    },
    options: {
      graphic: {
        image: Scene3ChartImage5
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-text-image-bottom`,
    zIndex: 1,
    position: {
      top: 620,
      left: 560,
      width: 570,
      height: 60
    },
    options: {
      graphic: {
        image: Scene3TextBottom
      }
    }
  },
  {
    type: 'TextComponent',
    id: `scene3-title-1486`,
    zIndex: 1,
    position: {
      top: 150,
      left: 420,
      width: 500,
      height: 200
    },
    options: {
      graphic: { text: '1486', fontSize: 12, fontWeight: 'bold', textAlign: 'left' }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-title-image`,
    zIndex: 1,
    position: {
      top: 180,
      left: 200,
      width: 250,
      height: 260
    },
    options: {
      graphic: {
        image: Scene3TitleImage
      }
    }
  },
  {
    type: 'RectComponent',
    id: `scene3-background`,
    zIndex: 0,
    position: {
      top: 0,
      left: 170,
      width: 1440,
      height: 810
    },
    options: {
      graphic: {
        stroke: false,
        fill: '#D9D4CA'
      }
    }
  },
  {
    type: 'ImageComponent',
    id: `scene3-background-decoration`,
    zIndex: 0,
    position: {
      top: 120,
      left: 270,
      width: 1000,
      height: 500
    },
    options: {
      graphic: {
        image: Scene3Decoration
      }
    }
  }
];

export const scene3: ISceneSpec = {
  id: 'scene3',
  actions: [
    // 第二个 scene 的内容，写在这里仅用作测试
    {
      characterId: `scene3-background`,
      characterActions: [
        {
          startTime: 1,
          duration: 800,
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
      characterId: `scene3-background-decoration`,
      characterActions: [
        {
          startTime: 1,
          duration: 800,
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
      characterId: `scene3-title1`,
      characterActions: [
        {
          action: 'appear',
          startTime: 1,
          duration: 700,
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
      characterId: `scene3-line-top`,
      characterActions: [
        {
          startTime: 1,
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
      characterId: `scene3-line-bottom`,
      characterActions: [
        {
          startTime: 1,
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
      characterId: `scene3-title-Nicole`,
      characterActions: [
        {
          startTime: 1,
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
      characterId: `scene3-title-1486`,
      characterActions: [
        {
          startTime: 1,
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
      characterId: `scene3-title-image`,
      characterActions: [
        {
          startTime: 1,
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
      characterId: `scene3-text-image-top`,
      characterActions: [
        {
          startTime: 300,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
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
      characterId: `scene3-chart-image-1`,
      characterActions: [
        {
          startTime: 330,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          startTime: 1500,
          duration: 1000,
          action: 'style',
          payload: {
            graphic: {
              width: 150
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-2`,
      characterActions: [
        {
          startTime: 330,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          startTime: 1500,
          duration: 1000,
          action: 'style',
          payload: {
            graphic: {
              width: 150,
              dx: -50
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-3`,
      characterActions: [
        {
          startTime: 330,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          startTime: 1500,
          duration: 1000,
          action: 'style',
          payload: {
            graphic: {
              width: 150
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-4`,
      characterActions: [
        {
          startTime: 330,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          startTime: 1500,
          duration: 1000,
          action: 'style',
          payload: {
            graphic: {
              width: 150,
              dx: -50
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-5`,
      characterActions: [
        {
          startTime: 330,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        },
        {
          startTime: 1500,
          duration: 1000,
          action: 'style',
          payload: {
            graphic: {
              width: 260,
              dx: -100
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-text-image-bottom`,
      characterActions: [
        {
          startTime: 360,
          duration: 500,
          action: 'appear',
          payload: {
            animation: {
              duration: 500,
              easing: 'easeInOutQuad',
              move: {
                from: 'bottom'
              }
            }
          }
        }
      ]
    },
    // transition
    {
      characterId: `scene3-title1`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 1000,
          payload: {
            animation: {
              duration: 1000,
              move: {
                to: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-line-top`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 1000,
          payload: {
            animation: {
              duration: 1000,
              move: {
                to: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-line-bottom`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 1000,
          payload: {
            animation: {
              duration: 1000,
              move: {
                to: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-title-Nicole`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 1000,
          payload: {
            animation: {
              duration: 1000,
              move: {
                to: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-title-1486`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 1000,
          payload: {
            animation: {
              duration: 1000,
              move: {
                to: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-title-image`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 1000,
          payload: {
            animation: {
              duration: 1000,
              move: {
                to: 'bottom'
              }
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-text-image-top`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-1`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-2`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-3`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-4`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-chart-image-5`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-text-image-bottom`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-background-decoration`,
      characterActions: [
        {
          action: 'disappear',
          startTime: 3500,
          duration: 700,
          payload: {
            animation: {
              duration: 700,
              effect: 'fade'
            }
          }
        }
      ]
    },
    {
      characterId: `scene3-background`,
      characterActions: [
        {
          action: 'moveTo',
          startTime: 3500,
          duration: 700,
          destination: {
            x: 0,
            y: 0
          },
          payload: {
            animation: {
              duration: 700,
              easing: 'easeInOutQuad'
            }
          }
        }
      ]
    }
  ]
};
