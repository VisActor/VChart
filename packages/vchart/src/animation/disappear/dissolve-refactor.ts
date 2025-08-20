import { EasingType } from '@visactor/vrender-core';
import { HybridEffectBase } from './base/CustomEffectBase';
import { ImageProcessUtils, ShaderLibrary } from './base/ImageProcessUtils';

// 向外溶解效果配置接口
export interface DissolveConfig {
  dissolveType?: 'outward' | 'inward' | 'radial' | 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'; // 溶解效果类型
  useWebGL?: boolean; // 是否使用WebGL实现
  noiseScale?: number; // 溶解颗粒大小(像素值，0为平滑溶解，1-20为颗粒溶解)
  fadeEdge?: boolean; // 是否启用边缘渐变
}

/**
 * 溶解效果类 - 使用HybridEffectBase重构
 * 支持多种溶解模式：向外、向内、径向、方向性溶解等
 */
export class DissolveRefactor extends HybridEffectBase {
  // 溶解配置，参数验证并设置默认值
  private dissolveConfig: Required<DissolveConfig>;

  // WebGL噪声纹理缓存
  private noiseData: Uint8Array | null = null;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化溶解配置，使用传入的参数或默认值，并进行参数验证
    const rawNoiseScale = params?.options?.noiseScale;
    const clampedNoiseScale = rawNoiseScale !== undefined ? Math.max(0, Math.floor(rawNoiseScale)) : 8;

    this.dissolveConfig = {
      dissolveType: params?.options?.dissolveType || 'outward',
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true,
      noiseScale: clampedNoiseScale, // 确保是非负整数，默认8px颗粒，0为平滑
      fadeEdge: params?.options?.fadeEdge !== undefined ? params.options.fadeEdge : true
    };
  }

  /**
   * WebGL着色器源码
   */
  protected getShaderSources(): { vertex: string; fragment: string } {
    const vertexShader = ShaderLibrary.STANDARD_VERTEX_SHADER;

    const fragmentShader = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform sampler2D u_noiseTexture;
      uniform float u_time;
      uniform int u_dissolveType;
      uniform vec2 u_resolution;
      uniform float u_noiseScale;
      uniform bool u_fadeEdge;
      varying vec2 v_texCoord;

      ${ShaderLibrary.SHADER_FUNCTIONS}

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

    return { vertex: vertexShader, fragment: fragmentShader };
  }

  /**
   * WebGL溶解效果实现
   */
  protected applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return canvas;
    }

    // 设置WebGL状态
    this.setupWebGLState(canvas);

    // 创建主纹理
    const texture = this.createTextureFromCanvas(canvas);
    if (!texture) {
      return canvas;
    }

    // 创建噪声纹理
    if (!this.noiseData) {
      this.noiseData = ImageProcessUtils.generateNoiseTexture(256, 256);
    }
    const noiseTexture = this.gl.createTexture();
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, noiseTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.LUMINANCE,
      256,
      256,
      0,
      this.gl.LUMINANCE,
      this.gl.UNSIGNED_BYTE,
      this.noiseData
    );
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    // 创建顶点缓冲区
    const vertexBuffer = this.createFullScreenQuad();
    if (!vertexBuffer) {
      return canvas;
    }

    // 使用着色器程序并设置属性
    this.gl.useProgram(this.program);
    this.setupVertexAttributes();

    // 设置uniform变量
    this.setUniforms();

    // 启用混合以支持透明度
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // 绘制
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // 清理资源
    this.gl.deleteTexture(texture);
    this.gl.deleteTexture(noiseTexture);
    this.gl.deleteBuffer(vertexBuffer);

    return this.webglCanvas;
  }

  /**
   * 设置WebGL uniform变量
   */
  private setUniforms(): void {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return;
    }

    const textureLocation = this.gl.getUniformLocation(this.program, 'u_texture');
    const noiseTextureLocation = this.gl.getUniformLocation(this.program, 'u_noiseTexture');
    const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    const dissolveTypeLocation = this.gl.getUniformLocation(this.program, 'u_dissolveType');
    const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    const noiseScaleLocation = this.gl.getUniformLocation(this.program, 'u_noiseScale');
    const fadeEdgeLocation = this.gl.getUniformLocation(this.program, 'u_fadeEdge');

    this.gl.uniform1i(textureLocation, 0);
    this.gl.uniform1i(noiseTextureLocation, 1);
    this.gl.uniform1f(timeLocation, this.currentAnimationRatio);
    this.gl.uniform2f(resolutionLocation, this.webglCanvas.width, this.webglCanvas.height);
    this.gl.uniform1f(noiseScaleLocation, this.dissolveConfig.noiseScale);
    this.gl.uniform1i(fadeEdgeLocation, this.dissolveConfig.fadeEdge ? 1 : 0);

    // 设置溶解类型映射
    const dissolveTypeMap: { [key: string]: number } = {
      outward: 0,
      inward: 1,
      radial: 2,
      leftToRight: 3,
      rightToLeft: 4,
      topToBottom: 5,
      bottomToTop: 6
    };
    this.gl.uniform1i(dissolveTypeLocation, dissolveTypeMap[this.dissolveConfig.dissolveType] || 0);
  }

  /**
   * Canvas 2D溶解效果实现
   */
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const outputCanvas = this.createOutputCanvas(canvas);
    if (!outputCanvas) {
      return canvas;
    }

    const { canvas: outputCanvasElement, ctx } = outputCanvas;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const progress = this.currentAnimationRatio;

    let dissolvedImageData: ImageData;

    // 根据溶解类型应用不同的溶解算法
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
    return outputCanvasElement;
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
          const noiseValue = ImageProcessUtils.pixelNoise(x, y, pixelSize);
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
}
