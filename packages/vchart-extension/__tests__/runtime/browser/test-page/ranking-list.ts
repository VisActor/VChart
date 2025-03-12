import { registerRankingList } from '../../../../src';
// import { GUI } from 'lil-gui';
import { VChart } from '@visactor/vchart';

const guiObject = {
  name: 'rankingList',
  labelLayout: 'top',
  pageSize: 5,
  scrollSize: 1,
  // animationType: 'scroll',
  // animationInterval: 2000,
  // animationDuration: 1000,
  // animationEasing: 'linear',
  rankingIconVisible: true,
  orderLabelVisible: true,
  animationAppearEnable: true,
  animationAppearDuration: 2000,
  animationAppearEasing: 'linear',
  animationUpdateEnable: true,
  animationUpdateDuration: 1000,
  animationUpdateEasing: 'linear',
  // animationNormalEnable: true,
  animationNormalInterval: 1000
  // animationNormalEasing: 'linear'
};

const chartData = [
  {
    y: '吉林xx',
    x: 50
  },
  {
    y: '内蒙古',
    x: 40
  },
  {
    y: '河北',
    x: 30 //
  },
  {
    y: '湖南', //
    x: 30
  },
  {
    y: '江西',
    x: 24
  },
  {
    y: '山西',
    x: 20
  },
  {
    y: '河南',
    x: 200
  },
  {
    y: '辽宁',
    x: 10
  },
  {
    y: '山东',
    x: 10
  },
  {
    y: '湖北',
    x: 10
  }
];
// console.log(chartData);

