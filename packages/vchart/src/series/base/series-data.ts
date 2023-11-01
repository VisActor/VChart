import { isNil, isValid } from '@visactor/vutils';
import { CompilableData } from '../../compile/data/compilable-data';

export class SeriesData extends CompilableData {
  protected _compileProduct() {
    const data = this._data?.latestData;
    if (isNil(data) || isValid(this.getProduct())) {
      return;
    }
    this._initProduct([]); // 性能优化：初次编译不需要数据
  }

  generateProductId(): string {
    return this._data?.name as string;
  }
}
