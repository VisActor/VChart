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

// 模糊效果配置接口
interface BlurConfig {
  blurRadius: number;
  useOptimizedBlur: boolean;
}

class TestStageAnimate extends AStageAnimate<any> {
  // 模糊配置
  private blurConfig: BlurConfig;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化模糊配置，使用传入的参数或默认值
    this.blurConfig = {
      blurRadius: params?.options?.blurRadius || 8,
      useOptimizedBlur: params?.options?.useOptimizedBlur !== undefined ? params.options.useOptimizedBlur : true
    };
  }
  // 使用CSS滤镜（性能最好）
  private applyCSSBlur(canvas: HTMLCanvasElement, radius: number): HTMLCanvasElement {
    const c = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const ctx = c.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    // 使用CSS滤镜进行模糊
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    return c;
  }

  // 降采样模糊（减少计算量）
  private applyDownsampleBlur(imageData: ImageData, radius: number): ImageData {
    const { width, height } = imageData;

    // 降采样因子，减少计算量
    const downsample = Math.max(1, Math.floor(radius / 2));
    const smallWidth = Math.floor(width / downsample);
    const smallHeight = Math.floor(height / downsample);

    // 创建小尺寸的临时canvas
    const tempCanvas = vglobal.createCanvas({
      width: smallWidth,
      height: smallHeight,
      dpr: 1
    });
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      return imageData;
    }

    // 将图像绘制到小canvas上
    const originalCanvas = vglobal.createCanvas({
      width: width,
      height: height,
      dpr: 1
    });
    const originalCtx = originalCanvas.getContext('2d');
    if (!originalCtx) {
      return imageData;
    }

    originalCtx.putImageData(imageData, 0, 0);

    // 缩小绘制（自动插值）
    tempCtx.drawImage(originalCanvas, 0, 0, smallWidth, smallHeight);

    // 应用模糊到小图像
    tempCtx.filter = `blur(${radius / downsample}px)`;
    tempCtx.drawImage(tempCanvas, 0, 0);
    tempCtx.filter = 'none';

    // 放大回原尺寸
    originalCtx.clearRect(0, 0, width, height);
    originalCtx.drawImage(tempCanvas, 0, 0, width, height);

    return originalCtx.getImageData(0, 0, width, height);
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    console.time('BlurEffect'); // 性能测试

    // 如果模糊强度为0，直接返回原图
    if (this.blurConfig.blurRadius <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    if (this.blurConfig.useOptimizedBlur) {
      // 使用CSS滤镜（性能最好）
      result = this.applyCSSBlur(canvas, this.blurConfig.blurRadius);
    } else {
      // 使用传统的像素级模糊
      const c = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });
      const ctx = c.getContext('2d');
      if (!ctx) {
        return false;
      }

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制原始图像
      ctx.drawImage(canvas, 0, 0);

      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 高质量模式下统一使用降采样模糊
      console.log('使用降采样模糊');
      const blurredImageData = this.applyDownsampleBlur(imageData, this.blurConfig.blurRadius);

      // 将模糊后的图像数据绘制到画布上
      ctx.putImageData(blurredImageData, 0, 0);

      result = c;
    }

    // 添加一个半透明的覆盖层来增强效果
    const ctx = result.getContext('2d');
    if (ctx) {
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, result.width, result.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    console.timeEnd('BlurEffect'); // 输出性能数据
    return result;
  }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

// 用于演示UI控制的全局变量（不影响类内部实现）
let currentBlurRadius = 8;
let currentUseOptimizedBlur = true;

