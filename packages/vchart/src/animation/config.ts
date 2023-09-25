import type { WordcloudAppearPreset } from './../series/word-cloud/animation';
import { wordcloudPresetAnimation } from './../series/word-cloud/animation';
/* eslint-disable no-duplicate-imports */
import { TagPointsUpdate } from '@visactor/vrender';
import type { IElement } from '@visactor/vgrammar-core';
import type { AreaAppearPreset, IAreaAnimationParams } from '../series/area/animation';
import { areaPresetAnimation } from '../series/area/animation';
import type { BarAppearPreset, IBarAnimationParams } from '../series/bar/animation';
import { barGrowIn, barGrowOut, barPresetAnimation } from '../series/bar/animation';
import type { ILineAnimationParams, LineAppearPreset } from '../series/line/animation';
import { linePresetAnimation } from '../series/line/animation';
import type { IPieAnimationParams, PieAppearPreset } from '../series/pie/animation/animation';
import { pieDisappear, pieEnter, pieExit, piePresetAnimation } from '../series/pie/animation/animation';
import type { IProgressLikeAnimationParams, ProgressLikeAppearPreset } from '../series/polar/progress-like/animation';
import { progressLikePresetAnimation } from '../series/polar/progress-like/animation';
import type { ILinearProgressAnimationParams, LinearProgressAppearPreset } from '../series/progress/linear/animation';
import { linearProgressDisappear } from '../series/progress/linear/animation';
import { linearProgressPresetAnimation } from '../series/progress/linear/animation';
import type { IRadarAnimationParams, RadarAppearPreset } from '../series/radar/animation';
import { radarGroupClipAnimation } from '../series/radar/animation';
import { PolarPointUpdate, PolarTagPointsUpdate } from '../series/polar/animation';
import { radarSymbolPresetAnimation } from '../series/radar/animation';
import { radarPresetAnimation } from '../series/radar/animation';
import type { IRoseAnimationParams, RoseAppearPreset } from '../series/rose/animation';
import { roseDisappear, roseEnter, roseExit, rosePresetAnimation } from '../series/rose/animation';
import type { WaterfallAppearPreset } from '../series/waterfall/animation';
import { waterfallPresetAnimation } from '../series/waterfall/animation';
import type { IScatterAnimationParams, ScatterAppearPreset } from '../series/scatter/animation';
import { scatterPresetAnimation } from '../series/scatter/animation';
import type { MarkAnimationSpec, ICartesianGroupAnimationParams } from './interface';
import type { RangeColumnAppearPreset } from '../series/range-column/animation';
import { rangeColumnGrowIn, rangeColumnPresetAnimation } from '../series/range-column/animation';
import type { IRangeColumnAnimationParams } from '../series/range-column/animation';
import { rangeColumnGrowOut } from '../series/range-column/animation';
import { ClipDirectionAnimate, GroupFadeOut } from '@visactor/vrender';
import { GroupFadeIn, GroupTransition } from '@visactor/vrender-components';
import type { IWordcloud3dAnimationParams, IWordcloudAnimationParams } from '../series/word-cloud/animation';
import { WordCloud3dAnimation } from '../series/word-cloud/animation';
import type { ISunburstAnimationParams, SunburstAppearPreset } from '../series/sunburst/animation';
import { sunburstPresetAnimation, sunburstExit, sunburstEnter } from '../series/sunburst/animation';
import type { FunnelAppearPreset } from '../series/funnel/interface';
import type { CirclePackingAppearPreset, ICirclePackingAnimationParams } from '../series/circle-packing/animation';
import { circlePackingPresetAnimation } from '../series/circle-packing/animation';
import type { HeatmapAppearPreset } from '../series/heatmap/animation';
import { heatmapPresetAnimation } from '../series/heatmap/animation';

export const DEFAULT_ANIMATION_CONFIG = {
  appear: {
    duration: 1000,
    easing: 'cubicOut'
  },
  update: {
    type: 'update',
    duration: 300,
    easing: 'linear'
  },
  enter: {
    duration: 300,
    easing: 'linear'
  },
  exit: {
    duration: 300,
    easing: 'linear'
  },
  disappear: {
    duration: 500,
    easing: 'cubicIn'
  }
};

