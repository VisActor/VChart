import type { IChartSpecInfo } from '../../chart/interface';
import { domDocument, isMiniAppLikeMode, isString, isTrueBrowser, isValid, mergeSpec } from '../../util';
import { BaseComponentSpecTransformer } from '../base';
import { TOOLTIP_EL_CLASS_NAME } from './constant';
import { getTooltipActualActiveType } from './utils';

export class TooltipSpecTransformer extends BaseComponentSpecTransformer<any> {
  protected _shouldMergeThemeToSpec() {
    return false;
  }

  protected _initTheme(spec: any, chartSpec: any): { spec: any; theme: any } {
    const { spec: newSpec, theme } = super._initTheme(spec, chartSpec);
    newSpec.style = mergeSpec({}, this._theme, newSpec.style);
    return { spec: newSpec, theme };
  }

  protected _transformSpecAfterMergingTheme(spec: any, chartSpec: any, chartSpecInfo?: IChartSpecInfo) {
    super._transformSpecAfterMergingTheme(spec, chartSpec, chartSpecInfo);

    spec.visible = spec.visible ?? true;
    spec.activeType = getTooltipActualActiveType(spec);
    spec.renderMode =
      spec.renderMode ??
      // 小程序或非浏览器环境下，默认使用canvas渲染
      (isMiniAppLikeMode(this._option.mode) || !isTrueBrowser(this._option.mode) ? 'canvas' : 'html');
    spec.trigger = spec.trigger ?? 'hover';
    spec.className = spec.className ?? TOOLTIP_EL_CLASS_NAME;
    spec.enterable = spec.enterable ?? false;
    spec.transitionDuration = spec.transitionDuration ?? 150;
    spec.triggerOff = spec.triggerOff ?? spec.trigger;
    spec.confine = spec.confine ?? spec.renderMode === 'canvas';

    if (isValid(spec.mark)) {
      spec.mark.activeType = 'mark';
    }
    if (isValid(spec.dimension)) {
      spec.dimension.activeType = 'dimension';
    }

    if (isValid(spec.parentElement)) {
      if (isString(spec.parentElement)) {
        spec.parentElement = globalThis?.document?.getElementById(spec.parentElement);
      }
    } else if (isTrueBrowser(this._option.mode)) {
      spec.parentElement = domDocument?.body;
    }
  }
}