const spec = {
  type: 'rankingList',
  data: chartData,
  xField: 'x',
  yField: 'y',
  background: 'rgba(0,0,0,1)',
  bar: {
    height: 10,
    style: {
      cornerRadius: 5,
      fill: {
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 0,
        stops: [
          {
            offset: 0,
            color: 'rgba(0, 110, 255,0.2)'
          },
          {
            offset: 1,
            color: 'rgba(0, 110, 255,1)'
          }
        ]
      }
    },
    state: {
      selected_reverse: {
        style: {
          fillOpacity: 0.2
        }
      }
    }
  },
  labelLayout: guiObject.labelLayout,

  rankingIcon: {
    visible: guiObject.rankingIconVisible,
    style: {
      size: 5,
      symbolType: 'circle',
      fill: 'yellow'
      // stroke: 'yellow',
      // symbolType:
      //   '<svg t="1735198937815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8376" width="200" height="200"><path d="M196.983884 1022.798281l-28.502383-167.232826L1.242423 827.05807l302.100508-302.095506L499.07814 720.590231 196.983884 1022.798281z" fill="#F3C450" p-id="8377"></path><path d="M166.883376 846.670731L8.535272 819.652677l-7.292849 7.405393 167.237827 28.507385-1.596874-8.894724z m321.824463-136.459555l-294.802657 294.802658 2.964908 17.784447L499.07814 720.590231l-10.370301-10.379055z" fill="#F7D582" p-id="8378"></path><path d="M826.149652 1022.798281l28.497382-167.232826 167.124033-28.507385-302.098007-302.100508-195.740211 195.632669 302.216803 302.20805z" fill="#F3C450" p-id="8379"></path><path d="M297.188027 532.372958l-143.185932 143.18093 15.504806 39.334115c10.941774 27.585776 32.262603 49.589371 59.509496 61.442751l150.478781 65.207972 113.316764-113.315514-195.623915-195.850254z m426.817975-2.964908l143.185932 143.185932-15.502305 39.331614c-10.941774 27.583275-32.263853 49.581868-59.510747 61.44025l-150.47878 65.207972-113.315514-113.313013 195.621414-195.852755z" fill="#EF9115" p-id="8380"></path><path d="M689.690098 700.97882l-158.348105 27.015553-7.411645-7.405393 167.242829-28.502384-1.483079 8.892224z m314.415318 129.162954L716.595608 542.630715l3.077452-17.673153 302.100508 302.100508-17.668152 3.083704z" fill="#F7D582" p-id="8381"></path><path d="M927.840625 393.177335l-89.151074-225.493083c-10.946776-27.593279-32.258851-49.589371-59.505745-61.445252L556.766925 9.90762c-27.134349-11.742087-57.913873-12.31356-85.497148-1.371786L245.771692 97.686909c-27.589527 10.941774-49.589371 32.262603-61.44025 59.509496l-96.331379 222.411879c-11.743337 27.134349-12.31481 57.917624-1.373037 85.507152l89.146073 225.483079c10.946776 27.589527 32.263853 49.589371 59.510746 61.452755L457.699476 848.381399c27.130598 11.743337 57.910121 12.311059 85.498398 1.369285l225.493083-89.151075c27.589527-10.936772 49.589371-32.258851 61.450254-59.505744l96.33138-222.528175c11.742087-27.138101 12.197265-57.916374 1.368034-85.388355z" fill="#EF8822" p-id="8382"></path><path d="M177.028589 429.085111c0 117.951075 62.92583 226.9449 165.074483 285.919188 102.149902 58.978038 228.000313 58.978038 330.148964 0 102.1449-58.973036 165.06948-167.966862 165.06948-285.919188 0-117.951075-62.92458-226.937397-165.06948-285.916686-102.149902-58.974287-227.999062-58.974287-330.148964 0-102.148652 58.978038-165.074482 167.970614-165.074483 285.916686z" fill="#E6F3FB" p-id="8383"></path><path d="M507.06501 99.058695c2.280891 0 4.440485 0 6.721375 0.112544-179.211254 3.648925-323.300039 149.912309-323.300039 330.026416 0 180.12286 144.093787 326.387495 323.300039 329.921376-2.280891 0-4.440485 0.115045-6.721375 0.115045-182.292458 0-330.148964-147.748964-330.148965-330.151466 0-182.397499 147.743962-330.023916 330.148965-330.023915z" fill="#E5DFBA" p-id="8384"></path><path d="M507.290098 99.058695c-2.282141 0-4.450488 0-6.726378 0.112544 179.093708 3.531379 323.305041 149.912309 323.305041 329.913872 0 180.011567-144.211333 326.50254-323.422587 330.036421 2.280891 0 4.450488 0.115045 6.73138 0.115045 182.283705 0 330.143962-147.748964 330.143962-330.151466 0-182.4-147.743962-330.026417-330.031418-330.026416z" fill="#FBFDFF" p-id="8385"></path><path d="M215.564893 429.085111c0 161.054162 130.558499 291.612661 291.612661 291.612662 161.04916 0 291.612661-130.558499 291.612661-291.612662 0-161.04916-130.563501-291.612661-291.612661-291.612661-161.054162 0-291.612661 130.563501-291.612661 291.612661z" fill="#EF8822" p-id="8386"></path><path d="M792.747855 143.632356s47.874951 69.763501 74.555373 127.334741c26.787964 57.571239 42.7517 132.014068 46.742008 147.063696 3.986557 15.045877 24.281985 2.964908 15.958734-18.581008-8.323251-21.547167-85.614693-216.939742-85.614693-216.939742s-9.007268-36.831887-39.556702-55.754279c-17.671903-11.166862-12.084721 16.876592-12.08472 16.876592zM526.101196 28.601172s64.635248 16.872841 115.367565 35.228762c50.844861 18.352169 106.247753 52.896913 117.874795 59.505744 11.630793 6.613834 15.392263-12.538648-2.732317-20.40297-18.127081-7.869324-183.089019-78.091755-183.089019-78.091755S555.400141 6.942712 526.555123 13.669089c-16.642751 3.766471-0.453927 14.932083-0.453927 14.932083z m366.852051 457.142322s-18.239625 59.734584-39.326612 110.809535c-21.091989 51.189996-60.08222 102.826417-67.492614 113.886987-7.405393 11.054318 13.222665 20.63306 22.228683 2.736068 9.007268-17.898242 89.151075-180.923173 89.151075-180.923173s13.335209-28.155998 11.972176-60.189761c-0.916608-20.064088-16.532708 13.680344-16.532708 13.680344z" fill="#E5A361" p-id="8387"></path><path d="M854.647034 855.565455l-9.80383 2.388433L816.116983 1012.770614l10.032669 10.027667 28.497382-167.232826z" fill="#FFFFFF" p-id="8388"></path><path d="M346.327222 632.522079l-1.303009-12.433607 0.05252-163.63517h78.955842v63.499805c0 4.142868 3.361313 7.502931 7.502931 7.502931h134.077374l1.250489 34.488472h-134.077374c-4.142868 0-7.502931 3.361313-7.502931 7.50293v13.180149c0 4.142868 3.361313 7.502931 7.502931 7.502931h158.161782a7.502931 7.502931 0 0 0 7.50293-7.502931v-63.349746c0-4.142868-3.361313-7.502931-7.50293-7.502931h-135.352873l-1.250488-12.504885v-42.816725h221.386479l1.250488 176.068777h-330.654161zM477.39467 456.34451a6.877687 6.877687 0 0 0-0.381399-0.38265 351.110903 351.110903 0 0 0-26.286518-22.158656c-8.967253-6.832669-18.622274-13.656585-28.69621-20.282923a7.482923 7.482923 0 0 0-4.119109-1.235482 7.492927 7.492927 0 0 0-5.70848 2.629777c-10.691676 12.512388-24.399531 21.707229-40.742165 27.328175-12.763736 4.392966-27.505744 7.145291-43.98093 8.21821l-1.250488-12.504884s12.223525-2.716061 14.635717-6.42501c7.529191-11.582024 13.997968-23.200313 19.228761-34.53349a7.506682 7.506682 0 0 0-6.812661-10.647909h-34.588511l-1.250489-12.504885v-44.517389h60.523642a7.502931 7.502931 0 0 0 7.502931-7.502931l1.250489-7.477921a7.502931 7.502931 0 0 0-7.502931-7.502931h-18.707308a7.497929 7.497929 0 0 0-4.859398 1.786948c-5.009457 4.257913-11.163111 7.838062-18.290895 10.637905-4.515514 1.775694-15.110903 4.140367-15.110902 4.140368l-1.250489-12.504885s6.586323-16.74154 7.440407-25.597499c1.210473-12.609926 0.770301-38.391247 1.162954-52.065338h51.758968c-0.015006 0.277608-1.2805 8.055647-1.295506 8.328253-0.122548 2.267136 2.075811 9.507464 1.605627 11.632044-0.492692 2.220868-1.200469-7.959359 0.223838-6.186167a7.50043 7.50043 0 0 0 5.851035 2.806096h116.644314l1.250489 57.022275h-44.791247a7.502931 7.502931 0 0 0-7.50293 7.502931l-1.250489 7.477921a7.502931 7.502931 0 0 0 7.502931 7.502931h50.744822l1.250489 57.022274h-27.361939a7.504181 7.504181 0 0 0-2.418444 14.605705c7.824306 2.664791 24.619617 1.145447 24.619617 1.145448l1.250488 12.504884-30.288081 41.738805z m59.406956-15.572333l-1.293005-11.854631 0.042516-181.644705h56.848457l1.250488 131.701446a7.502931 7.502931 0 0 0 7.502931 7.502931h34.012036a7.502931 7.502931 0 0 0 7.502931-7.502931v-57.397421a7.502931 7.502931 0 0 0-7.502931-7.502931h-15.030872L618.693615 301.367722l0.190074-54.096132h79.379758l1.250488 193.500587H536.801626z" fill="#DD4F17" p-id="8389"></path><path d="M345.076733 620.017194v-163.563892h78.955842v63.499805c0 4.142868 3.361313 7.502931 7.502931 7.502931h134.077374v21.983587h-134.077374c-4.142868 0-7.502931 3.361313-7.502931 7.502931v13.180148c0 4.142868 3.361313 7.502931 7.502931 7.502931h158.161782a7.502931 7.502931 0 0 0 7.502931-7.502931v-63.349746c0-4.142868-3.361313-7.502931-7.502931-7.502931h-135.352872v-42.816725h221.386479v163.563892h-330.654162zM476.144181 443.839625a6.877687 6.877687 0 0 0-0.381399-0.38265 351.110903 351.110903 0 0 0-26.286518-22.158655c-8.967253-6.832669-18.622274-13.656585-28.696209-20.282923a7.482923 7.482923 0 0 0-4.119109-1.235483 7.492927 7.492927 0 0 0-5.70848 2.629777c-10.691676 12.512388-24.399531 21.707229-40.742165 27.328175-12.763736 4.392966-27.505744 7.145291-43.98093 8.218211a292.459242 292.459242 0 0 0 13.385228-18.929895c7.529191-11.582024 13.997968-23.200313 19.228762-34.53349a7.506682 7.506682 0 0 0-6.812661-10.647909h-34.588512v-44.517389h60.523642a7.502931 7.502931 0 0 0 7.502931-7.502931v-19.982806a7.502931 7.502931 0 0 0-7.502931-7.502931h-18.707307a7.497929 7.497929 0 0 0-4.859398 1.786948c-5.009457 4.257913-11.163111 7.838062-18.290895 10.637906-4.515514 1.775694-9.572489 3.159984-15.110903 4.140367 2.961157-13.381477 5.038218-26.158968 6.189918-38.102384 1.210473-12.609926 2.020789-25.886362 2.413443-39.560453h51.758968l-0.045017 0.825322a41.098554 41.098554 0 0 1-0.89535 6.63009 7.50043 7.50043 0 0 0 7.325361 9.124814h116.644314v44.51739h-44.791246a7.502931 7.502931 0 0 0-7.502931 7.502931v19.982806a7.502931 7.502931 0 0 0 7.502931 7.502931h50.744822v44.517389h-27.361938a7.504181 7.504181 0 0 0-2.418445 14.605705c9.88136 3.366315 18.554748 7.945604 25.870106 13.650333l-30.288082 41.738804z m59.406956-15.572333V247.27159h56.848457v119.196562a7.502931 7.502931 0 0 0 7.50293 7.50293h34.012036a7.502931 7.502931 0 0 0 7.502931-7.50293v-57.397421a7.502931 7.502931 0 0 0-7.502931-7.502931h-15.030871v-54.29621h79.379758v180.995702H535.551137z" fill="#FFFFFF" p-id="8390"></path></svg>'
    },
    state: {
      selected_reverse: {
        style: {
          fillOpacity: 0.2
        }
      }
    }
  },
  orderLabel: {
    visible: guiObject.orderLabelVisible,
    style: {
      fontSize: 20
    },
    formatMethod: text => {
      // console.log('ctx-order', ctx);
      return `order${text}`;
    },
    state: {
      selected_reverse: {
        style: {
          fillOpacity: 0.2
        }
      }
    }
  },
  nameLabel: {
    visible: true,
    style: {
      fontSize: 20
    },
    formatMethod: text => {
      // console.log('ctx-name', ctx);
      return `name${text}`;
    },
    state: {
      selected_reverse: {
        style: {
          fillOpacity: 0.2
        }
      }
    }
  },
  valueLabel: {
    visible: true,
    style: {
      fontSize: 20
    },
    formatMethod: text => {
      // console.log('ctx-value', ctx);
      return `value${text}`;
    },
    state: {
      selected_reverse: {
        style: {
          fillOpacity: 0.2
        }
      }
    }
  },
  decorateHaloIcons: [
    {
      visible: true,
      style: {
        symbolType: 'circle',
        size: 8,
        fill: 'rgba(255,255,255,0.5)'
      },
      state: {
        selected_reverse: {
          style: {
            fillOpacity: 0.2
          }
        }
      }
    },
    {
      visible: true,
      style: {
        symbolType: 'circle',
        size: 15,
        lineWidth: 1,
        stroke: 'rgba(255,255,255,0.8)',
        fill: 'rgba(255,255,255,0.5)'
      },
      state: {
        selected_reverse: {
          style: {
            fillOpacity: 0.2
          }
        }
      }
    }
  ],
  pageSize: guiObject.pageSize,
  scrollSize: guiObject.scrollSize,
  width: 800,
  height: 400,
  // animation: false,
  selected: false,
  barBackground: {
    visible: true,
    // width:
    style: {
      // fill: 'red',
      symbolType: 'rect'
    }
  },
  interactions: [
    {
      type: 'element-select',
      isMultiple: true,
      trigger: null,
      triggerOff: null
    }
  ],
  animationAppear: {
    enable: guiObject.animationAppearEnable,
    type: 'grow',
    duration: guiObject.animationAppearDuration,
    easing: guiObject.animationAppearEasing
  },
  animationUpdate: {
    enable: guiObject.animationUpdateEnable,
    type: 'grow',
    duration: guiObject.animationUpdateDuration,
    easing: guiObject.animationUpdateEasing
  },
  animationNormal: {
    enable: guiObject.animationUpdateEnable,
    interval: guiObject.animationNormalInterval,
    easing: guiObject.animationUpdateEasing
  },
  // animation: false,
  customTransformSpec: spec => {
    console.log('spec----', spec);
    spec.axes[0].paddingOuter = 0.7;
  }
};

