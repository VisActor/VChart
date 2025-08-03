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
import { AnimateExecutor, AStageAnimate, FadeOut } from '@visactor/vrender-animate';
import { EasingType } from '@visactor/vrender-core';
registerAnimate();
registerCustomAnimate();
registerStateTransition();

// 颜色效果配置接口
interface ColorEffectConfig {
  effectType: 'grayscale' | 'sepia';
  strength: number;
  useWebGL: boolean;
}

class TestStageAnimate extends AStageAnimate<any> {
  private webglCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private currentAnimationRatio = 0; // 当前动画进度比例 0-1
  private animationTime = 0; // 基于动画进度的时间值

  // 颜色效果配置
  private colorConfig: ColorEffectConfig;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    // 调用父类构造函数，传递必要的参数
    super(from, to, duration, easing, params);

    console.log(this);
    // 初始化颜色效果配置，使用传入的参数或默认值
    this.colorConfig = {
      effectType: params?.options?.effectType || 'grayscale', // 'grayscale' | 'sepia'
      strength: params?.options?.strength || 1.0, // 0.0 - 1.0
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true // 是否使用WebGL实现
    };
  }

  // 重写onUpdate方法，接收动画进度
  onUpdate(end: boolean, ratio: number, out: any): void {
    // 调用父类的onUpdate
    super.onUpdate(end, ratio, out);

    // 更新当前动画进度
    this.currentAnimationRatio = ratio;

    // 根据动画进度计算时间值，用于动态效果
    // ratio是经过easing处理的进度值，范围0-1
    this.animationTime = ratio * Math.PI * 2; // 转换为0-2π范围，适合三角函数
  }

  // 获取基于父类动画系统的时间
  private getAnimationTime(): number {
    // 优先使用基于动画进度的时间
    if (this.currentAnimationRatio > 0) {
      return this.animationTime;
    }
    // 如果动画未运行，返回连续时间作为后备
    return Date.now() / 1000.0;
  }

  // 获取父类的duration配置
  getDurationFromParent(): number {
    return this.duration || 1000;
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
    console.time('ColorEffect');

    // 检查是否使用原生filter API
    if ((window as any).useFilterAPI) {
      console.log('使用Canvas Filter API');
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

      console.timeEnd('ColorEffect');
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
        console.log(`使用WebGL ${this.colorConfig.effectType}效果`);
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
          console.log('使用Canvas2D灰度效果（动态）');
          processedImageData = this.applyGrayscaleEffect(imageData, this.colorConfig.strength, controlledTime);
          break;
        case 'sepia':
          console.log('使用Canvas2D褐色调效果（动态）');
          processedImageData = this.applySepiaEffect(imageData, this.colorConfig.strength, controlledTime);
          break;
        default:
          processedImageData = imageData;
      }

      ctx.putImageData(processedImageData, 0, 0);
      result = c;
    }

    console.timeEnd('ColorEffect');
    return result;
  }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

// 用于演示UI控制的全局变量（不影响类内部实现）
let currentColorEffectType = 'grayscale';
let currentEffectStrength = 1.0;
let currentUseWebGL = true;

