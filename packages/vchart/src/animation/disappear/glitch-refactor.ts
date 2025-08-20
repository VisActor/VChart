import { EasingType } from '@visactor/vrender-core';
import { Canvas2DEffectBase } from './base/CustomEffectBase';
// import { GlitchEffectConfig, EffectConfigFactory, EffectType } from './base/DisappearEffectConfig';
import { ImageProcessUtils } from './base/ImageProcessUtils';

// 故障效果配置接口
export interface GlitchConfig {
  effectType?: 'rgb-shift' | 'digital-distortion' | 'scan-lines' | 'data-corruption'; // 故障效果类型
  intensity?: number; // 故障强度 0-1
}

/**
 * 故障消失动画效果 - 重构版
 * 使用Canvas2DEffectBase实现，专注于2D图像处理的故障效果
 */
export class GlitchDisintegrationRefactor extends Canvas2DEffectBase {
  private glitchConfig: Required<GlitchConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    this.glitchConfig = {
      effectType: params?.options?.effectType || 'rgb-shift',
      // intensity 可能为 0
      intensity: params?.options?.intensity !== undefined ? params.options.intensity : 0.5
    };
  }

  /**
   * Canvas 2D故障效果主入口
   */
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    // 如果强度为0，创建一个原图副本返回
    if (this.glitchConfig.intensity <= 0) {
      const outputCanvas = this.createOutputCanvas(canvas);
      return outputCanvas ? outputCanvas.canvas : null;
    }

    try {
      // 根据故障类型应用对应效果
      switch (this.glitchConfig.effectType) {
        case 'rgb-shift':
          return this.applyRGBShiftGlitch(canvas);
        case 'digital-distortion':
          return this.applyDigitalDistortionGlitch(canvas);
        case 'scan-lines':
          return this.applyScanLineGlitch(canvas);
        case 'data-corruption':
          return this.applyDataCorruptionGlitch(canvas);
        default:
          return this.applyRGBShiftGlitch(canvas);
      }
    } catch (error) {
      console.warn('Glitch effect failed:', error);
      return null;
    }
  }

  /**
   * RGB通道偏移故障效果
   * 分离RGB通道并应用不同的偏移，产生色散效果
   */
  private applyRGBShiftGlitch(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return null;
    }

    const { ctx } = outputCanvas;

    try {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 计算基于动画进度的动态强度
      const dynamicIntensity = ImageProcessUtils.calculateDynamicStrength(
        this.glitchConfig.intensity,
        this.getAnimationTime()
      );

      // 计算偏移量 - 增强色散效果
      const maxOffset = Math.floor(dynamicIntensity * 20);
      const redOffset = this.generateRandomOffset(maxOffset);
      const greenOffset = this.generateRandomOffset(maxOffset, 0.3);
      const blueOffset = this.generateRandomOffset(-maxOffset);

      // 获取原始图像数据
      const tempCanvas = ImageProcessUtils.createTempCanvas(canvas.width, canvas.height);
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(canvas, 0, 0);
      const originalImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

      // 创建RGB通道分离的图像数据
      const redChannelData = ImageProcessUtils.extractChannel(originalImageData, 0);
      const greenChannelData = ImageProcessUtils.extractChannel(originalImageData, 1);
      const blueChannelData = ImageProcessUtils.extractChannel(originalImageData, 2);

      // 使用screen混合模式绘制分离的通道
      ctx.globalCompositeOperation = 'screen';

      // 绘制红色通道
      tempCtx.clearRect(0, 0, canvas.width, canvas.height);
      tempCtx.putImageData(redChannelData, 0, 0);
      ctx.drawImage(tempCanvas, redOffset.x, redOffset.y);

      // 绘制绿色通道
      tempCtx.clearRect(0, 0, canvas.width, canvas.height);
      tempCtx.putImageData(greenChannelData, 0, 0);
      ctx.drawImage(tempCanvas, greenOffset.x, greenOffset.y);

      // 绘制蓝色通道
      tempCtx.clearRect(0, 0, canvas.width, canvas.height);
      tempCtx.putImageData(blueChannelData, 0, 0);
      ctx.drawImage(tempCanvas, blueOffset.x, blueOffset.y);

      // 恢复正常混合模式
      ctx.globalCompositeOperation = 'source-over';

      return outputCanvas.canvas;
    } catch (error) {
      console.warn('RGB shift glitch failed:', error);
      return null;
    }
  }

  /**
   * 数字扭曲故障效果
   * 应用水平切片偏移和随机像素噪声
   */
  private applyDigitalDistortionGlitch(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return null;
    }

    const { ctx } = outputCanvas;

    try {
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dynamicIntensity = ImageProcessUtils.calculateDynamicStrength(
        this.glitchConfig.intensity,
        this.getAnimationTime()
      );

      // 应用数字扭曲
      const distortedImageData = this.processDigitalDistortion(imageData, dynamicIntensity);

      // 清空画布并绘制扭曲后的图像
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(distortedImageData, 0, 0);

      return outputCanvas.canvas;
    } catch (error) {
      console.warn('Digital distortion glitch failed:', error);
      return null;
    }
  }

  /**
   * 扫描线故障效果
   * 添加水平扫描线和随机亮线效果
   */
  private applyScanLineGlitch(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return null;
    }

    const { ctx } = outputCanvas;

    try {
      const dynamicIntensity = ImageProcessUtils.calculateDynamicStrength(
        this.glitchConfig.intensity,
        this.getAnimationTime()
      );

      // 添加暗扫描线
      const lineSpacing = Math.max(2, Math.floor(10 - dynamicIntensity * 8));
      ctx.globalCompositeOperation = 'multiply';

      for (let y = 0; y < canvas.height; y += lineSpacing) {
        if (Math.random() < dynamicIntensity) {
          const opacity = 0.1 + dynamicIntensity * 0.4;
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          ctx.fillRect(0, y, canvas.width, 1);
        }
      }

      // 添加随机亮线
      ctx.globalCompositeOperation = 'screen';
      const brightLineCount = Math.floor(dynamicIntensity * 20);
      for (let i = 0; i < brightLineCount; i++) {
        const y = Math.random() * canvas.height;
        const opacity = dynamicIntensity * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(0, Math.floor(y), canvas.width, 1);
      }

      // 恢复正常混合模式
      ctx.globalCompositeOperation = 'source-over';

      return outputCanvas.canvas;
    } catch (error) {
      console.warn('Scan line glitch failed:', error);
      return null;
    }
  }

  /**
   * 数据损坏故障效果
   * 创建垂直条纹和随机块状损坏效果
   */
  private applyDataCorruptionGlitch(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return null;
    }

    const { ctx } = outputCanvas;

    try {
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dynamicIntensity = ImageProcessUtils.calculateDynamicStrength(
        this.glitchConfig.intensity,
        this.getAnimationTime()
      );

      // 应用数据损坏
      const corruptedImageData = this.processDataCorruption(imageData, dynamicIntensity);

      // 清空画布并绘制损坏后的图像
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(corruptedImageData, 0, 0);

      return outputCanvas.canvas;
    } catch (error) {
      console.warn('Data corruption glitch failed:', error);
      return null;
    }
  }

  /**
   * 生成随机偏移量
   */
  private generateRandomOffset(maxOffset: number, scale: number = 1): { x: number; y: number } {
    return {
      x: (Math.random() - 0.5) * maxOffset,
      y: (Math.random() - 0.5) * maxOffset * scale
    };
  }

  /**
   * 处理数字扭曲算法
   */
  private processDigitalDistortion(imageData: ImageData, intensity: number): ImageData {
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

  /**
   * 水平切片偏移算法
   */
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

  /**
   * 处理数据损坏算法
   */
  private processDataCorruption(imageData: ImageData, intensity: number): ImageData {
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

  /**
   * 损坏指定区域的像素块
   */
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
}
