{{ target: animate-stage-options }}

<!-- Stage Effect Animation Configuration Parameters -->

#${prefix} type = 'particle'

Particle Disintegration Effect
Configuration parameters when `type` is `'particle'`:

##${prefix} effectType(string) = 'gravity'
Particle motion mode. Available values:

- `'explode'`: Explosion effect - particles scatter outward from center
- `'vortex'`: Vortex effect - particles expand outward in a spiral pattern
- `'gravity'`: Gravity effect - particles disintegrate and fall

##${prefix} count(number) = 4000
Number of particles. Value range: 1000-8000.

##${prefix} size(number) = 20
Particle size. Value range: 2-15.

##${prefix} strength(number) = 1.0
Force field strength. Value range: 0.1-3.0.

##${prefix} useWebGL(boolean) = true
Whether to use WebGL implementation.

**Usage Example:**

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

Distortion Effect
Configuration parameters when `type` is `'distortion'`:

##${prefix} distortionType(string) = 'wave'
Distortion effect type. Available values:

- `'wave'`: Wave distortion - sinusoidal wave distortion producing wave effects
- `'ripple'`: Ripple distortion - circular ripples expanding from center point
- `'swirl'`: Swirl distortion - rotational distortion around center point

##${prefix} strength(number) = 0.3
Distortion strength. Value range: 0.0-2.0.

##${prefix} useWebGL(boolean) = true
Whether to use WebGL implementation.

**Usage Example:**

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

Gaussian Blur Effect
Configuration parameters when `type` is `'gaussianBlur'`:

##${prefix} blurRadius(number) = 8
Blur intensity. Value range: 1-20.

##${prefix} useOptimizedBlur(boolean) = true
Whether to use optimized version.

- `true`: High-performance mode - uses CSS filters with GPU acceleration
- `false`: High-quality mode - uses pixel-level downsampling algorithm

**Usage Example:**

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

Glitch Art Effect
Configuration parameters when `type` is `'glitch'`:

##${prefix} effectType(string) = 'rgb-shift'
Glitch effect type. Available values:

- `'rgb-shift'`: RGB channel shift - red, green, blue color channel separation and offset
- `'digital-distortion'`: Digital distortion - horizontal slice offset + random pixel noise
- `'scan-lines'`: Scan line glitch - horizontal scan lines and bright line effects
- `'data-corruption'`: Data corruption - vertical stripes + block corruption

##${prefix} intensity(number) = 0.5
Glitch intensity. Value range: 0.0-1.0.

**Usage Example:**

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

Pixelation Effect
Configuration parameters when `type` is `'pixelation'`:

##${prefix} maxPixelSize(number) = 20
Maximum pixelation intensity. Value range: 1-50.

##${prefix} method(string) = 'out'
Pixelation direction. Available values:

- `'out'`: Exit effect - pixelation intensity gradually increases from 1 to maximum
- `'in'`: Enter effect - pixelation intensity gradually decreases from maximum to 1

**Usage Example:**

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

Color Effect
Configuration parameters when `type` is `'grayscale'`:

##${prefix} effectType(string) = 'grayscale'
Color effect type. Available values:

- `'grayscale'`: Grayscale effect - converts to black and white using standard luminance formula
- `'sepia'`: Sepia effect - nostalgic style sepia filter

##${prefix} strength(number) = 1.0
Effect strength. Value range: 0.0-1.0.

##${prefix} useWebGL(boolean) = true
Whether to use WebGL implementation.

**Usage Example:**

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

Dissolve Effect
Configuration parameters when `type` is `'dissolve'`:

##${prefix} dissolveType(string) = 'outward'
Dissolve direction. Available values:

- `'outward'`: Dissolve from center outward
- `'inward'`: Dissolve from outside to center
- `'radial'`: Radial dissolve
- `'leftToRight'`: Dissolve from left to right
- `'rightToLeft'`: Dissolve from right to left
- `'topToBottom'`: Dissolve from top to bottom
- `'bottomToTop'`: Dissolve from bottom to top

##${prefix} noiseScale(number) = 8
Noise scale. Value range: 1-20.

##${prefix} fadeEdge(boolean) = true
Whether to use edge fading.

##${prefix} strength(number) = 1.0
Dissolve strength. Value range: 0.0-2.0.

**Usage Example:**

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
      strength: 1.2
    }
  }
}
```