/*
使用示例：
1. 通过spec配置：
animationAppear: {
  stage: {
    type: 'stageTest',
    duration: 2000,
    easing: 'linear',
    options: {
      effectType: 'grayscale', // 'grayscale' | 'sepia'
      strength: 1.0,           // 0.0 - 1.0
      useWebGL: true           // true: WebGL实现, false: Canvas2D实现
    }
  }
}

2. 支持的颜色效果：
- 'grayscale': 灰度效果 - 使用标准亮度公式将图像转为黑白，添加线性增长的动态强度变化
- 'sepia': 褐色调效果 - 应用怀旧风格的褐色滤镜，添加线性增长的动态强度变化

3. 参数说明：
- effectType: 颜色效果类型 ('grayscale' | 'sepia')
- strength: 效果强度 (0.0-1.0)
- useWebGL: 是否使用WebGL实现 (true: GPU加速, false: CPU处理)

4. 技术特点：
- WebGL模式：使用GPU着色器，性能最佳，支持实时动画
- Canvas2D模式：使用CPU像素操作，效果精确但性能较低
- 动态效果：所有效果都支持线性增长的动态强度变化
- 时间控制：基于父类动画系统的时间和easing控制
*/

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
      duration: 2000,
      easing: 'linear',
      options: {
        effectType: 'grayscale',
        strength: 1.0,
        useWebGL: true
      }
    }
  },
  animationUpdate: {
    duration: 300
  },
  animationEnter: {
    duration: 300
  },
  animationExit: {
    type: 'state',
    duration: 2000,
    easing: 'linear'
  },
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

  const button5 = document.createElement('button');
  button5.innerHTML = 'direction';
  button5.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    nextSpec.direction = nextSpec.direction === 'horizontal' ? 'vertical' : 'horizontal';
    [nextSpec.xField, nextSpec.yField] = [nextSpec.yField, nextSpec.xField];
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button5);

  const button7 = document.createElement('button');
  button7.innerHTML = 'Spec退场动画';
  button7.addEventListener('click', () => {
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

    // 5秒后恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3000);
  });
  document.body.appendChild(button7);

  // 添加自定义退场动画按钮
  const button8 = document.createElement('button');
  button8.innerHTML = '自定义退场动画';
  button8.addEventListener('click', () => {
    console.log('触发自定义退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建带有自定义退场动画的spec
    const customExitSpec = {
      ...spec,
      animationExit: {
        duration: 2000, // 2秒退场动画
        type: 'fadeOut', // 淡出效果
        easing: 'easeInOut' // 缓动函数
      },
      data: {
        id: 'data0',
        values: [] // 空数据触发退场
      }
    };

    // 更新spec，触发自定义退场动画
    cs.updateSpec(customExitSpec as any);

    // 2秒后恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3000);
  });
  document.body.appendChild(button8);

  // 添加颜色效果控制按钮
  // 1. 效果类型选择按钮
  const effectTypeButton = document.createElement('button');
  effectTypeButton.innerHTML = `效果类型: ${currentColorEffectType}`;
  effectTypeButton.style.backgroundColor = '#2196F3';
  effectTypeButton.style.color = 'white';
  effectTypeButton.style.margin = '10px';
  effectTypeButton.style.padding = '10px';
  effectTypeButton.addEventListener('click', () => {
    const types = ['grayscale', 'sepia'];
    const currentIndex = types.indexOf(currentColorEffectType);
    const nextIndex = (currentIndex + 1) % types.length;
    currentColorEffectType = types[nextIndex];
    effectTypeButton.innerHTML = `效果类型: ${currentColorEffectType}`;

    console.log(`切换颜色效果为: ${currentColorEffectType}`);
    cs.renderAsync();
  });
  document.body.appendChild(effectTypeButton);

  // 添加动画信息显示按钮
  const animationInfoButton = document.createElement('button');
  animationInfoButton.innerHTML = '显示动画信息';
  animationInfoButton.style.backgroundColor = '#FF5722';
  animationInfoButton.style.color = 'white';
  animationInfoButton.style.margin = '10px';
  animationInfoButton.style.padding = '10px';

  animationInfoButton.addEventListener('click', () => {
    // 获取TestStageAnimate实例的动画信息
    const stageAnimate = (window as any).stageAnimateInstance;

    if (stageAnimate) {
      const duration = stageAnimate.getDurationFromParent();
      const ratio = stageAnimate.currentAnimationRatio;
      const time = stageAnimate.animationTime;

      console.log('=== 动画信息 ===');
      console.log(`配置Duration: ${duration}ms`);
      console.log(`当前动画进度: ${(ratio * 100).toFixed(1)}%`);
      console.log(`动画时间值: ${time.toFixed(3)}`);
      console.log(`动画对象存在: ${!!stageAnimate.animate}`);
    } else {
      console.log('TestStageAnimate实例未找到');
    }
  });
  document.body.appendChild(animationInfoButton); // 2. WebGL/Canvas2D 切换按钮
  const renderModeButton = document.createElement('button');
  renderModeButton.innerHTML = currentUseWebGL ? '当前：WebGL模式' : '当前：Canvas2D模式';
  renderModeButton.style.backgroundColor = currentUseWebGL ? '#4CAF50' : '#FF9800';
  renderModeButton.style.color = 'white';
  renderModeButton.style.margin = '10px';
  renderModeButton.style.padding = '10px';
  renderModeButton.addEventListener('click', () => {
    currentUseWebGL = !currentUseWebGL;
    renderModeButton.innerHTML = currentUseWebGL ? '当前：WebGL模式' : '当前：Canvas2D模式';
    renderModeButton.style.backgroundColor = currentUseWebGL ? '#4CAF50' : '#FF9800';

    console.log(`切换到${currentUseWebGL ? 'WebGL' : 'Canvas2D'}模式`);
    cs.renderAsync();
  });
  document.body.appendChild(renderModeButton);

  // 3. 效果强度滑块控制
  const effectSlider = document.createElement('input');
  effectSlider.type = 'range';
  effectSlider.min = '0';
  effectSlider.max = '1';
  effectSlider.step = '0.1';
  effectSlider.value = currentEffectStrength.toString();
  effectSlider.style.width = '200px';
  effectSlider.style.margin = '10px';

  const effectLabel = document.createElement('label');
  effectLabel.innerHTML = `效果强度: ${currentEffectStrength.toFixed(1)}`;
  effectLabel.style.marginRight = '10px';

  effectSlider.addEventListener('input', e => {
    const value = parseFloat((e.target as HTMLInputElement).value);
    effectLabel.innerHTML = `效果强度: ${value.toFixed(1)}`;
    currentEffectStrength = value;
    console.log(`设置效果强度为: ${value}`);
    cs.renderAsync();
  });

  // 创建强度控制容器
  const effectControl = document.createElement('div');
  effectControl.style.margin = '10px';
  effectControl.appendChild(effectLabel);
  effectControl.appendChild(effectSlider);
  document.body.appendChild(effectControl);

  // 5. 预设效果快速测试按钮组
  const testButtonsContainer = document.createElement('div');
  testButtonsContainer.style.margin = '10px';
  testButtonsContainer.innerHTML = '<h4>快速测试效果：</h4>';

  const testConfigs = [
    { type: 'grayscale', strength: 1.0, label: '完全灰度' },
    { type: 'sepia', strength: 0.8, label: '怀旧褐色' },
    { type: 'grayscale', strength: 0.5, label: '半灰度' },
    { type: 'sepia', strength: 0.5, label: '轻微褐色' }
  ];

  testConfigs.forEach(config => {
    const testButton = document.createElement('button');
    testButton.innerHTML = config.label;
    testButton.style.margin = '5px';
    testButton.style.padding = '8px';
    testButton.style.backgroundColor = '#607D8B';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.addEventListener('click', () => {
      currentColorEffectType = config.type;
      currentEffectStrength = config.strength;

      // 更新UI显示
      effectTypeButton.innerHTML = `效果类型: ${currentColorEffectType}`;
      effectLabel.innerHTML = `效果强度: ${currentEffectStrength.toFixed(1)}`;
      effectSlider.value = currentEffectStrength.toString();

      console.log(`应用预设效果: ${config.label} (${config.type}, 强度: ${config.strength})`);
      cs.renderAsync();
    });
    testButtonsContainer.appendChild(testButton);
  });
  document.body.appendChild(testButtonsContainer);

  // 6. 应用配置按钮
  const applyConfigButton = document.createElement('button');
  applyConfigButton.innerHTML = '应用配置';
  applyConfigButton.style.backgroundColor = '#3F51B5';
  applyConfigButton.style.color = 'white';
  applyConfigButton.style.margin = '10px';
  applyConfigButton.style.padding = '10px';
  applyConfigButton.addEventListener('click', () => {
    console.log('应用配置...');

    const originalSpec = { ...spec };

    // 触发新的粒子动画，传入当前参数
    const newSpec = {
      ...spec,
      animationAppear: {
        stage: {
          type: 'stageTest',
          duration: 3000,
          easing: 'linear',
          options: {
            effectType: currentColorEffectType,
            strength: currentEffectStrength,
            useWebGL: currentUseWebGL
          }
        }
      },
      data: {
        id: 'data0',
        values: [] // 空数据触发退场
      }
    };
    cs.updateSpec(newSpec as any);

    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3500);
  });
  document.body.appendChild(applyConfigButton);

  // 7. 性能信息和说明
  const performanceInfo = document.createElement('div');
  performanceInfo.style.margin = '10px';
  performanceInfo.style.padding = '10px';
  performanceInfo.style.backgroundColor = '#f0f0f0';
  performanceInfo.style.borderRadius = '5px';
  performanceInfo.innerHTML = `
    <h4>颜色效果说明：</h4>
    <ul>
      <li><strong>WebGL模式</strong>：使用GPU着色器，性能最佳，支持实时动画</li>
      <li><strong>Canvas2D模式</strong>：使用CPU像素操作，效果精确但性能较低</li>
      <li><strong>灰度(grayscale)</strong>：使用标准亮度公式将图像转为黑白，添加了线性增长的动态强度变化</li>
      <li><strong>褐色调(sepia)</strong>：应用怀旧风格的褐色滤镜，添加了线性增长的动态强度变化</li>
      <li><strong>Canvas Filter API</strong>：使用浏览器原生CSS filter，最简单但功能有限</li>
      <li>查看控制台可以看到每次渲染的性能数据和使用的技术</li>
    </ul>
    <h4>技术特点：</h4>
    <ul>
      <li>✅ 支持WebGL和Canvas2D两种实现方式</li>
      <li>✅ 实时可调节的效果强度</li>
      <li>✅ 标准灰度和褐色调算法</li>
      <li>✅ 性能监控和技术切换</li>
      <li>🆕 <strong>所有效果都支持动态强度变化</strong>：灰度和褐色调都有线性增长的动画效果</li>
      <li>🆕 <strong>简洁高效</strong>：专注于经典的灰度和褐色调效果，去除了复杂的着色和彩虹效果</li>
    </ul>
  `;
  document.body.appendChild(performanceInfo);

  window['vchart'] = cs;
  console.log(cs);
};
run();
