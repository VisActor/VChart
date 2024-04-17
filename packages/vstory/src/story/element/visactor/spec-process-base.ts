import { IElementChartSpec } from './../dsl-interface';
import { EventEmitter, cloneDeep } from '@visactor/vutils';
import type {
  IDataTempTransform,
  IDataTempTransformConstructor,
  ISpecProcess,
  IElementVisactor,
  IUpdateAttributeOption,
  IVisactorTemp
} from './interface';

export abstract class SpecProcessBase implements ISpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _config: IElementChartSpec['config'];
  protected _onSpecReadyCall: () => void = null;
  // vTableSpec 只作为临时转换结果，传递给vTable，不会存储。
  protected _elementSpec: any = {} as any;

  protected _dataTempTransform: IDataTempTransform;
  get dataTempTransform() {
    return this._dataTempTransform;
  }

  protected _element: IElementVisactor = null;

  emitter: EventEmitter = new EventEmitter();

  constructor(element: IElementVisactor, DataTempClass: IDataTempTransformConstructor, call: () => void) {
    this._element = element;
    this._dataTempTransform = new DataTempClass({
      element,
      specProcess: this
    });
    this._onSpecReadyCall = call;
    this._dataTempTransform.emitter.on('specReady', this.transformSpec);
    this._dataTempTransform.emitter.on('tempUpdate', this._tempUpdateSuccess);
    this._dataTempTransform.emitter.on('dataUpdate', this._dataUpdateSuccess);
  }

  // transform spec 的过程
  protected abstract _mergeConfig(): void;

  getConfig() {
    return this._config;
  }

  getElementSpec() {
    return this._elementSpec;
  }

  protected _dataUpdateSuccess = (option: IUpdateAttributeOption) => {
    this.emitter.emit('beforeTempChange');
    this._config.data = this._dataTempTransform.dataParser.getSave();
    this.emitter.emit('afterDataChange');
  };
  protected _tempUpdateSuccess = (
    option: IUpdateAttributeOption,
    transParams: { currentTemp: IVisactorTemp; nextTemp: IVisactorTemp }
  ) => {
    const willPushHistory = option?.triggerHistory !== false;
    this.emitter.emit('beforeTempChange', willPushHistory, transParams);
    this._config.temp = this._dataTempTransform.specTemp.type;
    this.emitter.emit('afterTempChange', transParams);
  };
  protected _dataTempUpdateSuccess = (
    option: IUpdateAttributeOption,
    transParams: { currentTemp: IVisactorTemp; nextTemp: IVisactorTemp }
  ) => {
    const willPushHistory = option?.triggerHistory !== false;
    this.emitter.emit('beforeTempChange', willPushHistory, transParams);
    this._config.data = this._dataTempTransform.dataParser.getSave();
    this._config.temp = this._dataTempTransform.specTemp.type;
    this.emitter.emit('afterTempChange', transParams);
  };

  protected transformSpec = () => {
    this._elementSpec = this._dataTempTransform.getBaseSpec();
    this._mergeConfig();
    this._onSpecReadyCall();
  };

  release() {
    this._onSpecReadyCall = null;
    this._dataTempTransform.release();
    this._dataTempTransform = null;
    this._config = null;
    this._elementSpec = null;
  }

  // 得到模版类型
  getSpecTemp() {
    return this._config.temp;
  }
}
