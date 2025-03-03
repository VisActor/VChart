import { isMobile } from 'react-device-detect';
// eslint-disable-next-line no-duplicate-imports
import type { IImageCloudChartSpec } from '../../../../src/index';
import { registerImageCloudChart, default as VChart } from '../../../../src/index';
import type { EasingType } from '@visactor/vrender-core';
import { ACustomAnimate } from '@visactor/vrender-core';
import { isValidNumber } from '@visactor/vutils';

// const res = await fetch('https://cdn.jsdelivr.net/gh/xiaoluoHe/Resources/images/dogs/files.json');
// const res = await fetch('http://localhost:3003/dogs/files.json');
// const dogs = await res.json();

const images = [
  {
    url: 'http://localhost:3003/upload/dogs/dogs4.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs1.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs2.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs3.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs4.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs5.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs6.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs7.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs8.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs9.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs10.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs11.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs12.jpeg'
  },
  {
    url: 'http://localhost:3003/upload/dogs/dogs13.jpeg'
  }
];

const spec: IImageCloudChartSpec = {
  type: 'imageCloud',
  data: {
    values: images
  },
  urlField: 'url',
  valueField: 'count',
  // maskShape: `http://localhost:3003/upload/cloud.svg`,
  maskShape: `http://localhost:3003/upload/heart.svg`,

  layoutConfig: {
    layoutMode: 'grid',
    rectAspectRatio: 4 / 3
    // placement: 'masked'
  },
  image: {
    padding: 10,
    style: { cornerRadius: 2 }
  },
  background: '#2A3051',
  imageMask: {
    // edgeBlur: 50
  },
  tooltip: {
    mark: {
      visible: false
    }
  },

  animationEnter: {
    image: {
      channel: {
        scaleX: {
          from: 0,
          to: 1
        },
        scaleY: {
          from: 0,
          to: 1
        },
        fillOpacity: {
          from: 0,
          to: 1
        },
        x: { from: (datum, element, ctx) => ctx.VGRAMMAR_ANIMATION_PARAMETERS.width / 2 },
        y: { from: (datum, element, ctx) => ctx.VGRAMMAR_ANIMATION_PARAMETERS.height / 2 }
      },
      easing: 'linear',
      duration: 1200,
      delay: (datum: any) => {
        return 40 * datum.distance;
      }
    }
  }
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
  cs.on('click', ({ datum }) => {
    console.log(datum);
  });

  cs.renderSync();

  console.timeEnd('renderTime');

  // const runCarouselAnimation = () => {
  //   const imageMark = cs
  //     .getChart()
  //     ?.getAllMarks()
  //     .find(mark => mark.type === 'image');
  //   // const imageMarks = imageMark.filter(mark => mark.type === 'image');
  //   // console.log(imageMark);
  //   if (imageMark && imageMark.getProduct()) {
  //     imageMark.getProduct()?.animate?.run({
  //       custom: ScrollingAnimation,
  //       duration: 30000,
  //       easing: 'linear',
  //       customParameters: (datum: any) => {
  //         const row = datum.cell.row;
  //         const direction = row % 2 === 0 ? 'left' : 'right';
  //         return {
  //           width: cs.getChart()?.getAllRegions()[0].getLayoutRect().width - 50,
  //           direction
  //         };
  //       }
  //     });
  //   }
  // };

  // cs.on('allAnimationEnd', runCarouselAnimation);

  window['vchart'] = cs;
  console.log(cs);
};
run();
