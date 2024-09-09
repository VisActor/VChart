import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import { isNil } from '@visactor/vutils';

export class GaugePointerTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  updateTooltipSpec() {
    super.updateTooltipSpec();

    if (isNil(this.spec?.dimension)) {
      this.spec = {
        ...this.spec,
        dimension: {
          visible: false
        }
      };
    }
  }
}
