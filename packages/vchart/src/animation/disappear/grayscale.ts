import { AStageAnimate } from '@visactor/vrender-animate';
import { vglobal, EasingType } from '@visactor/vrender-core';

// 颜色效果配置接口
export interface ColorEffectConfig {
  effectType: 'grayscale' | 'sepia';
  strength: number;
  useWebGL: boolean;
}

export class Grayscale extends AStageAnimate<any> {
  private webglCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private currentAnimationRatio = 0; // 当前动画进度比例 0-1
  private animationTime = 0; // 基于动画进度的时间值

  // 颜色效果配置
  private colorConfig: ColorEffectConfig;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化颜色效果配置，使用传入的参数或默认值
    this.colorConfig = {
      effectType: params?.options?.effectType || 'grayscale', // 'grayscale' | 'sepia'
      strength: params?.options?.strength || 1.0, // 0.0 - 1.0
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true // 是否使用WebGL实现
    };
  }

  // 重写onUpdate方法，接收动画进度
  onUpdate(end: boolean, ratio: number, out: any): void {
    super.onUpdate(end, ratio, out);
    this.currentAnimationRatio = ratio;

    // 根据动画进度计算时间值，用于动态效果
    // ratio是经过easing处理的进度值，范围0-1
    this.animationTime = ratio * Math.PI * 2; // 转换为0-2π范围，适合三角函数
  }

  // 获取动画系统的时间
  private getAnimationTime(): number {
    // 优先使用基于动画进度的时间
    if (this.currentAnimationRatio > 0) {
      return this.animationTime;
    }
    // 如果动画未运行，返回连续时间作为后备
    return Date.now() / 1000.0;
  }

  // WebGL 着色器实现 (性能最佳)
  private initWebGL(canvas: HTMLCanvasElement): boolean {
    try {
      // 创建WebGL专用canvas
      this.webglCanvas = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });

      if (!this.webglCanvas) {
        console.warn('WebGL canvas creation failed');
        return false;
      }

      this.webglCanvas.style.width = canvas.style.width || `${canvas.width}px`;
      this.webglCanvas.style.height = canvas.style.height || `${canvas.height}px`;

      let glContext: WebGLRenderingContext | null = null;
      try {
        glContext = this.webglCanvas.getContext('webgl') as WebGLRenderingContext;
        if (!glContext) {
          glContext = this.webglCanvas.getContext('experimental-webgl') as WebGLRenderingContext;
        }
      } catch (e) {
        console.warn('Failed to get WebGL context:', e);
      }

      this.gl = glContext;
      if (!this.gl) {
        console.warn('WebGL not supported, falling back to Canvas 2D');
        return false;
      }

      // 顶点着色器
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;

        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;

      // 片元着色器 - 实现灰度和褐色调效果
      const fragmentShaderSource = `
          precision mediump float;
          uniform sampler2D u_texture;
          uniform float u_time;
          uniform float u_strength;
          uniform int u_effectType;
          uniform vec2 u_resolution;
          varying vec2 v_texCoord;

          // 灰度转换函数 - 使用标准亮度公式
          float luminance(vec3 color) {
            return dot(color, vec3(0.299, 0.587, 0.114));
          }

          // 褐色调函数
          vec3 sepia(vec3 color) {
            float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
            float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
            float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
            return vec3(r, g, b);
          }        void main() {
          vec2 uv = v_texCoord;
          vec4 originalColor = texture2D(u_texture, uv);
          vec3 color = originalColor.rgb;

          if (u_effectType == 0) {
            // 灰度效果 - 线性增长的动态强度
            float gray = luminance(color);
            vec3 grayColor = vec3(gray);
            float dynamicStrength = u_strength * (u_time / 6.28318531); // 时间范围0-2π，标准化到0-1
            color = mix(color, grayColor, dynamicStrength);
          } else if (u_effectType == 1) {
            // 褐色调效果 - 线性增长的动态强度
            vec3 sepiaColor = sepia(color);
            float dynamicStrength = u_strength * (u_time / 6.28318531); // 时间范围0-2π，标准化到0-1
            color = mix(color, sepiaColor, dynamicStrength);
          }

          gl_FragColor = vec4(color, originalColor.a);
        }
      `;

      this.program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);
      return this.program !== null;
    } catch (error) {
      console.warn('Failed to initialize WebGL:', error);
      return false;
    }
  }

  private createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
    if (!this.gl) {
      return null;
    }

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = this.gl.createProgram();
    if (!program) {
      return null;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Shader program link error:', this.gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) {
      return null;
    }

    const shader = this.gl.createShader(type);
    if (!shader) {
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private applyWebGLColorEffect(canvas: HTMLCanvasElement): HTMLCanvasElement {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return canvas;
    }

    const gl = this.gl;

    // 确保WebGL canvas尺寸正确
    if (this.webglCanvas.width !== canvas.width || this.webglCanvas.height !== canvas.height) {
      this.webglCanvas.width = canvas.width;
      this.webglCanvas.height = canvas.height;
    }

    gl.viewport(0, 0, this.webglCanvas.width, this.webglCanvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 创建纹理
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 创建顶点缓冲区
    const vertices = new Float32Array([
      // 位置      纹理坐标
      -1,
      -1,
      0,
      1, // 左下角 -> 左上角纹理
      1,
      -1,
      1,
      1, // 右下角 -> 右上角纹理
      -1,
      1,
      0,
      0, // 左上角 -> 左下角纹理
      1,
      1,
      1,
      0 // 右上角 -> 右下角纹理
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(this.program);

    // 设置属性
    const positionLocation = gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    // 设置uniform
    const timeLocation = gl.getUniformLocation(this.program, 'u_time');
    const strengthLocation = gl.getUniformLocation(this.program, 'u_strength');
    const effectTypeLocation = gl.getUniformLocation(this.program, 'u_effectType');
    const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');

    // 使用基于父类动画系统的时间
    const controlledTime = this.getAnimationTime();

    gl.uniform1f(timeLocation, controlledTime);
    gl.uniform1f(strengthLocation, this.colorConfig.strength);
    gl.uniform2f(resolutionLocation, this.webglCanvas.width, this.webglCanvas.height);

    const effectTypeMap: { [key: string]: number } = {
      grayscale: 0,
      sepia: 1
    };
    gl.uniform1i(effectTypeLocation, effectTypeMap[this.colorConfig.effectType] || 0);

    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 清理
    gl.deleteTexture(texture);
    gl.deleteBuffer(vertexBuffer);

    return this.webglCanvas;
  }

  // Canvas 2D 实现 - 灰度效果（线性增长动态效果）
  private applyGrayscaleEffect(imageData: ImageData, strength: number, time: number = 0): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);

    // 线性增长的动态强度 - 时间范围0-2π，标准化到0-1
    const dynamicStrength = strength * (time / (Math.PI * 2));

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // 使用标准亮度公式计算灰度值
      const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);

      // 根据动态强度混合原色和灰度色
      result[i] = Math.round(r * (1 - dynamicStrength) + gray * dynamicStrength);
      result[i + 1] = Math.round(g * (1 - dynamicStrength) + gray * dynamicStrength);
      result[i + 2] = Math.round(b * (1 - dynamicStrength) + gray * dynamicStrength);
      result[i + 3] = a;
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 褐色调效果（线性增长动态效果）
  private applySepiaEffect(imageData: ImageData, strength: number, time: number = 0): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);

    // 线性增长的动态强度 - 时间范围0-2π，标准化到0-1
    const dynamicStrength = strength * (time / (Math.PI * 2));

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // 褐色调矩阵变换
      const sepiaR = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      const sepiaG = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      const sepiaB = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);

      result[i] = Math.round(r * (1 - dynamicStrength) + sepiaR * dynamicStrength);
      result[i + 1] = Math.round(g * (1 - dynamicStrength) + sepiaG * dynamicStrength);
      result[i + 2] = Math.round(b * (1 - dynamicStrength) + sepiaB * dynamicStrength);
      result[i + 3] = a;
    }

    return new ImageData(result, width, height);
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    // 检查是否使用原生filter API
    if ((window as any).useFilterAPI) {
      const c = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });
      const ctx = c.getContext('2d');
      if (!ctx) {
        return false;
      }

      // 使用CSS filter API
      ctx.filter = 'grayscale(100%) sepia(50%)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none'; // 重置filter

      return c;
    }

    // 如果强度为0，直接返回原图
    if (this.colorConfig.strength <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    if (this.colorConfig.useWebGL) {
      // 使用WebGL实现
      if (!this.gl && !this.initWebGL(canvas)) {
        this.colorConfig.useWebGL = false;
      }

      if (this.gl) {
        result = this.applyWebGLColorEffect(canvas);
      } else {
        result = canvas;
      }
    } else {
      // 使用Canvas 2D实现
      const c = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });
      const ctx = c.getContext('2d');
      if (!ctx) {
        return false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // 使用基于父类动画系统的时间
      const controlledTime = this.getAnimationTime();

      let processedImageData: ImageData;

      switch (this.colorConfig.effectType) {
        case 'grayscale':
          processedImageData = this.applyGrayscaleEffect(imageData, this.colorConfig.strength, controlledTime);
          break;
        case 'sepia':
          processedImageData = this.applySepiaEffect(imageData, this.colorConfig.strength, controlledTime);
          break;
        default:
          processedImageData = imageData;
      }

      ctx.putImageData(processedImageData, 0, 0);
      result = c;
    }

    return result;
  }
}
