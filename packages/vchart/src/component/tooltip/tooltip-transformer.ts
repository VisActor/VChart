import { vglobal } from '@visactor/vrender-core';
import type { IChartSpecInfo } from '../../chart/interface';
import { domDocument, isMiniAppLikeMode, isString, isTrueBrowser, isValid } from '../../util';
import { BaseComponentSpecTransformer } from '../base';
import { TOOLTIP_EL_CLASS_NAME } from './constant';
import { getTooltipActualActiveType } from './utils/common';
import { mergeSpec } from '@visactor/vutils-extension';

export class TooltipSpecTransformer extends BaseComponentSpecTransformer<any> {
  protected _shouldMergeThemeToSpec() {
    return false;
  }

  protected _initTheme(spec: any, chartSpec: any): { spec: any; theme: any } {
    const { spec: newSpec, theme } = super._initTheme(spec, chartSpec);

    // 合并样式和配置
    newSpec.style = mergeSpec({}, this._theme, newSpec.style);
    newSpec.offset = mergeSpec({}, theme.offset, spec.offset);
    newSpec.transitionDuration = spec.transitionDuration ?? theme.transitionDuration;

    // 合并交互相关配置
    newSpec.trigger = spec.trigger ?? theme.trigger;
    newSpec.triggerOff = spec.triggerOff ?? theme.triggerOff;

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
    spec.confine = spec.confine ?? spec.renderMode === 'canvas';

    if (isValid(spec.parentElement)) {
      if (isString(spec.parentElement)) {
        spec.parentElement = vglobal.getElementById(spec.parentElement);
      }
    } else if (isTrueBrowser(this._option.mode)) {
      spec.parentElement = domDocument?.body;
    }
  }
}
