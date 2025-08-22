import { EasingType } from '@visactor/vrender-core';
import { DisappearAnimateBase } from './DisappearAnimateBase';

/**
 * 仅支持WebGL的特效基类
 * 适用于复杂的GPU计算特效，如粒子系统、复杂着色器特效等
 */
export abstract class WebGLEffectBase extends DisappearAnimateBase {
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
export abstract class Canvas2DEffectBase extends DisappearAnimateBase {
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
export class HybridEffectBase extends DisappearAnimateBase {
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

  /**
   * 重写渲染方法，支持用户配置的 useWebGL 控制
   */
  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    let result: HTMLCanvasElement | null = null;

    // 根据用户配置决定渲染策略
    // const useWebGL = this.params?.options?.useWebGL !== false; // 默认允许WebGL，除非明确设置为false

    if (this.params?.options?.useWebGL !== false) {
      // 用户允许使用WebGL，按照父类的自动判别逻辑
      // 优先尝试WebGL实现
      if (this.supportsWebGL()) {
        if (!this.gl && !this.initWebGL(canvas)) {
          console.warn('WebGL初始化失败，尝试Canvas 2D回退');
        }

        if (this.gl) {
          result = this.applyWebGLEffect(canvas);
          if (result) {
            return result;
          } else {
            console.warn('WebGL特效执行失败，尝试Canvas 2D回退');
          }
        }
      }

      // WebGL不可用或执行失败，尝试Canvas 2D回退
      if (this.supportsCanvas2D()) {
        result = this.applyCanvas2DEffect(canvas);
        if (result) {
          return result;
        } else {
          console.warn('Canvas 2D特效执行失败');
        }
      }
    } else {
      // 用户禁用WebGL，直接使用Canvas 2D
      if (this.supportsCanvas2D()) {
        result = this.applyCanvas2DEffect(canvas);
        if (result) {
          return result;
        } else {
          console.warn('Canvas 2D特效执行失败');
        }
      } else {
        console.warn(`${this.constructor.name}: useWebGL=false 但未实现Canvas 2D方法`);
      }
    }

    // 如果都不支持或都失败了，给出明确的错误信息
    if (!this.supportsWebGL() && !this.supportsCanvas2D()) {
      console.error(
        `特效类 ${this.constructor.name} 未实现任何渲染方法。请实现 applyWebGLEffect 或 applyCanvas2DEffect 方法。`
      );
    }

    // 返回原图作为最后的回退
    return canvas;
  }
}
