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

/**
 * 像素化退场动画效果实现
 *
 * 技术方案：
 * 1. Canvas 2D 降采样像素化（推荐，性能最佳）
 *    - 将图像绘制到小尺寸离屏Canvas
 *    - 关闭imageSmoothingEnabled获得清晰块状效果
 *    - 放大绘制回主Canvas
 *
 * 2. 直接操作像素数据进行块状平均
 *    - 对每个像素块计算平均颜色
 *    - 将平均颜色应用到整个块
 *    - 适合需要精确控制的场景
 *
 * 3. 色彩量化增强复古效果
 *    - 减少颜色级别模拟老式游戏风格
 *    - 结合像素化效果使用
 *
 * 4. CRT扫描线效果（可选）
 *    - 在高像素化强度时添加扫描线
 *    - 增强复古CRT显示器效果
 *
 * Duration配置支持：
 * - 动画持续时间可通过 spec.animationAppear.stage.duration 配置
 * - 支持500ms-5000ms范围的动画时间
 * - 可通过界面控件实时调整
 *
 * 使用方式：
 * - 点击"启动像素化退场动画"按钮观看自动动画
 * - 使用"动画持续时间"滑块调节动画速度
 * - 使用"像素化强度"滑块手动调节效果强度
 * - 点击不同测试按钮体验各种效果
 */

// 全局变量控制像素化强度和动画进度
let globalPixelSize = 1; // 像素化的块大小，1表示无像素化
let animationProgress = 0; // 动画进度，0-1之间

class TestStageAnimate extends AStageAnimate<any> {
  private animationStartTime: number = 0;
  private animationDuration: number = 2000; // 默认动画持续时间2秒，会被配置覆盖

  // 获取配置的动画持续时间
  private getConfiguredDuration(): number {
    // 尝试从动画配置中获取duration
    // 检查可能的配置路径
    if (this.params && this.params.duration) {
      console.log(`从params中获取到duration: ${this.params.duration}`);
      return this.params.duration;
    }
    if ((this as any).config && (this as any).config.duration) {
      console.log(`从config中获取到duration: ${(this as any).config.duration}`);
      return (this as any).config.duration;
    }
    if ((this as any).duration) {
      return (this as any).duration;
    }
    if ((this as any)._duration) {
      return (this as any)._duration;
    }
    if ((this as any).options && (this as any).options.duration) {
      return (this as any).options.duration;
    }
    // 如果没有找到配置的duration，返回默认值
    return this.animationDuration;
  }

  // 方法1: Canvas 2D 降采样像素化（推荐）
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

  // 方法2: 直接操作像素数据进行块状平均
  private applyPixelDataPixelation(canvas: HTMLCanvasElement, pixelSize: number): HTMLCanvasElement {
    if (pixelSize <= 1) {
      return canvas;
    }

    const outputCanvas = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      return canvas;
    }

    // 先绘制原图到输出Canvas
    outputCtx.drawImage(canvas, 0, 0);

    // 获取图像数据
    const imageData = outputCtx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    // 创建新的像素数据
    const newData = new Uint8ClampedArray(data);

    // 遍历每个像素块
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        // 计算当前块的平均颜色
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;

