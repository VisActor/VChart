import { AStageAnimate } from '@visactor/vrender-animate';
import { vglobal, EasingType } from '@visactor/vrender-core';

// 向外溶解效果配置接口
export interface DissolveConfig {
  dissolveType?: 'outward' | 'inward' | 'radial' | 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'; // 溶解效果类型
  useWebGL?: boolean; // 是否使用WebGL实现
  noiseScale?: number; // 溶解颗粒大小(像素值，0为平滑溶解，1-20为颗粒溶解)
  fadeEdge?: boolean; // 是否启用边缘渐变
}

export class Dissolve extends AStageAnimate<any> {
  private webglCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private currentAnimationRatio: number = 0;
  private noiseData: Uint8Array | null = null;

  // 溶解配置
  private dissolveConfig: Required<DissolveConfig>;

  constructor(from: null, to: null, duration: number, easing: any, params: any) {
    super(from, to, duration, easing, params);

    // 初始化溶解配置，使用传入的参数或默认值
    this.dissolveConfig = {
      dissolveType: params?.options?.dissolveType || 'outward',
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true,
      noiseScale: params?.options?.noiseScale !== undefined ? Math.max(0, Math.floor(params.options.noiseScale)) : 8, // 确保是非负整数，默认8px颗粒，0为平滑
      fadeEdge: params?.options?.fadeEdge !== undefined ? params.options.fadeEdge : true
    };
  }

  onUpdate(end: boolean, ratio: number, out: any): void {
    super.onUpdate(end, ratio, out);
    this.currentAnimationRatio = ratio; // ratio已经经过easing函数处理
  }

