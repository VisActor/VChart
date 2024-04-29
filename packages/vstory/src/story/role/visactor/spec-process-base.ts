import { IChartRoleSpec } from '../dsl-interface';
import { EventEmitter, cloneDeep } from '@visactor/vutils';
import type {
  IDataTempTransform,
  IDataTempTransformConstructor,
  ISpecProcess,
  IRoleVisactor,
  IUpdateAttributeOption,
  IVisactorTemp
} from './interface';

export abstract class SpecProcessBase implements ISpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _roleSpec: IChartRoleSpec;
  protected _onSpecReadyCall: () => void = null;
  // vTableSpec 只作为临时转换结果，传递给vTable，不会存储。
  protected _visSpec: any;

  protected _dataTempTransform: IDataTempTransform;
  get dataTempTransform() {
    return this._dataTempTransform;
  }

  protected _role: IRoleVisactor = null;

  emitter: EventEmitter = new EventEmitter();

  constructor(role: IRoleVisactor, DataTempClass: IDataTempTransformConstructor, call: () => void) {
    this._role = role;
    this._dataTempTransform = new DataTempClass({
      role,
      specProcess: this
    });
    this._onSpecReadyCall = call;
    this._dataTempTransform.emitter.on('specReady', this.transformSpec);
    this._dataTempTransform.emitter.on('tempUpdate', this._tempUpdateSuccess);
    this._dataTempTransform.emitter.on('dataUpdate', this._dataUpdateSuccess);
  }

  // transform spec 的过程
  protected abstract _mergeConfig(): void;

  getVisSpec() {
    return this._visSpec;
  }

  getRoleSpec() {
    return this._roleSpec;
  }

  protected _dataUpdateSuccess = (option: IUpdateAttributeOption) => {
    this.emitter.emit('beforeTempChange');
    this._roleSpec.options.data = this._dataTempTransform.dataParser.getSave();
    this.emitter.emit('afterDataChange');
  };
  protected _tempUpdateSuccess = (
    option: IUpdateAttributeOption,
    transParams: { currentTemp: IVisactorTemp; nextTemp: IVisactorTemp }
  ) => {
    const willPushHistory = option?.triggerHistory !== false;
    this.emitter.emit('beforeTempChange', willPushHistory, transParams);
    this._roleSpec.type = this._dataTempTransform.specTemp.type;
    this.emitter.emit('afterTempChange', transParams);
  };
  protected _dataTempUpdateSuccess = (
    option: IUpdateAttributeOption,
    transParams: { currentTemp: IVisactorTemp; nextTemp: IVisactorTemp }
  ) => {
    const willPushHistory = option?.triggerHistory !== false;
    this.emitter.emit('beforeTempChange', willPushHistory, transParams);
    this._roleSpec.options.data = this._dataTempTransform.dataParser.getSave();
    this._roleSpec.type = this._dataTempTransform.specTemp.type;
    this.emitter.emit('afterTempChange', transParams);
  };

  protected transformSpec = () => {
    this._visSpec = this._dataTempTransform.getBaseSpec();
    this._mergeConfig();
    this._onSpecReadyCall();
  };

  release() {
    this._onSpecReadyCall = null;
    this._dataTempTransform.release();
    this._dataTempTransform = null;
    this._roleSpec = null;
    this._visSpec = null;
    this._role = null;
  }

  // 得到模版类型
  getRoleType() {
    return this._roleSpec.type;
  }
}
