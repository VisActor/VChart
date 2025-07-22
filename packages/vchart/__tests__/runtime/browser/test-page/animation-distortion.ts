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
registerAnimate();
registerCustomAnimate();
registerStateTransition();

// 全局变量控制扭曲效果
let globalDistortionType = 'wave'; // wave, ripple, swirl
let globalDistortionStrength = 0.3;
let globalAnimationTime = 0;
let useWebGLDistortion = true; // 是否使用WebGL实现

class TestStageAnimate extends AStageAnimate<any> {
  private webglCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animationStartTime = Date.now();

  // WebGL 着色器实现 (性能最佳)
  private initWebGL(canvas: HTMLCanvasElement): boolean {
    try {
      // 创建一个WebGL专用的canvas，尺寸和设备像素比与传入canvas一致
      this.webglCanvas = vglobal.createCanvas({
        width: canvas.width,
        height: canvas.height,
        dpr: vglobal.devicePixelRatio
      });

      // 如果创建失败，打印警告并返回false
      if (!this.webglCanvas) {
        console.warn('WebGL canvas creation failed');
        return false;
      }

      // 确保WebGL canvas的显示尺寸正确
      this.webglCanvas.style.width = canvas.style.width || `${canvas.width}px`;
      this.webglCanvas.style.height = canvas.style.height || `${canvas.height}px`;

      let glContext: WebGLRenderingContext | null = null;
      try {
        // 尝试获取WebGL上下文
        glContext = this.webglCanvas.getContext('webgl') as WebGLRenderingContext;
        if (!glContext) {
          // 如果失败，尝试获取实验性WebGL上下文
          glContext = this.webglCanvas.getContext('experimental-webgl') as WebGLRenderingContext;
        }
      } catch (e) {
        // 获取上下文失败时打印警告
        console.warn('Failed to get WebGL context:', e);
      }

      this.gl = glContext;
      if (!this.gl) {
        // 如果不支持WebGL，打印警告并返回false，后续会回退到Canvas 2D实现
        console.warn('WebGL not supported, falling back to Canvas 2D');
        return false;
      }

      // 顶点着色器源码，负责传递顶点位置和纹理坐标
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;

      // 片元着色器源码，实现多种扭曲效果的计算和纹理采样
      const fragmentShaderSource = `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform float u_time;
        uniform float u_strength;
        uniform int u_distortionType;
        uniform vec2 u_resolution;
        varying vec2 v_texCoord;
        
        // 波浪扭曲函数，根据时间和强度计算纹理坐标偏移
        vec2 wave(vec2 uv, float time, float strength) {
          float waveX = sin(uv.y * 10.0 + time * 3.0) * strength * 0.1;
          float waveY = sin(uv.x * 10.0 + time * 2.0) * strength * 0.1;
          return uv + vec2(waveX, waveY);
        }
        
        // 涟漪扭曲函数，基于中心点和距离计算波纹偏移
        vec2 ripple(vec2 uv, float time, float strength) {
          vec2 center = vec2(0.5, 0.5);
          float distance = length(uv - center);
          float ripple = sin(distance * 20.0 - time * 5.0) * strength * 0.1;
          vec2 direction = normalize(uv - center);
          return uv + direction * ripple;
        }
        
        // 漩涡扭曲函数，基于距离和角度计算旋转偏移
        vec2 swirl(vec2 uv, float time, float strength) {
          vec2 center = vec2(0.5, 0.5);
          vec2 delta = uv - center;
          float dist = length(delta);
          float angle = atan(delta.y, delta.x) + dist * strength * 2.0 + time * 0.5;
          return center + dist * vec2(cos(angle), sin(angle));
        }
        
        void main() {
          // 使用原始纹理坐标，不需要Y轴翻转
          vec2 uv = v_texCoord;
          
          // 根据传入的扭曲类型选择对应的扭曲函数
          if (u_distortionType == 0) {
            uv = wave(uv, u_time, u_strength);
          } else if (u_distortionType == 1) {
            uv = ripple(uv, u_time, u_strength);
          } else if (u_distortionType == 2) {
            uv = swirl(uv, u_time, u_strength);
          }
          
          // 边界检查，超出纹理坐标范围则输出透明色
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          } else {
            // 直接采样纹理颜色，不需要额外的Y轴翻转
            gl_FragColor = texture2D(u_texture, uv);
          }
        }
      `;

      // 创建并编译着色器程序
      this.program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);
      // 返回是否成功创建程序
      return this.program !== null;
    } catch (error) {
      // 初始化失败时打印警告并返回false
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

  private applyWebGLDistortion(canvas: HTMLCanvasElement): HTMLCanvasElement {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return canvas;
    }

    const gl = this.gl;

    // 确保WebGL canvas尺寸正确
    if (this.webglCanvas.width !== canvas.width || this.webglCanvas.height !== canvas.height) {
      this.webglCanvas.width = canvas.width;
      this.webglCanvas.height = canvas.height;
    }

    // 设置视口，确保与canvas尺寸匹配
    gl.viewport(0, 0, this.webglCanvas.width, this.webglCanvas.height);

    // 清除画布
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

    // 创建顶点缓冲区 - 修复顶点坐标和纹理坐标
    // 顶点坐标: 位置(x,y) + 纹理坐标(u,v)
    // 注意：纹理坐标需要与Canvas 2D坐标系统匹配
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
    const timeLocation = gl.getUniformLocation(this.program, 'u_time');
    const strengthLocation = gl.getUniformLocation(this.program, 'u_strength');
    const distortionTypeLocation = gl.getUniformLocation(this.program, 'u_distortionType');
    const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');

    const currentTime = (Date.now() - this.animationStartTime) / 1000.0;
    globalAnimationTime = currentTime;

    gl.uniform1f(timeLocation, currentTime);
    gl.uniform1f(strengthLocation, globalDistortionStrength);
    gl.uniform2f(resolutionLocation, this.webglCanvas.width, this.webglCanvas.height);

    const distortionTypeMap: { [key: string]: number } = {
      wave: 0,
      ripple: 1,
      swirl: 2
    };
    gl.uniform1i(distortionTypeLocation, distortionTypeMap[globalDistortionType] || 0);

    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 清理
    gl.deleteTexture(texture);
    gl.deleteBuffer(vertexBuffer);

    return this.webglCanvas;
  }

