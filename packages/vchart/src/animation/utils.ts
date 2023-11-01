import type { IAnimationConfig } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import type {
  IElement,
  IAnimationTypeConfig,
  IStateAnimationConfig,
  IAnimationTimeline
} from '@visactor/vgrammar-core';
import type { MarkAnimationSpec, IAnimationState } from './interface';
import type { IStateAnimateSpec, IAnimationSpec, IMorphSeriesSpec } from './spec';
import { isFunction, isValidNumber } from '../util/type';
import { DEFAULT_DATA_INDEX } from '../constant';
import { DEFAULT_ANIMATION_CONFIG } from './config';
import { isArray, isValid } from '@visactor/vutils';
import type { SeriesMarkNameEnum } from '../series/interface/type';
import { mergeSpec } from '../util/spec/merge-spec';

export const AnimationStates = ['appear', 'enter', 'update', 'exit', 'disappear', 'normal'];

export function animationConfig<Preset extends string>(
  defaultConfig: MarkAnimationSpec = {},
  userConfig?: Partial<
    Record<IAnimationState, boolean | IStateAnimateSpec<Preset> | IAnimationConfig | IAnimationConfig[]>
  >,
  params?: {
    dataIndex: (datum: any) => number;
  }
) {
  const config = {} as MarkAnimationSpec;

  for (let i = 0; i < AnimationStates.length; i++) {
    const state = AnimationStates[i];

    if (userConfig?.[state] === false) {
      continue;
    }

    if (state === 'normal') {
      userConfig.normal && (config.normal = userConfig.normal as IAnimationTypeConfig);
      continue;
    }
    // 开始处理默认动画逻辑
    let defaultStateConfig: IAnimationConfig[];
    if (isArray(defaultConfig[state])) {
      defaultStateConfig = defaultConfig[state] as IAnimationConfig[];
    } else {
      defaultStateConfig = [{ ...DEFAULT_ANIMATION_CONFIG[state], ...defaultConfig[state] } as any];
      // FIXME: 用来控制当动画状态发生变更时是否清除正在执行的动画。
      // 现在 vrender 对于同一个视觉通道的 tween 不会做覆盖的处理。若不做动画清空同时 exit 动画比 update 动画时间长的情况下，效果会不正确
      if (state === 'exit') {
        defaultStateConfig[0].controlOptions = { stopWhenStateChange: true };
      }
    }

    if (!userConfig?.[state]) {
      config[state] = defaultStateConfig;
      continue;
    }

    // 开始处理用户配置的动画逻辑
    let stateConfig: IAnimationConfig[];

    if (isArray(userConfig[state])) {
      stateConfig = userConfig[state];
    } else {
      let singleConfig: IAnimationConfig = mergeSpec({}, defaultStateConfig[0], userConfig[state]) as IAnimationConfig;

      if (isChannelAnimation(singleConfig)) {
        // `type` and `channel` is conflict, and `type` has a higher priority.
        // here if user configured `channel`, we should remove `type` which will come from default animation config
        delete (singleConfig as IAnimationTypeConfig).type;
      }

      if (singleConfig.oneByOne) {
        singleConfig = produceOneByOne(singleConfig as IAnimationTypeConfig, params?.dataIndex ?? defaultDataIndex);
      }

      stateConfig = [singleConfig];
    }

    config[state] = stateConfig;
  }

  // 将 update copy 到 state 保证 useState 效果与 update 对齐
  config.state = config.update as IStateAnimationConfig;
  return config;
}

export function userAnimationConfig<M extends string, Preset extends string>(
  markName: SeriesMarkNameEnum | string,
  spec: IAnimationSpec<M, Preset>
) {
  return {
    appear: spec.animationAppear?.[markName] ?? spec.animationAppear,
    disappear: spec.animationDisappear?.[markName] ?? spec.animationDisappear,
    enter: spec.animationEnter?.[markName] ?? spec.animationEnter,
    exit: spec.animationExit?.[markName] ?? spec.animationExit,
    update: spec.animationUpdate?.[markName] ?? spec.animationUpdate,
    normal: spec.animationNormal?.[markName]
  };
}

/**
 * oneByOne
 */
function produceOneByOne(stateConfig: IAnimationTypeConfig, dataIndex: (datum: any) => number) {
  const { oneByOne, duration } = stateConfig;
  stateConfig.delay = (datum: any, element: IElement, params: any) => {
    const _index = dataIndex(datum);
    const _durationTime = isFunction(duration)
      ? duration(datum, element, params)
      : isValidNumber(duration)
      ? duration
      : 0;
    let _oneByOneTime = isFunction(oneByOne) ? oneByOne(datum, element, params) : oneByOne;
    if (_oneByOneTime === false) {
      return 0;
    }
    _oneByOneTime = _oneByOneTime === true ? 0 : _oneByOneTime;
    return _index * (_durationTime + _oneByOneTime);
  };
  delete stateConfig.oneByOne;
  return stateConfig;
}

function defaultDataIndex(datum: any) {
  return datum?.[DEFAULT_DATA_INDEX];
}

export function shouldDoMorph(
  hasAnimation: boolean,
  morphConfig?: IMorphSeriesSpec,
  animationConfig?: ReturnType<typeof userAnimationConfig>
) {
  if (hasAnimation === false) {
    return false;
  }

  if (animationConfig?.appear === false || animationConfig?.update === false) {
    return false;
  }

  if (morphConfig?.enable === false) {
    return false;
  }

  return true;
}

export function isTimeLineAnimation(animationConfig: IAnimationConfig) {
  return isValid((animationConfig as IAnimationTimeline).timeSlices);
}

export function isChannelAnimation(animationConfig: IAnimationConfig) {
  return !isTimeLineAnimation(animationConfig) && isValid((animationConfig as IAnimationTypeConfig).channel);
}
