import { isMobile } from 'react-device-detect';
import type { IAreaChartSpec } from '../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import {
  default as VChart,
  registerMediaQuery,
  registerAnimate,
  registerCustomAnimate,
  registerStateTransition,
  vglobal
} from '../../../../src/index';
import { AnimateExecutor, AStageAnimate } from '@visactor/vrender-animate';
import { EasingType } from '@visactor/vrender-core';
registerAnimate();
registerCustomAnimate();
registerStateTransition();

// 像素化效果配置接口
interface PixelationConfig {
  maxPixelSize?: number; // 最大像素化强度
  method?: 'downsample' | 'pixelData' | 'webgl'; // 像素化方法
}

/**
 * 像素化退场动画效果实现 - 参考particle-disintegration配置方式
 *
 * 技术方案：
 * 1. Canvas 2D 降采样像素化（推荐，性能最佳）
 *    - 将图像绘制到小尺寸离屏Canvas
 *    - 关闭imageSmoothingEnabled获得清晰块状效果
 *    - 放大绘制回主Canvas
 *
 * 2. 直接操作像素数据进行块状平均
 *    - 对每个像素块计算平均颜色
 *    - 将平均颜色应用到整个块
 *    - 适合需要精确控制的场景
 *
 * 动画进度管理（参考particle-disintegration）：
 * - 动画框架自动处理时间管理和缓动函数
 * - constructor接收duration和easing参数
 * - onUpdate方法接收已处理的ratio值（0-1，已应用easing）
 * - 直接使用ratio计算像素化强度，无需额外的缓动计算
 * - 像素化强度从1逐渐增加到配置的最大值
 *
 * 配置方式（通过params.options）：
 * animationAppear: {
 *   stage: {
 *     type: 'stageTest',
 *     duration: 3000,
 *     easing: 'easeInQuad',
 *     options: {
 *       maxPixelSize: 25,        // 最大像素化强度
 *       method: 'downsample'     // 像素化方法
 *     }
 *   }
 * }
 */

class TestStageAnimate extends AStageAnimate<any> {
  private currentAnimationRatio: number = 0;
  private pixelationConfig: Required<PixelationConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化像素化配置，使用传入的参数或默认值
    this.pixelationConfig = {
      maxPixelSize: params?.options?.maxPixelSize || 20,
      method: params?.options?.method || 'downsample'
    };

    // 设置全局实例引用，用于控制面板
    currentPixelationAnimate = this;
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

      // 添加调试信息
      console.debug('WebGL Debug:', {
        inputSize: { width: canvas.width, height: canvas.height },
        outputSize: { width: outputCanvas.width, height: outputCanvas.height },
        pixelSize: pixelSize,
        viewport: [0, 0, outputCanvas.width, outputCanvas.height]
      });

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
    console.time('PixelationEffect');

    // 更新动画进度并获取当前像素化强度
    const currentPixelSize = this.updateAnimationProgress();

