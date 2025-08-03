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

// 故障效果配置接口
interface GlitchConfig {
  effectType?: 'rgb-shift' | 'digital-distortion' | 'scan-lines' | 'data-corruption'; // 故障效果类型
  intensity?: number; // 故障强度 0-1
}

class TestStageAnimate extends AStageAnimate<any> {
  private frameCount = 0; // 帧计数器，用于动态效果

  // 故障效果配置
  private glitchConfig: Required<GlitchConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化故障效果配置，使用传入的参数或默认值
    this.glitchConfig = {
      effectType: params?.options?.effectType || 'rgb-shift',
      intensity: params?.options?.intensity || 0.5
    };
  }

  // RGB通道偏移故障效果
  private applyRGBShiftGlitch(canvas: HTMLCanvasElement, intensity: number): HTMLCanvasElement {
    const c = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const ctx = c.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 计算偏移量 - 增强色散效果
    const maxOffset = Math.floor(intensity * 20); // 增加偏移范围
    const redOffsetX = (Math.random() - 0.5) * maxOffset;
    const redOffsetY = (Math.random() - 0.5) * maxOffset * 0.3;
    const blueOffsetX = -(Math.random() - 0.5) * maxOffset; // 蓝色往相反方向偏移
    const blueOffsetY = (Math.random() - 0.5) * maxOffset * 0.3;

    // 获取原始图像数据
    const tempCanvas = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      return canvas;
    }

    tempCtx.drawImage(canvas, 0, 0);
    const originalImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

    // 创建RGB通道分离的图像数据
    const redChannelData = this.extractChannel(originalImageData, 0); // 红色通道
    const greenChannelData = this.extractChannel(originalImageData, 1); // 绿色通道
    const blueChannelData = this.extractChannel(originalImageData, 2); // 蓝色通道

    // 绘制红色通道 (偏移)
    tempCtx.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx.putImageData(redChannelData, 0, 0);
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(tempCanvas, redOffsetX, redOffsetY);

    // 绘制绿色通道 (基准位置，轻微偏移)
    tempCtx.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx.putImageData(greenChannelData, 0, 0);
    ctx.globalCompositeOperation = 'screen';
    const greenOffsetX = (Math.random() - 0.5) * maxOffset * 0.3;
    const greenOffsetY = (Math.random() - 0.5) * maxOffset * 0.2;
    ctx.drawImage(tempCanvas, greenOffsetX, greenOffsetY);

    // 绘制蓝色通道 (相反方向偏移)
    tempCtx.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx.putImageData(blueChannelData, 0, 0);
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(tempCanvas, blueOffsetX, blueOffsetY);

    // 恢复正常混合模式
    ctx.globalCompositeOperation = 'source-over';

    return c;
  }

  // 提取指定颜色通道的图像数据
  private extractChannel(imageData: ImageData, channelIndex: number): ImageData {
    const { data, width, height } = imageData;
    const channelData = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      // 清空所有通道
      channelData[i] = 0; // R
      channelData[i + 1] = 0; // G
      channelData[i + 2] = 0; // B
      channelData[i + 3] = data[i + 3]; // 保持Alpha通道

      // 只保留指定通道的数据
      if (channelIndex === 0) {
        channelData[i] = data[i]; // 红色通道
      } else if (channelIndex === 1) {
        channelData[i + 1] = data[i + 1]; // 绿色通道
      } else if (channelIndex === 2) {
        channelData[i + 2] = data[i + 2]; // 蓝色通道
      }
    }

    return new ImageData(channelData, width, height);
  }

  // 优化版本2: 数字扭曲故障效果
  private applyDigitalDistortionGlitch(imageData: ImageData, intensity: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data);

    // 随机水平切片
    const sliceCount = Math.floor(intensity * 20) + 5;
    const sliceHeight = Math.floor(height / sliceCount);

    for (let i = 0; i < sliceCount; i++) {
      if (Math.random() < intensity) {
        const y = i * sliceHeight;
        const sliceEnd = Math.min(y + sliceHeight, height);
        const offset = Math.floor((Math.random() - 0.5) * width * intensity * 0.1);

        // 水平偏移切片
        this.shiftSliceHorizontal(result, width, height, y, sliceEnd, offset);
      }
    }

    // 添加随机像素噪声
    const noiseIntensity = intensity * 0.3;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < noiseIntensity) {
        result[i] = Math.random() * 255; // R
        result[i + 1] = Math.random() * 255; // G
        result[i + 2] = Math.random() * 255; // B
      }
    }

    return new ImageData(result, width, height);
  }

  // 水平切片偏移
  private shiftSliceHorizontal(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    startY: number,
    endY: number,
    offset: number
  ): void {
    const tempRow = new Uint8ClampedArray(width * 4);

    for (let y = startY; y < endY; y++) {
      const rowStart = y * width * 4;

      // 保存当前行
      for (let x = 0; x < width * 4; x++) {
        tempRow[x] = data[rowStart + x];
      }

      // 应用偏移
      for (let x = 0; x < width; x++) {
        const sourceX = (x - offset + width) % width;
        const targetIndex = rowStart + x * 4;
        const sourceIndex = sourceX * 4;

        data[targetIndex] = tempRow[sourceIndex];
        data[targetIndex + 1] = tempRow[sourceIndex + 1];
        data[targetIndex + 2] = tempRow[sourceIndex + 2];
        data[targetIndex + 3] = tempRow[sourceIndex + 3];
      }
    }
  }

  // 优化版本3: 扫描线故障效果 (TOP3)
  private applyScanLineGlitch(canvas: HTMLCanvasElement, intensity: number): HTMLCanvasElement {
    const c = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const ctx = c.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    // 绘制原始图像
    ctx.drawImage(canvas, 0, 0);

    // 添加扫描线
    const lineSpacing = Math.max(2, Math.floor(10 - intensity * 8));
    ctx.globalCompositeOperation = 'multiply';

    for (let y = 0; y < canvas.height; y += lineSpacing) {
      if (Math.random() < intensity) {
        const opacity = 0.1 + intensity * 0.4;
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, y, canvas.width, 1);
      }
    }

    // 添加随机亮线
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < intensity * 20; i++) {
      const y = Math.random() * canvas.height;
      const opacity = intensity * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(0, y, canvas.width, 1);
    }

    ctx.globalCompositeOperation = 'source-over';
    return c;
  }

  // 优化版本5: 数据损坏故障效果 (TOP5)
  private applyDataCorruptionGlitch(imageData: ImageData, intensity: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data);

    // 随机垂直条纹
    const stripeCount = Math.floor(intensity * 15) + 5;
    for (let i = 0; i < stripeCount; i++) {
      if (Math.random() < intensity) {
        const x = Math.floor(Math.random() * width);
        const stripeWidth = Math.floor(Math.random() * 5) + 1;
        const color = Math.random() < 0.5 ? 0 : 255;

        for (let y = 0; y < height; y++) {
          for (let dx = 0; dx < stripeWidth && x + dx < width; dx++) {
            const index = (y * width + x + dx) * 4;
            result[index] = color; // R
            result[index + 1] = color; // G
            result[index + 2] = color; // B
          }
        }
      }
    }

    // 随机块状损坏
    const corruptionCount = Math.floor(intensity * 20);
    for (let i = 0; i < corruptionCount; i++) {
      const blockX = Math.floor(Math.random() * width);
      const blockY = Math.floor(Math.random() * height);
      const blockW = Math.floor(Math.random() * 20) + 5;
      const blockH = Math.floor(Math.random() * 10) + 2;

      this.corruptBlock(result, width, height, blockX, blockY, blockW, blockH);
    }

    return new ImageData(result, width, height);
  }

  // 损坏块
  private corruptBlock(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    for (let dy = 0; dy < h && y + dy < height; dy++) {
      for (let dx = 0; dx < w && x + dx < width; dx++) {
        const index = ((y + dy) * width + (x + dx)) * 4;
        if (Math.random() < 0.7) {
          data[index] = Math.random() * 255;
          data[index + 1] = Math.random() * 255;
          data[index + 2] = Math.random() * 255;
        }
      }
    }
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    console.time('GlitchEffect'); // 性能测试
    this.frameCount++;

    // 如果强度为0，直接返回原图
    if (this.glitchConfig.intensity <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    // 统一处理所有故障效果
    switch (this.glitchConfig.effectType) {
      case 'rgb-shift':
        result = this.applyRGBShiftGlitch(canvas, this.glitchConfig.intensity);
        break;
      case 'scan-lines':
        result = this.applyScanLineGlitch(canvas, this.glitchConfig.intensity);
        break;
      case 'digital-distortion':
        // 数字扭曲需要像素级处理
        const distortionCanvas = vglobal.createCanvas({
          width: canvas.width,
          height: canvas.height,
          dpr: vglobal.devicePixelRatio
        });
        const distortionCtx = distortionCanvas.getContext('2d');
        if (distortionCtx) {
          distortionCtx.drawImage(canvas, 0, 0);
          const imageData = distortionCtx.getImageData(0, 0, canvas.width, canvas.height);
          const glitchedImageData = this.applyDigitalDistortionGlitch(imageData, this.glitchConfig.intensity);
          distortionCtx.putImageData(glitchedImageData, 0, 0);
          result = distortionCanvas;
        } else {
          result = canvas;
        }
        break;
      case 'data-corruption':
        // 数据损坏需要像素级处理
        const corruptionCanvas = vglobal.createCanvas({
          width: canvas.width,
          height: canvas.height,
          dpr: vglobal.devicePixelRatio
        });
        const corruptionCtx = corruptionCanvas.getContext('2d');
        if (corruptionCtx) {
          corruptionCtx.drawImage(canvas, 0, 0);
          const imageData = corruptionCtx.getImageData(0, 0, canvas.width, canvas.height);
          const glitchedImageData = this.applyDataCorruptionGlitch(imageData, this.glitchConfig.intensity);
          corruptionCtx.putImageData(glitchedImageData, 0, 0);
          result = corruptionCanvas;
        } else {
          result = canvas;
        }
        break;
      default:
        result = this.applyRGBShiftGlitch(canvas, this.glitchConfig.intensity);
    }

    // 添加动态闪烁效果
    // if (this.frameCount % 30 === 0 && Math.random() < this.glitchConfig.intensity) {
    //   const ctx = result.getContext('2d');
    //   if (ctx) {
    //     ctx.globalCompositeOperation = 'difference';
    //     ctx.fillStyle = `rgba(255, 0, 255, ${this.glitchConfig.intensity * 0.3})`;
    //     ctx.fillRect(0, 0, result.width, result.height);
    //     ctx.globalCompositeOperation = 'source-over';
    //   }
    // }

    console.timeEnd('GlitchEffect'); // 输出性能数据
    return result;
  }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

// 用于演示UI控制的全局变量（不影响类内部实现）
let currentGlitchIntensity = 0.5;
let currentGlitchType = 'rgb-shift';

/*
使用示例：
1. 通过spec配置：
animationAppear: {
  stage: {
    type: 'stageTest',
    duration: 1000,
    easing: 'linear',
    options: {
      effectType: 'rgb-shift',  // 'rgb-shift' | 'digital-distortion' | 'scan-lines' | 'data-corruption'
      intensity: 0.5           // 0.0 - 1.0
    }
  }
}

2. 支持的故障效果：
- 'rgb-shift': RGB通道偏移 - 真正的红绿蓝颜色通道分离偏移，模拟色差aberration效果
- 'digital-distortion': 数字扭曲 - 水平切片偏移 + 随机像素噪声，模拟信号干扰
- 'scan-lines': 扫描线故障 - 添加水平扫描线和亮线，模拟CRT显示器故障
- 'data-corruption': 数据损坏 - 垂直条纹 + 块状损坏，模拟数据传输错误

3. 参数说明：
- effectType: 故障效果类型
- intensity: 故障强度 (0.0-1.0)

4. 技术特点：
- 所有效果都针对不同的故障类型使用最优的处理方式
- RGB通道偏移使用真正的颜色通道分离技术
- 支持动态闪烁效果增强视觉冲击
- 每次效果处理都有性能监控
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
      duration: 2000,
      easing: 'linear',
      options: {
        effectType: 'data-corruption', // 'rgb-shift' | 'digital-distortion' | 'scan-lines' | 'data-corruption'
        intensity: 0.5
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
    // duration: 2000,
    // type: 'fadeOut'
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

  // 添加退场动画按钮 - 通过更新spec来触发
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

    // 恢复原始spec
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

    // 恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 2000);
  });
  document.body.appendChild(button10);

  // 添加故障效果控制按钮
  const button11 = document.createElement('button');
  button11.innerHTML = '调整故障强度';
  button11.addEventListener('click', () => {
    console.log('调整故障效果强度...');

    // 随机调整故障强度
    const newIntensity = Math.random();
    currentGlitchIntensity = newIntensity;
    console.log(`设置故障强度为: ${newIntensity.toFixed(2)}`);

    // 触发图表重新渲染以应用新的故障效果
    cs.renderAsync();
  });
  document.body.appendChild(button11);

  // 添加故障强度滑块控制
  const glitchSlider = document.createElement('input');
  glitchSlider.type = 'range';
  glitchSlider.min = '0';
  glitchSlider.max = '1';
  glitchSlider.step = '0.1';
  glitchSlider.value = '0.5';
  glitchSlider.style.width = '200px';
  glitchSlider.style.margin = '10px';

  const glitchLabel = document.createElement('label');
  glitchLabel.innerHTML = '故障强度: 0.5';
  glitchLabel.style.marginRight = '10px';

  glitchSlider.addEventListener('input', e => {
    const value = parseFloat((e.target as HTMLInputElement).value);
    glitchLabel.innerHTML = `故障强度: ${value.toFixed(1)}`;

    // 直接修改全局变量
    currentGlitchIntensity = value;
    console.log(`设置故障强度为: ${value}`);

    // 触发图表重新渲染
    cs.renderAsync();
  });

  // 创建故障强度控制容器
  const glitchControl = document.createElement('div');
  glitchControl.style.margin = '10px';
  glitchControl.appendChild(glitchLabel);
  glitchControl.appendChild(glitchSlider);
  document.body.appendChild(glitchControl);

  // 添加故障类型选择器
  const glitchTypeSelect = document.createElement('select');
  glitchTypeSelect.style.margin = '10px';
  glitchTypeSelect.style.padding = '5px';

  const glitchTypes = [
    { value: 'rgb-shift', label: 'RGB通道偏移' },
    { value: 'digital-distortion', label: '数字扭曲' },
    { value: 'scan-lines', label: '扫描线故障' },
    { value: 'data-corruption', label: '数据损坏' }
  ];

  glitchTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.value;
    option.textContent = type.label;
    if (type.value === currentGlitchType) {
      option.selected = true;
    }
    glitchTypeSelect.appendChild(option);
  });

  glitchTypeSelect.addEventListener('change', e => {
    currentGlitchType = (e.target as HTMLSelectElement).value;
    console.log(`切换故障类型为: ${currentGlitchType}`);

    // 重新渲染图表以应用新的故障类型
    cs.renderAsync();
  });

  const glitchTypeLabel = document.createElement('label');
  glitchTypeLabel.innerHTML = '故障类型: ';
  glitchTypeLabel.style.marginRight = '10px';

  const glitchTypeControl = document.createElement('div');
  glitchTypeControl.style.margin = '10px';
  glitchTypeControl.appendChild(glitchTypeLabel);
  glitchTypeControl.appendChild(glitchTypeSelect);
  document.body.appendChild(glitchTypeControl);

  // 添加随机故障效果按钮
  const randomGlitchButton = document.createElement('button');
  randomGlitchButton.innerHTML = '随机故障效果';
  randomGlitchButton.style.backgroundColor = '#9C27B0';
  randomGlitchButton.style.color = 'white';
  randomGlitchButton.style.margin = '10px';
  randomGlitchButton.style.padding = '10px';
  randomGlitchButton.addEventListener('click', () => {
    // 随机设置故障参数
    currentGlitchIntensity = Math.random();
    currentGlitchType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)].value;

    // 更新UI显示
    glitchSlider.value = currentGlitchIntensity.toString();
    glitchLabel.innerHTML = `故障强度: ${currentGlitchIntensity.toFixed(1)}`;
    glitchTypeSelect.value = currentGlitchType;

    console.log(`随机故障设置 - 强度: ${currentGlitchIntensity.toFixed(2)}, 类型: ${currentGlitchType}`);

    // 重新渲染图表
    cs.renderAsync();
  });
  document.body.appendChild(randomGlitchButton);

  // 添加应用当前UI配置的按钮
  const applyUIConfigButton = document.createElement('button');
  applyUIConfigButton.innerHTML = '应用UI配置到动画';
  applyUIConfigButton.style.backgroundColor = '#4CAF50';
  applyUIConfigButton.style.color = 'white';
  applyUIConfigButton.style.margin = '10px';
  applyUIConfigButton.style.padding = '10px';
  applyUIConfigButton.addEventListener('click', () => {
    console.log('应用UI配置到动画...');

    // 更新spec配置
    const newSpec = {
      ...spec,
      animationAppear: {
        stage: {
          type: 'stageTest',
          duration: 1000,
          easing: 'linear',
          options: {
            effectType: currentGlitchType,
            intensity: currentGlitchIntensity
          }
        }
      }
    };

    console.log(`应用配置 - 类型: ${currentGlitchType}, 强度: ${currentGlitchIntensity.toFixed(2)}`);

    // 更新spec并重新渲染
    spec = newSpec;
    cs.updateSpec(newSpec as any);
  });
  document.body.appendChild(applyUIConfigButton);

  // 添加故障效果信息显示
  const glitchInfo = document.createElement('div');
  glitchInfo.style.margin = '10px';
  glitchInfo.style.padding = '10px';
  glitchInfo.style.backgroundColor = '#f0f0f0';
  glitchInfo.style.borderRadius = '5px';
  glitchInfo.innerHTML = `
    <h4>故障效果 (Glitch Effect) 说明：</h4>
    <ul>
      <li><strong>RGB通道偏移</strong>：真正的红绿蓝颜色通道分离偏移，模拟色差aberration效果</li>
      <li><strong>数字扭曲</strong>：水平切片偏移 + 随机像素噪声，模拟信号干扰</li>
      <li><strong>扫描线故障</strong>：添加水平扫描线和亮线，模拟CRT显示器故障</li>
      <li><strong>数据损坏</strong>：垂直条纹 + 块状损坏，模拟数据传输错误</li>
      <li>所有效果都针对不同的故障类型使用最优的处理方式</li>
      <li>查看控制台可以看到每次故障效果的处理耗时</li>
    </ul>
    <h4>配置说明：</h4>
    <ul>
      <li>✅ <strong>新架构</strong>：故障效果配置通过 params.options 传入动画类</li>
      <li>✅ <strong>配置驱动</strong>：effectType 和 intensity 都由 spec 配置控制</li>
      <li>⚠️ <strong>UI控制</strong>：当前UI控制仅用于演示，不会影响实际动画效果</li>
      <li>🔧 <strong>实际使用</strong>：通过更新 spec.animationAppear.stage.options 来控制效果</li>
    </ul>
    <h4>推荐配置示例：</h4>
    <ul>
      <li><code>{ effectType: 'rgb-shift', intensity: 0.7 }</code> - 强RGB色散效果</li>
      <li><code>{ effectType: 'digital-distortion', intensity: 0.5 }</code> - 中等数字故障</li>
      <li><code>{ effectType: 'scan-lines', intensity: 0.8 }</code> - 强扫描线效果</li>
      <li><code>{ effectType: 'data-corruption', intensity: 0.3 }</code> - 轻微数据损坏</li>
    </ul>
  `;
  document.body.appendChild(glitchInfo);

  window['vchart'] = cs;
  console.log(cs);
};
run();
