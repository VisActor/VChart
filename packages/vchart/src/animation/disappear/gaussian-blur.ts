import { AStageAnimate } from '@visactor/vrender-animate';
import { vglobal, EasingType } from '@visactor/vrender-core';

// 模糊效果配置接口
export interface BlurConfig {
  blurRadius: number;
  useOptimizedBlur: boolean;
}

export class GaussianBlur extends AStageAnimate<any> {
  // 模糊配置
  private blurConfig: BlurConfig;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

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

    return result;
  }
}
