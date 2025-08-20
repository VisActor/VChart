import { EasingType } from '@visactor/vrender-core';
import { HybridEffectBase } from './base/CustomEffectBase';
import { ImageProcessUtils } from './base/ImageProcessUtils';

export interface ParticleConfig {
  effectType?: 'explode' | 'vortex' | 'gravity'; // 粒子效果类型
  count?: number; // 粒子数量
  size?: number; // 粒子大小
  strength?: number; // 力场强度
}
// 粒子数据结构
export interface ParticleData {
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

/**
 * 重构后的粒子消散特效
 * 使用HybridEffectBase，优先WebGL实现，Canvas 2D回退
 */
export class ParticleDisintegrationRefactor extends HybridEffectBase {
  private particles: ParticleData[] = [];
  private positionBuffer: WebGLBuffer | null = null;
  private colorBuffer: WebGLBuffer | null = null;
  private particleConfig: ParticleConfig;

  constructor(from: null, to: null, duration: number, easing: EasingType, params: any) {
    super(from, to, duration, easing, params);

    this.particleConfig = {
      effectType: params?.options?.effectType || 'gravity', //'explode' | 'vortex' | 'gravity'; // 粒子效果类型
      count: params?.options?.count || 4000,
      size: params?.options?.size || 20,
      strength: params?.options?.strength || 1.5
    };
  }

