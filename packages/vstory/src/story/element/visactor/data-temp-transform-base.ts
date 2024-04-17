import { DataSet } from '@visactor/vdataset';
import { EditorFactory } from '../../core/factory';
import type {
  IDataParser,
  StandardData,
  IVisactorTemp,
  IDataTempTransform,
  ISpecProcess,
  IVisactorElement
} from './interface';
import { EventEmitter } from '@visactor/vutils';
import type { IUpdateAttributeOption } from '../../core/interface';
import { EditorEventType, EditorMessageType } from '../../core/const';
import type { VChartEditor } from '../../core/vchart-editor';

export class DataTempTransformBase implements IDataTempTransform {
  protected _state = 'alive';

  protected _specTemp: IVisactorTemp = null;
  get specTemp() {
    return this._specTemp;
  }
  protected _dataSet: DataSet = null;
  protected _dataParser: IDataParser;
  get dataParser() {
    return this._dataParser;
  }

  protected _element: IVisactorElement;
  protected _editor: VChartEditor;
  protected _specProcess: ISpecProcess;

  // 当图表类或者数据更新时，先使用 next 验证是否可用，可用再更新
  protected _nextTemp: IVisactorTemp = null;
  get nextTemp() {
    return this._nextTemp;
  }
  protected _nextDataParser: IDataParser = null;
  get nextDataParser() {
    return this._nextDataParser;
  }

  protected _changeType: 'data' | 'temp' | 'dataTemp' | 'none' = 'none';

  protected _updateOption: IUpdateAttributeOption = {};

  emitter: EventEmitter = new EventEmitter();

  constructor({
    editor,
    specProcess,
    element
  }: {
    element: IVisactorElement;
    editor: VChartEditor;
    specProcess: ISpecProcess;
  }) {
    this._element = element;
    this._editor = editor;
    this._specProcess = specProcess;
    this._dataSet = new DataSet();
  }

  protected _updateChartData(type: string, value: unknown) {
    if (!type && this._dataParser) {
      this._dataParser.updateValue(value);
      return;
    }
    if (!this._createNextDataParser(type, value, true)) {
      return;
    }
    this._changeType = 'data';
    // 尝试更新数据
    this._nextDataParser.updateValue(value);
  }