  // Canvas 2D 实现 - 波浪扭曲
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

  // Canvas 2D 实现 - 涟漪扭曲
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

  // Canvas 2D 实现 - 漩涡扭曲
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
        const angle = Math.atan2(dy, dx) + distance * strength * 0.02 + time * 0.5;

        const sourceX = Math.round(centerX + distance * Math.cos(angle));
        const sourceY = Math.round(centerY + distance * Math.sin(angle));

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

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    console.time('DistortionEffect');

    // 如果强度为0，直接返回原图
    if (globalDistortionStrength <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    if (useWebGLDistortion) {
      // 使用WebGL实现（性能最佳）
      if (!this.gl && !this.initWebGL(canvas)) {
        // WebGL初始化失败，回退到Canvas 2D
        useWebGLDistortion = false;
      }

      if (this.gl) {
        console.log('使用WebGL扭曲');
        result = this.applyWebGLDistortion(canvas);
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
      const currentTime = (Date.now() - this.animationStartTime) / 1000.0;
      globalAnimationTime = currentTime;

      let distortedImageData: ImageData;

      switch (globalDistortionType) {
        case 'wave':
          console.log('使用波浪扭曲');
          distortedImageData = this.applyWaveDistortion(imageData, globalDistortionStrength, currentTime);
          break;
        case 'ripple':
          console.log('使用涟漪扭曲');
          distortedImageData = this.applyRippleDistortion(imageData, globalDistortionStrength, currentTime);
          break;
        case 'swirl':
          console.log('使用漩涡扭曲');
          distortedImageData = this.applySwirlDistortion(imageData, globalDistortionStrength, currentTime);
          break;
        default:
          distortedImageData = imageData;
      }

      ctx.putImageData(distortedImageData, 0, 0);
      result = c;
    }

    console.timeEnd('DistortionEffect');
    return result;
  }

  // 原版代码（保留作为参考）
  // protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
  //   const c = vglobal.createCanvas({
  //     width: canvas.width,
  //     height: canvas.height,
  //     dpr: vglobal.devicePixelRatio
  //   });
  //   const ctx = c.getContext('2d');
  //   if (!ctx) {
  //     return false;
  //   }
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.drawImage(canvas, 0, 0);
  //   ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
  //     Math.random() * 255
  //   )}, 0.2)`;
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   return c;
  // }
}

AnimateExecutor.registerBuiltInAnimate('stageTest', TestStageAnimate);

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
  // animationAppear: {
  //   duration: 300
  // },
  animationAppear: {
    stage: {
      type: 'stageTest',
      duration: 1000,
      easing: 'linear'
    }
  },
  animationUpdate: {
    duration: 300
  },
  animationEnter: {
    duration: 300
  },
  animationExit: {
    duration: 2000,
    type: 'fadeOut'
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
  button5.innerHTML = 'stack<->group remove';
  button5.addEventListener('click', () => {
    const nextSpec: any = { ...spec };
    const fieldKey = direction === 'horizontal' ? 'yField' : 'xField';
    if (typeof nextSpec[fieldKey] === 'string') {
      (nextSpec as any)[fieldKey] = ['type', 'country'];
    } else {
      (nextSpec as any)[fieldKey] = 'type';
    }
    removeData();
    nextSpec.data = {
      id: 'data0',
      values: dataArray
    };
    spec = nextSpec;
    cs.updateSpec(spec as any);
  });
  document.body.appendChild(button5);

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

  // 添加退场动画按钮
  const button7 = document.createElement('button');
  button7.innerHTML = '触发退场动画';
  button7.addEventListener('click', () => {
    console.log('触发退场动画...');

    // 方法1: 通过移除数据来触发退场动画
    // 先保存原始数据
    const originalData = [...dataArray];

    // 清空数据，这会触发所有元素的退场动画
    cs.updateData('data0', []);

    // 3秒后恢复数据，重新显示图表
    setTimeout(() => {
      console.log('恢复数据，重新显示图表...');
      cs.updateData('data0', originalData);
    }, 3000);
  });
  document.body.appendChild(button7);

  // 添加第三种退场动画按钮 - 通过更新spec来触发
  const button9 = document.createElement('button');
  button9.innerHTML = 'Spec退场动画';
  button9.addEventListener('click', () => {
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

    // 3秒后恢复原始spec
    setTimeout(() => {
      console.log('恢复原始spec...');
      cs.updateSpec(originalSpec as any);
    }, 3000);
  });
  document.body.appendChild(button9);

  // 添加自定义退场动画按钮
  const button10 = document.createElement('button');
  button10.innerHTML = '自定义退场动画';
  button10.addEventListener('click', () => {
    console.log('触发自定义退场动画...');

    // 保存原始spec
    const originalSpec = { ...spec };

    // 创建带有自定义退场动画的spec
    const customExitSpec = {
      ...spec,
      animationExit: {
        duration: 1000, // 1秒退场动画
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
    }, 2000);
  });
  document.body.appendChild(button10);

  // 添加扭曲效果控制按钮
  // 1. 扭曲类型选择按钮
  const distortionTypeButton = document.createElement('button');
  distortionTypeButton.innerHTML = `扭曲类型: ${globalDistortionType}`;
  distortionTypeButton.style.backgroundColor = '#2196F3';
  distortionTypeButton.style.color = 'white';
  distortionTypeButton.style.margin = '10px';
  distortionTypeButton.style.padding = '10px';
  distortionTypeButton.addEventListener('click', () => {
    const types = ['wave', 'ripple', 'swirl'];
    const currentIndex = types.indexOf(globalDistortionType);
    const nextIndex = (currentIndex + 1) % types.length;
    globalDistortionType = types[nextIndex];
    distortionTypeButton.innerHTML = `扭曲类型: ${globalDistortionType}`;

    console.log(`切换扭曲类型为: ${globalDistortionType}`);
    cs.renderAsync();
  });
  document.body.appendChild(distortionTypeButton);

  // 2. WebGL/Canvas2D 切换按钮
  const renderModeButton = document.createElement('button');
  renderModeButton.innerHTML = useWebGLDistortion ? '当前：WebGL模式' : '当前：Canvas2D模式';
  renderModeButton.style.backgroundColor = useWebGLDistortion ? '#4CAF50' : '#FF9800';
  renderModeButton.style.color = 'white';
  renderModeButton.style.margin = '10px';
  renderModeButton.style.padding = '10px';
  renderModeButton.addEventListener('click', () => {
    useWebGLDistortion = !useWebGLDistortion;
    renderModeButton.innerHTML = useWebGLDistortion ? '当前：WebGL模式' : '当前：Canvas2D模式';
    renderModeButton.style.backgroundColor = useWebGLDistortion ? '#4CAF50' : '#FF9800';

    console.log(`切换到${useWebGLDistortion ? 'WebGL' : 'Canvas2D'}模式`);
    cs.renderAsync();
  });
  document.body.appendChild(renderModeButton);

  // 3. 扭曲强度滑块控制
  const distortionSlider = document.createElement('input');
  distortionSlider.type = 'range';
  distortionSlider.min = '0';
  distortionSlider.max = '2';
  distortionSlider.step = '0.1';
  distortionSlider.value = globalDistortionStrength.toString();
  distortionSlider.style.width = '200px';
  distortionSlider.style.margin = '10px';

  const distortionLabel = document.createElement('label');
  distortionLabel.innerHTML = `扭曲强度: ${globalDistortionStrength.toFixed(1)}`;
  distortionLabel.style.marginRight = '10px';

  distortionSlider.addEventListener('input', e => {
    const value = parseFloat((e.target as HTMLInputElement).value);
    distortionLabel.innerHTML = `扭曲强度: ${value.toFixed(1)}`;
    globalDistortionStrength = value;
    console.log(`设置扭曲强度为: ${value}`);
    cs.renderAsync();
  });

  // 创建扭曲控制容器
  const distortionControl = document.createElement('div');
  distortionControl.style.margin = '10px';
  distortionControl.appendChild(distortionLabel);
  distortionControl.appendChild(distortionSlider);
  document.body.appendChild(distortionControl);

  // 4. 快速测试按钮组
  const testButtonsContainer = document.createElement('div');
  testButtonsContainer.style.margin = '10px';
  testButtonsContainer.innerHTML = '<h4>快速测试效果：</h4>';

  const testConfigs = [
    { type: 'wave', strength: 0.5, label: '波浪效果' },
    { type: 'ripple', strength: 0.8, label: '涟漪效果' },
    { type: 'swirl', strength: 0.6, label: '漩涡效果' }
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
      globalDistortionType = config.type;
      globalDistortionStrength = config.strength;

      // 更新UI显示
      distortionTypeButton.innerHTML = `扭曲类型: ${globalDistortionType}`;
      distortionLabel.innerHTML = `扭曲强度: ${globalDistortionStrength.toFixed(1)}`;
      distortionSlider.value = globalDistortionStrength.toString();

      console.log(`应用预设效果: ${config.label} (${config.type}, 强度: ${config.strength})`);
      cs.renderAsync();
    });
    testButtonsContainer.appendChild(testButton);
  });
  document.body.appendChild(testButtonsContainer);

  // 5. 性能信息显示
  const performanceInfo = document.createElement('div');
  performanceInfo.style.margin = '10px';
  performanceInfo.style.padding = '10px';
  performanceInfo.style.backgroundColor = '#f0f0f0';
  performanceInfo.style.borderRadius = '5px';
  performanceInfo.innerHTML = `
    <h4>扭曲效果说明：</h4>
    <ul>
      <li><strong>WebGL模式</strong>：使用GPU着色器，性能最佳，支持实时动画</li>
      <li><strong>Canvas2D模式</strong>：使用CPU像素操作，效果精确但性能较低</li>
      <li><strong>波浪</strong>：正弦波形扭曲，产生波浪效果</li>
      <li><strong>涟漪</strong>：从中心点扩散的圆形波纹</li>
      <li><strong>漩涡</strong>：围绕中心点的旋转扭曲</li>
      <li>查看控制台可以看到每次渲染的性能数据</li>
    </ul>
    <h4>已修复的问题：</h4>
    <ul>
      <li>✅ WebGL渲染位置偏移问题已修复</li>
      <li>✅ WebGL图像上下颠倒问题已修复</li>
      <li>✅ 纹理坐标系统统一问题已修复</li>
      <li>✅ 视口尺寸设置问题已修复</li>
      <li>✅ DPR兼容性问题已修复</li>
      <li>✅ 透视和鱼眼效果已移除</li>
    </ul>
  `;
  document.body.appendChild(performanceInfo);

  window['vchart'] = cs;
  console.log(cs);
};
run();
