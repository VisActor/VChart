import { ISpec } from '@visactor/vchart';
import { IElementChartSpec } from './../../dsl-interface';
import { cloneDeep } from '@visactor/vutils';
import type { IChartSpecProcess } from './interface';
import type { ChartDataTempTransform } from './data-temp-transform';
import { SpecProcessBase } from '../../visactor/spec-process-base';

const DefaultEditorSpec: IElementChartSpec['config'] = {
  data: null,
  temp: null,
  config: {
    theme: null,
    color: null,
    layout: { viewBox: { x: 0, y: 0, width: 0, height: 0 }, data: [] },
    marker: {
      markLine: [],
      markArea: []
    },
    barLink: {
      enable: false,
      spec: {
        linkStyle: {},
        areaStyle: {},
        label: {},
        styleMap: {}
      }
    },
    markStyle: null,
    zIndex: 0,
    moduleSpec: []
  }
};

// @ts-ignore
export class SpecProcess extends SpecProcessBase implements IChartSpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _config: IElementChartSpec['config'] = cloneDeep(DefaultEditorSpec);
  // vchartSpec 只作为临时转换结果，传递给vchart，不会存储。
  protected _elementSpec: ISpec = {} as any;

  // @ts-ignore
  protected declare _element: EditorChart;

  protected declare _dataTempTransform: ChartDataTempTransform;

  updateConfig(spec: IElementChartSpec['config']) {
    this._config = spec;

    this._dataTempTransform.updateChartDataTemp(this._config.data, this._config.temp, {
      triggerHistory: false
    });
  }

  release() {
    this._onSpecReadyCall = null;
    this._dataTempTransform.release();
    this._dataTempTransform = null;
    this._config = null;
    this._elementSpec = null;
  }

  protected _mergeConfig() {
    // 将编辑配置，更新到图表配置上
    this._dataTempTransform.specTemp.updateSpec(this._elementSpec, this._config, { chart: this._element });
    this._dataTempTransform.specTemp.transformSpec(this._elementSpec, this._config, { chart: this._element });
  }
}
