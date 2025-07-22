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

// 全局变量控制故障效果
let globalGlitchIntensity = 0.5; // 故障强度 0-1
let useOptimizedGlitch = true; // 是否使用优化版本
let glitchType = 'rgb-shift'; // 故障类型: 'rgb-shift', 'digital-distortion', 'scan-lines', 'pixelation', 'data-corruption'

class TestStageAnimate extends AStageAnimate<any> {
  private frameCount = 0; // 帧计数器，用于动态效果

  // 优化版本1: RGB通道偏移故障效果 (TOP1 - 性能最好)
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

  // 像素级精确RGB通道偏移实现
  private applyPixelRGBShiftGlitch(imageData: ImageData, intensity: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);

    // 计算偏移量 - 加强色散效果
    const maxOffset = Math.floor(intensity * 25);
    const redOffsetX = Math.floor((Math.random() - 0.5) * maxOffset);
    const redOffsetY = Math.floor((Math.random() - 0.5) * maxOffset * 0.4);
    const blueOffsetX = Math.floor(-(Math.random() - 0.5) * maxOffset); // 蓝色相反方向
    const blueOffsetY = Math.floor((Math.random() - 0.5) * maxOffset * 0.4);
    const greenOffsetX = Math.floor((Math.random() - 0.5) * maxOffset * 0.3); // 绿色轻微偏移
    const greenOffsetY = Math.floor((Math.random() - 0.5) * maxOffset * 0.2);

    // 初始化结果数组 (全部设为黑色，保持Alpha)
    for (let i = 0; i < data.length; i += 4) {
      result[i] = 0; // R
      result[i + 1] = 0; // G
      result[i + 2] = 0; // B
      result[i + 3] = data[i + 3]; // A
    }

