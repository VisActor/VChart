// 原有特效类
export * from './particle';
// export * from './distortion';
export * from './pixelation';
export * from './gaussian-blur';
// export * from './glitch';
// export * from './grayscale';
// export * from './dissolve';

// 重构后的基础类和工具类
export * from './base/DisappearAnimateBase';
export * from './base/CustomEffectBase';
export * from './base/ImageProcessUtils';
// export {
//   BaseDisappearConfig,
//   ParticleEffectConfig,
//   DistortionEffectConfig,
//   BlurEffectConfig,
//   GlitchEffectConfig,
//   PixelationEffectConfig,
//   DissolveEffectConfig,
//   EffectType,
//   EffectConfigFactory
// } from './base/DisappearEffectConfig';

// 重构后的特效类示例
export { ParticleDisintegrationRefactor } from './particle-refactor';
export * from './distortion-refactor';
export * from './glitch-refactor';
export * from './grayscale-refactor';
export * from './dissolve-refactor';
