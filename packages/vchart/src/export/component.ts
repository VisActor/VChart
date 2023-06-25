/* eslint-disable no-duplicate-imports */
/**
 * @description export all component modules
 */
import type { IScrollBarSpec } from '../component/data-zoom/scroll-bar';
import { ScrollBar } from '../component/data-zoom/scroll-bar';
import type { IDataZoomSpec } from '../component/data-zoom/data-zoom';
import { DataZoom } from '../component/data-zoom/data-zoom';
import { CustomMark } from '../component/custom-mark';
import type { IBrushSpec } from '../component/brush';
import { Brush } from '../component/brush';
import type { IMapLabelSpec } from '../component/map-label';
import { MapLabelComponent } from '../component/map-label';
import type {
  ICartesianLinearAxisSpec,
  ICartesianBandAxisSpec,
  ICartesianTimeAxisSpec,
  ICartesianAxisSpec
} from '../component/axis/cartesian/index';
import {
  CartesianAxis,
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis
} from '../component/axis/cartesian/index';
import type { IPolarAxisSpec, IPolarBandAxisSpec, IPolarLinearAxisSpec } from '../component/axis/polar';
import { PolarAxis, PolarBandAxis, PolarLinearAxis } from '../component/axis/polar';
import type { IDiscreteLegendSpec } from '../component/legend/discrete';
import { DiscreteLegend } from '../component/legend/discrete';
import type { IContinuousLegendSpec } from '../component/legend/continuous';
import { ContinuousLegend } from '../component/legend/continuous';
import type { IIndicatorSpec } from '../component/indicator';
import { Indicator } from '../component/indicator';
import type { ITitleSpec } from '../component/title';
import { Title } from '../component/title';
import type { IGeoCoordinateSpec } from '../component/geo';
import { GeoCoordinate } from '../component/geo';
import type { ICartesianCrosshairSpec, IPolarCrosshairSpec } from '../component/crosshair';
import { CartesianCrossHair, PolarCrossHair } from '../component/crosshair';
import type { IPlayerSpec } from '../component/player';
import { Player } from '../component/player';
import type { IMarkLineSpec } from '../component/marker/mark-line';
import { MarkLine } from '../component/marker/mark-line';
import type { IMarkAreaSpec } from '../component/marker/mark-area';
import { MarkArea } from '../component/marker/mark-area';
import type { IMarkPointSpec } from '../component/marker/mark-point';
import { MarkPoint } from '../component/marker/mark-point';
import type { ITooltipSpec } from '../component/tooltip';
import { Tooltip } from '../component/tooltip';
import type { ILabelSpec } from '../component/label';
import { Label } from '../component/label';

export {
  ScrollBar,
  DataZoom,
  CustomMark,
  Brush,
  MapLabelComponent,
  CartesianAxis,
  CartesianBandAxis,
  CartesianLinearAxis,
  CartesianTimeAxis,
  PolarAxis,
  PolarBandAxis,
  PolarLinearAxis,
  DiscreteLegend,
  ContinuousLegend,
  Indicator,
  Title,
  GeoCoordinate,
  CartesianCrossHair,
  PolarCrossHair,
  Player,
  MarkArea,
  MarkLine,
  MarkPoint,
  Tooltip,
  Label
};

export type {
  IScrollBarSpec,
  IBrushSpec,
  ICartesianAxisSpec,
  ICartesianBandAxisSpec,
  ICartesianCrosshairSpec,
  ICartesianLinearAxisSpec,
  ICartesianTimeAxisSpec,
  IContinuousLegendSpec,
  IDataZoomSpec,
  IDiscreteLegendSpec,
  IGeoCoordinateSpec,
  IIndicatorSpec,
  ILabelSpec,
  IMapLabelSpec,
  IMarkAreaSpec,
  IMarkLineSpec,
  IMarkPointSpec,
  IPlayerSpec,
  IPolarAxisSpec,
  IPolarBandAxisSpec,
  IPolarCrosshairSpec,
  IPolarLinearAxisSpec,
  ITitleSpec,
  ITooltipSpec
};