/*
使用示例：
1. 通过spec配置：
animationAppear: {
  stage: {
    type: 'stageTest',
    duration: 3000,
    easing: 'linear',
    options: {
      blurRadius: 8,        // 模糊强度 (1-20)
      useOptimizedBlur: true // true: CSS滤镜（高性能）, false: 像素级算法（高质量）
    }
  }
}

2. 参数说明：
- blurRadius: 模糊强度 (1-20)
- useOptimizedBlur: 是否使用优化版本 (true: CSS滤镜, false: 像素级算法)

3. 技术特点：
- 高性能模式：使用CSS滤镜，GPU加速，流畅但效果略简单
- 高质量模式：使用像素级降采样算法，效果更好但可能卡顿
*/

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
      easing: 'linear',
      options: {
        blurRadius: 10,
        useOptimizedBlur: true
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
    duration: 3000,
    type: 'update'
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
  button5.innerHTML = 'direction';
  button5.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    nextSpec.direction = nextSpec.direction === 'horizontal' ? 'vertical' : 'horizontal';
    [nextSpec.xField, nextSpec.yField] = [nextSpec.yField, nextSpec.xField];
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button5);

  // // 添加退场动画按钮
  // const button6 = document.createElement('button');
  // button6.innerHTML = '触发退场动画';
  // button6.addEventListener('click', () => {
  //   console.log('触发退场动画...');

  //   const originalData = [...dataArray];

  //   cs.updateData('data0', []);

  //   // 恢复数据，重新显示图表
  //   setTimeout(() => {
  //     console.log('恢复数据，重新显示图表...');
  //     cs.updateData('data0', originalData);
  //   }, 3500);
  // });
  // document.body.appendChild(button6);

  const button7 = document.createElement('button');
  button7.innerHTML = 'Spec退场动画';
  button7.addEventListener('click', () => {
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
  document.body.appendChild(button7);

  // 添加自定义退场动画按钮
  const button8 = document.createElement('button');
  button8.innerHTML = '自定义退场动画';
  button8.addEventListener('click', () => {
    console.log('触发自定义退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建带有自定义退场动画的spec
    const customExitSpec = {
      ...spec,
      animationExit: {
        duration: 3000, // 退场动画
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

    // 恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3500);
  });
  document.body.appendChild(button8);

  // 添加高斯模糊控制按钮
  const button9 = document.createElement('button');
  button9.innerHTML = '调整模糊强度';
  button9.addEventListener('click', () => {
    console.log('调整高斯模糊强度...');

    // 随机调整模糊强度
    const newRadius = Math.floor(Math.random() * 15) + 3; // 3-17之间
    currentBlurRadius = newRadius;
    console.log(`设置模糊强度为: ${newRadius}`);

    // 更新spec并重新应用动画
    const newSpec = {
      ...spec,
      animationAppear: {
        stage: {
          type: 'stageTest',
          duration: 3000,
          easing: 'linear',
          options: {
            blurRadius: newRadius,
            useOptimizedBlur: currentUseOptimizedBlur
          }
        }
      }
    };
    cs.updateSpec(newSpec as any);
  });
  document.body.appendChild(button9);

  // 添加模糊强度滑块控制
  const blurSlider = document.createElement('input');
  blurSlider.type = 'range';
  blurSlider.min = '1';
  blurSlider.max = '20';
  blurSlider.value = '8';
  blurSlider.style.width = '200px';
  blurSlider.style.margin = '10px';

  const blurLabel = document.createElement('label');
  blurLabel.innerHTML = '模糊强度: 8';
  blurLabel.style.marginRight = '10px';

  blurSlider.addEventListener('input', e => {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    blurLabel.innerHTML = `模糊强度: ${value}`;

    // 直接修改全局变量
    currentBlurRadius = value;
    console.log(`设置模糊强度为: ${value}`);

    // 更新spec并重新应用动画
    const newSpec = {
      ...spec,
      animationAppear: {
        stage: {
          type: 'stageTest',
          duration: 3000,
          easing: 'linear',
          options: {
            blurRadius: value,
            useOptimizedBlur: currentUseOptimizedBlur
          }
        }
      }
    };
    cs.updateSpec(newSpec as any);
  });

  // 创建控制容器
  const blurControl = document.createElement('div');
  blurControl.style.margin = '10px';
  blurControl.appendChild(blurLabel);
  blurControl.appendChild(blurSlider);
  document.body.appendChild(blurControl);

  // 添加性能模式切换按钮
  const performanceButton = document.createElement('button');
  performanceButton.innerHTML = currentUseOptimizedBlur ? '当前：高性能模式' : '当前：高质量模式';
  performanceButton.style.backgroundColor = currentUseOptimizedBlur ? '#4CAF50' : '#FF9800';
  performanceButton.style.color = 'white';
  performanceButton.style.margin = '10px';
  performanceButton.style.padding = '10px';
  performanceButton.addEventListener('click', () => {
    currentUseOptimizedBlur = !currentUseOptimizedBlur;
    performanceButton.innerHTML = currentUseOptimizedBlur ? '当前：高性能模式' : '当前：高质量模式';
    performanceButton.style.backgroundColor = currentUseOptimizedBlur ? '#4CAF50' : '#FF9800';

    console.log(`切换到${currentUseOptimizedBlur ? '高性能' : '高质量'}模式`);

    // 更新spec并重新应用动画
    const newSpec = {
      ...spec,
      animationAppear: {
        stage: {
          type: 'stageTest',
          duration: 3000,
          easing: 'linear',
          options: {
            blurRadius: currentBlurRadius,
            useOptimizedBlur: currentUseOptimizedBlur
          }
        }
      }
    };
    cs.updateSpec(newSpec as any);
  });
  document.body.appendChild(performanceButton);

  // 添加性能信息显示
  const performanceInfo = document.createElement('div');
  performanceInfo.style.margin = '10px';
  performanceInfo.style.padding = '10px';
  performanceInfo.style.backgroundColor = '#f0f0f0';
  performanceInfo.style.borderRadius = '5px';
  performanceInfo.innerHTML = `
    <h4>性能优化说明：</h4>
    <ul>
      <li><strong>高性能模式</strong>：使用CSS滤镜，GPU加速，流畅但效果略简单</li>
      <li><strong>高质量模式</strong>：使用像素级算法，效果更好但可能卡顿</li>
      <li>查看控制台可以看到每次模糊的耗时</li>
    </ul>
  `;
  document.body.appendChild(performanceInfo);

  window['vchart'] = cs;
  console.log(cs);
};
run();
