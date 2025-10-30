/**
 * @description The core module of VChart, containing the necessary interfaces for using VChart.
 */

import { VChart } from './vchart';
import { Factory } from './factory';

export { VChart, Factory };

// export the version
export const version = __VERSION__;

// export necessary types
export type { IVChart } from './interface';
export type { IStateSpec, StateValueType } from '../compile/mark';
export type { IRegion } from '../region/interface';

export * from '../event/interface';
export * from '../theme/interface';
export * from '../model/interface';

export * from './interface';
export * from '../typings';
export type { IMarkGraphic, IGraphicContext } from '../mark/interface/';

// some constants
export * from '../constant/base';
export * from '../constant/data';
export * from '../constant/layout';
export { AttributeLevel } from '../constant/attribute';
export { TransformLevel } from '../data/initialize';
export { STATE_VALUE_ENUM } from '../compile/mark/interface';
export { ChartEvent } from '../constant/event';

/**
 * spec
 */
export * from '../typings/spec/index';
export * from '../typings/visual';

// tooltip
export * from '../typings/tooltip';

// theme
export * from '../theme/index';

// vrender
export {
  vglobal,
  createGroup,
  createRichText,
  createText,
  createArc,
  createArea,
  createRect,
  createLine,
  createSymbol,
  createImage,
  createPath,
  createArc3d,
  createPyramid3d,
  createRect3d,
  registerDirectionalLight,
  registerOrthoCamera,
  registerViewTransform3dPlugin,
  graphicCreator,
  type IGraphic,
  type IGlyph,
  type IGroup,
  type IText,
  type ILine,
  type IArea,
  type IRect,
  type INode,
  type IStage,
  type EasingType,
  type ILineGraphicAttribute,
  type ITextGraphicAttribute,
  type IRectGraphicAttribute,
  type IGroupGraphicAttribute,
  type TextAlignType,
  type TextBaselineType,
  type GraphicEventType,
  type IAreaGraphicAttribute,
  type ISymbolGraphicAttribute
} from '@visactor/vrender-core';
export {
  ManualTicker,
  StreamLight,
  ACustomAnimate,
  AnimateExecutor,
  RotateBySphereAnimate
} from '@visactor/vrender-animate';

// utils
export * from '../util/space';
export { transformToGraphic } from '../util/style';
export { getSpecInfo } from '../component/util';
export { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../data/register';
export { lookup } from '../data/transforms/lookup';
export { warn } from '../util/debug';
export { measureText } from '../util/text';

// vrender-components
export {
  AbstractComponent,
  Segment,
  MarkPoint,
  type SegmentAttributes,
  type Point
} from '@visactor/vrender-components';

// vrender-kits
export {
  registerLine,
  registerRect,
  registerArc3d,
  registerPyramid3d,
  registerRect3d,
  registerShadowRoot
} from '@visactor/vrender-kits';

// vlayouts
export * from '@visactor/vlayouts';

// vdataset
export { DataView, DataSet, svgParser } from '@visactor/vdataset';
export type { SVGParsedElement, SVGParserResult, ISVGSourceOption } from '@visactor/vdataset';

// vutils
// @ts-ignore
export * from '@visactor/vutils';