    // 如果像素化强度为1或更小，直接返回原图
    if (currentPixelSize <= 1) {
      console.timeEnd('PixelationEffect');
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

    console.log(
      `像素化强度: ${currentPixelSize.toFixed(1)}, 动画进度: ${(this.currentAnimationRatio * 100).toFixed(
        1
      )}%, 最大像素化: ${this.pixelationConfig.maxPixelSize}, 方法: ${this.pixelationConfig.method}, Duration: ${
        this.duration || 1000
      }ms`
    );
    console.timeEnd('PixelationEffect');
    return result;
  }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

// 全局动画实例引用，用于控制面板
let currentPixelationAnimate: TestStageAnimate | null = null;

let dataArray = [
  { type: 'Nail polish', country: 'Africa', value: 4229 },
  { type: 'Nail polish', country: 'EU', value: 4376 },
  { type: 'Nail polish', country: 'China', value: 3054 },
  { type: 'Nail polish', country: 'USA', value: 12814 },
  { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
  { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
  { type: 'Eyebrow pencil', country: 'China', value: 5067 },
  { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
  { type: 'Rouge', country: 'Africa', value: 5221 },
  { type: 'Rouge', country: 'EU', value: 3574 },
  { type: 'Rouge', country: 'China', value: 7004 },
  { type: 'Rouge', country: 'USA', value: 11624 },
  { type: 'Lipstick', country: 'Africa', value: 9256 },
  { type: 'Lipstick', country: 'EU', value: 4376 },
  { type: 'Lipstick', country: 'China', value: 9054 },
  { type: 'Lipstick', country: 'USA', value: 8814 },
  { type: 'Eyeshadows', country: 'Africa', value: 3308 },
  { type: 'Eyeshadows', country: 'EU', value: 4572 },
  { type: 'Eyeshadows', country: 'China', value: 12043 },
  { type: 'Eyeshadows', country: 'USA', value: 12998 },
  { type: 'Eyeliner', country: 'Africa', value: 5432 },
  { type: 'Eyeliner', country: 'EU', value: 3417 },
  { type: 'Eyeliner', country: 'China', value: 15067 },
  { type: 'Eyeliner', country: 'USA', value: 12321 },
  { type: 'Foundation', country: 'Africa', value: 13701 },
  { type: 'Foundation', country: 'EU', value: 5231 },
  { type: 'Foundation', country: 'China', value: 10119 },
  { type: 'Foundation', country: 'USA', value: 10342 },
  { type: 'Lip gloss', country: 'Africa', value: 4008 },
  { type: 'Lip gloss', country: 'EU', value: 4572 },
  { type: 'Lip gloss', country: 'China', value: 12043 },
  { type: 'Lip gloss', country: 'USA', value: 22998 },
  { type: 'Mascara', country: 'Africa', value: 18712 },
  { type: 'Mascara', country: 'EU', value: 6134 },
  { type: 'Mascara', country: 'China', value: 10419 },
  { type: 'Mascara', country: 'USA', value: 11261 }
];

const direction: string = 'vertical';

let spec = {
  type: 'bar',
  data: {
    id: 'data0',
    values: dataArray
  },
  title: {
    visible: true,
    text: 'Stacked area chart of cosmetic products sales'
  },
  direction,
  useSequentialAnimation: true,
  // stack: true,
  xField: direction === 'horizontal' ? 'value' : 'type',
  yField: direction === 'horizontal' ? 'type' : 'value',
  seriesField: 'country',
  legends: [{ visible: true, position: 'middle' as const, orient: 'bottom' as const }],
  crosshair: {
    followTooltip: true,
    xField: { visible: true, label: { visible: true } },
    yField: { visible: true, label: { visible: true } }
  },
  animationAppear: {
    stage: {
      type: 'stageTest',
      duration: 3000,
      easing: 'linear',
      options: {
        maxPixelSize: 25,
        method: 'webgl' // 使用修复后的 WebGL 方法测试
      }
    }
  },
  animationUpdate: {
    duration: 1000
  },
  animationEnter: {
    duration: 300
  },
  animationExit: {
    duration: 3000,
    type: 'update'
  },
  // animationDisappear:{
  //   stage: {
  //     type: 'stageTest',
  //     duration: 1000,
  //   }
  // },
  animationNormal: {
    point: [
      {
        loop: true,
        startTime: 100,
        oneByOne: 100,
        priority: 1,
        timeSlices: [
          {
            delay: 1000,
            effects: {
              channel: {
                fillOpacity: { to: 0.5 }
              },
              easing: 'linear'
            },
            duration: 500
          },
          {
            effects: {
              channel: {
                fillOpacity: { to: 1 }
              },
              easing: 'linear'
            },
            duration: 500
          }
        ]
      }
    ]
  },
  point: {
    state: {
      hover: {
        fill: 'red'
      }
    },
    style: {
      size: 80
    }
  }
};

const run = () => {
  registerMediaQuery();
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  const button = document.createElement('button');
  button.innerHTML = 'click';
  button.addEventListener('click', () => {
    dataArray = dataArray.map(d => ({ ...d, value: 100000 * Math.random() }));
    cs.updateData('data0', dataArray);
  });
  document.body.appendChild(button);

  const button2 = document.createElement('button');
  button2.innerHTML = 'add&remove';
  button2.addEventListener('click', () => {
    const name = Math.random().toString();
    dataArray = dataArray.map(d => ({
      ...d,
      value: 100000 * Math.random(),
      country: ['EU', 'China', 'USA'].includes(d.country) ? d.country : name
    }));
    cs.updateData('data0', dataArray);
  });
  document.body.appendChild(button2);

  function addData() {
    const name = Math.random().toString();
    const newData = dataArray
      .filter(d => d.country === 'EU')
      .map(d => ({
        ...d,
        value: 100000 * Math.random(),
        country: name
      }));

    dataArray = [...dataArray, ...newData];
  }

  function removeData() {
    dataArray = dataArray.filter(d => ['EU', 'China', 'USA'].includes(d.country));
  }

  const button3 = document.createElement('button');
  button3.innerHTML = 'stack<->group';
  button3.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    const fieldKey = direction === 'horizontal' ? 'yField' : 'xField';
    if (typeof nextSpec[fieldKey] === 'string') {
      (nextSpec as any)[fieldKey] = ['type', 'country'];
    } else {
      (nextSpec as any)[fieldKey] = 'type';
    }
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button3);

  const button4 = document.createElement('button');
  button4.innerHTML = 'stack<->group add';
  button4.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    const fieldKey = direction === 'horizontal' ? 'yField' : 'xField';
    if (typeof nextSpec[fieldKey] === 'string') {
      (nextSpec as any)[fieldKey] = ['type', 'country'];
    } else {
      (nextSpec as any)[fieldKey] = 'type';
    }
    addData();
    nextSpec.data = {
      id: 'data0',
      values: dataArray
    };
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button4);

  const button6 = document.createElement('button');
  button6.innerHTML = 'direction';
  button6.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    nextSpec.direction = nextSpec.direction === 'horizontal' ? 'vertical' : 'horizontal';
    [nextSpec.xField, nextSpec.yField] = [nextSpec.yField, nextSpec.xField];
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button6);

  // 添加退场动画按钮 - 通过更新spec来触发
  const button8 = document.createElement('button');
  button8.innerHTML = 'Spec退场动画';
  button8.addEventListener('click', () => {
    console.log('通过更新spec触发退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建一个空的spec来触发退场动画
    const emptySpec = {
      ...spec,
      data: {
        id: 'data0',
        values: [] // 空数据
      }
    };

    // 更新spec，这会触发退场动画
    cs.updateSpec(emptySpec as any);

    // 恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3500);
  });
  document.body.appendChild(button8);

  // 添加自定义退场动画按钮
  const button9 = document.createElement('button');
  button9.innerHTML = '自定义退场动画';
  button9.addEventListener('click', () => {
    console.log('触发自定义退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建带有自定义退场动画的spec
    const customExitSpec = {
      ...spec,
      animationExit: {
        type: 'fadeOut',
        duration: 3000 // 自定义退场动画持续时间
      },
      data: {
        id: 'data0',
        values: [] // 空数据触发退场
      }
    };

    // 更新spec，触发自定义退场动画
    cs.updateSpec(customExitSpec as any);

    // 恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3500);
  });
  document.body.appendChild(button9);

  // 添加动画持续时间控制
  const durationControls = document.createElement('div');
  durationControls.style.margin = '10px 0';
  durationControls.innerHTML = `
    <label>动画持续时间(ms): </label>
    <input type="range" id="durationSlider" min="500" max="5000" value="1000" step="100">
    <span id="durationValue">1000</span>
    <button id="applyDuration">应用到配置</button>
  `;
  document.body.appendChild(durationControls);

  const durationSlider = document.getElementById('durationSlider') as HTMLInputElement;
  const durationValue = document.getElementById('durationValue') as HTMLSpanElement;
  const applyDuration = document.getElementById('applyDuration') as HTMLButtonElement;

  durationSlider.addEventListener('input', () => {
    durationValue.textContent = durationSlider.value;
  });

  applyDuration.addEventListener('click', () => {
    const newDuration = parseInt(durationSlider.value, 10);
    // 更新spec中的duration配置
    if (spec.animationAppear && spec.animationAppear.stage) {
      spec.animationAppear.stage.duration = newDuration;
    }
    console.log(`已更新动画duration配置为: ${newDuration}ms`);

    // 重新应用配置
    cs.updateSpec(spec as any);
  });

  // 将动画实例暴露到全局，方便控制
  // 通过已注册的动画获取实例
  window['testStageAnimate'] = null; // 初始化为null，实际实例会在动画执行时创建

  window['vchart'] = cs;
  console.log(cs);
};
run();
