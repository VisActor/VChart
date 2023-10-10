import { PolarSeries } from '../polar';
import type { IRoseLikeSeriesSpec } from './interface';
export declare abstract class RoseLikeSeries<T extends IRoseLikeSeriesSpec> extends PolarSeries<T> {
  getStackGroupFields(): string[];
  getStackValueField(): string;
  getGroupFields(): string[];
  setAttrFromSpec(): void;
  setValueFieldToStack(): void;
  setValueFieldToPercent(): void;
  getDimensionField(): string[];
  getMeasureField(): string[];
  getDefaultShapeType(): string;
  setValueFieldToStackOffsetSilhouette(): void;
}