    // 复制红色通道 (带偏移)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceX = x - redOffsetX;
        const sourceY = y - redOffsetY;

        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          const targetIndex = (y * width + x) * 4;
          // 使用加法混合来叠加颜色通道
          result[targetIndex] = Math.min(255, result[targetIndex] + data[sourceIndex]);
        }
      }
    }

    // 复制绿色通道 (轻微偏移)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceX = x - greenOffsetX;
        const sourceY = y - greenOffsetY;

        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          const targetIndex = (y * width + x) * 4;
          result[targetIndex + 1] = Math.min(255, result[targetIndex + 1] + data[sourceIndex + 1]);
        }
      }
    }

    // 复制蓝色通道 (相反方向偏移)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceX = x - blueOffsetX;
        const sourceY = y - blueOffsetY;

        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          const targetIndex = (y * width + x) * 4;
          result[targetIndex + 2] = Math.min(255, result[targetIndex + 2] + data[sourceIndex + 2]);
        }
      }
    }

    return new ImageData(result, width, height);
  }
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
    if (globalGlitchIntensity <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    if (useOptimizedGlitch) {
      // 使用优化的Canvas技术
      switch (glitchType) {
        case 'rgb-shift':
          result = this.applyRGBShiftGlitch(canvas, globalGlitchIntensity);
          break;
        case 'scan-lines':
          result = this.applyScanLineGlitch(canvas, globalGlitchIntensity);
          break;
        default:
          result = this.applyRGBShiftGlitch(canvas, globalGlitchIntensity);
      }
    } else {
      // 使用像素级处理
      const c = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });
      const ctx = c.getContext('2d');
      if (!ctx) {
        return false;
      }

      // 清空画布并绘制原始图像
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);

      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 根据故障类型选择不同的算法
      let glitchedImageData: ImageData;
      switch (glitchType) {
        case 'rgb-shift':
          console.log('使用像素级RGB通道偏移');
          glitchedImageData = this.applyPixelRGBShiftGlitch(imageData, globalGlitchIntensity);
          break;
        case 'digital-distortion':
          console.log('使用数字扭曲故障效果');
          glitchedImageData = this.applyDigitalDistortionGlitch(imageData, globalGlitchIntensity);
          break;
        case 'data-corruption':
          console.log('使用数据损坏故障效果');
          glitchedImageData = this.applyDataCorruptionGlitch(imageData, globalGlitchIntensity);
          break;
        default:
          console.log('使用像素级RGB通道偏移');
          glitchedImageData = this.applyPixelRGBShiftGlitch(imageData, globalGlitchIntensity);
      }

      // 将处理后的图像数据绘制到画布上
      ctx.putImageData(glitchedImageData, 0, 0);

      result = c;
    }

    // 添加动态闪烁效果
    if (this.frameCount % 30 === 0 && Math.random() < globalGlitchIntensity) {
      const ctx = result.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = `rgba(255, 0, 255, ${globalGlitchIntensity * 0.3})`;
        ctx.fillRect(0, 0, result.width, result.height);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    console.timeEnd('GlitchEffect'); // 输出性能数据
    return result;
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

  // 添加故障效果控制按钮
  const button11 = document.createElement('button');
  button11.innerHTML = '调整故障强度';
  button11.addEventListener('click', () => {
    console.log('调整故障效果强度...');

    // 随机调整故障强度
    const newIntensity = Math.random();
    globalGlitchIntensity = newIntensity;
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
    globalGlitchIntensity = value;
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
    if (type.value === glitchType) {
      option.selected = true;
    }
    glitchTypeSelect.appendChild(option);
  });

  glitchTypeSelect.addEventListener('change', e => {
    glitchType = (e.target as HTMLSelectElement).value;
    console.log(`切换故障类型为: ${glitchType}`);

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

  // 添加性能模式切换按钮
  const performanceButton = document.createElement('button');
  performanceButton.innerHTML = useOptimizedGlitch ? '当前：高性能模式' : '当前：高质量模式';
  performanceButton.style.backgroundColor = useOptimizedGlitch ? '#4CAF50' : '#FF9800';
  performanceButton.style.color = 'white';
  performanceButton.style.margin = '10px';
  performanceButton.style.padding = '10px';
  performanceButton.addEventListener('click', () => {
    useOptimizedGlitch = !useOptimizedGlitch;
    performanceButton.innerHTML = useOptimizedGlitch ? '当前：高性能模式' : '当前：高质量模式';
    performanceButton.style.backgroundColor = useOptimizedGlitch ? '#4CAF50' : '#FF9800';

    console.log(`切换到${useOptimizedGlitch ? '高性能' : '高质量'}模式`);

    // 重新渲染图表以应用新的故障模式
    cs.renderAsync();
  });
  document.body.appendChild(performanceButton);

  // 添加随机故障效果按钮
  const randomGlitchButton = document.createElement('button');
  randomGlitchButton.innerHTML = '随机故障效果';
  randomGlitchButton.style.backgroundColor = '#9C27B0';
  randomGlitchButton.style.color = 'white';
  randomGlitchButton.style.margin = '10px';
  randomGlitchButton.style.padding = '10px';
  randomGlitchButton.addEventListener('click', () => {
    // 随机设置故障参数
    globalGlitchIntensity = Math.random();
    glitchType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)].value;
    useOptimizedGlitch = Math.random() < 0.5;

    // 更新UI显示
    glitchSlider.value = globalGlitchIntensity.toString();
    glitchLabel.innerHTML = `故障强度: ${globalGlitchIntensity.toFixed(1)}`;
    glitchTypeSelect.value = glitchType;
    performanceButton.innerHTML = useOptimizedGlitch ? '当前：高性能模式' : '当前：高质量模式';
    performanceButton.style.backgroundColor = useOptimizedGlitch ? '#4CAF50' : '#FF9800';

    console.log(
      `随机故障设置 - 强度: ${globalGlitchIntensity.toFixed(2)}, 类型: ${glitchType}, 性能模式: ${
        useOptimizedGlitch ? '高性能' : '高质量'
      }`
    );

    // 重新渲染图表
    cs.renderAsync();
  });
  document.body.appendChild(randomGlitchButton);

  // 添加故障效果信息显示
  const glitchInfo = document.createElement('div');
  glitchInfo.style.margin = '10px';
  glitchInfo.style.padding = '10px';
  glitchInfo.style.backgroundColor = '#f0f0f0';
  glitchInfo.style.borderRadius = '5px';
  glitchInfo.innerHTML = `
    <h4>故障效果 (Glitch Effect) 说明：</h4>
    <ul>
      <li><strong>RGB通道偏移</strong>：使用CSS滤镜实现红绿蓝通道偏移，性能最佳</li>
      <li><strong>数字扭曲</strong>：水平切片偏移 + 随机像素噪声，模拟信号干扰</li>
      <li><strong>扫描线故障</strong>：添加水平扫描线和亮线，模拟CRT显示器故障</li>
      <li><strong>像素化</strong>：随机区域像素化处理，模拟分辨率降低</li>
      <li><strong>数据损坏</strong>：垂直条纹 + 块状损坏，模拟数据传输错误</li>
      <li>高性能模式使用Canvas 2D优化技术，高质量模式使用像素级处理</li>
      <li>查看控制台可以看到每次故障效果的处理耗时</li>
    </ul>
  `;
  document.body.appendChild(glitchInfo);

  window['vchart'] = cs;
  console.log(cs);
};
run();
