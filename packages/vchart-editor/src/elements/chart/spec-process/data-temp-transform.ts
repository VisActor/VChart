import { DataSet } from '@visactor/vdataset';
import { EditorFactory } from '../../../core/factory';
import type { IDataParser, StandardData } from '../data/interface';
import type { IChartTemp } from '../template/interface';
import type { EditorChart } from '../chart';
import { EventEmitter } from '@visactor/vutils';
import type { IUpdateAttributeOption } from '../../../core/interface';

export class DataTempTransform {
  protected _specTemp: IChartTemp = null;
  get specTemp() {
    return this._specTemp;
  }
  protected _dataSet: DataSet = null;
  protected _dataParser: IDataParser;
  get dataParser() {
    return this._dataParser;
  }

  protected _chart: EditorChart;

  // 当图表类或者数据更新时，先使用 next 验证是否可用，可用再更新
  protected _nextTemp: IChartTemp = null;
  protected _nextDataParser: IDataParser = null;

  protected _changeType: 'data' | 'temp' | 'dataTemp' | 'none' = 'none';

  emitter: EventEmitter = new EventEmitter();

  constructor(chart: EditorChart) {
    this._chart = chart;
    this._dataSet = new DataSet();
  }

  private _updateChartData(type: string, value: unknown) {
    if (!this._createNextDataParser(type, value, true)) {
      return;
    }
    this._changeType = 'data';
    // 尝试更新数据
    this._nextDataParser.updateValue(value);
  }

  private _createNextDataParser(type: string, value: unknown, compareCurrent: boolean = false) {
    if (!type && !value) {
      return false;
    }
    type = type ?? this._dataParser.type;
    const parserCreate = EditorFactory.getParser(type);
    if (!parserCreate) {
      console.warn('invalid data source type:', type);
      return false;
    }
    this._nextDataParser = new parserCreate(this._dataSet, null, {
      updateCall: this._nextDataUpdateCall,
      errorCall: this._nextDataErrorCall,
      currentData: compareCurrent ? this._dataParser : null,
      emitter: this._chart.option.editor.emitter,
      editor: this._chart.option.editor
    });
    return true;
  }

  private _nextDataUpdateCall = (d: StandardData) => {
    if (this._changeType === 'data') {
      if (this._checkEnable(this._nextDataParser, this._specTemp)) {
        // 数据更新成功
        this._dataChangeSuccess(d, this._changeType);
      }
    } else if (this._changeType === 'dataTemp') {
      if (this._checkEnable(this._nextDataParser, this._nextTemp)) {
        // 数据 + 模版更新成功
        if (this._specTemp) {
          this._chart.clearDataForChartTypeChange({ clearCurrent: true });
        }
        this._setTempToNext();
        this._dataChangeSuccess(d, this._changeType);
      }
    }
    this._changeType = 'none';
  };

  private _dataChangeSuccess(d: StandardData, type: 'data' | 'dataTemp') {
    // change success
    this._dataParser?.clear();
    this._dataParser = this._nextDataParser;
    this._nextDataParser = null;
    this._dataParser.setDataErrorHandler(this._currentDataErrorCall);
    this._dataParser.setDataUpdateHandler(this._currentDataUpdateCall);
    this._chart.option.editorEvent.editor.emitter.emit('success', { type });
    this._currentDataUpdateCall(d, type);
  }

  private _nextDataErrorCall = (msg: { type: string; info: string }, opt: any) => {
    if (msg.type === 'msg') {
      if (msg.info === 'chartTypeChange') {
        // 这里仅仅是数据中的类型切换，保留模版
        const temp = this._chart.specProcess.getEditorSpec().temp;
        this._chart.clearDataForChartTypeChange({ clearCurrent: true });
        this._chart.specProcess.getEditorSpec().temp = temp;
      } else if (msg.info === 'needClearHistory') {
        this._chart.option.editorData.clearHistory();
      }
    } else if (msg.type === 'error') {
      this._chart.option.editorEvent.editor.emitter.emit('error', msg);
    }
  };

  private _currentDataUpdateCall = (d: StandardData, type: 'data' | 'dataTemp' = 'data') => {
    this.emitter.emit(`${type}Update`, this);
    if (this._checkEnable(this._dataParser, this._specTemp)) {
      this.emitter.emit('specReady');
    }
  };
  private _currentDataErrorCall = (msg: { type: string; info: string }, opt: any) => {
    // do nothing
    if (msg.type === 'msg') {
      if (msg.info === 'chartTypeChange') {
        // 这里仅仅是数据中的类型切换，保留模版
        const temp = this._chart.specProcess.getEditorSpec().temp;
        this._chart.clearDataForChartTypeChange({ clearCurrent: true });
        this._chart.specProcess.getEditorSpec().temp = temp;
      } else if (msg.info === 'needClearHistory') {
        this._chart.option.editorData.clearHistory();
      }
    } else if (msg.type === 'error') {
      this._chart.option.editorEvent.editor.emitter.emit('error', msg);
    }
  };

  private _updateChartTemp(temp: string) {
    if (!this._createNextTemp(temp)) {
      return;
    }
    this._changeType = 'temp';
    if (this._checkEnable(this._dataParser, this._nextTemp)) {
      this._setTempToNext();
      this.emitter.emit('tempUpdate', this);
      this.emitter.emit('specReady');
    } else {
      // fail
    }
    this._changeType = 'none';
  }

  private _setTempToNext() {
    this._specTemp?.clear();
    this._specTemp = this._nextTemp;
    this._nextTemp = null;
  }

  private _createNextTemp(temp: string) {
    if (temp === this._specTemp?.type) {
      console.warn('same temp type:', temp);
      return false;
    }
    const tCreate = EditorFactory.getTemp(temp);
    if (!tCreate) {
      console.warn('invalid type  type:', temp);
      return false;
    }
    this._nextTemp?.clear();
    this._nextTemp = new tCreate();
    return true;
  }

  updateChartDataTemp(
    data?: { type: string; value: unknown },
    temp?: string,
    actionType?: IUpdateAttributeOption['actionType']
  ) {
    if (!data && !temp) {
      return;
    }
    if (!data && temp) {
      this._updateChartTemp(temp);
      return;
    }
    // update data & emit event
    this._chart.option.editorEvent.editor.emitter.emit('dataUpdate', actionType);
    if (data && !temp) {
      this._updateChartData(data.type, data.value);
      return;
    }
    if (!this._createNextDataParser(data.type, data.value) || !this._createNextTemp(temp)) {
      return;
    }
    this._changeType = 'dataTemp';
    // 尝试更新数据
    this._nextDataParser.updateValue(data.value);
  }

  private _checkEnable(parser: IDataParser, temp: IChartTemp) {
    if (!parser) {
      return false;
    }
    if (!temp) {
      return false;
    }
    const data = parser.getData();
    const info = parser.getDataInfo?.();
    if (temp.checkDataEnable(data, info)) {
      return true;
    }
    return false;
  }

  getBaseSpec() {
    const data = this._dataParser.getData();
    const info = this._dataParser.getDataInfo();
    const option = this._dataParser.getSpecOption?.();
    return this._specTemp.getSpec(data, info, option);
  }

  release() {
    this._dataParser?.clear();
    this._specTemp?.clear();
    this._nextDataParser?.clear();
    this._nextTemp?.clear();
    this.emitter.removeAllListeners();
    this.emitter = this._dataParser = this._specTemp = this._nextDataParser = this._nextDataParser = null;
  }
}
