# Quickstart: Area Enlargement

## Introduction

Area Enlargement (Linear Interval Scale) allows you to emphasize specific ranges on a linear axis by allocating more visual space to them.

## Usage

Configure your axis with `type: 'linear'` (default) and provide `customDistribution`.

```javascript
const spec = {
  type: 'line',
  data: [ ... ],
  axes: [
    {
      orient: 'left',
      type: 'linear',
      domain: [0, 10], // Optional if customDistribution covers the data
      customDistribution: [
        { domain: [0, 7], ratio: 0.2 },
        { domain: [7, 9], ratio: 0.6 }, // Focus on 7-9
        { domain: [9, 10], ratio: 0.2 }
      ]
    }
  ],
  ...
};
```
