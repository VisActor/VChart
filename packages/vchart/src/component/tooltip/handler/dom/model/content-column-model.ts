import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isNumber, isString, merge, toNumber } from '@visactor/vutils';
import {
  defaultKeyStyle,
  defaultContentColumnStyle,
  defaultValueStyle,
  defaultAdaptiveKeyStyle
} from './style-constants';
import { BaseTooltipModel, TOOLTIP_EMPTY_STRING } from './base-tooltip-model';
import type { ITooltipModelOption } from './interface';
import type { IShapeSvgOption } from './shape-model';
// eslint-disable-next-line no-duplicate-imports
import { ShapeModel } from './shape-model';
import { TextModel } from './text-model';
import type { IDomTooltipStyle } from '../interface';
import type { IToolTipActual } from '../../../../../typings';

export type ContentColumnType = 'shape-box' | 'key-box' | 'value-box';

export class ContentColumnModel extends BaseTooltipModel {
  readonly className: ContentColumnType;

  constructor(
    parent: BaseTooltipModel | HTMLElement,
    option: ITooltipModelOption,
    className: ContentColumnType,
    childIndex?: number,
    tooltipStyle?: Maybe<IDomTooltipStyle>,
    tooltipActual?: Maybe<IToolTipActual>
  ) {
    super(parent, option, childIndex, tooltipStyle, tooltipActual);
    this.className = className;
  }

  init(): void {
    if (!this.product) {
      this.product = this.createElement('div', [this.className]);
    }
    const renderContent = this.getRenderContent();

    if (this.className === 'shape-box' && !renderContent.some(c => c.hasShape && c.shapeType)) {
      // 当有一行配有形状的时候，其他行要对齐。如果没有一行配有形状，则删除所有的行
      Object.keys(this.children).forEach(key => {
        const i = toNumber(key);
        this.children[i].release();
        delete this.children[i];
      });
    } else {
      // 删除多余的行
      Object.keys(this.children).forEach(key => {
        const i = toNumber(key);
        if (i >= renderContent.length) {
          this.children[i].release();
          delete this.children[i];
        }
      });
      // 新增没有的行
      for (let i = 0; i < renderContent.length; i++) {
        if (!this.children[i]) {
          if (this.className === 'key-box' || this.className === 'value-box') {
            const text = new TextModel(this.product!, this._option, i, this._tooltipStyle, this._tooltipActual);
            text.init([this.className.substring(0, this.className.indexOf('-'))], undefined, 'div');
            this.children[i] = text;
          } else if (this.className === 'shape-box') {
            const shape = new ShapeModel(this.product!, this._option, i, this._tooltipStyle, this._tooltipActual);
            shape.init(['shape'], undefined, 'div');
            this.children[i] = shape;
          }
        }
      }
    }
  }

  setStyle() {
    if (!this._tooltipStyle) {
      return;
    }

    super.setStyle(merge({}, defaultContentColumnStyle, this._tooltipStyle.content, this._getContentColumnStyle()));

    const renderContent = this.getRenderContent();
    renderContent.forEach((line, i) => {
      let childStyle: any = {};
      if (this.className === 'key-box') {
        const { key, isKeyAdaptive } = line;
        childStyle = merge({}, isKeyAdaptive ? defaultAdaptiveKeyStyle : defaultKeyStyle, {
          height: `${100 / renderContent.length}%`,
          ...this._tooltipStyle!.keyColumn.item
        });
        const hasContent = (isString(key) && key?.trim?.() !== '') || isNumber(key);
        if (!hasContent && !childStyle.visibility) {
          childStyle.visibility = 'hidden';
        } else {
          childStyle.visibility = 'visible';
        }
        (this.children[i] as TextModel).setStyle(childStyle);
      } else if (this.className === 'value-box') {
        childStyle = merge({}, defaultValueStyle, {
          height: `${100 / renderContent.length}%`,
          ...this._tooltipStyle!.valueColumn.item
        });
        (this.children[i] as TextModel).setStyle(childStyle);
      } else if (this.className === 'shape-box') {
        childStyle = this._tooltipStyle!.shapeColumn.item;
        const childContent = {
          hasShape: line.hasShape,
          shapeType: line.shapeType,
          size: this._tooltipStyle!.shapeColumn.item?.width,
          color: line.shapeColor,
          hollow: line.shapeHollow
        } as IShapeSvgOption;
        (this.children[i] as ShapeModel)?.setStyle(childStyle, childContent);
      }
    });
  }

  setContent(): void {
    if (!this._tooltipStyle) {
      return;
    }

    const renderContent = this.getRenderContent();
    renderContent.forEach((line, i) => {
      let childContent: any;
      if (this.className === 'key-box') {
        const keyContent = line.key;
        if ((isString(keyContent) && keyContent?.trim?.() !== '') || isNumber(keyContent)) {
          childContent = keyContent;
        } else {
          childContent = TOOLTIP_EMPTY_STRING;
        }
      } else if (this.className === 'value-box') {
        const valueContent = line.value;
        if ((isString(valueContent) && valueContent?.trim?.() !== '') || isNumber(valueContent)) {
          childContent = valueContent;
        } else {
          childContent = TOOLTIP_EMPTY_STRING;
        }
      } else if (this.className === 'shape-box') {
        childContent = {
          hasShape: line.hasShape,
          shapeType: line.shapeType,
          size: this._tooltipStyle!.shapeColumn.item?.width,
          color: line.shapeColor,
          hollow: line.shapeHollow
        } as IShapeSvgOption;
      }
      this.children[i]?.setContent(childContent);
    });
  }

  protected _getContentColumnStyle() {
    switch (this.className) {
      case 'shape-box':
        return this._tooltipStyle?.shapeColumn;
      case 'key-box':
        return this._tooltipStyle?.keyColumn;
      case 'value-box':
        return this._tooltipStyle?.valueColumn;
    }
  }
}
