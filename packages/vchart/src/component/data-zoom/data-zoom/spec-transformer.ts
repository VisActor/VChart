import type { AdaptiveSpec } from '../../../typings';
import { BaseComponentSpecTransformer } from '../../base';
import type { IDataZoomSpec } from './interface';

export class DataZoomSpecTransformer<T extends IDataZoomSpec = IDataZoomSpec> extends BaseComponentSpecTransformer<
  AdaptiveSpec<T, 'width' | 'height'>
> {
  protected _prepareSpecBeforeMergingTheme(
    originalSpec: Partial<AdaptiveSpec<T, 'width' | 'height'>>
  ): Partial<AdaptiveSpec<T, 'width' | 'height'>> {
    const newSpec: Partial<AdaptiveSpec<T, 'width' | 'height'>> = {
      ...originalSpec
    };
    // 为了减少主题更改造成的影响，如果用户在 spec 配置了主题默认关闭的 mark，则自动加上 visible: true
    const { selectedBackgroundChart = {} } = newSpec;
    const { line, area } = selectedBackgroundChart as T['selectedBackgroundChart'];
    if (line || area) {
      newSpec.selectedBackgroundChart = {
        ...selectedBackgroundChart,
        line:
          line && line.visible !== false
            ? {
                ...line,
                style: {
                  ...line.style,
                  visible: true // FIXME: visible 应该提到更上面，等 datazoom 支持
                }
              }
            : line,
        area:
          area && area.visible !== false
            ? {
                ...area,
                style: {
                  ...area.style,
                  visible: true // FIXME: visible 应该提到更上面，等 datazoom 支持
                }
              }
            : area
      };
    }
    return newSpec;
  }
}
