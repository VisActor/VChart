import { merge } from '@visactor/vutils';
import { CharacterChart } from '../character';
import { IChartCharacterRuntime } from './interface';
import { ChartSpecMatch } from './utils';

export class SeriesSpecRuntime implements IChartCharacterRuntime {
  type = 'SeriesSpec';

  protected declare _character: CharacterChart;

  constructor(character: CharacterChart) {
    this._character = character;
  }

  onSpecReady() {
    const rawSpec = this._character.specProcess.getVisSpec();
    const options = this._character.specProcess.getCharacterSpec().options;
    if (!options) {
      return;
    }
    // 如果原始spec没有series，并且seriesSpec只有一项
    if (!rawSpec.series && options.seriesSpec?.length === 1) {
      merge(rawSpec, options.seriesSpec[0].spec);
      return;
    }
    options.seriesSpec.forEach(seriesSpec => {
      if (!rawSpec.series) {
        rawSpec.series = [{ ...seriesSpec.spec }];
        return;
      } else {
        const s = rawSpec.series.find((a: any, index: number) => {
          return ChartSpecMatch(a, index, seriesSpec.matchInfo);
        });
        if (s) {
          merge(s, seriesSpec.spec);
        } else {
          rawSpec.series.push({ ...seriesSpec.spec });
        }
      }
    });
  }

  afterInitializeChart() {
    //
  }
  afterVRenderDraw() {}
}
