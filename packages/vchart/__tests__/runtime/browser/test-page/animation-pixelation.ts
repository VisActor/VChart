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
import { EasingType } from '@visactor/vrender-core';
registerAnimate();
registerCustomAnimate();
registerStateTransition();

// 像素化效果配置接口
interface PixelationConfig {
  maxPixelSize?: number; // 最大像素化强度
  method?: 'out' | 'in'; // 像素化方法：out为增强效果，in为减弱效果
}

/**
 * 像素化退场动画效果实现 - 参考particle-disintegration配置方式
 *
 * 技术方案：
 * Canvas 2D 降采样像素化
 *    - 将图像绘制到小尺寸离屏Canvas
 *    - 关闭imageSmoothingEnabled获得清晰块状效果
 *    - 放大绘制回主Canvas
 *
 * 动画进度管理（参考particle-disintegration）：
 * - 动画框架自动处理时间管理和缓动函数
 * - constructor接收duration和easing参数
 * - onUpdate方法接收已处理的ratio值（0-1，已应用easing）
 * - 直接使用ratio计算像素化强度，无需额外的缓动计算
 * - method为'out'时：像素化强度从1逐渐增加到配置的最大值（退场效果）
 * - method为'in'时：像素化强度从配置的最大值逐渐减小到1（入场效果）
 *
 * 配置方式（通过params.options）：
 * animationAppear: {
 *   stage: {
 *     type: 'stageTest',
 *     duration: 3000,
 *     easing: 'easeInQuad',
 *     options: {
 *       maxPixelSize: 25,        // 最大像素化强度
 *       method: 'out'            // 动画方向：'out'为退场效果，'in'为入场效果
 *     }
 *   }
 * }
 */

class TestStageAnimate extends AStageAnimate<any> {
  private currentAnimationRatio: number = 0;
  private pixelationConfig: Required<PixelationConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化像素化配置，使用传入的参数或默认值
    this.pixelationConfig = {
      maxPixelSize: params?.options?.maxPixelSize || 20,
      method: params?.options?.method || 'out'
    };
  }

  onUpdate(end: boolean, ratio: number, out: any): void {
    super.onUpdate(end, ratio, out);
    this.currentAnimationRatio = ratio; // ratio已经经过easing函数处理
  }

  // Canvas 2D 降采样像素化
  private applyDownsamplePixelation(canvas: HTMLCanvasElement, pixelSize: number): HTMLCanvasElement {
    if (pixelSize <= 1) {
      return canvas;
    }

    const { width, height } = canvas;

    // 创建小尺寸的离屏Canvas
    const smallWidth = Math.ceil(width / pixelSize);
    const smallHeight = Math.ceil(height / pixelSize);

    const smallCanvas = vglobal.createCanvas({
      width: smallWidth,
      height: smallHeight,
      dpr: 1
    });
    const smallCtx = smallCanvas.getContext('2d');
    if (!smallCtx) {
      return canvas;
    }

    // 创建输出Canvas
    const outputCanvas = vglobal.createCanvas({
      width: width,
      height: height,
      dpr: vglobal.devicePixelRatio
    });
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      return canvas;
    }

    // 关闭图像平滑以获得清晰的像素块效果
    smallCtx.imageSmoothingEnabled = false;
    outputCtx.imageSmoothingEnabled = false;

    // 将原图绘制到小Canvas上（自动降采样）
    smallCtx.drawImage(canvas, 0, 0, smallWidth, smallHeight);

    // 将小图放大绘制到输出Canvas上
    outputCtx.drawImage(smallCanvas, 0, 0, width, height);

    return outputCanvas;
  }

  // 更新动画进度，直接使用框架提供的ratio
  private updateAnimationProgress(): number {
    // 直接根据动画进度计算像素化强度
    // ratio已经经过easing函数处理，无需额外的缓动计算

    if (this.pixelationConfig.method === 'in') {
      // 入场效果：从最大值逐渐减小到1
      const currentPixelSize =
        this.pixelationConfig.maxPixelSize - this.currentAnimationRatio * (this.pixelationConfig.maxPixelSize - 1);
      return currentPixelSize;
    } else {
      // 退场效果：从1逐渐增加到最大值（默认行为）
      const currentPixelSize = 1 + this.currentAnimationRatio * (this.pixelationConfig.maxPixelSize - 1);
      return currentPixelSize;
    }
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    // 更新动画进度并获取当前像素化强度
    const currentPixelSize = this.updateAnimationProgress();

    // 如果像素化强度为1或更小，直接返回原图
    if (currentPixelSize <= 1) {
      return canvas;
    }

    // 直接使用降采样像素化方法
    const result: HTMLCanvasElement = this.applyDownsamplePixelation(canvas, currentPixelSize);
    return result;
  }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

// 全局动画实例引用，用于控制面板
const currentPixelationAnimate: TestStageAnimate | null = null;

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
  animationAppear: {
    stage: {
      type: 'stageTest',
      duration: 2000,
      easing: 'linear',
      options: {
        maxPixelSize: 20,
        method: 'out' // 'out'为退场效果(1->max)，'in'为入场效果(max->1)
      }
    }
  },
  animationUpdate: {
    duration: 1000
  },
  animationEnter: {
    duration: 300
  },
  animationExit: {
    duration: 2000,
    type: 'update'
  },
  // animationDisappear:{
  //   stage: {
  //     type: 'stageTest',
  //     duration: 1000,
  //   }
  // },
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

  // 添加退场动画按钮 - 通过更新spec来触发
  const button8 = document.createElement('button');
  button8.innerHTML = 'Spec退场动画';
  button8.addEventListener('click', () => {
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

    // 恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3500);
  });
  document.body.appendChild(button8);

  // 添加自定义退场动画按钮
  const button9 = document.createElement('button');
  button9.innerHTML = '自定义退场动画';
  button9.addEventListener('click', () => {
    console.log('触发自定义退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建带有自定义退场动画的spec
    const customExitSpec = {
      ...spec,
      animationExit: {
        type: 'fadeOut',
        duration: 3000 // 自定义退场动画持续时间
      },
      data: {
        id: 'data0',
        values: [] // 空数据触发退场
      }
    };

    // 更新spec，触发自定义退场动画
    cs.updateSpec(customExitSpec as any);

    // 恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3500);
  });
  document.body.appendChild(button9);

  window['vchart'] = cs;
  console.log(cs);
};
run();
