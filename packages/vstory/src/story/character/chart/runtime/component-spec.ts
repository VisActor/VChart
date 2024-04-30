import { merge, isValid } from '@visactor/vutils';
import { IComponentSpec } from '../../dsl-interface';
import { CharacterChart } from '../character';
import { IChartCharacterRuntime } from './interface';
import { ChartSpecMatch } from './utils';

export class ComponentSpecRuntime implements IChartCharacterRuntime {
  type = 'ComponentSpec';

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
    const componentSpec = options.componentSpec;
    componentSpec?.forEach(cSpec => {
      if (cSpec.specKey === 'axes') {
        this._mergeAxesSpec(rawSpec, cSpec);
      }
    });
  }

  protected _mergeAxesSpec(rawSpec: any, componentSpec: IComponentSpec) {
    if (!rawSpec.axes) {
      rawSpec.axes = [{ ...componentSpec }];
      return;
    } else {
      const s = rawSpec.axes.find((a: any, index: number) => {
        if (ChartSpecMatch(a, index, componentSpec.matchInfo)) {
          return true;
        } else {
          return a.orient === componentSpec.matchInfo.orient;
        }
      });
      if (s) {
        merge(s, componentSpec.spec);
      } else {
        rawSpec.axes.push(componentSpec.spec);
      }
    }
  }

  afterInitializeChart() {
    //
  }
  afterVRenderDraw() {}
}