export const DEFAULT_MARK_ANIMATION: Record<string, (params?: any, preset?: any) => MarkAnimationSpec> = {
  bar: (params: IBarAnimationParams, preset: BarAppearPreset) => {
    return {
      appear: barPresetAnimation(params, preset),
      enter: barGrowIn(params, false),
      exit: barGrowOut(params, false),
      disappear: barGrowOut(params)
    };
  },
  bar3d: (params: IBarAnimationParams, preset: BarAppearPreset) => {
    return {
      appear: barPresetAnimation(params, preset),
      enter: barGrowIn(params, false),
      exit: barGrowOut(params, false),
      disappear: barGrowOut(params)
    };
  },
  line: (params: ILineAnimationParams, preset: LineAppearPreset) => {
    return {
      appear: linePresetAnimation(params, preset),
      enter: { type: 'fadeIn' },
      exit: { type: 'fadeOut' },
      update: [
        {
          options: { excludeChannels: 'points' }
        },
        {
          channel: ['points'],
          custom: TagPointsUpdate,
          duration: DEFAULT_ANIMATION_CONFIG.update.duration,
          easing: DEFAULT_ANIMATION_CONFIG.update.easing
        }
      ],
      disappear: { type: 'clipOut' }
    } as MarkAnimationSpec;
  },
  area: (params: IAreaAnimationParams, preset: AreaAppearPreset) => {
    return {
      appear: areaPresetAnimation(params, preset),
      enter: { type: 'fadeIn' },
      exit: { type: 'fadeOut' },
      disappear: { type: 'clipOut' }
    };
  },
  pie: (params: IPieAnimationParams, preset: PieAppearPreset) => {
    return {
      appear: piePresetAnimation(params, preset),
      enter: pieEnter(params),
      exit: pieExit(params),
      disappear: pieDisappear(params)
    };
  },
  pie3d: (params: IPieAnimationParams, preset: PieAppearPreset) => {
    return {
      appear: piePresetAnimation(params, preset),
      enter: pieEnter(params),
      exit: pieExit(params),
      disappear: pieDisappear(params)
    };
  },
  rose: (params: IRoseAnimationParams, preset: RoseAppearPreset) => {
    return {
      appear: rosePresetAnimation(params, preset),
      enter: roseEnter(params),
      exit: roseExit(params),
      disappear: roseDisappear(params)
    };
  },
  radar: (params: IRadarAnimationParams, preset: RadarAppearPreset) => {
    return {
      appear: preset === 'clipIn' ? undefined : radarPresetAnimation(params, preset, 'in'),
      enter: radarPresetAnimation(params, preset, 'in'),
      exit: radarPresetAnimation(params, preset, 'out'),
      disappear: preset === 'clipIn' ? undefined : radarPresetAnimation(params, preset, 'out'),
      update: [
        {
          options: { excludeChannels: 'points' }
        },
        {
          channel: ['points'],
          custom: PolarTagPointsUpdate,
          customParameters: params,
          duration: DEFAULT_ANIMATION_CONFIG.update.duration,
          easing: DEFAULT_ANIMATION_CONFIG.update.easing
        }
      ]
    } as MarkAnimationSpec;
  },
  radarSymbol: (params: IRadarAnimationParams, preset: RadarAppearPreset) =>
    ({
      appear: preset === 'clipIn' ? undefined : radarSymbolPresetAnimation(params, preset, 'in'),
      enter: { type: 'scaleIn' },
      exit: { type: 'scaleOut' },
      disappear: preset === 'clipIn' ? undefined : radarSymbolPresetAnimation(params, preset, 'out'),
      update: [
        {
          options: { excludeChannels: ['x', 'y'] }
        },
        {
          channel: ['x', 'y'],
          custom: PolarPointUpdate,
          customParameters: params,
          duration: DEFAULT_ANIMATION_CONFIG.update.duration,
          easing: DEFAULT_ANIMATION_CONFIG.update.easing
        }
      ]
    } as MarkAnimationSpec),
  radarGroup: (params: IRadarAnimationParams, preset: RadarAppearPreset) => {
    return {
      appear: radarGroupClipAnimation(params, 'in'),
      disappear: radarGroupClipAnimation(params, 'out')
    };
  },
  circularProgress: (params: IProgressLikeAnimationParams, preset: ProgressLikeAppearPreset) => ({
    appear: progressLikePresetAnimation(params, preset),
    enter: { type: 'growAngleIn' },
    disappear: { type: 'growAngleOut' }
  }),
  scatter: (params: IScatterAnimationParams, preset: ScatterAppearPreset) => ({
    appear: scatterPresetAnimation(params, preset),
    enter: { type: 'scaleIn' },
    exit: { type: 'scaleOut' },
    disappear: { type: 'scaleOut' }
  }),
  progressBackground: () => ({
    appear: { type: 'fadeIn' },
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  linearProgress: (params: ILinearProgressAnimationParams, preset: LinearProgressAppearPreset) => {
    return {
      appear: linearProgressPresetAnimation(params, preset),
      enter: { type: 'grow' },
      disappear: linearProgressDisappear(params)
    };
  },
  symbol: () => ({
    appear: { type: 'scaleIn' },
    enter: { type: 'scaleIn' },
    exit: { type: 'scaleOut' },
    disappear: { type: 'scaleOut' }
  }),
  label: () => ({
    appear: { type: 'fadeIn' },
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  path: () => ({
    appear: { type: 'fadeIn' },
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  funnel: (params: any, preset: FunnelAppearPreset) => ({
    appear: preset === 'clipIn' ? undefined : { type: 'fadeIn' },
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  funnel3d: () => ({
    appear: { type: 'fadeIn' },
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  cartesianGroup: (params: ICartesianGroupAnimationParams) => {
    return {
      appear: {
        custom: ClipDirectionAnimate,
        customParameters: (datum: any, element: IElement) => {
          return {
            animationType: 'in',
            group: element.getGraphicItem(),
            direction: params.direction(),
            width: params.width(),
            height: params.height(),
            orient: params.orient()
          };
        }
      },
      disappear: {
        custom: ClipDirectionAnimate,
        customParameters: (datum: any, element: IElement) => {
          return {
            animationType: 'out',
            group: element.getGraphicItem(),
            direction: params.direction(),
            width: params.width(),
            height: params.height(),
            orient: params.orient()
          };
        }
      }
    };
  },
  wordCloud: (params: IWordcloudAnimationParams, preset: WordcloudAppearPreset) => ({
    appear: wordcloudPresetAnimation(params, preset),
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  wordCloud3d: (params: IWordcloud3dAnimationParams) => ({
    appear: WordCloud3dAnimation(params)
  }),
  rangeColumn: (params: IRangeColumnAnimationParams, preset: RangeColumnAppearPreset) => ({
    appear: rangeColumnPresetAnimation(params, preset),
    enter: rangeColumnGrowIn(params),
    exit: rangeColumnGrowOut(params),
    disappear: rangeColumnGrowOut(params)
  }),
  waterfall: (params: IBarAnimationParams, preset: WaterfallAppearPreset) => {
    return {
      appear: waterfallPresetAnimation(params, preset),
      enter: barGrowIn(params, false),
      exit: barGrowOut(params, false),
      disappear: barGrowOut(params, false)
    };
  },
  boxPlot: () => ({
    appear: { type: 'scaleIn' },
    enter: { type: 'scaleIn' },
    exit: { type: 'scaleOut' },
    disappear: { type: 'scaleOut' }
  }),
  treemap: () => ({
    appear: { type: 'growCenterIn' },
    enter: { type: 'growCenterIn' },
    exit: { type: 'growCenterOut' },
    disappear: { type: 'growCenterOut' }
  }),
  sankeyNode: () => ({
    appear: { type: 'fadeIn' },
    enter: { type: 'fadeIn' },
    exit: { type: 'fadeOut' },
    disappear: { type: 'fadeOut' }
  }),
  sankeyLinkPath: () => ({
    appear: { type: 'linkPathGrowIn' },
    enter: { type: 'linkPathGrowIn' },
    exit: { type: 'linkPathGrowOut' },
    disappear: { type: 'linkPathGrowOut' }
  }),
  sunburst: (params: ISunburstAnimationParams, preset: SunburstAppearPreset) => ({
    appear: sunburstPresetAnimation(params, preset),
    enter: sunburstEnter(params),
    exit: sunburstExit(params),
    disappear: sunburstExit(params)
  }),
  circlePacking: (params: ICirclePackingAnimationParams, preset: CirclePackingAppearPreset) => ({
    appear: circlePackingPresetAnimation(params, preset),
    enter: { type: 'growRadiusIn' },
    exit: { type: 'growRadiusOut' },
    disappear: { type: 'growRadiusOut' }
  }),
  heatmap: (params: any, preset: HeatmapAppearPreset) => {
    return {
      appear: heatmapPresetAnimation(preset),
      enter: { type: 'fadeIn' },
      exit: { type: 'fadeOut' },
      disappear: { type: 'fadeOut' }
    };
  },
  axis: () => ({
    appear: {
      custom: GroupFadeIn
    },
    // enter: {
    //   custom: GroupFadeIn
    // },
    update: {
      custom: GroupTransition
    },
    // disappear: {
    //   custom: GroupFadeOut
    // },
    exit: {
      custom: GroupFadeOut
    }
  })
};
