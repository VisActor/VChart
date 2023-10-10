import type { DataView } from '@visactor/vdataset';
import type { IGlobalScale } from '../scale/interface';
import { type IBaseScale, BandScale, LinearScale, OrdinalScale, PointScale, ThresholdScale } from '@visactor/vscale';
import type { IVisual } from '../typings/visual';
import { ColorOrdinalScale } from '../scale/color-ordinal-scale';
declare const defaultScaleMap: {
  linear: typeof LinearScale;
  band: typeof BandScale;
  point: typeof PointScale;
  ordinal: typeof OrdinalScale;
  threshold: typeof ThresholdScale;
  colorOrdinal: typeof ColorOrdinalScale;
};
export declare function createScale(type: keyof typeof defaultScaleMap): IBaseScale | null;
export declare function createScaleWithSpec(
  spec: IVisual<any>,
  context: {
    globalScale: IGlobalScale;
    dataStatistics: DataView;
  }
): IBaseScale | null;
export declare function valueInScaleRange(v: number, s?: IBaseScale): number;
export declare function isSpecValueWithScale(specValue: any): boolean;
export {};
