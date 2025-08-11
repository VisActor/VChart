import { vglobal } from '@visactor/vrender-core';

/**
 * 图像处理工具类，提取公共的图像处理逻辑
 */
export class ImageProcessUtils {
  /**
   * 创建临时Canvas用于图像处理
   */
  static createTempCanvas(width: number, height: number, dpr?: number): HTMLCanvasElement {
    return vglobal.createCanvas({
      width,
      height,
      dpr: dpr || vglobal.devicePixelRatio
    });
  }

  /**
   * 复制图像数据
   */
  static cloneImageData(imageData: ImageData): ImageData {
    const clonedData = new Uint8ClampedArray(imageData.data);
    return new ImageData(clonedData, imageData.width, imageData.height);
  }

  /**
   * 线性插值
   */
  static lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }

  /**
   * 平滑步进函数
   */
  static smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  /**
   * 计算两点之间的距离
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 归一化角度到0-1范围
   */
  static normalizeAngle(angle: number): number {
    return (angle + Math.PI) / (2 * Math.PI);
  }

  /**
   * 基于像素网格的噪声函数
   */
  static pixelNoise(x: number, y: number, pixelSize: number): number {
    if (pixelSize <= 0) {
      return 0;
    }

    const gridX = Math.floor(x / pixelSize) * pixelSize;
    const gridY = Math.floor(y / pixelSize) * pixelSize;

    const n = Math.sin(gridX * 12.9898 + gridY * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  /**
   * 生成噪声纹理数据
   */
  static generateNoiseTexture(width: number, height: number): Uint8Array {
    const data = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.floor(Math.random() * 256);
    }
    return data;
  }

  /**
   * 应用CSS滤镜（如果支持）
   */
  static applyCSSFilter(canvas: HTMLCanvasElement, filter: string): HTMLCanvasElement {
    const outputCanvas = this.createTempCanvas(canvas.width, canvas.height);
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    ctx.filter = filter;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    return outputCanvas;
  }

  /**
   * 提取颜色通道
   */
  static extractChannel(imageData: ImageData, channelIndex: number): ImageData {
    const { data, width, height } = imageData;
    const channelData = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      // 清空所有通道
      channelData[i] = 0; // R
      channelData[i + 1] = 0; // G
      channelData[i + 2] = 0; // B
      channelData[i + 3] = data[i + 3]; // 保持Alpha通道

      // 只保留指定通道的数据
      if (channelIndex >= 0 && channelIndex <= 2) {
        channelData[i + channelIndex] = data[i + channelIndex];
      }
    }

    return new ImageData(channelData, width, height);
  }

  /**
   * 混合两个图像数据
   */
  static blendImageData(imageData1: ImageData, imageData2: ImageData, ratio: number): ImageData {
    const { data: data1, width, height } = imageData1;
    const { data: data2 } = imageData2;
    const result = new Uint8ClampedArray(data1.length);

    for (let i = 0; i < data1.length; i += 4) {
      result[i] = Math.round(this.lerp(data1[i], data2[i], ratio)); // R
      result[i + 1] = Math.round(this.lerp(data1[i + 1], data2[i + 1], ratio)); // G
      result[i + 2] = Math.round(this.lerp(data1[i + 2], data2[i + 2], ratio)); // B
      result[i + 3] = Math.round(this.lerp(data1[i + 3], data2[i + 3], ratio)); // A
    }

    return new ImageData(result, width, height);
  }

  /**
   * 计算像素亮度
   */
  static getLuminance(r: number, g: number, b: number): number {
    return r * 0.299 + g * 0.587 + b * 0.114;
  }

  /**
   * 应用褐色调效果
   */
  static applySepiaToPixel(r: number, g: number, b: number): [number, number, number] {
    const sepiaR = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    const sepiaG = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    const sepiaB = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    return [sepiaR, sepiaG, sepiaB];
  }

  /**
   * 动态计算强度（基于动画时间的线性增长）
   */
  static calculateDynamicStrength(baseStrength: number, animationTime: number): number {
    // 时间范围0-2π，标准化到0-1
    return baseStrength * (animationTime / (Math.PI * 2));
  }
}

/**
 * WebGL着色器片段库
 */
export class ShaderLibrary {
  /**
   * 标准顶点着色器
   */
  static readonly STANDARD_VERTEX_SHADER = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  /**
   * 常用的着色器函数库
   */
  static readonly SHADER_FUNCTIONS = `
    // 亮度计算函数
    float luminance(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }

    // 褐色调函数
    vec3 sepia(vec3 color) {
      float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
      float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
      float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
      return vec3(r, g, b);
    }

    // 线性插值函数
    float lerp(float a, float b, float t) {
      return a * (1.0 - t) + b * t;
    }

    // 平滑步进函数
    float smoothstep(float edge0, float edge1, float x) {
      float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
      return t * t * (3.0 - 2.0 * t);
    }

    // 简单噪声函数
    float pixelNoise(vec2 coord, float pixelSize) {
      vec2 gridCoord = floor(coord / pixelSize) * pixelSize;
      return fract(sin(dot(gridCoord, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 动态强度计算
    float calculateDynamicStrength(float baseStrength, float time) {
      return baseStrength * (time / 6.28318531); // 2π
    }
  `;
}
