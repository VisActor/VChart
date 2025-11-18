{{ target: animate-stage-options }}

<!-- 舞台特效动画配置参数 -->

#${prefix} type = 'particle'

粒子分解效果
当 `type` 为 `'particle'` 时的配置参数：

##${prefix} effectType(string) = 'gravity'
粒子运动模式。可选值：

- `'explode'`: 爆炸效果 - 粒子从中心向外飞散
- `'vortex'`: 漩涡效果 - 粒子以螺旋方式向外扩散
- `'gravity'`: 重力效果 - 粒子瓦解下落

##${prefix} count(number) = 4000
粒子数量。取值范围：1000-8000。

##${prefix} size(number) = 20
粒子大小。取值范围：2-15。

##${prefix} strength(number) = 1.0
力场强度。取值范围：0.1-3.0。

##${prefix} useWebGL(boolean) = true
是否使用 WebGL 实现。

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'particle',
    duration: 3000,
    easing: 'linear',
    options: {
      effectType: 'vortex',
      count: 6000,
      size: 8,
      strength: 2.0,
      useWebGL: true
    }
  }
}
```

#${prefix} type = 'distortion'

扭曲变形效果
当 `type` 为 `'distortion'` 时的配置参数：

##${prefix} distortionType(string) = 'wave'
扭曲效果类型。可选值：

- `'wave'`: 波浪扭曲 - 正弦波形扭曲，产生波浪效果
- `'ripple'`: 涟漪扭曲 - 从中心点扩散的圆形波纹
- `'swirl'`: 漩涡扭曲 - 围绕中心点的旋转扭曲

##${prefix} strength(number) = 0.3
扭曲强度。取值范围：0.0-2.0。

##${prefix} useWebGL(boolean) = true
是否使用 WebGL 实现。

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'distortion',
    duration: 3000,
    easing: 'linear',
    options: {
      distortionType: 'wave',
      strength: 0.8,
      useWebGL: true
    }
  }
}
```

#${prefix} type = 'gaussianBlur'

高斯模糊效果
当 `type` 为 `'gaussianBlur'` 时的配置参数：

##${prefix} blurRadius(number) = 8
模糊强度。取值范围：1-20。

##${prefix} useOptimizedBlur(boolean) = true
是否使用优化版本。

- `true`: 高性能模式 - 使用 CSS 滤镜，GPU 加速
- `false`: 高质量模式 - 使用像素级降采样算法

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'gaussianBlur',
    duration: 1000,
    easing: 'linear',
    options: {
      blurRadius: 10,
      useOptimizedBlur: true
    }
  }
}
```

#${prefix} type = 'glitch'

故障艺术效果
当 `type` 为 `'glitch'` 时的配置参数：

##${prefix} effectType(string) = 'rgb-shift'
故障效果类型。可选值：

- `'rgb-shift'`: RGB 通道偏移 - 红绿蓝颜色通道分离偏移
- `'digital-distortion'`: 数字扭曲 - 水平切片偏移 + 随机像素噪声
- `'scan-lines'`: 扫描线故障 - 水平扫描线和亮线效果
- `'data-corruption'`: 数据损坏 - 垂直条纹 + 块状损坏

##${prefix} intensity(number) = 0.5
故障强度。取值范围：0.0-1.0。

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'glitch',
    duration: 1000,
    easing: 'linear',
    options: {
      effectType: 'rgb-shift',
      intensity: 0.5
    }
  }
}
```

#${prefix} type = 'pixelation'

像素化效果
当 `type` 为 `'pixelation'` 时的配置参数：

##${prefix} maxPixelSize(number) = 20
最大像素化强度。取值范围：1-50。

##${prefix} method(string) = 'out'
像素化方向。可选值：

- `'out'`: 退场效果 - 像素化强度从 1 逐渐增加到最大值
- `'in'`: 入场效果 - 像素化强度从最大值逐渐减小到 1

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'pixelation',
    duration: 2000,
    easing: 'linear',
    options: {
      maxPixelSize: 25,
      method: 'out'
    }
  }
}
```

#${prefix} type = 'grayscale'

颜色效果
当 `type` 为 `'grayscale'` 时的配置参数：

##${prefix} effectType(string) = 'grayscale'
颜色效果类型。可选值：

- `'grayscale'`: 灰度效果 - 使用标准亮度公式转为黑白
- `'sepia'`: 褐色调效果 - 怀旧风格的褐色滤镜

##${prefix} strength(number) = 1.0
效果强度。取值范围：0.0-1.0。

##${prefix} useWebGL(boolean) = true
是否使用 WebGL 实现。

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'grayscale',
    duration: 2000,
    easing: 'linear',
    options: {
      effectType: 'grayscale',
      strength: 1.0,
      useWebGL: true
    }
  }
}
```

#${prefix} type = 'dissolve'

溶解效果
当 `type` 为 `'dissolve'` 时的配置参数：

##${prefix} dissolveType(string) = 'outward'
溶解方向。可选值：

- `'outward'`: 从中心向外溶解
- `'inward'`: 从外向中心溶解
- `'radial'`: 径向溶解
- `'leftToRight'`: 从左到右溶解
- `'rightToLeft'`: 从右到左溶解
- `'topToBottom'`: 从上到下溶解
- `'bottomToTop'`: 从下到上溶解

##${prefix} noiseScale(number) = 8
噪声比例。取值范围：1-20。

##${prefix} fadeEdge(boolean) = true
是否边缘渐变。

**使用示例：**

```typescript
animationDisappear: {
  stage: {
    type: 'dissolve',
    duration: 2000,
    easing: 'linear',
    options: {
      dissolveType: 'radial',
      noiseScale: 10,
      fadeEdge: true,
    }
  }
}
```
