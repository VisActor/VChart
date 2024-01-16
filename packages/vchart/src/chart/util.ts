import { getContainerSize, isString } from '@visactor/vutils';
import { DEFAULT_CHART_HEIGHT, DEFAULT_CHART_WIDTH } from '../constant/base';
import type { IChartSpec } from '../typings';
import { Direction } from '../typings';
import { array, isMiniAppLikeMode, isTrueBrowser, isValid, mergeSpec } from '../util';
import type { ICartesianChartSpec } from './cartesian/interface';
import type { IChartOption } from './interface/common';
import type { IUpdateSpecResult } from '../model/interface';

export function setDefaultCrosshairForCartesianChart(spec: ICartesianChartSpec) {
  spec.crosshair = array(spec.crosshair || {}).map(crosshairCfg => {
    return mergeSpec(
      {
        [spec.direction === Direction.horizontal ? 'yField' : 'xField']: {
          visible: true,
          line: {
            visible: true,
            type: 'rect'
          }
        }
      },
      crosshairCfg
    );
  });
}

export function calculateChartSize(
  spec: { width?: number; height?: number },
  option: Pick<IChartOption, 'canvas' | 'container' | 'mode' | 'modeParams'>,
  defaultSize: { width: number; height: number }
) {
  const { width: userWidth, height: userHeight } = spec;
  if (isValid(userWidth) && isValid(userHeight)) {
    return {
      width: userWidth,
      height: userHeight
    };
  }
  let width = defaultSize.width;
  let height = defaultSize.height;
  const container = option.container;
  const canvas = option.canvas;
  if (container) {
    const { width: containerWidth, height: containerHeight } = getContainerSize(
      container,
      DEFAULT_CHART_WIDTH,
      DEFAULT_CHART_HEIGHT
    );
    width = containerWidth;
    height = containerHeight;
  } else if (canvas && isTrueBrowser(option.mode)) {
    let canvasNode;
    if (isString(canvas)) {
      canvasNode = document?.getElementById(canvas);
    } else {
      canvasNode = canvas;
    }
    const { width: containerWidth, height: containerHeight } = getContainerSize(
      canvasNode as HTMLCanvasElement,
      DEFAULT_CHART_WIDTH,
      DEFAULT_CHART_HEIGHT
    );
    width = containerWidth;
    height = containerHeight;
  } else if (isMiniAppLikeMode(option.mode) && (option.modeParams as any)?.domref) {
    const domRef = (option.modeParams as any).domref;
    width = domRef.width;
    height = domRef.height;
  }

  width = userWidth ?? width;
  height = userHeight ?? height;

  return {
    width,
    height
  };
}

export function mergeUpdateResult(target: IUpdateSpecResult, ...sources: IUpdateSpecResult[]) {
  const merge = (key: keyof IUpdateSpecResult) => sources.reduce((value, cur) => value || cur?.[key], target[key]);
  Object.assign(target, {
    change: merge('change'),
    reCompile: merge('reCompile'),
    reMake: merge('reMake'),
    reRender: merge('reRender'),
    reSize: merge('reSize')
  } as Required<IUpdateSpecResult>);
  return target;
}

export function getTrimPaddingConfig(chartType: string, spec: IChartSpec) {
  if (
    chartType === 'line' ||
    chartType === 'area' ||
    (chartType === 'common' && spec.series.every(item => item.type === 'area' || item.type === 'line'))
  ) {
    return {
      paddingInner: 1,
      paddingOuter: 0
    };
  }

  return {
    paddingOuter: 0
  };
}
