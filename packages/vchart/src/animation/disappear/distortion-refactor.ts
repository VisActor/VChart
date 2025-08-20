import { EasingType } from '@visactor/vrender-core';
import { HybridEffectBase } from './base/CustomEffectBase';

// 扭曲效果配置接口
export interface DistortionConfig {
  distortionType?: 'wave' | 'ripple' | 'swirl'; // 扭曲效果类型
  strength?: number; // 扭曲强度
  useWebGL?: boolean; // 是否使用WebGL实现
}
/**
 * 扭曲消失动画效果 - 重构版
 * 使用HybridEffectBase实现WebGL和Canvas 2D双重支持
 */
export class DistortionDisintegrationRefactor extends HybridEffectBase {
  private distortionConfig: Partial<DistortionConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    this.distortionConfig = {
      distortionType: params?.options?.distortionType || 'wave',
      strength: params?.options?.strength || 0.3,
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true
    };
  }

  /**
   * WebGL实现：着色器扭曲效果
   */
  protected getShaderSources(): { vertex: string; fragment: string } | null {
    const vertexShader = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_strength;
      uniform int u_distortionType;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      // 波浪扭曲函数
      vec2 wave(vec2 uv, float time, float strength) {
        float waveX = sin(uv.y * 10.0 + time * 3.0) * strength * 0.1;
        float waveY = sin(uv.x * 10.0 + time * 2.0) * strength * 0.1;
        return uv + vec2(waveX, waveY);
      }

      // 涟漪扭曲函数
      vec2 ripple(vec2 uv, float time, float strength) {
        vec2 center = vec2(0.5, 0.5);
        float distance = length(uv - center);
        float ripple = sin(distance * 20.0 - time * 5.0) * strength * 0.1;
        vec2 direction = normalize(uv - center);
        return uv + direction * ripple;
      }

      // 漩涡扭曲函数
      vec2 swirl(vec2 uv, float time, float strength) {
        vec2 center = vec2(0.5, 0.5);
        vec2 delta = uv - center;
        float dist = length(delta);
        float originalAngle = atan(delta.y, delta.x);
        float rotationAngle = dist * strength * time * 2.0;
        float finalAngle = originalAngle + rotationAngle;
        return center + dist * vec2(cos(finalAngle), sin(finalAngle));
      }

      void main() {
        vec2 uv = v_texCoord;

        // 根据扭曲类型应用相应变换
        if (u_distortionType == 0) {
          uv = wave(uv, u_time, u_strength);
        } else if (u_distortionType == 1) {
          uv = ripple(uv, u_time, u_strength);
        } else if (u_distortionType == 2) {
          uv = swirl(uv, u_time, u_strength);
        }

        // 边界检查
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        } else {
          gl_FragColor = texture2D(u_texture, uv);
        }
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
      this.setDistortionUniforms();

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
   * 设置扭曲效果的uniform变量
   */
  private setDistortionUniforms(): void {
    if (!this.gl || !this.program) {
      return;
    }

    const currentTime = this.getAnimationTime();

    // 获取uniform位置
    const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    const strengthLocation = this.gl.getUniformLocation(this.program, 'u_strength');
    const distortionTypeLocation = this.gl.getUniformLocation(this.program, 'u_distortionType');
    const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');

    // 设置uniform值
    this.gl.uniform1f(timeLocation, currentTime);
    this.gl.uniform1f(strengthLocation, this.distortionConfig.strength);
    this.gl.uniform2f(resolutionLocation, this.webglCanvas!.width, this.webglCanvas!.height);

    // 扭曲类型映射
    const distortionTypeMap: { [key: string]: number } = {
      wave: 0,
      ripple: 1,
      swirl: 2
    };
    this.gl.uniform1i(distortionTypeLocation, distortionTypeMap[this.distortionConfig.distortionType] || 0);
  }

  /**
   * Canvas 2D实现：软件扭曲效果
   */
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return null;
    }

    const { ctx } = outputCanvas;

    try {
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const currentTime = this.getAnimationTime();

      // 应用对应的扭曲算法
      let distortedImageData: ImageData;

      switch (this.distortionConfig.distortionType) {
        case 'wave':
          distortedImageData = this.applyWaveDistortion(imageData, this.distortionConfig.strength, currentTime);
          break;
        case 'ripple':
          distortedImageData = this.applyRippleDistortion(imageData, this.distortionConfig.strength, currentTime);
          break;
        case 'swirl':
          distortedImageData = this.applySwirlDistortion(imageData, this.distortionConfig.strength, currentTime);
          break;
        default:
          distortedImageData = imageData;
      }

      // 清空画布并绘制扭曲后的图像
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(distortedImageData, 0, 0);

      return outputCanvas.canvas;
    } catch (error) {
      console.warn('Canvas 2D distortion effect failed:', error);
      return null;
    }
  }

  /**
   * Canvas 2D波浪扭曲实现
   */
  private applyWaveDistortion(imageData: ImageData, strength: number, time: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // 波浪扭曲计算
        const waveX = Math.sin(y * 0.1 + time * 3) * strength * 20;
        const waveY = Math.sin(x * 0.1 + time * 2) * strength * 20;

        const sourceX = Math.round(x - waveX);
        const sourceY = Math.round(y - waveY);

        const targetIndex = (y * width + x) * 4;

        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          result[targetIndex] = data[sourceIndex];
          result[targetIndex + 1] = data[sourceIndex + 1];
          result[targetIndex + 2] = data[sourceIndex + 2];
          result[targetIndex + 3] = data[sourceIndex + 3];
        } else {
          result[targetIndex + 3] = 0; // 透明
        }
      }
    }

    return new ImageData(result, width, height);
  }

  /**
   * Canvas 2D涟漪扭曲实现
   */
  private applyRippleDistortion(imageData: ImageData, strength: number, time: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 涟漪效果
        const ripple = Math.sin(distance * 0.2 - time * 5) * strength * 10;
        const angle = Math.atan2(dy, dx);

        const sourceX = Math.round(x - Math.cos(angle) * ripple);
        const sourceY = Math.round(y - Math.sin(angle) * ripple);

        const targetIndex = (y * width + x) * 4;

        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          result[targetIndex] = data[sourceIndex];
          result[targetIndex + 1] = data[sourceIndex + 1];
          result[targetIndex + 2] = data[sourceIndex + 2];
          result[targetIndex + 3] = data[sourceIndex + 3];
        } else {
          result[targetIndex + 3] = 0;
        }
      }
    }

    return new ImageData(result, width, height);
  }

  /**
   * Canvas 2D漩涡扭曲实现
   */
  private applySwirlDistortion(imageData: ImageData, strength: number, time: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const originalAngle = Math.atan2(dy, dx);

        // 旋转角度随时间和强度增长
        const rotationAngle = distance * strength * time * 0.02;
        const finalAngle = originalAngle + rotationAngle;

        const sourceX = Math.round(centerX + distance * Math.cos(finalAngle));
        const sourceY = Math.round(centerY + distance * Math.sin(finalAngle));

        const targetIndex = (y * width + x) * 4;

        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          result[targetIndex] = data[sourceIndex];
          result[targetIndex + 1] = data[sourceIndex + 1];
          result[targetIndex + 2] = data[sourceIndex + 2];
          result[targetIndex + 3] = data[sourceIndex + 3];
        } else {
          result[targetIndex + 3] = 0;
        }
      }
    }

    return new ImageData(result, width, height);
  }

  /**
   * 重写主要渲染方法，添加强度检查
   */
  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    // 如果强度为0，直接返回原图
    if (this.distortionConfig.strength <= 0) {
      return canvas;
    }

    // 调用父类的智能渲染选择逻辑
    return super.afterStageRender(stage, canvas);
  }
}
