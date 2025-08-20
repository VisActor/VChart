import { vglobal, EasingType } from '@visactor/vrender-core';
import { DisappearAnimateBase } from './base/DisappearAnimateBase';

export interface PixelationConfig {
  maxPixelSize?: number; // 最大像素化强度
  method?: 'out' | 'in'; // 像素化方法：out为出场效果，in为入场效果
}

export class Pixelation extends DisappearAnimateBase<any> {
  private pixelationConfig: Required<PixelationConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    this.pixelationConfig = {
      maxPixelSize: params?.options?.maxPixelSize || 20,
      method: params?.options?.method || 'out'
    };
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

  private updateAnimationProgress(): number {
    // 直接根据动画进度计算像素化强度

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