  // 生成噪声纹理数据
  private generateNoiseTexture(width: number, height: number): Uint8Array {
    const data = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i++) {
      // 使用简单的伪随机噪声
      data[i] = Math.floor(Math.random() * 256);
    }
    return data;
  }

  // WebGL 着色器实现 (性能最佳)
  private initWebGL(canvas: HTMLCanvasElement): boolean {
    try {
      // 创建WebGL专用的canvas
      this.webglCanvas = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });

      if (!this.webglCanvas) {
        console.warn('WebGL canvas creation failed');
        return false;
      }

      // 确保WebGL canvas的显示尺寸正确
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

      // 顶点着色器源码
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;

        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;

      // 片元着色器源码，实现多种溶解效果
      const fragmentShaderSource = `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform sampler2D u_noiseTexture;
        uniform float u_time;
        uniform int u_dissolveType;
        uniform vec2 u_resolution;
        uniform float u_noiseScale;
        uniform bool u_fadeEdge;
        varying vec2 v_texCoord;

        // 简单噪声函数 - 基于像素网格
        float pixelNoise(vec2 coord, float pixelSize) {
          // 将坐标映射到像素网格
          vec2 gridCoord = floor(coord / pixelSize) * pixelSize;
          return fract(sin(dot(gridCoord, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        // 向外溶解函数
        float outwardDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          vec2 center = vec2(0.5, 0.5);
          float distFromCenter = length(uv - center);
          float maxDist = length(vec2(0.5, 0.5));

          // 归一化距离 (0为中心，1为边缘)
          float normalizedDist = distFromCenter / maxDist;

          // 向外溶解：从边缘开始溶解，time控制溶解进度
          // 增加安全边距，确保动画结束时完全溶解
          float edgeThreshold = 1.2 - time * 1.5;

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            // 添加基于像素大小的噪声，让边缘呈现颗粒状
            vec2 pixelCoord = uv * resolution; // 转换为像素坐标
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.4; // 增强噪声影响
            edgeThreshold += noiseInfluence;
            return normalizedDist > edgeThreshold ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.15; // 渐变宽度
              return 1.0 - smoothstep(edgeThreshold - fadeWidth, edgeThreshold, normalizedDist);
            } else {
              // 硬边缘：返回0或1
              return normalizedDist > edgeThreshold ? 0.0 : 1.0;
            }
          }
        }

        // 向内溶解函数
        float inwardDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          vec2 center = vec2(0.5, 0.5);
          float distFromCenter = length(uv - center);
          float maxDist = length(vec2(0.5, 0.5));

          float normalizedDist = distFromCenter / maxDist;

          // 向内溶解：从中心开始溶解，time控制溶解进度
          // 增加系数，确保动画结束时完全溶解
          float centerThreshold = time * 1.4;

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            vec2 pixelCoord = uv * resolution;
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.4;
            centerThreshold += noiseInfluence;
            return normalizedDist < centerThreshold ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.15; // 渐变宽度
              return smoothstep(centerThreshold, centerThreshold + fadeWidth, normalizedDist);
            } else {
              // 硬边缘：返回0或1
              return normalizedDist < centerThreshold ? 0.0 : 1.0;
            }
          }
        }

        // 径向溶解函数
        float radialDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          vec2 center = vec2(0.5, 0.5);
          float angle = atan(uv.y - center.y, uv.x - center.x);
          float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);

          // 径向溶解：按角度顺序溶解，time控制溶解进度
          // 增加系数，确保动画结束时完全溶解
          float angleThreshold = time * 1.2;

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            vec2 pixelCoord = uv * resolution;
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.3;
            angleThreshold += noiseInfluence;
            return normalizedAngle < angleThreshold ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.08; // 渐变宽度
              return smoothstep(angleThreshold, angleThreshold + fadeWidth, normalizedAngle);
            } else {
              // 硬边缘：返回0或1
              return normalizedAngle < angleThreshold ? 0.0 : 1.0;
            }
          }
        }

        // 从左到右溶解函数
        float leftToRightDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          // 左到右溶解：从x=0开始向x=1溶解
          float dissolvePosition = time * 1.2; // 增加系数确保完全溶解

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            vec2 pixelCoord = uv * resolution;
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.3;
            dissolvePosition += noiseInfluence;
            return uv.x < dissolvePosition ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.08; // 渐变宽度
              return smoothstep(dissolvePosition, dissolvePosition + fadeWidth, uv.x);
            } else {
              // 硬边缘：返回0或1
              return uv.x < dissolvePosition ? 0.0 : 1.0;
            }
          }
        }

        // 从右到左溶解函数
        float rightToLeftDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          // 右到左溶解：从x=1开始向x=0溶解
          float dissolvePosition = 1.0 - time * 1.2; // 增加系数确保完全溶解

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            vec2 pixelCoord = uv * resolution;
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.3;
            dissolvePosition += noiseInfluence;
            return uv.x > dissolvePosition ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.08; // 渐变宽度
              return smoothstep(dissolvePosition - fadeWidth, dissolvePosition, uv.x);
            } else {
              // 硬边缘：返回0或1
              return uv.x > dissolvePosition ? 0.0 : 1.0;
            }
          }
        }

        // 从上到下溶解函数
        float topToBottomDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          // 上到下溶解：从y=0开始向y=1溶解
          float dissolvePosition = time * 1.2; // 增加系数确保完全溶解

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            vec2 pixelCoord = uv * resolution;
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.3;
            dissolvePosition += noiseInfluence;
            return uv.y < dissolvePosition ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.08; // 渐变宽度
              return smoothstep(dissolvePosition, dissolvePosition + fadeWidth, uv.y);
            } else {
              // 硬边缘：返回0或1
              return uv.y < dissolvePosition ? 0.0 : 1.0;
            }
          }
        }

        // 从下到上溶解函数
        float bottomToTopDissolve(vec2 uv, float time, float pixelSize, vec2 resolution) {
          // 下到上溶解：从y=1开始向y=0溶解
          float dissolvePosition = 1.0 - time * 1.2; // 增加系数确保完全溶解

          // 当pixelSize > 0时添加颗粒效果
          if (pixelSize > 0.0) {
            vec2 pixelCoord = uv * resolution;
            float noiseValue = pixelNoise(pixelCoord, pixelSize);
            float noiseInfluence = (noiseValue - 0.5) * 0.3;
            dissolvePosition += noiseInfluence;
            return uv.y > dissolvePosition ? 0.0 : 1.0;
          } else {
            // 平滑溶解：根据fadeEdge决定是否使用渐变
            if (u_fadeEdge) {
              // 柔和边缘：返回渐变值
              float fadeWidth = 0.08; // 渐变宽度
              return smoothstep(dissolvePosition - fadeWidth, dissolvePosition, uv.y);
            } else {
              // 硬边缘：返回0或1
              return uv.y > dissolvePosition ? 0.0 : 1.0;
            }
          }
        }

        void main() {
          vec2 uv = v_texCoord;
          vec4 texColor = texture2D(u_texture, uv);

          float alpha = 1.0;

          // 根据溶解类型选择对应的溶解函数
          if (u_dissolveType == 0) {
            alpha = outwardDissolve(uv, u_time, u_noiseScale, u_resolution);
          } else if (u_dissolveType == 1) {
            alpha = inwardDissolve(uv, u_time, u_noiseScale, u_resolution);
          } else if (u_dissolveType == 2) {
            alpha = radialDissolve(uv, u_time, u_noiseScale, u_resolution);
          } else if (u_dissolveType == 3) {
            alpha = leftToRightDissolve(uv, u_time, u_noiseScale, u_resolution);
          } else if (u_dissolveType == 4) {
            alpha = rightToLeftDissolve(uv, u_time, u_noiseScale, u_resolution);
          } else if (u_dissolveType == 5) {
            alpha = topToBottomDissolve(uv, u_time, u_noiseScale, u_resolution);
          } else if (u_dissolveType == 6) {
            alpha = bottomToTopDissolve(uv, u_time, u_noiseScale, u_resolution);
          }

          gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
        }
      `;

      // 创建并编译着色器程序
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

  private applyWebGLDissolve(canvas: HTMLCanvasElement): HTMLCanvasElement {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return canvas;
    }

    const gl = this.gl;

    // 确保WebGL canvas尺寸正确
    if (this.webglCanvas.width !== canvas.width || this.webglCanvas.height !== canvas.height) {
      this.webglCanvas.width = canvas.width;
      this.webglCanvas.height = canvas.height;
    }

    // 设置视口
    gl.viewport(0, 0, this.webglCanvas.width, this.webglCanvas.height);

    // 清除画布
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 创建主纹理
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 创建噪声纹理
    if (!this.noiseData) {
      this.noiseData = this.generateNoiseTexture(256, 256);
    }
    const noiseTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 256, 256, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, this.noiseData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 创建顶点缓冲区
    const vertices = new Float32Array([
      -1,
      -1,
      0,
      1, // 左下角
      1,
      -1,
      1,
      1, // 右下角
      -1,
      1,
      0,
      0, // 左上角
      1,
      1,
      1,
      0 // 右上角
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 使用着色器程序
    gl.useProgram(this.program);

    // 设置属性
    const positionLocation = gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    // 设置uniform
    const textureLocation = gl.getUniformLocation(this.program, 'u_texture');
    const noiseTextureLocation = gl.getUniformLocation(this.program, 'u_noiseTexture');
    const timeLocation = gl.getUniformLocation(this.program, 'u_time');
    const dissolveTypeLocation = gl.getUniformLocation(this.program, 'u_dissolveType');
    const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
    const noiseScaleLocation = gl.getUniformLocation(this.program, 'u_noiseScale');
    const fadeEdgeLocation = gl.getUniformLocation(this.program, 'u_fadeEdge');

    // 使用当前动画进度，已经过easing函数处理
    const progress = this.currentAnimationRatio;

    gl.uniform1i(textureLocation, 0);
    gl.uniform1i(noiseTextureLocation, 1);
    gl.uniform1f(timeLocation, progress);
    gl.uniform2f(resolutionLocation, this.webglCanvas.width, this.webglCanvas.height);
    gl.uniform1f(noiseScaleLocation, this.dissolveConfig.noiseScale);
    gl.uniform1i(fadeEdgeLocation, this.dissolveConfig.fadeEdge ? 1 : 0);

    const dissolveTypeMap: { [key: string]: number } = {
      outward: 0,
      inward: 1,
      radial: 2,
      leftToRight: 3,
      rightToLeft: 4,
      topToBottom: 5,
      bottomToTop: 6
    };
    gl.uniform1i(dissolveTypeLocation, dissolveTypeMap[this.dissolveConfig.dissolveType] || 0);

    // 启用混合以支持透明度
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 清理
    gl.deleteTexture(texture);
    gl.deleteTexture(noiseTexture);
    gl.deleteBuffer(vertexBuffer);

    return this.webglCanvas;
  }

  // 基于像素网格的噪声函数
  private pixelNoise(x: number, y: number, pixelSize: number): number {
    // 将像素坐标映射到网格
    const gridX = Math.floor(x / pixelSize) * pixelSize;
    const gridY = Math.floor(y / pixelSize) * pixelSize;

    // 基于网格坐标生成伪随机值
    const n = Math.sin(gridX * 12.9898 + gridY * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  // Canvas 2D 实现 - 向外溶解
  private applyOutwardDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    // 直接使用noiseScale作为像素颗粒大小
    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        const normalizedDist = distFromCenter / maxDist;

        // 向外溶解：从边缘开始，增加安全边距确保完全溶解
        let dissolveThreshold = 1.2 - progress * 1.4;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果：使用基于像素网格的噪声，产生颗粒状效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.4; // 增强噪声影响
          dissolveThreshold += noiseInfluence;

          alpha = normalizedDist > dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.15; // 渐变宽度
            const fadeStart = dissolveThreshold - fadeWidth;
            const fadeEnd = dissolveThreshold;

            if (normalizedDist < fadeStart) {
              alpha = 1.0;
            } else if (normalizedDist > fadeEnd) {
              alpha = 0.0;
            } else {
              // 线性插值产生渐变
              alpha = 1.0 - (normalizedDist - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedDist > dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 向内溶解
  private applyInwardDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        const normalizedDist = distFromCenter / maxDist;

        // 向内溶解：从中心开始，增加系数确保完全溶解
        let dissolveThreshold = progress * 1.4;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.4;
          dissolveThreshold += noiseInfluence;

          alpha = normalizedDist < dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.15; // 渐变宽度
            const fadeStart = dissolveThreshold;
            const fadeEnd = dissolveThreshold + fadeWidth;

            if (normalizedDist < fadeStart) {
              alpha = 0.0;
            } else if (normalizedDist > fadeEnd) {
              alpha = 1.0;
            } else {
              // 线性插值产生渐变
              alpha = (normalizedDist - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedDist < dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 径向溶解
  private applyRadialDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const centerX = width / 2;
    const centerY = height / 2;
    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);

        // 径向溶解：按角度顺序，增加系数确保完全溶解
        let dissolveThreshold = progress * 1.2;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.3;
          dissolveThreshold += noiseInfluence;

          alpha = normalizedAngle < dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.08; // 渐变宽度
            const fadeStart = dissolveThreshold;
            const fadeEnd = dissolveThreshold + fadeWidth;

            if (normalizedAngle < fadeStart) {
              alpha = 0.0;
            } else if (normalizedAngle > fadeEnd) {
              alpha = 1.0;
            } else {
              // 线性插值产生渐变
              alpha = (normalizedAngle - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedAngle < dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 从左到右溶解
  private applyLeftToRightDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;

        // 从左到右溶解：增加系数确保完全溶解
        let dissolveThreshold = progress * 1.2;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.3;
          dissolveThreshold += noiseInfluence;

          alpha = normalizedX < dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.08; // 渐变宽度
            const fadeStart = dissolveThreshold;
            const fadeEnd = dissolveThreshold + fadeWidth;

            if (normalizedX < fadeStart) {
              alpha = 0.0;
            } else if (normalizedX > fadeEnd) {
              alpha = 1.0;
            } else {
              // 线性插值产生渐变
              alpha = (normalizedX - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedX < dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 从右到左溶解
  private applyRightToLeftDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;

        // 从右到左溶解：增加系数确保完全溶解
        let dissolveThreshold = 1.0 - progress * 1.2;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.3;
          dissolveThreshold += noiseInfluence;

          alpha = normalizedX > dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.08; // 渐变宽度
            const fadeStart = dissolveThreshold - fadeWidth;
            const fadeEnd = dissolveThreshold;

            if (normalizedX < fadeStart) {
              alpha = 1.0;
            } else if (normalizedX > fadeEnd) {
              alpha = 0.0;
            } else {
              // 线性插值产生渐变
              alpha = 1.0 - (normalizedX - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedX > dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 从上到下溶解
  private applyTopToBottomDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalizedY = y / height;

        // 从上到下溶解：增加系数确保完全溶解
        let dissolveThreshold = progress * 1.2;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.3;
          dissolveThreshold += noiseInfluence;

          alpha = normalizedY < dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.08; // 渐变宽度
            const fadeStart = dissolveThreshold;
            const fadeEnd = dissolveThreshold + fadeWidth;

            if (normalizedY < fadeStart) {
              alpha = 0.0;
            } else if (normalizedY > fadeEnd) {
              alpha = 1.0;
            } else {
              // 线性插值产生渐变
              alpha = (normalizedY - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedY < dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  // Canvas 2D 实现 - 从下到上溶解
  private applyBottomToTopDissolve(imageData: ImageData, progress: number): ImageData {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data.length);
    result.set(data);

    const pixelSize = this.dissolveConfig.noiseScale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalizedY = y / height;

        // 从下到上溶解：增加系数确保完全溶解
        let dissolveThreshold = 1.0 - progress * 1.2;
        let alpha = 1.0;

        if (pixelSize > 0) {
          // 颗粒效果
          const noiseValue = this.pixelNoise(x, y, pixelSize);
          const noiseInfluence = (noiseValue - 0.5) * 0.3;
          dissolveThreshold += noiseInfluence;

          alpha = normalizedY > dissolveThreshold ? 0.0 : 1.0;
        } else {
          // 平滑溶解：根据fadeEdge决定是否使用渐变
          if (this.dissolveConfig.fadeEdge) {
            // 柔和边缘：使用渐变值
            const fadeWidth = 0.08; // 渐变宽度
            const fadeStart = dissolveThreshold - fadeWidth;
            const fadeEnd = dissolveThreshold;

            if (normalizedY < fadeStart) {
              alpha = 1.0;
            } else if (normalizedY > fadeEnd) {
              alpha = 0.0;
            } else {
              // 线性插值产生渐变
              alpha = 1.0 - (normalizedY - fadeStart) / (fadeEnd - fadeStart);
            }
          } else {
            // 硬边缘：使用0或1
            alpha = normalizedY > dissolveThreshold ? 0.0 : 1.0;
          }
        }

        const index = (y * width + x) * 4;
        result[index + 3] = Math.floor(result[index + 3] * alpha);
      }
    }

    return new ImageData(result, width, height);
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    let result: HTMLCanvasElement;

    if (this.dissolveConfig.useWebGL) {
      // 使用WebGL实现（性能最佳）
      if (!this.gl && !this.initWebGL(canvas)) {
        // WebGL初始化失败，回退到Canvas 2D
        this.dissolveConfig.useWebGL = false;
      }

      if (this.gl) {
        result = this.applyWebGLDissolve(canvas);
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
      // 使用当前动画进度，已经过easing函数处理
      const progress = this.currentAnimationRatio;

      let dissolvedImageData: ImageData;

      switch (this.dissolveConfig.dissolveType) {
        case 'outward':
          dissolvedImageData = this.applyOutwardDissolve(imageData, progress);
          break;
        case 'inward':
          dissolvedImageData = this.applyInwardDissolve(imageData, progress);
          break;
        case 'radial':
          dissolvedImageData = this.applyRadialDissolve(imageData, progress);
          break;
        case 'leftToRight':
          dissolvedImageData = this.applyLeftToRightDissolve(imageData, progress);
          break;
        case 'rightToLeft':
          dissolvedImageData = this.applyRightToLeftDissolve(imageData, progress);
          break;
        case 'topToBottom':
          dissolvedImageData = this.applyTopToBottomDissolve(imageData, progress);
          break;
        case 'bottomToTop':
          dissolvedImageData = this.applyBottomToTopDissolve(imageData, progress);
          break;
        default:
          dissolvedImageData = imageData;
      }

      ctx.putImageData(dissolvedImageData, 0, 0);
      result = c;
    }
    return result;
  }
}
