import { isValid } from '@visactor/vutils';
import type { ISeriesSpec } from '../../typings';
import { BaseSeriesSpecTransformer } from '../base';
import { svgSourceMap } from './svg-source';
import type { SVGParserResult } from '@visactor/vdataset';

export class PictogramSeriesSpecTransformer<T extends ISeriesSpec, K> extends BaseSeriesSpecTransformer<T, K> {
  protected _getDefaultSpecFromChart(chartSpec: any): any {
    const spec = super._getDefaultSpecFromChart(chartSpec) ?? {};
    const svg = chartSpec.svg;
    const elements = svgSourceMap.get(svg)?.latestData?.elements as SVGParserResult['elements'];
    if (elements && elements.length) {
      const names = elements.map(e => e.name).filter(n => isValid(n));
      names.forEach(name => {
        if (chartSpec[name]) {
          spec[name] = chartSpec[name];
        }
      });
    }
    return spec;
  }
}
