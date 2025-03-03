import { isMobile } from 'react-device-detect';
// eslint-disable-next-line no-duplicate-imports
import type { IImageCloudChartSpec } from '../../../../src/index';
import { registerImageCloudChart, default as VChart } from '../../../../src/index';
import { ScrollingAnimation } from '../../../../src/series/image-cloud/animation';
import type { IMark } from '@visactor/vgrammar-core';

// const res = await fetch('https://cdn.jsdelivr.net/gh/xiaoluoHe/Resources/images/dogs/files.json');
// const res = await fetch('http://localhost:3003/dogs/files.json');
// const dogs = await res.json();

const res = await fetch('http://localhost:3003/dogs/files.json');
const dogs = await res.json();

// const dogs = [
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_014.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_001.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_002.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_007.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_015.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_024.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_020.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_022.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_027.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_029.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_017.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_008.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_005.png',
//     count: 474
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_023.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_018.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_003.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_006.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_025.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_004.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_019.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_000.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_021.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_013.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_026.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_012.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_011.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_009.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_028.png'
//   },
//   {
//     url: 'http://tosv.boe.byted.org/obj/bytecharts/picCloud_pad2_016.png'
//   }
// ];
const spec: IImageCloudChartSpec = {
  type: 'imageCloud',
  data: {
    values: dogs.map((dog, index) => {
      return {
        ...dog,
        name: `name-${index}`,
        value: index
      };
    })
  },
  padding: 0,
  urlField: 'url',
  nameField: 'name',
  valueField: 'value',
  // maskShape: {
  //   type: 'text',
  //   text: 'V',
  //   fontWeight: 'bold',
  //   fill: 'blue'
  // },
  // maskShape: `http://localhost:3003/upload/visactor.png`,
  image: {
    padding: 4,
    style: {
      cornerRadius: 10
      // visible: (datum: any) => datum.cell === '5_4',
      // fillOpacity: datum => (datum.frequency > 1 ? 0.6 : 1),
      // stroke: 'green',
      // shadowBlur: 10
      // shadowColor: 'grey'
    },
    state: {
      hover: {
        scaleX: 1.5,
        scaleY: 1.5,
        zIndex: 100
      }
    }
  },
  ratio: 0.08,
  // imageSizeRange: [100, 200],
  imageSize: 50,
  // maskShape: `http://localhost:3003/heart-red.png`,
  imageMask: {
    // visible: true,
    // edgeBlur: 200
    // threshold: 0,
    // invert: true
  },
  layoutConfig: {
    // layoutMode: 'spiral',
    // spiralType: 'rectangular'
    // minFillingImageSize: 80
    // fillingTimes: 10

    layoutMode: 'grid'
    // rectAspectRatio: 4 / 3
    // cellType: 'circle'
    // cellType: 'hexagonal',
    // layoutMode: 'stack'
    // placement: 'masked'
  },
  animationAppear: {
    preset: 'axialRotate'
  },
  animationEnter: {
    image: {
      duration: 5000,
      delay: (datum: any, item: any, params: any) => {
        return datum.x;
      }
    }
  },
  // animationNormal: {
  //   image: {
  //     custom: ScrollingAnimation,
  //     customParameters: {
  //       width: 1000,
  //       direction: 'left'
  //     }
  //   }
  // },
  background: '#2A3051'
  // animationEnter: {
  //   image: {
  //     duration: 1000,
  //     easing: 'sineInOut'
  //     // totalTime: 10000
  //   }
  // }
};

registerImageCloudChart();

const run = () => {
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    // animation: false,
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');
  cs.on('click', console.log);

  cs.renderSync();
  console.timeEnd('renderTime');

  setTimeout(() => {}, 2000);

  window['vchart'] = cs;
  console.log(cs);
};
run();