  // WebGL实现 - 高性能版本
  protected getShaderSources(): { vertex: string; fragment: string } | null {
    const vertexShader = `
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

    const fragmentShader = `
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
        gl_FragColor = vec4(v_color.rgb, v_color.a);
      }
    `;

    return { vertex: vertexShader, fragment: fragmentShader };
  }

  protected applyWebGLEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    if (!this.gl || !this.program || !this.webglCanvas) {
      return null;
    }

    // 使用基类提供的WebGL状态设置
    this.setupWebGLState(canvas);

    // 如果没有粒子，提取粒子数据
    if (this.particles.length === 0) {
      this.extractParticles(canvas);
    }

    // 更新粒子物理
    this.updateParticles(canvas);

    const gl = this.gl;

    // 启用混合
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);

    // 准备粒子数据并绘制
    this.prepareAndDrawParticles(gl);

    return this.webglCanvas;
  }

  // Canvas 2D回退实现 - 简化版本，主要用于兼容性
  protected applyCanvas2DEffect(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const output = this.createOutputCanvas(canvas);
    if (!output) {
      return null;
    }

    const { canvas: outputCanvas, ctx } = output;

    // 简化的粒子效果：使用透明度和简单变换模拟粒子消散
    const progress = this.currentAnimationRatio;

    // 根据效果类型应用不同的Canvas 2D模拟
    switch (this.particleConfig.effectType) {
      case 'explode':
        this.applyCanvas2DExplode(ctx, canvas, progress);
        break;
      case 'gravity':
        this.applyCanvas2DGravity(ctx, canvas, progress);
        break;
      case 'vortex':
        this.applyCanvas2DVortex(ctx, canvas, progress);
        break;
      default:
        // 默认简单透明度淡出
        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.drawImage(canvas, 0, 0);
    }

    return outputCanvas;
  }

  /**
   * 从canvas提取粒子数据
   */
  private extractParticles(canvas: HTMLCanvasElement): void {
    const tempCanvas = ImageProcessUtils.createTempCanvas(canvas.width, canvas.height, 1);
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

    // 计算采样步长
    const step = Math.max(
      1,
      Math.floor(Math.sqrt((tempCanvas.width * tempCanvas.height) / (this.particleConfig.count! * 1.5)))
    );

    for (let y = 0; y < tempCanvas.height; y += step) {
      for (let x = 0; x < tempCanvas.width; x += step) {
        const index = (y * tempCanvas.width + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        // 只创建非透明像素的粒子
        if (a > 5) {
          // 将坐标转换回原始canvas尺寸
          const realX = (x / tempCanvas.width) * canvas.width;
          const realY = (y / tempCanvas.height) * canvas.height;

          const particle: ParticleData = {
            x: realX,
            y: realY,
            originX: realX,
            originY: realY,
            vx: 0,
            vy: 0,
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a: Math.max(0.6, a / 255),
            life: 1.0,
            size: this.particleConfig.size! * (1 + Math.random() * 0.5)
          };

          this.particles.push(particle);
        }
      }
    }
  }

  /**
   * 更新粒子物理模拟
   */
  private updateParticles(canvas: HTMLCanvasElement): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const progress = this.currentAnimationRatio;
    const duration = this.getDurationFromParent();
    const isShortAnimation = duration < 2000;
    const timeMultiplier = isShortAnimation ? Math.max(1.5, 3000 / duration) : 1.0;
    const intensityBoost = isShortAnimation ? Math.min(2.0, 2000 / duration) : 1.0;

    this.particles.forEach(particle => {
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // 根据效果类型应用不同的物理力
      this.applyParticleForces(particle, angle, distance, progress, intensityBoost, canvas);

      // 更新粒子属性
      this.updateParticleProperties(particle, progress, isShortAnimation, timeMultiplier, intensityBoost);
    });
  }

  /**
   * 根据效果类型应用粒子力
   */
  private applyParticleForces(
    particle: ParticleData,
    angle: number,
    distance: number,
    progress: number,
    intensityBoost: number,
    canvas: HTMLCanvasElement
  ): void {
    const time = this.getAnimationTime();

    switch (this.particleConfig.effectType) {
      case 'explode':
        const explodeIntensity = progress * this.particleConfig.strength! * intensityBoost * 5;
        particle.vx += Math.cos(angle) * explodeIntensity;
        particle.vy += Math.sin(angle) * explodeIntensity;
        break;

      case 'gravity':
        this.applyGravityEffect(particle, progress, intensityBoost, canvas, time);
        break;

      case 'vortex':
        this.applyVortexEffect(particle, progress, intensityBoost, canvas, angle, distance);
        break;
    }
  }

  /**
   * 应用重力效果
   */
  private applyGravityEffect(
    particle: ParticleData,
    progress: number,
    intensityBoost: number,
    canvas: HTMLCanvasElement,
    time: number
  ): void {
    const gravityThreshold = ((particle.originX + particle.originY * 0.7) / (canvas.width + canvas.height)) * 0.8;

    if (progress > gravityThreshold) {
      const gravityProgress = (progress - gravityThreshold) / (1 - gravityThreshold);
      const gravityForce = this.particleConfig.strength! * gravityProgress * gravityProgress * 12 * intensityBoost;

      particle.vy += gravityForce;

      // 添加水平随机扰动
      const turbulence = Math.sin(time * 3 + particle.originX * 0.02) * Math.cos(time * 2 + particle.originY * 0.015);
      particle.vx += turbulence * this.particleConfig.strength! * 2 * intensityBoost;
    }
  }

  /**
   * 应用漩涡效果
   */
  private applyVortexEffect(
    particle: ParticleData,
    progress: number,
    intensityBoost: number,
    canvas: HTMLCanvasElement,
    angle: number,
    distance: number
  ): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const spiralAngle = angle + progress * Math.PI * 0.8;
    const targetRadius = distance + progress * Math.max(canvas.width, canvas.height) * 0.7 * 1.8;

    const targetX = centerX + Math.cos(spiralAngle) * targetRadius;
    const targetY = centerY + Math.sin(spiralAngle) * targetRadius;

    const baseForce = progress * this.particleConfig.strength! * 0.08 * intensityBoost;

    particle.vx += (targetX - particle.x) * baseForce;
    particle.vy += (targetY - particle.y) * baseForce;
  }

  /**
   * 更新粒子生命周期属性
   */
  private updateParticleProperties(
    particle: ParticleData,
    progress: number,
    isShortAnimation: boolean,
    timeMultiplier: number,
    intensityBoost: number
  ): void {
    // 应用阻力
    const dragCoeff = isShortAnimation ? 0.99 : 0.98;
    particle.vx *= dragCoeff;
    particle.vy *= dragCoeff;

    // 更新位置
    particle.x += particle.vx;
    particle.y += particle.vy;

    // 更新生命值和透明度
    if (isShortAnimation) {
      const lifeDecayRate = Math.max(0.1, 0.5 / timeMultiplier);
      particle.life = Math.max(0, 1 - progress * lifeDecayRate);
      particle.a = Math.max(0.2, particle.life * Math.min(1, particle.a * 1.2));
      particle.size = Math.max(
        this.particleConfig.size! * 0.7,
        this.particleConfig.size! * (0.5 + particle.life * 0.5)
      );
    } else {
      particle.life = Math.max(0, 1 - progress * 0.2);
      particle.a = Math.max(0.1, particle.life * Math.min(1, particle.a * 1.5));
      particle.size = Math.max(
        this.particleConfig.size! * 0.5,
        this.particleConfig.size! * (0.3 + particle.life * 0.7)
      );
    }
  }

  /**
   * 准备粒子数据并绘制
   */
  private prepareAndDrawParticles(gl: WebGLRenderingContext): void {
    const positions = new Float32Array(this.particles.length * 2);
    const colors = new Float32Array(this.particles.length * 4);
    const sizes = new Float32Array(this.particles.length);

    this.particles.forEach((particle, i) => {
      positions[i * 2] = particle.x;
      positions[i * 2 + 1] = particle.y;

      colors[i * 4] = particle.r;
      colors[i * 4 + 1] = particle.g;
      colors[i * 4 + 2] = particle.b;
      colors[i * 4 + 3] = Math.max(0.1, particle.a);

      sizes[i] = Math.max(6, particle.size * 1.5);
    });

    // 更新缓冲区
    this.updateParticleBuffers(gl, positions, colors, sizes);

    // 设置uniforms
    this.setParticleUniforms(gl);

    // 绘制粒子
    gl.drawArrays(gl.POINTS, 0, this.particles.length);

    // 清理临时缓冲区
    this.cleanupTempBuffers(gl);
  }

  /**
   * 更新粒子缓冲区
   */
  private updateParticleBuffers(
    gl: WebGLRenderingContext,
    positions: Float32Array,
    colors: Float32Array,
    sizes: Float32Array
  ): void {
    // 位置缓冲区
    if (!this.positionBuffer) {
      this.positionBuffer = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

    const positionLocation = gl.getAttribLocation(this.program!, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 颜色缓冲区
    if (!this.colorBuffer) {
      this.colorBuffer = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

    const colorLocation = gl.getAttribLocation(this.program!, 'a_color');
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    // 大小缓冲区
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);

    const sizeLocation = gl.getAttribLocation(this.program!, 'a_size');
    gl.enableVertexAttribArray(sizeLocation);
    gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, 0, 0);

    // 保存临时缓冲区引用，用于清理
    (this as any)._tempSizeBuffer = sizeBuffer;
  }

  /**
   * 设置粒子着色器uniforms
   */
  private setParticleUniforms(gl: WebGLRenderingContext): void {
    const resolutionLocation = gl.getUniformLocation(this.program!, 'u_resolution');
    const timeLocation = gl.getUniformLocation(this.program!, 'u_time');
    const forceStrengthLocation = gl.getUniformLocation(this.program!, 'u_forceStrength');
    const effectTypeLocation = gl.getUniformLocation(this.program!, 'u_effectType');

    gl.uniform2f(resolutionLocation, this.webglCanvas!.width, this.webglCanvas!.height);
    gl.uniform1f(timeLocation, this.getAnimationTime());
    gl.uniform1f(forceStrengthLocation, this.particleConfig.strength!);

    const effectTypeMap: { [key: string]: number } = {
      explode: 0,
      vortex: 1,
      gravity: 2
    };
    gl.uniform1i(effectTypeLocation, effectTypeMap[this.particleConfig.effectType!] || 0);
  }

  /**
   * 清理临时缓冲区
   */
  private cleanupTempBuffers(gl: WebGLRenderingContext): void {
    const tempSizeBuffer = (this as any)._tempSizeBuffer;
    if (tempSizeBuffer) {
      gl.deleteBuffer(tempSizeBuffer);
      delete (this as any)._tempSizeBuffer;
    }
  }

  // Canvas 2D回退实现的具体方法

  /**
   * Canvas 2D爆炸效果模拟
   */
  private applyCanvas2DExplode(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, progress: number): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 简单的放大和透明度模拟爆炸效果
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - progress);
    ctx.translate(centerX, centerY);
    const scale = 1 + progress * 0.5;
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }

  /**
   * Canvas 2D重力效果模拟
   */
  private applyCanvas2DGravity(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, progress: number): void {
    // 使用垂直偏移和透明度模拟重力下落
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - progress);
    const offsetY = progress * canvas.height * 0.3;
    ctx.drawImage(canvas, 0, offsetY);
    ctx.restore();
  }

  /**
   * Canvas 2D漩涡效果模拟
   */
  private applyCanvas2DVortex(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, progress: number): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 使用旋转和透明度模拟漩涡效果
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - progress);
    ctx.translate(centerX, centerY);
    ctx.rotate(progress * Math.PI * 2);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }
}
