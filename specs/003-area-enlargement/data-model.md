# Data Model: Area Enlargement (Linear Scale)

## Scale Specification

### ILinearScaleSpec

Extended to support non-uniform interval distribution via `customDistribution`.

```typescript
import type { ILinearScaleSpec } from './scale';

export interface ILinearScaleSpec {
  type: 'linear';
  
  /**
   * Custom interval distribution.
   * Defines how domain intervals map to range proportions.
   */
  customDistribution?: IIntervalRatio[];
}

export interface IIntervalRatio {
  /**
   * The sub-domain interval [min, max].
   */
  domain: [number, number];
  
  /**
   * The proportion of the visual range this interval should occupy.
   * Value between 0 and 1.
   */
  ratio: number;
}
```

## Usage Example

```json
{
  "type": "linear",
  "customDistribution": [
    { "domain": [0, 6], "ratio": 0.2 },
    { "domain": [6, 7], "ratio": 0.1 },
    { "domain": [7, 9], "ratio": 0.5 },
    { "domain": [9, 10], "ratio": 0.2 }
  ]
}
```
