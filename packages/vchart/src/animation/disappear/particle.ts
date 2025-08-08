import { AStageAnimate } from '@visactor/vrender-animate';
import { vglobal, EasingType } from '@visactor/vrender-core';

// 粒子效果配置接口
export interface ParticleConfig {
  effectType?: 'explode' | 'vortex' | 'gravity'; // 粒子效果类型
  count?: number; // 粒子数量
  size?: number; // 粒子大小
  strength?: number; // 力场强度
}

// 粒子数据结构
export interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  life: number;
  size: number;
}

export class ParticleDisintegration extends AStageAnimate<any> {
  private webglCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private particles: Particle[] = [];
  private currentAnimationRatio = 0;
  private animationTime = 0;

  // WebGL相关
  private positionBuffer: WebGLBuffer | null = null;
  private colorBuffer: WebGLBuffer | null = null;

  // 粒子配置
  private particleConfig: Required<ParticleConfig>;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    // 初始化粒子配置，使用传入的参数或默认值
    this.particleConfig = {
      effectType: params?.options?.effectType || 'gravity', //'explode' | 'vortex' | 'gravity'; // 粒子效果类型
      count: params?.options?.count || 4000,
      size: params?.options?.size || 20,
      strength: params?.options?.strength || 1.5
    };
  }

  onUpdate(end: boolean, ratio: number, out: any): void {
    super.onUpdate(end, ratio, out);
    this.currentAnimationRatio = ratio;
    this.animationTime = ratio * Math.PI * 2;
  }

  private getAnimationTime(): number {
    if (this.currentAnimationRatio > 0) {
      return this.animationTime;
    }
    return Date.now() / 1000.0;
  }

  getDurationFromParent(): number {
    return this.duration || 2000;
  }

  // 初始化WebGL
  private initWebGL(canvas: HTMLCanvasElement): boolean {
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

      // 顶点着色器
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec4 a_color;
        attribute float a_size;

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_forceStrength;
        uniform int u_effectType;

        varying vec4 v_color;

        void main() {
          // 将像素坐标转换为剪辑空间坐标
          vec2 clipSpace = ((a_position / u_resolution) * 2.0) - 1.0;
          clipSpace.y = -clipSpace.y; // 翻转Y轴

          gl_Position = vec4(clipSpace, 0.0, 1.0);
          gl_PointSize = a_size;
          v_color = a_color;
        }
      `;

      // 片元着色器
      const fragmentShaderSource = `
        precision mediump float;
        varying vec4 v_color;

        void main() {
          // 创建圆形粒子
          vec2 coord = gl_PointCoord - vec2(0.5);
          float distance = length(coord);

          if (distance > 0.5) {
            discard;
          }

          // 保持原始颜色，只调整透明度渐变
          float alpha = v_color.a;

          // 使用原始颜色，不进行亮度增强
          gl_FragColor = vec4(v_color.rgb, alpha);
        }
      `;

      this.program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);

      if (this.program) {
        // 创建缓冲区
        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();

        // 启用点精灵
        if (this.gl.getExtension) {
          this.gl.getExtension('OES_standard_derivatives');
        }

        return true;
      }

      return false;
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

  // 从canvas提取粒子数据
  private extractParticles(canvas: HTMLCanvasElement): void {
    const tempCanvas = vglobal.createCanvas({
      width: canvas.width,
      height: canvas.height,
      dpr: 1 // 使用1的DPR来简化像素采样
    });

    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      return;
    }

    // 绘制原始图像到临时canvas
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    // 获取图像数据
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    this.particles = [];

    // 采样步长，控制粒子密度 - 减小步长以获得更多粒子
    const step = Math.max(
      1,
      Math.floor(Math.sqrt((tempCanvas.width * tempCanvas.height) / (this.particleConfig.count * 1.5)))
    );

    for (let y = 0; y < tempCanvas.height; y += step) {
      for (let x = 0; x < tempCanvas.width; x += step) {
        const index = (y * tempCanvas.width + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        // 只创建非透明像素的粒子 - 降低透明度阈值以包含更多粒子
        if (a > 5) {
          // 将坐标转换回原始canvas尺寸
          const realX = (x / tempCanvas.width) * canvas.width;
          const realY = (y / tempCanvas.height) * canvas.height;

          const particle: Particle = {
            x: realX,
            y: realY,
            originX: realX,
            originY: realY,
            vx: 0,
            vy: 0,
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a: Math.max(0.6, a / 255), // 确保粒子有足够的透明度
            life: 1.0,
            size: this.particleConfig.size * (1 + Math.random() * 0.5) // 添加粒子大小的随机变化
          };

          this.particles.push(particle);
        }
      }
    }
  }

  // 更新粒子物理
  private updateParticles(time: number, canvas: HTMLCanvasElement): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const progress = this.currentAnimationRatio;

    // 针对短动画时间的优化：动态调整时间曲线和力度
    const duration = this.getDurationFromParent();
    const isShortAnimation = duration < 2000;
    const timeMultiplier = isShortAnimation ? Math.max(1.5, 3000 / duration) : 1.0;
    const intensityBoost = isShortAnimation ? Math.min(2.0, 2000 / duration) : 1.0;

    this.particles.forEach(particle => {
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      let forceX = 0;
      let forceY = 0;

      switch (this.particleConfig.effectType) {
        case 'explode':
          // 爆炸效果：粒子从中心向外飞散
          // 短动画优化：提高爆炸力度，使用更陡峭的加速曲线
          const explodeIntensity = isShortAnimation ? Math.pow(progress, 0.6) * intensityBoost * 8 : progress * 5;
          forceX = Math.cos(angle) * this.particleConfig.strength * explodeIntensity;
          forceY = Math.sin(angle) * this.particleConfig.strength * explodeIntensity;
          break;

        case 'vortex':
          // 重新设计的漩涡退场效果：根据动画时长调整退场时机
          const baseRadius = Math.sqrt((particle.originX - centerX) ** 2 + (particle.originY - centerY) ** 2);
          const canvasRadius = Math.max(canvas.width, canvas.height) * 0.7;

          // 根据动画时长调整时间分配和退场时机
          const isLongAnimation = duration > 1500; // 长动画阈值

          // 长动画时延迟退场，保持更长时间的可见性
          let adjustedProgress: number;
          if (isLongAnimation) {
            // 长动画：前70%时间粒子保持在canvas内螺旋，后30%退场
            if (progress < 0.7) {
              adjustedProgress = progress * 0.5; // 前期移动更缓慢
            } else {
              adjustedProgress = 0.35 + (progress - 0.7) * 2.17; // 后期加速退场 (0.35 + 0.3*2.17 ≈ 1)
            }
          } else if (isShortAnimation) {
            // 短动画：使用原有逻辑
            adjustedProgress = Math.pow(progress, 0.8);
          } else {
            // 中等动画：平衡处理
            adjustedProgress = progress < 0.6 ? progress * 0.7 : 0.42 + (progress - 0.6) * 1.45;
          }

          // 根据动画时长调整旋转速度
          let rotationSpeed: number;
          if (isLongAnimation) {
            rotationSpeed = 0.6; // 长动画更慢的旋转
          } else if (isShortAnimation) {
            rotationSpeed = 1.2;
          } else {
            rotationSpeed = 0.8;
          }

          const spiralAngle = angle + adjustedProgress * Math.PI * rotationSpeed;

          // 根据动画时长调整扩散系数
          let expansionFactor: number;
          if (isLongAnimation) {
            // 长动画：前期小扩散，后期大扩散
            expansionFactor = progress < 0.7 ? 0.8 : 1.5 + (progress - 0.7) * 3.33; // 后期快速扩散
          } else if (isShortAnimation) {
            expansionFactor = 2.2;
          } else {
            expansionFactor = 1.8;
          }

          const targetRadius = baseRadius + adjustedProgress * canvasRadius * expansionFactor;

          // 计算目标位置
          const targetX = centerX + Math.cos(spiralAngle) * targetRadius;
          const targetY = centerY + Math.sin(spiralAngle) * targetRadius;

          // 根据动画时长调整力度
          let baseForce: number;
          if (isLongAnimation) {
            // 长动画：前期力度小，后期力度大
            baseForce =
              progress < 0.7
                ? adjustedProgress * this.particleConfig.strength * 0.04 // 前期很小的力度
                : adjustedProgress * this.particleConfig.strength * 0.15; // 后期较大力度
          } else if (isShortAnimation) {
            baseForce = adjustedProgress * this.particleConfig.strength * 0.12 * intensityBoost;
          } else {
            baseForce = adjustedProgress * this.particleConfig.strength * 0.08;
          }

          // 主要推力：向目标位置移动
          forceX = (targetX - particle.x) * baseForce;
          forceY = (targetY - particle.y) * baseForce;

          // 径向推力：根据动画时长和阶段调整
          let radialForce: number;
          if (isLongAnimation) {
            // 长动画：只在后期添加径向推力
            radialForce = progress > 0.7 ? (progress - 0.7) * 2.5 * this.particleConfig.strength * 0.08 : 0;
          } else if (isShortAnimation) {
            radialForce = adjustedProgress * this.particleConfig.strength * 0.06 * intensityBoost;
          } else {
            radialForce = adjustedProgress * this.particleConfig.strength * 0.04;
          }

          forceX += Math.cos(angle) * radialForce;
          forceY += Math.sin(angle) * radialForce;

          // 切向力：保持螺旋感
          const tangentX = -Math.sin(spiralAngle);
          const tangentY = Math.cos(spiralAngle);
          const tangentForce = baseForce * 0.25;
          forceX += tangentX * tangentForce;
          forceY += tangentY * tangentForce;

          // 最终退场推进力：确保完全离开canvas
          if (isLongAnimation) {
            // 长动画：只在最后20%时间加强退场
            if (progress > 0.8) {
              const finalExitProgress = (progress - 0.8) / 0.2;
              const exitForce = finalExitProgress * this.particleConfig.strength * 0.12;
              forceX += Math.cos(angle) * exitForce;
              forceY += Math.sin(angle) * exitForce;
            }
          } else {
            // 短动画和中等动画：保留原有逻辑
            if (progress > 0.6) {
              const exitProgress = (progress - 0.6) / 0.4;
              const exitForce =
                exitProgress * this.particleConfig.strength * (isShortAnimation ? 0.08 * intensityBoost : 0.05);
              forceX += Math.cos(angle) * exitForce;
              forceY += Math.sin(angle) * exitForce;
            }
          }
          break;

        case 'gravity':
          // 重力效果：粒子瓦解下落，带有随机性和重力加速度
          // 基于时间进度增加受影响的粒子数量
          const baseGravityThreshold =
            ((particle.originX + particle.originY * 0.7) / (canvas.width + canvas.height)) * 0.8;

          // 短动画优化：降低阈值，让粒子更早开始受重力影响
          const gravityThreshold = isShortAnimation ? Math.max(0.05, baseGravityThreshold - 0.3) : baseGravityThreshold;

          if (progress > gravityThreshold) {
            const rawGravityProgress = (progress - gravityThreshold) / (1 - gravityThreshold);

            // 短动画优化：使用更快的重力加速曲线
            const gravityProgress = isShortAnimation ? Math.pow(rawGravityProgress, 0.8) : rawGravityProgress;

            // 重力下落力，短动画时增强
            const baseGravityForce = this.particleConfig.strength * gravityProgress * gravityProgress * 12;
            const gravityForce = isShortAnimation ? baseGravityForce * intensityBoost : baseGravityForce;
            forceY += gravityForce;

            // 添加水平随机扰动，模拟瓦解时的不规则运动
            const turbulenceIntensity = isShortAnimation ? timeMultiplier * 1.5 : 1.0;
            const turbulence =
              Math.sin(time * 3 * turbulenceIntensity + particle.originX * 0.02) *
              Math.cos(time * 2 * turbulenceIntensity + particle.originY * 0.015);
            forceX += turbulence * this.particleConfig.strength * 2 * intensityBoost;

            // 添加初始爆发力，让粒子先向外散开再下落
            // 短动画优化：缩短爆发阶段时间，增强爆发力度
            const burstDuration = isShortAnimation ? 0.4 : 0.3;
            if (gravityProgress < burstDuration) {
              const burstIntensity = (burstDuration - gravityProgress) * this.particleConfig.strength;
              const burstForce = isShortAnimation ? burstIntensity * intensityBoost * 12 : burstIntensity * 8;

              const burstAngle = angle + Math.sin(time * 5 * timeMultiplier) * 0.5;
              forceX += Math.cos(burstAngle) * burstForce;
              forceY += Math.sin(burstAngle) * burstForce * 0.5;
            }

            // 空气阻力随时间减少，短动画时调整阻力系数
            const dragMultiplier = isShortAnimation ? 0.5 : 1.0;
            particle.vx *= 0.99 - gravityProgress * 0.01 * dragMultiplier;
            particle.vy *= 0.98 - gravityProgress * 0.005 * dragMultiplier;
          }
          break;
      }

      // 应用力并更新位置
      particle.vx += forceX;
      particle.vy += forceY;

      // 添加阻力，短动画时减少阻力以保持动感
      const dragCoeff = isShortAnimation ? 0.99 : 0.98;
      particle.vx *= dragCoeff;
      particle.vy *= dragCoeff;

      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 更新生命值和透明度 - 针对短动画优化
      if (isShortAnimation) {
        // 短动画：更缓慢的生命值衰减，确保粒子在整个动画期间都可见
        const lifeDecayRate = Math.max(0.1, 0.5 / timeMultiplier);
        particle.life = Math.max(0, 1 - progress * lifeDecayRate);

        // 透明度保持更高的可见性
        particle.a = Math.max(0.2, particle.life * (particle.a > 0 ? Math.min(1, particle.a * 1.2) : 0.9));

        // 粒子大小在短动画中保持更大
        particle.size = Math.max(
          this.particleConfig.size * 0.7,
          this.particleConfig.size * (0.5 + particle.life * 0.5)
        );
      } else {
        // 长动画：原有的生命值和透明度计算
        particle.life = Math.max(0, 1 - progress * 0.2);
        particle.a = Math.max(0.1, particle.life * (particle.a > 0 ? Math.min(1, particle.a * 1.5) : 0.8));
        particle.size = Math.max(
          this.particleConfig.size * 0.5,
          this.particleConfig.size * (0.3 + particle.life * 0.7)
        );
      }
    });
  }

  // WebGL渲染粒子
  private renderWebGLParticles(canvas: HTMLCanvasElement): HTMLCanvasElement {
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

    // 启用混合 - 使用加性混合增强粒子亮度
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // 可选：使用加性混合让粒子更亮
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(this.program);

    // 准备粒子数据
    const positions = new Float32Array(this.particles.length * 2);
    const colors = new Float32Array(this.particles.length * 4);
    const sizes = new Float32Array(this.particles.length);

    this.particles.forEach((particle, i) => {
      positions[i * 2] = particle.x;
      positions[i * 2 + 1] = particle.y;

      // 保持原始颜色，不进行亮度增强
      colors[i * 4] = particle.r;
      colors[i * 4 + 1] = particle.g;
      colors[i * 4 + 2] = particle.b;
      colors[i * 4 + 3] = Math.max(0.1, particle.a); // 仅确保最小透明度

      // 确保粒子大小足够大
      sizes[i] = Math.max(6, particle.size * 1.5);
    });

    // 更新缓冲区
    if (this.positionBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

      const positionLocation = gl.getAttribLocation(this.program, 'a_position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    }

    if (this.colorBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

      const colorLocation = gl.getAttribLocation(this.program, 'a_color');
      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    }

    // 大小属性
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);

    const sizeLocation = gl.getAttribLocation(this.program, 'a_size');
    gl.enableVertexAttribArray(sizeLocation);
    gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, 0, 0);

    // 设置uniform
    const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(this.program, 'u_time');
    const forceStrengthLocation = gl.getUniformLocation(this.program, 'u_forceStrength');
    const effectTypeLocation = gl.getUniformLocation(this.program, 'u_effectType');

    gl.uniform2f(resolutionLocation, this.webglCanvas.width, this.webglCanvas.height);
    gl.uniform1f(timeLocation, this.getAnimationTime());
    gl.uniform1f(forceStrengthLocation, this.particleConfig.strength);

    const effectTypeMap: { [key: string]: number } = {
      explode: 0,
      vortex: 1,
      gravity: 2
    };
    gl.uniform1i(effectTypeLocation, effectTypeMap[this.particleConfig.effectType] || 0);

    // 绘制粒子
    gl.drawArrays(gl.POINTS, 0, this.particles.length);

    // 清理
    gl.deleteBuffer(sizeBuffer);

    return this.webglCanvas;
  }

  protected afterStageRender(stage: any, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false {
    // 如果没有粒子或者需要重新生成粒子
    if (this.particles.length === 0) {
      this.extractParticles(canvas);
    }

    // 更新粒子物理
    const currentTime = this.getAnimationTime();
    this.updateParticles(currentTime, canvas);

    let result: HTMLCanvasElement;

    // 初始化WebGL（如果尚未初始化）
    if (!this.gl && !this.initWebGL(canvas)) {
      console.warn('WebGL初始化失败，无法渲染粒子效果');
      result = canvas;
    } else if (this.gl) {
      result = this.renderWebGLParticles(canvas);
    } else {
      result = canvas;
    }

    return result;
  }
}
