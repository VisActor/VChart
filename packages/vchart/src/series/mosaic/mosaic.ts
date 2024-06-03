import { BarSeries } from '../bar/bar';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import { registerRectMark } from '../../mark/rect';
// eslint-disable-next-line no-duplicate-imports
import { registerTextMark } from '../../mark/text';
import { registerFadeInOutAnimation } from '../../animation/config';
import type { IMosaicSeriesSpec } from './interface';
import { Factory } from '../../core/factory';
import { BarSeriesSpecTransformer } from '../bar/bar-transformer';
import { registerCartesianLinearAxis } from '../../component/axis/cartesian';
import { Direction } from '../../typings/space';
import { STACK_FIELD_TOTAL_END_PERCENT, STACK_FIELD_TOTAL_START_PERCENT } from '../../constant';

export class MosaicSeries<T extends IMosaicSeriesSpec = IMosaicSeriesSpec> extends BarSeries<any> {
  static readonly type: string = SeriesTypeEnum.mosaic;
  type = SeriesTypeEnum.mosaic;

  protected declare _spec: T;

  static readonly transformerConstructor = BarSeriesSpecTransformer as any;
  readonly transformerConstructor = BarSeriesSpecTransformer as any;

  getGroupFields() {
    return this.direction === 'vertical' ? this._specXField : this._specYField;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();

    if (this.direction === Direction.horizontal) {
      this.setFieldY(STACK_FIELD_TOTAL_END_PERCENT);
      this.setFieldY2(STACK_FIELD_TOTAL_START_PERCENT);
    } else {
      this.setFieldX(STACK_FIELD_TOTAL_END_PERCENT);
      this.setFieldX2(STACK_FIELD_TOTAL_START_PERCENT);
    }
  }
}

export const registerMosaicSeries = () => {
  registerRectMark();
  registerTextMark();
  registerFadeInOutAnimation();
  registerCartesianLinearAxis();
  Factory.registerSeries(MosaicSeries.type, MosaicSeries);
};
