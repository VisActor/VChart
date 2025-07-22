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

// 全局变量控制模糊强度
let globalBlurRadius = 8;
let useOptimizedBlur = true; // 是否使用优化版本

class TestStageAnimate extends AStageAnimate<any> {
  // 优化版本1: 使用CSS滤镜（性能最好）TOP1
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

  // 优化版本2: 降采样模糊（减少计算量） TOP2
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

  // 优化版本3: 简化的高斯模糊（减少计算精度） TOP3
  private applyFastGaussianBlur(imageData: ImageData, radius: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data);

    // 使用简化的权重，避免复杂的高斯计算
    const passes = Math.min(3, Math.ceil(radius / 2)); // 限制通道数

    for (let pass = 0; pass < passes; pass++) {
      // 简单的均值模糊，多次通过近似高斯效果
      this.applyBoxBlur(result, width, height, Math.ceil(radius / passes));
    }

    return new ImageData(result, width, height);
  }

  // 盒状模糊（性能更好的近似）
  private applyBoxBlur(data: Uint8ClampedArray, width: number, height: number, radius: number): void {
    const tempData = new Uint8ClampedArray(data);

    // 水平模糊
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;

        const minX = Math.max(0, x - radius);
        const maxX = Math.min(width - 1, x + radius);

        for (let sx = minX; sx <= maxX; sx++) {
          const index = (y * width + sx) * 4;
          r += tempData[index];
          g += tempData[index + 1];
          b += tempData[index + 2];
          a += tempData[index + 3];
          count++;
        }

        const resultIndex = (y * width + x) * 4;
        data[resultIndex] = r / count;
        data[resultIndex + 1] = g / count;
        data[resultIndex + 2] = b / count;
        data[resultIndex + 3] = a / count;
      }
    }

    // 垂直模糊
    const tempData2 = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;

        const minY = Math.max(0, y - radius);
        const maxY = Math.min(height - 1, y + radius);

        for (let sy = minY; sy <= maxY; sy++) {
          const index = (sy * width + x) * 4;
          r += tempData2[index];
          g += tempData2[index + 1];
          b += tempData2[index + 2];
          a += tempData2[index + 3];
          count++;
        }

        const resultIndex = (y * width + x) * 4;
        data[resultIndex] = r / count;
        data[resultIndex + 1] = g / count;
        data[resultIndex + 2] = b / count;
        data[resultIndex + 3] = a / count;
      }
    }
  }

  // 原始的高斯模糊算法（保留作为对比） TOP4
  private applyGaussianBlur(imageData: ImageData, radius: number = 5): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data);

    // 计算高斯核
    const kernel = this.createGaussianKernel(radius);
    const kernelSize = kernel.length;
    const halfKernel = Math.floor(kernelSize / 2);

    // 水平方向模糊
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let weightSum = 0;

        for (let i = 0; i < kernelSize; i++) {
          const sampleX = Math.min(Math.max(x + i - halfKernel, 0), width - 1);
          const index = (y * width + sampleX) * 4;
          const weight = kernel[i];

          r += data[index] * weight;
          g += data[index + 1] * weight;
          b += data[index + 2] * weight;
          a += data[index + 3] * weight;
          weightSum += weight;
        }

        const resultIndex = (y * width + x) * 4;
        result[resultIndex] = r / weightSum;
        result[resultIndex + 1] = g / weightSum;
        result[resultIndex + 2] = b / weightSum;
        result[resultIndex + 3] = a / weightSum;
      }
    }

    // 垂直方向模糊
    const tempData = new Uint8ClampedArray(result);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let weightSum = 0;

        for (let i = 0; i < kernelSize; i++) {
          const sampleY = Math.min(Math.max(y + i - halfKernel, 0), height - 1);
          const index = (sampleY * width + x) * 4;
          const weight = kernel[i];

          r += tempData[index] * weight;
          g += tempData[index + 1] * weight;
          b += tempData[index + 2] * weight;
          a += tempData[index + 3] * weight;
          weightSum += weight;
        }

        const resultIndex = (y * width + x) * 4;
        result[resultIndex] = r / weightSum;
        result[resultIndex + 1] = g / weightSum;
        result[resultIndex + 2] = b / weightSum;
        result[resultIndex + 3] = a / weightSum;
      }
    }

    return new ImageData(result, width, height);
  }

  // 创建高斯核
  private createGaussianKernel(radius: number): number[] {
    const size = radius * 2 + 1;
    const kernel = new Array(size);
    const sigma = radius / 3;
    let sum = 0;

    for (let i = 0; i < size; i++) {
      const x = i - radius;
      kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
      sum += kernel[i];
    }

    // 归一化
    for (let i = 0; i < size; i++) {
      kernel[i] /= sum;
    }

    return kernel;
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    console.time('BlurEffect'); // 性能测试

    // 如果模糊强度为0，直接返回原图
    if (globalBlurRadius <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    if (useOptimizedBlur) {
      // 使用CSS滤镜（性能最好）
      result = this.applyCSSBlur(canvas, globalBlurRadius);
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

      // 根据模糊强度选择不同的算法
      let blurredImageData: ImageData;
      if (globalBlurRadius <= 5) {
        // 小半径使用快速高斯模糊
        console.log('使用快速高斯模糊');
        blurredImageData = this.applyFastGaussianBlur(imageData, globalBlurRadius);
      } else if (globalBlurRadius <= 10) {
        // 中等半径使用降采样模糊
        console.log('使用降采样模糊');
        blurredImageData = this.applyDownsampleBlur(imageData, globalBlurRadius);
      } else {
        // 大半径使用原始高斯模糊
        console.log('使用原始高斯模糊');
        blurredImageData = this.applyGaussianBlur(imageData, globalBlurRadius);
      }

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

  原版代码;
  // protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
  //   const c = vglobal.createCanvas({
  //     width: canvas.width,
  //     height: canvas.height,
  //     dpr: vglobal.devicePixelRatio
  //   });
  //   const ctx = c.getContext('2d');
  //   if (!ctx) {
  //     return false;
  //   }
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.drawImage(canvas, 0, 0);
  //   ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
  //     Math.random() * 255
  //   )}, 0.2)`;
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   return c;
  // }
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

  // 添加高斯模糊控制按钮
  const button11 = document.createElement('button');
  button11.innerHTML = '调整模糊强度';
  button11.addEventListener('click', () => {
    console.log('调整高斯模糊强度...');

    // 随机调整模糊强度
    const newRadius = Math.floor(Math.random() * 15) + 3; // 3-17之间
    globalBlurRadius = newRadius;
    console.log(`设置模糊强度为: ${newRadius}`);

    // 触发图表重新渲染以应用新的模糊效果
    cs.renderAsync();
  });
  document.body.appendChild(button11);

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
    globalBlurRadius = value;
    console.log(`设置模糊强度为: ${value}`);

    // 触发图表重新渲染
    cs.renderAsync();
  });

  // 创建控制容器
  const blurControl = document.createElement('div');
  blurControl.style.margin = '10px';
  blurControl.appendChild(blurLabel);
  blurControl.appendChild(blurSlider);
  document.body.appendChild(blurControl);

  // 添加性能模式切换按钮
  const performanceButton = document.createElement('button');
  performanceButton.innerHTML = useOptimizedBlur ? '当前：高性能模式' : '当前：高质量模式';
  performanceButton.style.backgroundColor = useOptimizedBlur ? '#4CAF50' : '#FF9800';
  performanceButton.style.color = 'white';
  performanceButton.style.margin = '10px';
  performanceButton.style.padding = '10px';
  performanceButton.addEventListener('click', () => {
    useOptimizedBlur = !useOptimizedBlur;
    performanceButton.innerHTML = useOptimizedBlur ? '当前：高性能模式' : '当前：高质量模式';
    performanceButton.style.backgroundColor = useOptimizedBlur ? '#4CAF50' : '#FF9800';

    console.log(`切换到${useOptimizedBlur ? '高性能' : '高质量'}模式`);

    // 重新渲染图表以应用新的模糊模式
    cs.renderAsync();
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
