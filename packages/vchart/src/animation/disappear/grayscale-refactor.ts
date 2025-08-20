import { EasingType, vglobal } from '@visactor/vrender-core';
import { HybridEffectBase } from './base/CustomEffectBase';
// import { ColorEffectConfig, EffectConfigFactory, EffectType } from './base/DisappearEffectConfig';
import { ImageProcessUtils, ShaderLibrary } from './base/ImageProcessUtils';

export interface ColorEffectConfig {
  effectType: 'grayscale' | 'sepia';
  strength: number;
  useWebGL: boolean;
}
/**
 * 灰度/褐色调消失动画效果 - 重构版
 * 使用HybridEffectBase实现WebGL和Canvas 2D双重支持
 */
export class GrayscaleDisintegrationRefactor extends HybridEffectBase {
  private colorConfig: Required<ColorEffectConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 获取strength并限制在0-1范围内
    const rawStrength = params?.options?.strength !== undefined ? params.options.strength : 1.0;
    const clampedStrength = Math.max(0, Math.min(1, rawStrength));

    this.colorConfig = {
      effectType: params?.options?.effectType || 'grayscale', // 'grayscale' | 'sepia'
      strength: clampedStrength, // 限制在 0.0 - 1.0 范围内
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true // 是否使用WebGL实现
    };
  }

  /**
   * WebGL实现：高性能着色器颜色转换
   */
  protected getShaderSources(): { vertex: string; fragment: string } | null {
    const vertexShader = ShaderLibrary.STANDARD_VERTEX_SHADER;

    const fragmentShader = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_strength;
      uniform int u_effectType;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      ${ShaderLibrary.SHADER_FUNCTIONS}

      void main() {
        vec2 uv = v_texCoord;
        vec4 originalColor = texture2D(u_texture, uv);
        vec3 color = originalColor.rgb;

        // 计算动态强度
        float dynamicStrength = calculateDynamicStrength(u_strength, u_time);

        if (u_effectType == 0) {
          // 灰度效果
          float gray = luminance(color);
          vec3 grayColor = vec3(gray);
          color = mix(color, grayColor, dynamicStrength);
        } else if (u_effectType == 1) {
          // 褐色调效果
          vec3 sepiaColor = sepia(color);
          color = mix(color, sepiaColor, dynamicStrength);
        }

        gl_FragColor = vec4(color, originalColor.a);
      }
    `;

    return { vertex: vertexShader, fragment: fragmentShader };
  }

  protected applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return null;
    }

    // 使用基类提供的公共方法
    this.setupWebGLState(canvas);

    // 创建纹理
    const texture = this.createTextureFromCanvas(canvas);
    if (!texture) {
      return null;
    }

    // 创建顶点缓冲区
    const vertexBuffer = this.createFullScreenQuad();
    if (!vertexBuffer) {
      this.gl.deleteTexture(texture);
      return null;
    }

    try {
      // 使用着色器程序
      this.gl.useProgram(this.program);

      // 设置顶点属性
      this.setupVertexAttributes();

      // 设置uniform变量
      this.setColorUniforms();

      // 绘制
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      return this.webglCanvas;
    } finally {
      // 清理资源
      this.gl.deleteTexture(texture);
      this.gl.deleteBuffer(vertexBuffer);
    }
  }

  /**
   * 设置颜色效果的uniform变量
   */
  private setColorUniforms(): void {
    if (!this.gl || !this.program) {
      return;
    }

    const currentTime = this.getAnimationTime();

    // 获取uniform位置
    const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    const strengthLocation = this.gl.getUniformLocation(this.program, 'u_strength');
    const effectTypeLocation = this.gl.getUniformLocation(this.program, 'u_effectType');
    const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');

    // 设置uniform值
    this.gl.uniform1f(timeLocation, currentTime);
    this.gl.uniform1f(strengthLocation, this.colorConfig.strength);
    this.gl.uniform2f(resolutionLocation, this.webglCanvas!.width, this.webglCanvas!.height);

    // 效果类型映射
    const effectTypeMap: { [key: string]: number } = {
      grayscale: 0,
      sepia: 1
    };
    this.gl.uniform1i(effectTypeLocation, effectTypeMap[this.colorConfig.effectType] || 0);
  }

  /**
   * Canvas 2D实现：软件颜色转换
   */
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    // 如果强度为0，创建原图副本
    if (this.colorConfig.strength <= 0) {
      const outputCanvas = this.createOutputCanvas(canvas);
      return outputCanvas ? outputCanvas.canvas : null;
    }

    // 检查是否使用CSS Filter API（如果支持）
    if (this.canUseCSSFilter()) {
      return this.applyCSSFilter(canvas);
    }

    // 使用像素级处理
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return null;
    }

    const { ctx } = outputCanvas;

    try {
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const currentTime = this.getAnimationTime();

      // 应用对应的颜色效果
      let processedImageData: ImageData;

      switch (this.colorConfig.effectType) {
        case 'grayscale':
          processedImageData = this.applyGrayscaleEffect(imageData, this.colorConfig.strength, currentTime);
          break;
        case 'sepia':
          processedImageData = this.applySepiaEffect(imageData, this.colorConfig.strength, currentTime);
          break;
        default:
          processedImageData = this.applyGrayscaleEffect(imageData, this.colorConfig.strength, currentTime);
      }

      // 清空画布并绘制处理后的图像
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(processedImageData, 0, 0);

      return outputCanvas.canvas;
    } catch (error) {
      console.warn('Canvas 2D color effect failed:', error);
      return null;
    }
  }

  /**
   * 检查是否可以使用CSS Filter API
   */
  private canUseCSSFilter(): boolean {
    // 检查全局配置或浏览器支持
    return !!(window as any).useFilterAPI && typeof CSS !== 'undefined' && CSS.supports?.('filter', 'grayscale(1)');
  }

  /**
   * 使用CSS Filter API应用颜色效果
   */
  private applyCSSFilter(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    try {
      const outputCanvas = ImageProcessUtils.createTempCanvas(canvas.width, canvas.height);
      const ctx = outputCanvas.getContext('2d');
      if (!ctx) {
        return null;
      }

      // 计算动态强度
      const currentTime = this.getAnimationTime();
      const dynamicStrength = ImageProcessUtils.calculateDynamicStrength(this.colorConfig.strength, currentTime);

      // 应用CSS滤镜
      let filterValue = '';
      if (this.colorConfig.effectType === 'grayscale') {
        filterValue = `grayscale(${Math.min(1, dynamicStrength)})`;
      } else if (this.colorConfig.effectType === 'sepia') {
        filterValue = `sepia(${Math.min(1, dynamicStrength)})`;
      }

      ctx.filter = filterValue;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';

      return outputCanvas;
    } catch (error) {
      console.warn('CSS Filter API failed, falling back to pixel processing:', error);
      return null;
    }
  }

  /**
   * Canvas 2D灰度效果实现
   */
  private applyGrayscaleEffect(imageData: ImageData, strength: number, time: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);

    // 计算动态强度
    const dynamicStrength = ImageProcessUtils.calculateDynamicStrength(strength, time);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // 使用标准亮度公式计算灰度值
      const gray = ImageProcessUtils.getLuminance(r, g, b);

      // 根据动态强度混合原色和灰度色
      result[i] = Math.round(ImageProcessUtils.lerp(r, gray, dynamicStrength));
      result[i + 1] = Math.round(ImageProcessUtils.lerp(g, gray, dynamicStrength));
      result[i + 2] = Math.round(ImageProcessUtils.lerp(b, gray, dynamicStrength));
      result[i + 3] = a;
    }

    return new ImageData(result, width, height);
  }

  /**
   * Canvas 2D褐色调效果实现
   */
  private applySepiaEffect(imageData: ImageData, strength: number, time: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);

    // 计算动态强度
    const dynamicStrength = ImageProcessUtils.calculateDynamicStrength(strength, time);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // 使用工具类计算褐色调
      const [sepiaR, sepiaG, sepiaB] = ImageProcessUtils.applySepiaToPixel(r, g, b);

      // 根据动态强度混合原色和褐色调
      result[i] = Math.round(ImageProcessUtils.lerp(r, sepiaR, dynamicStrength));
      result[i + 1] = Math.round(ImageProcessUtils.lerp(g, sepiaG, dynamicStrength));
      result[i + 2] = Math.round(ImageProcessUtils.lerp(b, sepiaB, dynamicStrength));
      result[i + 3] = a;
    }

    return new ImageData(result, width, height);
  }

  /**
   * 重写主要渲染方法，添加CSS Filter快速路径
   */
  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    // 检查是否使用CSS Filter API作为快速路径
    if (this.canUseCSSFilter() && this.colorConfig.strength > 0) {
      const cssResult = this.applyCSSFilter(canvas);
      if (cssResult) {
        return cssResult;
      }
    }

    // 调用父类的智能渲染选择逻辑
    return super.afterStageRender(stage, canvas);
  }
}
