import type { DataView } from '@visactor/vdataset';
import type { IData as IVGrammarData } from '@visactor/vgrammar-core';
import { GrammarItem } from '../grammar-item';
import type { Maybe } from '../../typings';
import { isNil } from '../../util/type';
import type { ICompilableData } from './interface';
import type { GrammarItemInitOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { GrammarType } from '../interface/compilable-item';

export class CompilableData extends GrammarItem implements ICompilableData {
  readonly grammarType = GrammarType.data;
  protected declare _product: Maybe<IVGrammarData>;
  declare getProduct: () => Maybe<IVGrammarData>;

  /** 原始DataView */
  protected _data: Maybe<DataView> = null;
  getDataView() {
    return this._data;
  }
  setDataView(d?: DataView) {
    this._data = d;
  }
  getLatestData() {
    return this._data?.latestData;
  }

  constructor(option: GrammarItemInitOption, dataView?: DataView) {
    super(option);
    this._data = dataView;
  }

  release() {
    super.release();
    this._data = null;
  }

  /** 更新数据并默认重新渲染 */
  updateData(noRender?: boolean) {
    const product = this.getProduct();
    const data = this.getLatestData();
    if (product && data) {
      product.values(data);
      if (!noRender) {
        // 将实际的 dataflow 推迟到下一次异步操作，以避免同步的数据更新内容被忽略
        return this.getCompiler().renderNextTick();
      }
    }
    return;
  }

  protected _compileProduct() {
    const data = this.getLatestData();
    if (isNil(data)) {
      return;
    }
    if (isNil(this.getProduct())) {
      this._initProduct(data);
    } else {
      this._product.values(data);
    }
  }

  /** 创建语法元素对象 */
  protected _initProduct(data: any[]) {
    const view = this.getVGrammarView();
    if (!view || !data) {
      return;
    }

    const id = this.getProductId();
    this._product = view?.data?.(data).id(id);
    this._compiledProductId = id;
  }

  generateProductId(): string {
    return `${this.getDataView()?.name}`;
  }

  protected _lookupGrammar(id: string) {
    return this.getCompiler().getVGrammarView()?.getDataById?.(id);
  }
}
