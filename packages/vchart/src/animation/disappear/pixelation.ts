import { AStageAnimate } from '@visactor/vrender-animate';
import { vglobal, EasingType } from '@visactor/vrender-core';

// 像素化效果配置接口
export interface PixelationConfig {
  maxPixelSize?: number; // 最大像素化强度
  method?: 'downsample' | 'pixelData' | 'webgl'; // 像素化方法
}

export class Pixelation extends AStageAnimate<any> {
  private currentAnimationRatio: number = 0;
  private pixelationConfig: Required<PixelationConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化像素化配置，使用传入的参数或默认值
    this.pixelationConfig = {
      maxPixelSize: params?.options?.maxPixelSize || 20,
      method: params?.options?.method || 'downsample'
    };
  }

  onUpdate(end: boolean, ratio: number, out: any): void {
    super.onUpdate(end, ratio, out);
    this.currentAnimationRatio = ratio; // ratio已经经过easing函数处理
  }

  // 方法1: Canvas 2D 降采样像素化
  private applyDownsamplePixelation(canvas: HTMLCanvasElement, pixelSize: number): HTMLCanvasElement {
    if (pixelSize <= 1) {
      return canvas;
    }

    const { width, height } = canvas;

    // 创建小尺寸的离屏Canvas
    const smallWidth = Math.ceil(width / pixelSize);
    const smallHeight = Math.ceil(height / pixelSize);

    const smallCanvas = vglobal.createCanvas({
      width: smallWidth,
      height: smallHeight,
      dpr: 1
    });
    const smallCtx = smallCanvas.getContext('2d');
    if (!smallCtx) {
      return canvas;
    }

    // 创建输出Canvas
    const outputCanvas = vglobal.createCanvas({
      width: width,
      height: height,
      dpr: vglobal.devicePixelRatio
    });
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      return canvas;
    }

    // 关闭图像平滑以获得清晰的像素块效果
    smallCtx.imageSmoothingEnabled = false;
    outputCtx.imageSmoothingEnabled = false;

    // 将原图绘制到小Canvas上（自动降采样）
    smallCtx.drawImage(canvas, 0, 0, smallWidth, smallHeight);

    // 将小图放大绘制到输出Canvas上
    outputCtx.drawImage(smallCanvas, 0, 0, width, height);

    return outputCanvas;
  }

  // 方法2: 直接操作像素数据进行块状平均
  private applyPixelDataPixelation(canvas: HTMLCanvasElement, pixelSize: number): HTMLCanvasElement {
    if (pixelSize <= 1) {
      return canvas;
    }

    const outputCanvas = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: vglobal.devicePixelRatio
    });
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      return canvas;
    }

    // 先绘制原图到输出Canvas
    outputCtx.drawImage(canvas, 0, 0);

    // 获取图像数据
    const imageData = outputCtx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    // 创建新的像素数据
    const newData = new Uint8ClampedArray(data);

    // 遍历每个像素块
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        // 计算当前块的平均颜色
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;

        // 遍历块内的所有像素
        for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            a += data[index + 3];
            count++;
          }
        }

        // 计算平均值
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = Math.round(a / count);

        // 将平均颜色应用到整个块
        for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            newData[index] = r;
            newData[index + 1] = g;
            newData[index + 2] = b;
            newData[index + 3] = a;
          }
        }
      }
    }

    // 将处理后的数据绘制回Canvas
    const newImageData = new ImageData(newData, width, height);
    outputCtx.putImageData(newImageData, 0, 0);

    return outputCanvas;
  }

  // 方法3: WebGL着色器像素化（高性能）
  private applyWebGLPixelation(canvas: HTMLCanvasElement, pixelSize: number): HTMLCanvasElement {
    if (pixelSize <= 1) {
      return canvas;
    }

    try {
      // 创建输出Canvas - 使用与输入相同的尺寸，不应用DPR缩放
      const outputCanvas = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: 1 // 强制DPR为1，避免尺寸缩放问题
      });

      const gl = outputCanvas.getContext('webgl') || outputCanvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, falling back to downsample method');
        return this.applyDownsamplePixelation(canvas, pixelSize);
      }

      // 设置视口 - 使用Canvas的实际像素尺寸
      gl.viewport(0, 0, outputCanvas.width, outputCanvas.height);

      // 设置 WebGL 状态
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // 禁用深度测试和混合，确保像素完全替换
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);

      // 创建着色器程序
      const program = this.createPixelationShaderProgram(gl);
      if (!program) {
        return this.applyDownsamplePixelation(canvas, pixelSize);
      }

      // 创建纹理
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // 设置像素存储参数，确保正确的像素对齐
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // 创建顶点缓冲区
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      // 定义全屏四边形顶点 - 修正纹理坐标的Y轴翻转问题
      // 格式: [x, y, u, v] 其中 (x,y) 是顶点坐标，(u,v) 是纹理坐标
      const vertices = new Float32Array([
        -1.0,
        -1.0,
        0.0,
        1.0, // 左下角 -> 纹理左上角
        1.0,
        -1.0,
        1.0,
        1.0, // 右下角 -> 纹理右上角
        -1.0,
        1.0,
        0.0,
        0.0, // 左上角 -> 纹理左下角
        1.0,
        1.0,
        1.0,
        0.0 // 右上角 -> 纹理右下角
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // 使用着色器程序
      gl.useProgram(program);

      // 设置顶点属性
      const positionLocation = gl.getAttribLocation(program, 'a_position');
      const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(texCoordLocation);

      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 4 * 4, 0);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

      // 设置uniform变量
      const textureLocation = gl.getUniformLocation(program, 'u_texture');
      const pixelSizeLocation = gl.getUniformLocation(program, 'u_pixelSize');
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

      gl.uniform1i(textureLocation, 0);
      gl.uniform1f(pixelSizeLocation, pixelSize);
      // 使用输出Canvas的尺寸确保一致性
      gl.uniform2f(resolutionLocation, outputCanvas.width, outputCanvas.height);

      // 绘制
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // 确保绘制完成
      gl.finish();

      // 清理资源
      gl.deleteTexture(texture);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);

      return outputCanvas;
    } catch (error) {
      console.warn('WebGL pixelation failed, falling back to downsample method:', error);
      return this.applyDownsamplePixelation(canvas, pixelSize);
    }
  }

  // 创建像素化着色器程序
  private createPixelationShaderProgram(gl: WebGLRenderingContext): WebGLProgram | null {
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

    // 片段着色器源码 - 实现像素化效果（优化版本）
    const fragmentShaderSource = `
      precision mediump float;

      uniform sampler2D u_texture;
      uniform float u_pixelSize;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
        // 直接使用纹理坐标进行像素化计算
        vec2 uv = v_texCoord;

        // 计算像素化后的纹理坐标
        vec2 pixelatedUV = floor(uv * u_resolution / u_pixelSize) * u_pixelSize / u_resolution;

        // 采样像素化后的纹理
        gl_FragColor = texture2D(u_texture, pixelatedUV);
      }
    `;

    // 编译着色器
    const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    // 创建程序
    const program = gl.createProgram();
    if (!program) {
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 检查链接状态
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Failed to link shader program:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    // 清理着色器
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  // 编译着色器
  private compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Failed to compile shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // 更新动画进度 - 简化版本，直接使用框架提供的ratio
  private updateAnimationProgress(): number {
    // 直接根据动画进度计算像素化强度
    // ratio已经经过easing函数处理，无需额外的缓动计算
    // 从1像素增加到配置的最大值
    const currentPixelSize = 1 + this.currentAnimationRatio * (this.pixelationConfig.maxPixelSize - 1);
    return currentPixelSize;
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    // 更新动画进度并获取当前像素化强度
    const currentPixelSize = this.updateAnimationProgress();

    // 如果像素化强度为1或更小，直接返回原图
    if (currentPixelSize <= 1) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    // 根据配置选择像素化方法
    switch (this.pixelationConfig.method) {
      case 'pixelData':
        result = this.applyPixelDataPixelation(canvas, currentPixelSize);
        break;
      case 'webgl':
        result = this.applyWebGLPixelation(canvas, currentPixelSize);
        break;
      case 'downsample':
      default:
        result = this.applyDownsamplePixelation(canvas, currentPixelSize);
        break;
    }

    return result;
  }
}