  protected _createNextDataParser(type: string, value: unknown, compareCurrent = false) {
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
      emitter: this._editor.emitter,
      editor: this._editor
    });
    return true;
  }

  protected _nextDataUpdateCall = (d: StandardData) => {
    if (this._state === 'release') {
      return;
    }
    if (this._changeType === 'data') {
      if (this._checkEnable(this._nextDataParser, this._specTemp)) {
        // 数据更新成功
        this._dataChangeSuccess(d, this._changeType);
      } else {
        // 数据不可用
        this._editor.emitter.emit(EditorEventType.dataUpdateFail, {
          message: EditorMessageType.dataUnmeetChartRequire
        });
      }
    } else if (this._changeType === 'dataTemp') {
      if (this._checkEnable(this._nextDataParser, this._nextTemp)) {
        // 数据 + 模版更新成功
        const hasSpecialDataSource = this._nextTemp.type !== 'standard' || this._specTemp.type !== 'standard';
        if (this._specTemp) {
          this._element.clearEditorData({
            // 如果参与变换的类型里有风神。那么清楚编辑模块数据，否则不清楚
            clearCurrent: hasSpecialDataSource ? { layout: true } : false
          });

          if (hasSpecialDataSource) {
            // 这一次的更新不添加历史数据 并且清除当前的数据
            this._element.option.editorData.clearHistory();
            this._setNoHistoryState();
          }
        }
        const currentTemp = this._specTemp;
        this._setTempToNext();
        this._dataChangeSuccess(d, this._changeType, { currentTemp, nextTemp: this._specTemp });
      }
    }
    this._changeType = 'none';
  };

  protected _setNoHistoryState() {
    this._updateOption = this._updateOption || {};
    if (this._updateOption.triggerHistory) {
      this._updateOption.saveData = true;
      this._updateOption.triggerHistory = false;
    }
  }

  protected _dataChangeSuccess(d: StandardData, type: 'data' | 'dataTemp', opt?: any) {
    // change success
    this._dataParser?.clear();
    this._dataParser = this._nextDataParser;
    this._nextDataParser = null;
    this._dataParser.setDataErrorHandler(this._currentDataErrorCall);
    this._dataParser.setDataUpdateHandler(this._currentDataUpdateCall);
    this._currentDataUpdateCall(d, type, opt);
    this._editor.emitter.emit(EditorEventType.dataUpdateSuccess, { type });
  }

  protected _nextDataErrorCall = (msg: { type: string; info: string }, opt: any) => {
    if (msg.type === 'msg') {
      this._handlerDataError(msg);
    } else if (msg.type === 'error') {
      this._editor.emitter.emit(EditorEventType.dataUpdateFail, msg);
    }
  };

  protected _currentDataUpdateCall = (d: StandardData, type: 'data' | 'dataTemp' = 'data', opt?: any) => {
    if (this._state === 'release') {
      return;
    }
    this.emitter.emit(`${type}Update`, this._updateOption, opt);
    if (this._checkEnable(this._dataParser, this._specTemp)) {
      this.emitter.emit('specReady');
    }
    if (this._updateOption.saveData === true) {
      this._editor.editorData.saveData();
    }
  };
  protected _currentDataErrorCall = (msg: { type: string; info: string }, opt: any) => {
    if (msg.type === 'msg') {
      this._handlerDataError(msg);
    } else if (msg.type === 'error') {
      this._editor.emitter.emit(EditorEventType.dataUpdateFail, msg);
    }
  };

  protected _handlerDataError(msg: { type: string; info: string }) {
    if (msg.info === 'chartTypeChange') {
      // 这里仅仅是数据中的类型切换，保留模版
      const temp = this._specProcess.getEditorSpec().temp;
      this._element.clearEditorData({ clearCurrent: { layout: true, marker: true } });
      this._specProcess.getEditorSpec().temp = temp;
    } else if (msg.info === 'needClearHistory') {
      this._editor.editorData.clearHistory();
    } else if (msg.info === 'noHistory') {
      // 这一次的更新不添加历史数据
      this._setNoHistoryState();
    } else if (msg.info === 'dataSourceChange') {
      // 需要清楚当前的全部编辑信息
      const temp = this._specProcess.getEditorSpec().temp;
      this._element.clearEditorData({ clearCurrent: { layout: true } });
      this._specProcess.getEditorSpec().temp = temp;
    } else if (msg.info === 'toTableElement') {
      // 需要将当前元素切换为table
      this.emitter.emit('toTableElement');
    } else if (msg.info === 'toChartElement') {
      // 需要将当前元素切换为chart
      this.emitter.emit('toChartElement');
    }
  }

  protected _updateChartTemp(temp: string) {
    if (!this._createNextTemp(temp)) {
      return;
    }
    this._changeType = 'temp';
    if (this._checkEnable(this._dataParser, this._nextTemp)) {
      const currentTemp = this._specTemp;
      this._setTempToNext();
      this.emitter.emit('tempUpdate', this._updateOption, { currentTemp, nextTemp: this._specTemp });
      this.emitter.emit('specReady');
    } else {
      // fail
    }
    this._changeType = 'none';
  }

  protected _setTempToNext() {
    this._specTemp?.clear();
    this._specTemp = this._nextTemp;
    this._nextTemp = null;
  }

  protected _createNextTemp(temp: string) {
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

  updateChartDataTemp(data?: { type: string; value: unknown }, temp?: string, option?: IUpdateAttributeOption) {
    if (!data && !temp) {
      return;
    }
    // 记录当前是否需要记录历史数据
    this._updateOption = option;
    if (!data && temp) {
      this._updateChartTemp(temp);
      return;
    }
    // update data & emit event
    this._editor.emitter.emit(EditorEventType.dataUpdateStart, {
      actionType: option?.actionType,
      temp: temp
    });
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

  protected _checkEnable(parser: IDataParser, temp: IVisactorTemp) {
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
    return this._specTemp.getSpec(data, info, { chart: this._element }, option);
  }

  release() {
    this._state = 'release';
    this._dataParser?.clear();
    this._specTemp?.clear();
    this._nextDataParser?.clear();
    this._nextTemp?.clear();
    this.emitter.removeAllListeners();
    this.emitter = this._dataParser = this._specTemp = this._nextDataParser = this._nextDataParser = null;
  }
}
