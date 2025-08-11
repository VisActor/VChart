import { AStageAnimate } from '@visactor/vrender-animate';
import { vglobal, EasingType } from '@visactor/vrender-core';

/**
 * 特效动画基类，提取公共的WebGL和Canvas 2D操作
 */
export abstract class DisappearAnimateBase<T = any> extends AStageAnimate<T> {
  protected webglCanvas: HTMLCanvasElement | null = null;
  protected gl: WebGLRenderingContext | null = null;
  protected program: WebGLProgram | null = null;
  protected currentAnimationRatio = 0;
  protected animationTime = 0;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);
  }

  onUpdate(end: boolean, ratio: number, out: any): void {
    super.onUpdate(end, ratio, out);
    this.currentAnimationRatio = ratio;
    this.animationTime = ratio * Math.PI * 2;
  }

  /**
   * 获取基于动画进度的时间
   */
  protected getAnimationTime(): number {
    if (this.currentAnimationRatio > 0) {
      return this.animationTime;
    }
    return Date.now() / 1000.0;
  }

  /**
   * 获取动画持续时间
   */
  protected getDurationFromParent(): number {
    return this.duration || 1000;
  }

  /**
   * 初始化WebGL上下文 - WebGL公共逻辑
   */
  protected initWebGL(canvas: HTMLCanvasElement): boolean {
    try {
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
        console.warn('WebGL not supported');
        return false;
      }

      const shaders = this.getShaderSources();
      this.program = this.createShaderProgram(shaders.vertex, shaders.fragment);
      return this.program !== null;
    } catch (error) {
      console.warn('Failed to initialize WebGL:', error);
      return false;
    }
  }

  /**
   * 创建着色器程序 - WebGL公共逻辑
   */
  protected createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
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

  /**
   * 创建着色器 - WebGL公共逻辑
   */
  protected createShader(type: number, source: string): WebGLShader | null {
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

  /**
   * 设置WebGL视口和基本状态 - WebGL公共逻辑
   */
  protected setupWebGLState(canvas: HTMLCanvasElement): void {
    if (!this.gl || !this.webglCanvas) {
      return;
    }

    // 确保WebGL canvas尺寸正确
    if (this.webglCanvas.width !== canvas.width || this.webglCanvas.height !== canvas.height) {
      this.webglCanvas.width = canvas.width;
      this.webglCanvas.height = canvas.height;
    }

    this.gl.viewport(0, 0, this.webglCanvas.width, this.webglCanvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * 创建标准的全屏四边形顶点缓冲区 - WebGL公共逻辑
   */
  protected createFullScreenQuad(): WebGLBuffer | null {
    if (!this.gl) {
      return null;
    }

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

    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    return vertexBuffer;
  }

  /**
   * 创建纹理 - WebGL公共逻辑
   */
  protected createTextureFromCanvas(canvas: HTMLCanvasElement): WebGLTexture | null {
    if (!this.gl) {
      return null;
    }

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  /**
   * 设置顶点属性 - WebGL公共逻辑
   */
  protected setupVertexAttributes(): void {
    if (!this.gl || !this.program) {
      return;
    }

    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);

    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
  }

  /**
   * 创建Canvas 2D输出画布 - Canvas 2D公共逻辑
   */
  protected createOutputCanvas(
    canvas: HTMLCanvasElement
  ): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
    const outputCanvas = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas, 0, 0);

    return { canvas: outputCanvas, ctx };
  }

  // 可选的抽象方法，由子类选择性实现
  protected getShaderSources(): { vertex: string; fragment: string } | null {
    // 默认返回null，表示不支持WebGL实现
    return null;
  }

  protected applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    // 默认返回null，表示不支持WebGL实现
    return null;
  }

  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    // 默认返回null，表示不支持Canvas 2D实现
    return null;
  }

  /**
   * 检查是否支持WebGL实现
   */
  protected supportsWebGL(): boolean {
    return this.getShaderSources() !== null;
  }

  /**
   * 检查是否支持Canvas 2D实现
   */
  protected supportsCanvas2D(): boolean {
    // 通过尝试调用来检查是否有实现
    // 这里通过检查方法是否被重写来判断
    return this.applyCanvas2DEffect !== DisappearAnimateBase.prototype.applyCanvas2DEffect;
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    let result: HTMLCanvasElement | null = null;

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

    // 尝试Canvas 2D实现
    if (this.supportsCanvas2D()) {
      result = this.applyCanvas2DEffect(canvas);
      if (result) {
        return result;
      } else {
        console.warn('Canvas 2D特效执行失败');
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
