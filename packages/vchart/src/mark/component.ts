import type { IGroupMark } from '@visactor/vgrammar';
import { GrammarMarkType } from '@visactor/vgrammar';
import type { ICommonSpec } from '../typings';
import { BaseMark } from './base';
import type { IMarkOption, IMarkRaw } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type IComponentMark = IMarkRaw<ICommonSpec>;

export class ComponentMark extends BaseMark<ICommonSpec> implements IComponentMark {
  static readonly type = MarkTypeEnum.component;
  type: string = 'component';

  private _componentType: string;

  constructor(name: string, option: IMarkOption) {
    super(name, option);
    // 这里需要将 type 指定为具体的组件名称，即调用 vgrammar 的 registerComponent API 注册的组件名称
    this._componentType = option.componentType;
  }
  /** 创建语法元素对象 */
  protected _initProduct(group?: string | IGroupMark) {
    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();
    this._product = view
      .mark(GrammarMarkType.component, group ?? view.rootMark, { componentType: this._componentType })
      .id(id);
    this._compiledProductId = id;
  }
}
