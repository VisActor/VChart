/**
 * 通用特效配置接口
 */
export interface BaseDisappearConfig {
  useWebGL?: boolean;
  strength?: number;
}

/**
 * 粒子特效配置
 */
export interface ParticleEffectConfig extends BaseDisappearConfig {
  effectType?: 'explode' | 'vortex' | 'gravity';
  count?: number;
  size?: number;
}

/**
 * 扭曲特效配置
 */
export interface DistortionEffectConfig extends BaseDisappearConfig {
  distortionType?: 'wave' | 'ripple' | 'swirl';
}

/**
 * 模糊特效配置
 */
export interface BlurEffectConfig extends BaseDisappearConfig {
  blurRadius?: number;
  useOptimizedBlur?: boolean;
}

/**
 * 故障特效配置
 */
export interface GlitchEffectConfig extends BaseDisappearConfig {
  effectType?: 'rgb-shift' | 'digital-distortion' | 'scan-lines' | 'data-corruption';
  intensity?: number;
}

/**
 * 像素化特效配置
 */
export interface PixelationEffectConfig extends BaseDisappearConfig {
  maxPixelSize?: number;
  method?: 'out' | 'in';
}

/**
 * 颜色特效配置
 */
export interface ColorEffectConfig extends BaseDisappearConfig {
  effectType?: 'grayscale' | 'sepia';
}

/**
 * 溶解特效配置
 */
export interface DissolveEffectConfig extends BaseDisappearConfig {
  dissolveType?: 'outward' | 'inward' | 'radial' | 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop';
  noiseScale?: number;
  fadeEdge?: boolean;
}

/**
 * 特效类型枚举
 */
export enum EffectType {
  PARTICLE = 'particle',
  DISTORTION = 'distortion',
  BLUR = 'blur',
  GLITCH = 'glitch',
  PIXELATION = 'pixelation',
  GRAYSCALE = 'grayscale',
  DISSOLVE = 'dissolve'
}

/**
 * 配置工厂类
 */
export class EffectConfigFactory {
  /**
   * 获取默认配置
   */
  static getDefaultConfig(effectType: EffectType, userConfig: any = {}): BaseDisappearConfig {
    const baseDefaults = {
      useWebGL: true,
      strength: 1.0
    };

    switch (effectType) {
      case EffectType.PARTICLE:
        return {
          ...baseDefaults,
          effectType: 'gravity',
          count: 4000,
          size: 20,
          ...userConfig
        } as ParticleEffectConfig;

      case EffectType.DISTORTION:
        return {
          ...baseDefaults,
          distortionType: 'wave',
          strength: 0.3,
          ...userConfig
        } as DistortionEffectConfig;

      case EffectType.BLUR:
        return {
          ...baseDefaults,
          blurRadius: 8,
          useOptimizedBlur: true,
          ...userConfig
        } as BlurEffectConfig;

      case EffectType.GLITCH:
        return {
          ...baseDefaults,
          effectType: 'rgb-shift',
          intensity: 0.5,
          ...userConfig
        } as GlitchEffectConfig;

      case EffectType.PIXELATION:
        return {
          ...baseDefaults,
          maxPixelSize: 20,
          method: 'out',
          ...userConfig
        } as PixelationEffectConfig;

      case EffectType.GRAYSCALE:
        return {
          ...baseDefaults,
          effectType: 'grayscale',
          ...userConfig
        } as ColorEffectConfig;

      case EffectType.DISSOLVE:
        return {
          ...baseDefaults,
          dissolveType: 'outward',
          noiseScale: 8,
          fadeEdge: true,
          ...userConfig
        } as DissolveEffectConfig;

      default:
        return {
          ...baseDefaults,
          ...userConfig
        };
    }
  }
}
