# @visactor/vchart-types

## Description

Provide the pure TypeScript type declarations of [VChart](https://github.com/VisActor/VChart).

## Usage

You can refer to the following statement to import types as needed:

```typescript
import type { xxx } from '@visactor/vchart-types';
```

Such as:

```typescript
import type { IBarSeriesSpec } from '@visactor/vchart-types';
```

You can also find the types in the corresponding path in `types` and import them:

```typescript
import type { xxx } from '@visactor/vchart-types/types/xxx';
```

Such as:

```typescript
import type { IBarSeriesSpec } from '@visactor/vchart-types/types/series/bar/interface';
```

## 更新类型声明

在 `packages/vchart` 目录执行 `npm run build:types`，从当前源码重新生成此包的 `types` 目录。该命令先清空旧输出，并关闭此次声明构建的增量缓存，保证源码删除后不残留旧声明，连续构建也能完整生成类型文件。

`sequence` 图表及 `dot`、`link` 系列已迁至 `@visactor/vchart-extension`。对应的 `ISequenceChartSpec`、`IDotSeriesSpec`、`ILinkSeriesSpec` 等类型请从扩展包导入。
