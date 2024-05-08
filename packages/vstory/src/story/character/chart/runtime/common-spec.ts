import { merge } from '@visactor/vutils';
import { CharacterChart } from '../character';
import { IChartCharacterRuntime } from './interface';

export class CommonSpecRuntime implements IChartCharacterRuntime {
  type = 'CommonSpec';

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
    merge(rawSpec, { color: options.color, theme: options.theme, padding: options.padding, title: options.title });
  }

  afterInitializeChart() {
    //
  }
  afterVRenderDraw() {}
}
