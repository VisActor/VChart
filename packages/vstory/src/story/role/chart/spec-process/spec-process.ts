import { IChartRoleSpec } from '../../dsl-interface';
import { cloneDeep } from '@visactor/vutils';
import type { IChartSpecProcess } from './interface';
import type { ChartDataTempTransform } from './data-temp-transform';
import { SpecProcessBase } from '../../visactor/spec-process-base';

const DefaultEditorSpec: IChartRoleSpec = {
  type: null,
  zIndex: 0,
  id: '',
  position: undefined,
  options: {
    data: null,
    theme: null,
    color: null,
    layout: { viewBox: { x: 0, y: 0, width: 0, height: 0 }, data: [] },
    marker: {
      markLine: [],
      markArea: []
    },
    markStyle: null
  }
};

// @ts-ignore
export class SpecProcess extends SpecProcessBase implements IChartSpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _roleSpec: IChartRoleSpec = cloneDeep(DefaultEditorSpec);

  // @ts-ignore
  protected declare _role: EditorChart;

  protected declare _dataTempTransform: ChartDataTempTransform;

  updateConfig(spec: IChartRoleSpec) {
    this._roleSpec = spec;

    this._dataTempTransform.updateChartTemp(this._roleSpec.type);
  }

  protected _mergeConfig() {}
}
