import { default as VChart, vglobal } from '../../index';
import { AStageAnimate } from '@visactor/vrender-animate';

// 扭曲效果配置接口
export interface DistortionConfig {
  distortionType?: 'wave' | 'ripple' | 'swirl'; // 扭曲效果类型
  strength?: number; // 扭曲强度
  useWebGL?: boolean; // 是否使用WebGL实现
}

export class Distortion extends AStageAnimate<any> {
  private webglCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animationStartTime = Date.now();

  // 扭曲配置
  private distortionConfig: Required<DistortionConfig>;

  constructor(from: null, to: null, duration: number, easing: any, params: any) {
    super(from, to, duration, easing, params);

    // 初始化扭曲配置，使用传入的参数或默认值
    this.distortionConfig = {
      distortionType: params?.options?.distortionType || 'wave',
      strength: params?.options?.strength || 0.3,
      useWebGL: params?.options?.useWebGL !== undefined ? params.options.useWebGL : true
    };
  }

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
    // globalAnimationTime = currentTime;

    gl.uniform1f(timeLocation, currentTime);
    gl.uniform1f(strengthLocation, this.distortionConfig.strength);
    gl.uniform2f(resolutionLocation, this.webglCanvas.width, this.webglCanvas.height);

    const distortionTypeMap: { [key: string]: number } = {
      wave: 0,
      ripple: 1,
      swirl: 2
    };
    gl.uniform1i(distortionTypeLocation, distortionTypeMap[this.distortionConfig.distortionType] || 0);

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
    // 如果强度为0，直接返回原图
    if (this.distortionConfig.strength <= 0) {
      return canvas;
    }

    let result: HTMLCanvasElement;

    if (this.distortionConfig.useWebGL) {
      // 使用WebGL实现（性能最佳）
      if (!this.gl && !this.initWebGL(canvas)) {
        // WebGL初始化失败，回退到Canvas 2D
        this.distortionConfig.useWebGL = false;
      }

      if (this.gl) {
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
      // globalAnimationTime = currentTime;

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

      ctx.putImageData(distortedImageData, 0, 0);
      result = c;
    }
    return result;
  }
}