const getPageCount = (arr, scrollSize, pageSize) => {
  let pageOrder = 0;
  for (let i = 0; i < arr.length; i += scrollSize) {
    pageOrder++;

    if (i + pageSize - 1 >= arr.length - 1) {
      break;
    }
  }
  return pageOrder;
};
console.log('spec', spec);

const run = () => {
  registerRankingList();
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderSync();

  const b = document.createElement('button');
  b.innerHTML = 'updateData';
  b.style.marginRight = '5px';
  b.style.marginTop = '5px';
  b.onclick = () => {
    cs.updateSpec({
      ...spec,
      data: [
        {
          y: '吉林xx',
          x: 60
        },
        {
          y: '内蒙古',
          x: 30
        },
        {
          y: '河北',
          x: 20 //
        },
        {
          y: '湖南', //
          x: 10
        },
        {
          y: '江西',
          x: 40
        },
        {
          y: '山西',
          x: 10
        },
        {
          y: '河南',
          x: 100
        },
        {
          y: '辽宁',
          x: 10
        },
        {
          y: '山东',
          x: 10
        },
        {
          y: '湖北',
          x: 10
        }
      ]
    });
  };
  document.getElementById('chart')?.appendChild(b);

  const pageCount = getPageCount(spec.data, guiObject.scrollSize, guiObject.pageSize);
  const totalDuration = (spec.animationNormal?.interval ?? 1000) + (spec.animationUpdate?.duaration ?? 1000) / 2;
  setInterval(() => {
    console.log('cs', pageCount);
    // cs.updateSpecSync(spec, false, { animation: false });
    cs.updateSpec(
      {
        ...spec,
        animationAppear: {
          enable: false
        }
      },
      false,
      { reuse: false, enableExitAnimation: false },
      { reMake: true, change: true }
    );
  }, pageCount * totalDuration);

  // gui
  // const gui = new GUI();
  // gui.add(guiObject, 'name');
  // gui.add(guiObject, 'labelLayout', ['top', 'bothEnd']).onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       labelLayout: value
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });
  // gui.add(guiObject, 'pageSize').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       pageSize: value
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });
  // gui.add(guiObject, 'scrollSize').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       scrollSize: value
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // gui.add(guiObject, 'animationAppearEnable').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationAppear: {
  //         ...spec.animationAppear,
  //         enable: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // gui.add(guiObject, 'animationAppearDuration').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationAppear: {
  //         ...spec.animationAppear,
  //         duration: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // gui.add(guiObject, 'animationAppearEasing', ['linear', 'quadIn', 'quadOut', 'quadInOut']).onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationAppear: {
  //         ...spec.animationAppear,
  //         easing: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // gui.add(guiObject, 'animationUpdateEnable').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationUpdate: {
  //         ...spec.animationUpdate,
  //         enable: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // gui.add(guiObject, 'animationUpdateDuration').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationUpdate: {
  //         ...spec.animationUpdate,
  //         duration: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // gui.add(guiObject, 'animationUpdateEasing', ['linear', 'quadIn', 'quadOut', 'quadInOut']).onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationUpdate: {
  //         ...spec.animationUpdate,
  //         easing: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // // gui.add(guiObject, 'animationNormalEnable').onChange(value => {
  // //   cs.updateSpec(
  // //     {
  // //       ...spec,
  // //       animationNormal: {
  // //         ...spec.animationNormal,
  // //         enable: value
  // //       }
  // //     },
  // //     false,
  // //     {
  // //       enableExitAnimation: false
  // //     }
  // //   );
  // // });

  // gui.add(guiObject, 'animationNormalInterval').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       animationNormal: {
  //         ...spec.animationNormal,
  //         interval: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  // // gui.add(guiObject, 'animationNormalEasing', ['linear', 'quadIn', 'quadOut', 'quadInOut']).onChange(value => {
  // //   cs.updateSpec(
  // //     {
  // //       ...spec,
  // //       animationNormal: {
  // //         ...spec.animationNormal,
  // //         easing: value
  // //       }
  // //     },
  // //     false,
  // //     {
  // //       enableExitAnimation: false
  // //     }
  // //   );
  // // });
  // gui.add(guiObject, 'rankingIconVisible').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       rankingIcon: {
  //         ...spec.rankingIcon,
  //         visible: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });
  // gui.add(guiObject, 'orderLabelVisible').onChange(value => {
  //   cs.updateSpec(
  //     {
  //       ...spec,
  //       orderLabel: {
  //         ...spec.orderLabel,
  //         visible: value
  //       }
  //     },
  //     false,
  //     {
  //       enableExitAnimation: false
  //     }
  //   );
  // });

  console.timeEnd('renderTime');
  window['vchart'] = cs;
  console.log(cs);
};
run();
