import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import {
  default as VChart,
  registerMediaQuery,
  registerAnimate,
  registerCustomAnimate,
  registerStateTransition,
  vglobal
} from '../../../../src/index';
import { AnimateExecutor, AStageAnimate } from '@visactor/vrender-animate';
registerAnimate();
registerCustomAnimate();
registerStateTransition();

class TestStageAnimate extends AStageAnimate<any> {
  // 原版代码
  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    const c = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const ctx = c.getContext('2d');
    if (!ctx) {
      return false;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, 0.2)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return c;
  }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

let dataArray = [
  { type: 'Nail polish', country: 'Africa', value: 4229 },
  { type: 'Nail polish', country: 'EU', value: 4376 },
  { type: 'Nail polish', country: 'China', value: 3054 },
  { type: 'Nail polish', country: 'USA', value: 12814 },
  { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
  { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
  { type: 'Eyebrow pencil', country: 'China', value: 5067 },
  { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
  { type: 'Rouge', country: 'Africa', value: 5221 },
  { type: 'Rouge', country: 'EU', value: 3574 },
  { type: 'Rouge', country: 'China', value: 7004 },
  { type: 'Rouge', country: 'USA', value: 11624 },
  { type: 'Lipstick', country: 'Africa', value: 9256 },
  { type: 'Lipstick', country: 'EU', value: 4376 },
  { type: 'Lipstick', country: 'China', value: 9054 },
  { type: 'Lipstick', country: 'USA', value: 8814 },
  { type: 'Eyeshadows', country: 'Africa', value: 3308 },
  { type: 'Eyeshadows', country: 'EU', value: 4572 },
  { type: 'Eyeshadows', country: 'China', value: 12043 },
  { type: 'Eyeshadows', country: 'USA', value: 12998 },
  { type: 'Eyeliner', country: 'Africa', value: 5432 },
  { type: 'Eyeliner', country: 'EU', value: 3417 },
  { type: 'Eyeliner', country: 'China', value: 15067 },
  { type: 'Eyeliner', country: 'USA', value: 12321 },
  { type: 'Foundation', country: 'Africa', value: 13701 },
  { type: 'Foundation', country: 'EU', value: 5231 },
  { type: 'Foundation', country: 'China', value: 10119 },
  { type: 'Foundation', country: 'USA', value: 10342 },
  { type: 'Lip gloss', country: 'Africa', value: 4008 },
  { type: 'Lip gloss', country: 'EU', value: 4572 },
  { type: 'Lip gloss', country: 'China', value: 12043 },
  { type: 'Lip gloss', country: 'USA', value: 22998 },
  { type: 'Mascara', country: 'Africa', value: 18712 },
  { type: 'Mascara', country: 'EU', value: 6134 },
  { type: 'Mascara', country: 'China', value: 10419 },
  { type: 'Mascara', country: 'USA', value: 11261 }
];

const direction: string = 'vertical';

let spec = {
  type: 'bar',
  data: {
    id: 'data0',
    values: dataArray
  },
  title: {
    visible: true,
    text: 'Stacked area chart of cosmetic products sales'
  },
  direction,
  useSequentialAnimation: true,
  // stack: true,
  xField: direction === 'horizontal' ? 'value' : 'type',
  yField: direction === 'horizontal' ? 'type' : 'value',
  seriesField: 'country',
  legends: [{ visible: true, position: 'middle' as const, orient: 'bottom' as const }],
  crosshair: {
    followTooltip: true,
    xField: { visible: true, label: { visible: true } },
    yField: { visible: true, label: { visible: true } }
  },
  // animationAppear: {
  //   duration: 300
  // },
  animationAppear: {
    stage: {
      type: 'stageTest',
      duration: 1000,
      easing: 'linear'
    }
  },
  animationUpdate: {
    duration: 300
  },
  animationEnter: {
    duration: 300
  },
  animationExit: {
    duration: 2000,
    type: 'fadeOut'
  },
  animationNormal: {
    point: [
      {
        loop: true,
        startTime: 100,
        oneByOne: 100,
        priority: 1,
        timeSlices: [
          {
            delay: 1000,
            effects: {
              channel: {
                fillOpacity: { to: 0.5 }
              },
              easing: 'linear'
            },
            duration: 500
          },
          {
            effects: {
              channel: {
                fillOpacity: { to: 1 }
              },
              easing: 'linear'
            },
            duration: 500
          }
        ]
      }
    ]
  },
  point: {
    state: {
      hover: {
        fill: 'red'
      }
    },
    style: {
      size: 80
    }
  }
};

const run = () => {
  registerMediaQuery();
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  const button = document.createElement('button');
  button.innerHTML = 'click';
  button.addEventListener('click', () => {
    dataArray = dataArray.map(d => ({ ...d, value: 100000 * Math.random() }));
    cs.updateData('data0', dataArray);
  });
  document.body.appendChild(button);

  const button2 = document.createElement('button');
  button2.innerHTML = 'add&remove';
  button2.addEventListener('click', () => {
    const name = Math.random().toString();
    dataArray = dataArray.map(d => ({
      ...d,
      value: 100000 * Math.random(),
      country: ['EU', 'China', 'USA'].includes(d.country) ? d.country : name
    }));
    cs.updateData('data0', dataArray);
  });
  document.body.appendChild(button2);

  function addData() {
    const name = Math.random().toString();
    const newData = dataArray
      .filter(d => d.country === 'EU')
      .map(d => ({
        ...d,
        value: 100000 * Math.random(),
        country: name
      }));

    dataArray = [...dataArray, ...newData];
  }

  function removeData() {
    dataArray = dataArray.filter(d => ['EU', 'China', 'USA'].includes(d.country));
  }

  const button3 = document.createElement('button');
  button3.innerHTML = 'stack<->group';
  button3.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    const fieldKey = direction === 'horizontal' ? 'yField' : 'xField';
    if (typeof nextSpec[fieldKey] === 'string') {
      (nextSpec as any)[fieldKey] = ['type', 'country'];
    } else {
      (nextSpec as any)[fieldKey] = 'type';
    }
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button3);

  const button4 = document.createElement('button');
  button4.innerHTML = 'stack<->group add';
  button4.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    const fieldKey = direction === 'horizontal' ? 'yField' : 'xField';
    if (typeof nextSpec[fieldKey] === 'string') {
      (nextSpec as any)[fieldKey] = ['type', 'country'];
    } else {
      (nextSpec as any)[fieldKey] = 'type';
    }
    addData();
    nextSpec.data = {
      id: 'data0',
      values: dataArray
    };
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button4);

  const button5 = document.createElement('button');
  button5.innerHTML = 'stack<->group remove';
  button5.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    const fieldKey = direction === 'horizontal' ? 'yField' : 'xField';
    if (typeof nextSpec[fieldKey] === 'string') {
      (nextSpec as any)[fieldKey] = ['type', 'country'];
    } else {
      (nextSpec as any)[fieldKey] = 'type';
    }
    removeData();
    nextSpec.data = {
      id: 'data0',
      values: dataArray
    };
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button5);

  const button6 = document.createElement('button');
  button6.innerHTML = 'direction';
  button6.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    nextSpec.direction = nextSpec.direction === 'horizontal' ? 'vertical' : 'horizontal';
    [nextSpec.xField, nextSpec.yField] = [nextSpec.yField, nextSpec.xField];
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button6);

  // 添加退场动画按钮
  const button7 = document.createElement('button');
  button7.innerHTML = '触发退场动画';
  button7.addEventListener('click', () => {
    console.log('触发退场动画...');

    // 方法1: 通过移除数据来触发退场动画
    // 先保存原始数据
    const originalData = [...dataArray];

    // 清空数据，这会触发所有元素的退场动画
    cs.updateData('data0', []);

    // 3秒后恢复数据，重新显示图表
    setTimeout(() => {
      console.log('恢复数据，重新显示图表...');
      cs.updateData('data0', originalData);
    }, 3000);
  });
  document.body.appendChild(button7);

  // 添加第三种退场动画按钮 - 通过更新spec来触发
  const button9 = document.createElement('button');
  button9.innerHTML = 'Spec退场动画';
  button9.addEventListener('click', () => {
    console.log('通过更新spec触发退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建一个空的spec来触发退场动画
    const emptySpec = {
      ...spec,
      data: {
        id: 'data0',
        values: [] // 空数据
      }
    };

    // 更新spec，这会触发退场动画
    cs.updateSpec(emptySpec as any);

    // 3秒后恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3000);
  });
  document.body.appendChild(button9);

  // 添加自定义退场动画按钮
  const button10 = document.createElement('button');
  button10.innerHTML = '自定义退场动画';
  button10.addEventListener('click', () => {
    console.log('触发自定义退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建带有自定义退场动画的spec
    const customExitSpec = {
      ...spec,
      animationExit: {
        duration: 1000, // 1秒退场动画
        type: 'fadeOut', // 淡出效果
        easing: 'easeInOut' // 缓动函数
      },
      data: {
        id: 'data0',
        values: [] // 空数据触发退场
      }
    };

    // 更新spec，触发自定义退场动画
    cs.updateSpec(customExitSpec as any);

    // 2秒后恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 2000);
  });
  document.body.appendChild(button10);

  window['vchart'] = cs;
  console.log(cs);
};
run();