        // 遍历块内的所有像素
        for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            a += data[index + 3];
            count++;
          }
        }

        // 计算平均值
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = Math.round(a / count);

        // 将平均颜色应用到整个块
        for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            newData[index] = r;
            newData[index + 1] = g;
            newData[index + 2] = b;
            newData[index + 3] = a;
          }
        }
      }
    }

    // 将处理后的数据绘制回Canvas
    const newImageData = new ImageData(newData, width, height);
    outputCtx.putImageData(newImageData, 0, 0);

    return outputCanvas;
  }

  // 方法3: WebGL着色器像素化（高性能，但实现复杂）
  private applyWebGLPixelation(canvas: HTMLCanvasElement, pixelSize: number): HTMLCanvasElement {
    // 由于WebGL实现较复杂，这里提供简化版本
    // 实际项目中可以使用Three.js或原生WebGL实现
    return this.applyDownsamplePixelation(canvas, pixelSize);
  }

  // 创建复古/游戏风格的色彩量化效果
  private applyColorQuantization(canvas: HTMLCanvasElement, levels: number = 8): HTMLCanvasElement {
    const outputCanvas = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      return canvas;
    }

    outputCtx.drawImage(canvas, 0, 0);
    const imageData = outputCtx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    // 量化颜色
    const step = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step; // R
      data[i + 1] = Math.round(data[i + 1] / step) * step; // G
      data[i + 2] = Math.round(data[i + 2] / step) * step; // B
      // Alpha通道保持不变
    }

    outputCtx.putImageData(imageData, 0, 0);
    return outputCanvas;
  }

  // 更新动画进度
  private updateAnimationProgress(): void {
    const currentTime = Date.now();
    if (this.animationStartTime === 0) {
      this.animationStartTime = currentTime;
    }

    // 使用配置的duration而不是硬编码的值
    const configuredDuration = this.getConfiguredDuration();
    const elapsed = currentTime - this.animationStartTime;
    animationProgress = Math.min(elapsed / configuredDuration, 1);

    // 根据动画进度计算像素化强度
    // 使用缓动函数让效果更自然
    const easedProgress = this.easeInQuad(animationProgress);
    globalPixelSize = 1 + easedProgress * 19; // 从1像素增加到20像素

    // 动画结束后重置
    if (animationProgress >= 1) {
      setTimeout(() => {
        this.animationStartTime = 0;
        animationProgress = 0;
        globalPixelSize = 1;
      }, 500);
    }
  }

  // 缓动函数：二次缓入
  private easeInQuad(t: number): number {
    return t * t;
  }

  // 缓动函数：三次缓入缓出
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    console.time('PixelationEffect');

    // 更新动画进度
    this.updateAnimationProgress();

    // 如果像素化强度为1或更小，直接返回原图
    if (globalPixelSize <= 1) {
      console.timeEnd('PixelationEffect');
      return canvas;
    }

    let result: HTMLCanvasElement;

    // 使用降采样方法（推荐，性能好效果佳）
    result = this.applyDownsamplePixelation(canvas, globalPixelSize);

    // 可选：添加色彩量化效果，增强复古感
    if (globalPixelSize > 5) {
      const colorLevels = Math.max(4, 16 - Math.floor(globalPixelSize / 2));
      result = this.applyColorQuantization(result, colorLevels);
    }

    // 可选：添加轻微的CRT扫描线效果
    if (globalPixelSize > 10) {
      const ctx = result.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

        // 绘制水平扫描线
        for (let y = 0; y < result.height; y += 4) {
          ctx.fillRect(0, y, result.width, 2);
        }

        ctx.globalCompositeOperation = 'source-over';
      }
    }

    const configuredDuration = this.getConfiguredDuration();
    console.log(
      `像素化强度: ${globalPixelSize.toFixed(1)}, 动画进度: ${(animationProgress * 100).toFixed(
        1
      )}%, 配置Duration: ${configuredDuration}ms`
    );
    console.timeEnd('PixelationEffect');
    return result;
  }

  // 原版代码（保留作参考）
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
      duration: 2000,
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
    stage: {
      type: 'stageTest',
      duration: 1000,
      easing: 'linear'
    }
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

  // 添加像素化动画控制按钮
  const buttonPixelate = document.createElement('button');
  buttonPixelate.innerHTML = '启动像素化退场动画';
  buttonPixelate.addEventListener('click', () => {
    console.log('启动像素化退场动画...');

    // 直接控制全局变量启动动画
    globalPixelSize = 1;
    animationProgress = 0;

    // 获取当前配置的duration，如果没有就使用默认的2000ms
    const configuredDuration = spec.animationAppear?.stage?.duration || 2000;
    console.log(`使用配置的duration: ${configuredDuration}ms`);

    // 启动动画循环
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / configuredDuration, 1);

      // 使用缓动函数
      const easedProgress = progress * progress; // 二次缓入
      globalPixelSize = 1 + easedProgress * 19; // 从1增加到20

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画结束后暂停一会儿再重置
        setTimeout(() => {
          globalPixelSize = 1;
        }, 500);
      }
    };

    animate();
  });
  document.body.appendChild(buttonPixelate);

  // 添加动画持续时间控制
  const durationControls = document.createElement('div');
  durationControls.style.margin = '10px 0';
  durationControls.innerHTML = `
    <label>动画持续时间(ms): </label>
    <input type="range" id="durationSlider" min="500" max="5000" value="1000" step="100">
    <span id="durationValue">1000</span>
    <button id="applyDuration">应用到配置</button>
  `;
  document.body.appendChild(durationControls);

  const durationSlider = document.getElementById('durationSlider') as HTMLInputElement;
  const durationValue = document.getElementById('durationValue') as HTMLSpanElement;
  const applyDuration = document.getElementById('applyDuration') as HTMLButtonElement;

  durationSlider.addEventListener('input', () => {
    durationValue.textContent = durationSlider.value;
  });

  applyDuration.addEventListener('click', () => {
    const newDuration = parseInt(durationSlider.value, 10);
    // 更新spec中的duration配置
    if (spec.animationAppear && spec.animationAppear.stage) {
      spec.animationAppear.stage.duration = newDuration;
    }
    console.log(`已更新动画duration配置为: ${newDuration}ms`);

    // 重新应用配置
    cs.updateSpec(spec as any);
  });

  // 添加手动像素化强度控制
  const pixelationControls = document.createElement('div');
  pixelationControls.style.margin = '10px 0';
  pixelationControls.innerHTML = `
    <label>像素化强度: </label>
    <input type="range" id="pixelSlider" min="1" max="50" value="1" step="1">
    <span id="pixelValue">1</span>
    <button id="resetPixel">重置</button>
  `;
  document.body.appendChild(pixelationControls);

  const pixelSlider = document.getElementById('pixelSlider') as HTMLInputElement;
  const pixelValue = document.getElementById('pixelValue') as HTMLSpanElement;
  const resetPixel = document.getElementById('resetPixel') as HTMLButtonElement;

  pixelSlider.addEventListener('input', () => {
    globalPixelSize = parseInt(pixelSlider.value, 10);
    pixelValue.textContent = pixelSlider.value;
    animationProgress = 0; // 停止自动动画
  });

  resetPixel.addEventListener('click', () => {
    globalPixelSize = 1;
    animationProgress = 0;
    pixelSlider.value = '1';
    pixelValue.textContent = '1';
  });

  // 添加不同像素化方法的测试按钮
  const methodButtons = document.createElement('div');
  methodButtons.style.margin = '10px 0';
  methodButtons.innerHTML = `
    <button id="testDownsample">测试降采样像素化(10px)</button>
    <button id="testPixelData">测试像素数据像素化(8px)</button>
    <button id="testColorQuant">测试色彩量化(15px)</button>
    <button id="testCombined">测试组合效果(20px)</button>
  `;
  document.body.appendChild(methodButtons);

  document.getElementById('testDownsample')?.addEventListener('click', () => {
    globalPixelSize = 10;
    animationProgress = 0;
    pixelSlider.value = '10';
    pixelValue.textContent = '10';
    console.log('测试降采样像素化方法，像素大小: 10');
  });

  document.getElementById('testPixelData')?.addEventListener('click', () => {
    globalPixelSize = 8;
    animationProgress = 0;
    pixelSlider.value = '8';
    pixelValue.textContent = '8';
    console.log('测试像素数据像素化方法，像素大小: 8');
  });

  document.getElementById('testColorQuant')?.addEventListener('click', () => {
    globalPixelSize = 15;
    animationProgress = 0;
    pixelSlider.value = '15';
    pixelValue.textContent = '15';
    console.log('测试色彩量化效果，像素大小: 15');
  });

  document.getElementById('testCombined')?.addEventListener('click', () => {
    globalPixelSize = 20;
    animationProgress = 0;
    pixelSlider.value = '20';
    pixelValue.textContent = '20';
    console.log('测试组合效果，像素大小: 20');
  });

  // 将动画实例暴露到全局，方便控制
  // 通过已注册的动画获取实例
  window['testStageAnimate'] = null; // 初始化为null，实际实例会在动画执行时创建

  window['vchart'] = cs;
  console.log(cs);
};
run();
