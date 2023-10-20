import type { IComponent } from './interface/common';
/* eslint-disable no-duplicate-imports */
/**
 * @description export all component modules
 */
import type { IScrollBarSpec } from './data-zoom/scroll-bar';
import { ScrollBar, registerScrollBar } from './data-zoom/scroll-bar';
import type { IDataZoomSpec } from './data-zoom/data-zoom';
import { DataZoom, registerDataZoom } from './data-zoom/data-zoom';
import { CustomMark, registerCustomMark } from './custom-mark';
import type { IBrushSpec } from './brush';
import { Brush, registerBrush } from './brush';
import type { IMapLabelSpec } from './map-label';
import { MapLabelComponent, registerMapLabel } from './map-label';
import type {
  ICartesianLinearAxisSpec,
  ICartesianBandAxisSpec,
  ICartesianTimeAxisSpec,
  ICartesianAxisSpec,
  ICartesianLogAxisSpec
} from './axis/cartesian/index';
import {
  CartesianAxis,
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis,
  CartesianLogAxis,
  CartesianSymlogAxis,
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  registerCartesianLogAxis,
  registerCartesianSymlogAxis,
  registerCartesianTimeAxis
} from './axis/cartesian/index';
import type { IPolarAxisSpec, IPolarBandAxisSpec, IPolarLinearAxisSpec } from './axis/polar';
import {
  PolarAxis,
  PolarBandAxis,
  PolarLinearAxis,
  registerPolarBandAxis,
  registerPolarLinearAxis
} from './axis/polar';
import type { IDiscreteLegendSpec } from './legend/discrete';
import { DiscreteLegend, registerDiscreteLegend } from './legend/discrete';
import type { IContinuousLegendSpec } from './legend/continuous';
import { ContinuousLegend, registerContinuousLegend } from './legend/continuous';
import type { IIndicatorSpec } from './indicator';
import { Indicator, registerIndicator } from './indicator';
import type { ITitleSpec } from './title';
import { Title, registerTitle } from './title';
import type { IGeoCoordinateSpec } from './geo';
import { GeoCoordinate, registerGeoCoordinate } from './geo';
import type { ICartesianCrosshairSpec, IPolarCrosshairSpec } from './crosshair';
import { CartesianCrossHair, PolarCrossHair, registerCartesianCrossHair, registerPolarCrossHair } from './crosshair';
import type { IPlayerSpec } from './player';
import { Player, registerPlayer } from './player';
import type { IMarkLineSpec, IStepMarkLineSpec } from './marker/mark-line';
import { MarkLine, registerMarkLine } from './marker/mark-line';
import type { IMarkAreaSpec } from './marker/mark-area';
import { MarkArea, registerMarkArea } from './marker/mark-area';
import type { IMarkPointSpec } from './marker/mark-point';
import { MarkPoint, registerMarkPoint } from './marker/mark-point';
import type { ITooltipSpec } from './tooltip';
import { Tooltip, registerTooltip } from './tooltip';
import type { ILabelSpec } from './label';
import { Label, registerLabel } from './label';
import { TotalLabel, registerTotalLabel } from './label/totalLabel';
import { registerPoptip } from './poptip/index';

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
  CartesianLogAxis,
  CartesianSymlogAxis,
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
  Label,
  TotalLabel
};

export {
  registerBrush,
  registerScrollBar,
  registerTitle,
  registerTooltip,
  registerCartesianBandAxis,
  registerCartesianCrossHair,
  registerCartesianLinearAxis,
  registerCartesianLogAxis,
  registerCartesianSymlogAxis,
  registerCartesianTimeAxis,
  registerContinuousLegend,
  registerCustomMark,
  registerDataZoom,
  registerDiscreteLegend,
  registerGeoCoordinate,
  registerIndicator,
  registerLabel,
  registerTotalLabel,
  registerMapLabel,
  registerMarkArea,
  registerMarkLine,
  registerMarkPoint,
  registerPlayer,
  registerPolarBandAxis,
  registerPolarCrossHair,
  registerPolarLinearAxis,
  registerPoptip
};

export type {
  IComponent,
  IScrollBarSpec,
  IBrushSpec,
  ICartesianAxisSpec,
  ICartesianBandAxisSpec,
  ICartesianCrosshairSpec,
  ICartesianLinearAxisSpec,
  ICartesianTimeAxisSpec,
  ICartesianLogAxisSpec,
  IContinuousLegendSpec,
  IDataZoomSpec,
  IDiscreteLegendSpec,
  IGeoCoordinateSpec,
  IIndicatorSpec,
  ILabelSpec,
  IMapLabelSpec,
  IMarkAreaSpec,
  IMarkLineSpec,
  IStepMarkLineSpec,
  IMarkPointSpec,
  IPlayerSpec,
  IPolarAxisSpec,
  IPolarBandAxisSpec,
  IPolarCrosshairSpec,
  IPolarLinearAxisSpec,
  ITitleSpec,
  ITooltipSpec
};
