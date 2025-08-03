import { default as VChart, vglobal } from '../../index';
import { AStageAnimate } from '@visactor/vrender-animate';
import { EasingType } from '@visactor/vrender-core';

// 故障效果配置接口
export interface GlitchConfig {
  effectType?: 'rgb-shift' | 'digital-distortion' | 'scan-lines' | 'data-corruption'; // 故障效果类型
  intensity?: number; // 故障强度 0-1
}

export class Glitch extends AStageAnimate<any> {
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

    return result;
  }
}
