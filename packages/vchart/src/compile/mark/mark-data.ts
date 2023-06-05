import { CompilableData } from '../data/compilable-data';
import { PREFIX } from '../../constant';
import { isNil, isValid } from '@visactor/vutils';
import type { ICompilableMark, IMarkDataInitOption } from './interface';

export class MarkData extends CompilableData {
  protected _mark: ICompilableMark;

  constructor(option: IMarkDataInitOption) {
    super(option);
    this._mark = option.mark;
  }

  setCompiledProductId(name: string) {
    this._compiledProductId = name;
  }

  generateProductId(): string {
    const name = super.generateProductId();
    if (isValid(name)) {
      return name;
    }
    return `${PREFIX}_markData_${this._mark.id}`;
  }

  protected _compileProduct() {
    const data = this._data?.latestData;
    if (isNil(data) || isValid(this.getProduct())) {
      return;
    }

    this._initProduct(data);
  }
}
