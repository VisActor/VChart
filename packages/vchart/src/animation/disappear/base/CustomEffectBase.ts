import { EasingType } from '@visactor/vrender-core';
import { DisappearAnimateBase } from './DisappearAnimateBase';

/**
 * 仅支持WebGL的特效基类
 * 适用于复杂的GPU计算特效，如粒子系统、复杂着色器特效等
 */
export abstract class WebGLOnlyEffectBase extends DisappearAnimateBase {
  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);
  }

  // 必须实现WebGL相关方法
  protected abstract getShaderSources(): { vertex: string; fragment: string };
  protected abstract applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement;

  // Canvas 2D回退：简单的透明度动画或返回原图
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement {
    console.warn(`${this.constructor.name}: WebGL不可用，使用简单透明度回退动画`);

    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return canvas;
    }

    const { ctx } = outputCanvas;

    // 简单的透明度渐变作为回退
    ctx.globalAlpha = Math.max(0, 1 - this.currentAnimationRatio);
    ctx.drawImage(canvas, 0, 0);

    return outputCanvas.canvas;
  }
}

/**
 * 仅支持Canvas 2D的特效基类
 * 适用于简单的2D图像处理特效，如模糊、颜色调整等
 */
export abstract class Canvas2DOnlyEffectBase extends DisappearAnimateBase {
  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);
  }

  // 必须实现Canvas 2D方法
  protected abstract applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement;

  // 不支持WebGL，返回null
  protected getShaderSources(): { vertex: string; fragment: string } | null {
    return null;
  }

  protected applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    return null;
  }
}

/**
 * 混合实现特效基类
 * 既支持WebGL也支持Canvas 2D，根据环境自动选择
 */
export abstract class HybridEffectBase extends DisappearAnimateBase {
  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);
  }

  // 可选实现WebGL方法
  protected getShaderSources(): { vertex: string; fragment: string } | null {
    return null; // 子类可以重写
  }

  protected applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    return null; // 子类可以重写
  }

  // 可选实现Canvas 2D方法
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    return null; // 子类可以重写
  }

  // 重写检查方法，使用更准确的检测
  protected supportsWebGL(): boolean {
    return this.getShaderSources !== HybridEffectBase.prototype.getShaderSources && this.getShaderSources() !== null;
  }

  protected supportsCanvas2D(): boolean {
    return this.applyCanvas2DEffect !== HybridEffectBase.prototype.applyCanvas2DEffect;
  }
}
