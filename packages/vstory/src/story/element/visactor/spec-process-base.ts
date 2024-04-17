import { EventEmitter, cloneDeep } from '@visactor/vutils';
import type { IUpdateAttributeOption, IUpdateAttributeParam, KeepModelInClear } from '../../core/interface';
import { diffSpec } from '../../utils/spec';
import type {
  IDataTempTransform,
  IDataTempTransformConstructor,
  IEditorSpec,
  ISpecProcess,
  IVisactorElement
} from './interface';
import type { ITheme } from '@visactor/vchart';
import type { IChartTemp } from '../chart/template/interface';
import { transformElementSpec } from '../../utils/element';

export abstract class SpecProcessBase implements ISpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _editorSpec: IEditorSpec;
  protected _onSpecReadyCall: () => void = null;
  // vTableSpec 只作为临时转换结果，传递给vTable，不会存储。
  protected _elementSpec: any = {} as any;

  protected _dataTempTransform: IDataTempTransform;
  get dataTempTransform() {
    return this._dataTempTransform;
  }

  protected _element: IVisactorElement = null;

  emitter: EventEmitter = new EventEmitter();

  constructor(element: IVisactorElement, DataTempClass: IDataTempTransformConstructor, call: () => void) {
    this._element = element;
    this._dataTempTransform = new DataTempClass({
      element,
      editor: element.editor,
      specProcess: this
    });
    this._onSpecReadyCall = call;
    this._dataTempTransform.emitter.on('specReady', this.transformSpec);
    this._dataTempTransform.emitter.on('tempUpdate', this._tempUpdateSuccess);
    this._dataTempTransform.emitter.on('dataUpdate', this._dataUpdateSuccess);
    this._dataTempTransform.emitter.on('toTableElement', () => {
      this._changeElementType('table');
    });
    this._dataTempTransform.emitter.on('toChartElement', () => {
      this._changeElementType('chart');
    });
  }

  // 清除编辑数据
  abstract clearEditorSpec(keep: KeepModelInClear): void;
  // 更新编辑数据
  abstract updateEditorSpec(spec: IEditorSpec): void;
  // 更新主题
  abstract updateTheme(theme: ITheme): void;
  // 从历史数据中更新编辑数据
  abstract updateAttributeFromHistory(att: any, fromAttribute: any): void;
  // transform spec 的过程
  protected abstract _mergeEditorSpec(attr: IUpdateAttributeParam): void;

  getEditorSpec() {
    return this._editorSpec;
  }

  updateLayout(layout: any) {
    this._editorSpec.layout = layout;
  }

  updateZIndex(zIndex: number, willPushHistory: boolean) {
    this._updateWithHistory(() => {
      this._editorSpec.zIndex = zIndex;
    }, willPushHistory);
  }

  getElementSpec() {
    return this._elementSpec;
  }

  protected _updateWithHistory(updateCall: () => void, willPushHistory = true) {
    willPushHistory && this.saveSnapshot();
    updateCall();
    willPushHistory && this.pushHistory();
  }

  protected _dataUpdateSuccess = (option: IUpdateAttributeOption) => {
    const willPushHistory = option?.triggerHistory !== false;
    willPushHistory && this.saveSnapshot();
    this._editorSpec.data = this._dataTempTransform.dataParser.getSave();
    willPushHistory && this.pushHistory();
  };
  protected _tempUpdateSuccess = (
    option: IUpdateAttributeOption,
    transParams: { currentTemp: IChartTemp; nextTemp: IChartTemp }
  ) => {
    const willPushHistory = option?.triggerHistory !== false;
    this.emitter.emit('beforeTempChange', willPushHistory, transParams);
    willPushHistory && this.saveSnapshot();
    this._editorSpec.temp = this._dataTempTransform.specTemp.type;
    willPushHistory && this.pushHistory();
    this.emitter.emit('afterTempChange', transParams);
  };
  protected _dataTempUpdateSuccess = (
    option: IUpdateAttributeOption,
    transParams: { currentTemp: IChartTemp; nextTemp: IChartTemp }
  ) => {
    const willPushHistory = option?.triggerHistory !== false;
    this.emitter.emit('beforeTempChange', willPushHistory, transParams);
    this._updateWithHistory(() => {
      this._editorSpec.data = this._dataTempTransform.dataParser.getSave();
      this._editorSpec.temp = this._dataTempTransform.specTemp.type;
    }, willPushHistory);
    this.emitter.emit('afterTempChange', transParams);
  };

  protected transformSpec = () => {
    this._elementSpec = this._dataTempTransform.getBaseSpec();
    this._mergeEditorSpec(null);
    this._onSpecReadyCall();
  };

  release() {
    this._onSpecReadyCall = null;
    this._dataTempTransform.release();
    this._dataTempTransform = null;
    this._editorSpec = null;
    this._elementSpec = null;
  }

  protected _snapShot: any = null;
  saveSnapshot() {
    this._snapShot = cloneDeep(this._element.getData());
  }
  clearSnapshot() {
    this._snapShot = null;
  }

  pushHistory() {
    const { from, to } = diffSpec(this._snapShot, this._element.getData());
    if (Object.keys(from).length === Object.keys(to).length && Object.keys(from).length === 0) {
      return;
    }
    this._element.editor.editorData.pushHistoryNextTick({
      element: this._element.getElementInfo(),
      from: cloneDeep(from),
      to: cloneDeep(to),
      use: this._element.option.commonHistoryUse
    });
  }

  // 得到模版类型
  getSpecTemp() {
    return this._editorSpec.temp;
  }

  _changeElementType(type: string) {
    // 先清除全部编辑内容
    this._element.option.editor.clearAllEditorElements();
    const editorSpec = this._element.getData();
    const nextSpec = transformElementSpec(editorSpec, this._element.type, type);
    nextSpec.attribute.data = this._dataTempTransform.nextDataParser?.getSave();
    nextSpec.attribute.temp = this._dataTempTransform.nextTemp?.type ?? nextSpec.attribute.temp;
    const editor = this._element.option.editor;
    // @ts-ignore
    editor.deleteElement(this._element.id, false);
    editor.addElements(type, nextSpec);
  }
}
