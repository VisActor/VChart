import { isNumber, isString, toNumber } from '@visactor/vutils';
import {
  defaultKeyStyle,
  defaultContentColumnStyle,
  defaultValueStyle,
  defaultAdaptiveKeyStyle,
  defaultShapeStyle
} from './style-constants';
import { BaseTooltipModel } from './base-tooltip-model';
import type { ITooltipModelOption } from './interface';
import type { IShapeSvgOption } from './shape-model';
// eslint-disable-next-line no-duplicate-imports
import { ShapeModel } from './shape-model';
import { TextModel } from './text-model';
import { TOOLTIP_EMPTY_STRING } from '../../constants';
import { getPixelPropertyStr } from '../utils';
import type { IToolTipLineActual } from '../../../../../typings';
import { mergeSpec } from '../../../../../util/spec/merge-spec';

export type ContentColumnType = 'shape-box' | 'key-box' | 'value-box';

/** 默认的标签样式，覆盖外界对这些属性的预先配置 */
const defaultLabelStyle: Partial<CSSStyleDeclaration> = {
  overflowWrap: 'normal',
  wordWrap: 'normal'
};

export class ContentColumnModel extends BaseTooltipModel {
  readonly className: ContentColumnType;

  constructor(
    parent: BaseTooltipModel | HTMLElement,
    option: ITooltipModelOption,
    className: ContentColumnType,
    childIndex?: number
  ) {
    super(parent, option, childIndex);
    this.className = className;
  }

  init(): void {
    if (!this.product) {
      this.product = this.createElement('div', [this.className]);
    }
    const renderContent = this._option.getTooltipActual()?.content ?? [];

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
            const text = new TextModel(this.product!, this._option, i);
            text.init([this.className.substring(0, this.className.indexOf('-'))], undefined, 'div');
            this.children[i] = text;
          } else if (this.className === 'shape-box') {
            const shape = new ShapeModel(this.product!, this._option, i);
            shape.init(['shape'], undefined, 'div');
            this.children[i] = shape;
          }
        }
      }
    }
  }

  setStyle() {
    const tooltipStyle = this._option.getTooltipStyle();

    super.setStyle(mergeSpec({}, defaultContentColumnStyle, tooltipStyle.content, this._getContentColumnStyle()));

    const renderContent = this._option.getTooltipActual()?.content ?? [];
    const contentAttributes = this._option.getTooltipAttributes()?.content ?? [];

    const getKeyItemStyle = (line: IToolTipLineActual, i: number): Partial<CSSStyleDeclaration> => {
      const { key, isKeyAdaptive } = line;
      const { height } = contentAttributes[i];
      const { keyColumn } = tooltipStyle;
      const style: Partial<CSSStyleDeclaration> = mergeSpec(
        {},
        isKeyAdaptive ? defaultAdaptiveKeyStyle : defaultKeyStyle,
        {
          height: getPixelPropertyStr(height),
          ...defaultLabelStyle,
          ...keyColumn.common,
          ...keyColumn.items?.[i]
        } as Partial<CSSStyleDeclaration>
      );
      const hasContent = (isString(key) && key?.trim?.() !== '') || isNumber(key);
      if (!hasContent && !style.visibility) {
        style.visibility = 'hidden';
      } else {
        style.visibility = 'visible';
      }
      return style;
    };

    const getValueItemStyle = (line: IToolTipLineActual, i: number): Partial<CSSStyleDeclaration> => {
      const { height } = contentAttributes[i];
      const { valueColumn } = tooltipStyle;
      const style: Partial<CSSStyleDeclaration> = mergeSpec({}, defaultValueStyle, {
        height: getPixelPropertyStr(height),
        ...defaultLabelStyle,
        ...valueColumn.common,
        ...valueColumn.items?.[i]
      } as Partial<CSSStyleDeclaration>);
      return style;
    };

    const getShapeItemStyle = (line: IToolTipLineActual, i: number): Partial<CSSStyleDeclaration> => {
      const { height } = contentAttributes[i];
      const { shapeColumn } = tooltipStyle;
      const keyStyle = getKeyItemStyle(line, i);
      const paddingTop = `calc((${keyStyle.lineHeight ?? keyStyle.fontSize ?? '18px'} - ${
        shapeColumn.width ?? '8px'
      }) / 2)`; // shape 和 key 的第一行文字对齐
      const style: Partial<CSSStyleDeclaration> = mergeSpec({}, defaultShapeStyle, {
        height: getPixelPropertyStr(height),
        paddingTop,
        ...shapeColumn.common,
        ...shapeColumn.items?.[i]
      } as Partial<CSSStyleDeclaration>);
      return style;
    };

    renderContent.forEach((line, i) => {
      if (this.className === 'key-box') {
        (this.children[i] as TextModel).setStyle(getKeyItemStyle(line, i));
      } else if (this.className === 'value-box') {
        (this.children[i] as TextModel).setStyle(getValueItemStyle(line, i));
      } else if (this.className === 'shape-box') {
        (this.children[i] as ShapeModel)?.setStyle(getShapeItemStyle(line, i), this._getShapeSvgOption(line, i));
      }
    });
  }

  setContent(): void {
    const renderContent = this._option.getTooltipActual()?.content ?? [];
    const contentAttributes = this._option.getTooltipAttributes()?.content ?? [];
    renderContent.forEach((line, i) => {
      let childContent: any;
      if (this.className === 'key-box') {
        const keyContent = line.key;
        if ((isString(keyContent) && keyContent?.trim?.() !== '') || isNumber(keyContent)) {
          childContent = keyContent;
        } else {
          childContent = TOOLTIP_EMPTY_STRING;
        }
        (this.children[i] as TextModel)?.setContent(childContent, contentAttributes[i].key?.multiLine);
      } else if (this.className === 'value-box') {
        const valueContent = line.value;
        if ((isString(valueContent) && valueContent?.trim?.() !== '') || isNumber(valueContent)) {
          childContent = valueContent;
        } else {
          childContent = TOOLTIP_EMPTY_STRING;
        }
        (this.children[i] as TextModel)?.setContent(childContent, contentAttributes[i].value?.multiLine);
      } else if (this.className === 'shape-box') {
        childContent = this._getShapeSvgOption(line, i);
        this.children[i]?.setContent(childContent);
      }
    });
  }

  protected _getContentColumnStyle() {
    const tooltipStyle = this._option.getTooltipStyle();

    switch (this.className) {
      case 'shape-box':
        const renderContent = this._option.getTooltipActual()?.content ?? [];
        return {
          ...tooltipStyle.shapeColumn,
          ...(this.className === 'shape-box' && !renderContent.some(c => c.hasShape && c.shapeType)
            ? { display: 'none' }
            : {})
        };
      case 'key-box':
        return tooltipStyle.keyColumn;
      case 'value-box':
        return tooltipStyle.valueColumn;
    }
  }

  protected _getShapeSvgOption(line: IToolTipLineActual, index: number): IShapeSvgOption {
    const tooltipStyle = this._option.getTooltipStyle();
    const shapeColumn = {
      ...tooltipStyle.shapeColumn,
      ...tooltipStyle.shapeColumn.items?.[index]
    };
    const keyColumn = {
      ...tooltipStyle.keyColumn,
      ...tooltipStyle.keyColumn.items?.[index]
    };
    return {
      hasShape: line.hasShape,
      symbolType: line.shapeType,
      size: shapeColumn.width,
      fill: line.shapeFill ?? line.shapeColor,
      stroke: line.shapeStroke,
      lineWidth: line.shapeLineWidth,
      hollow: line.shapeHollow,
      index
    } as IShapeSvgOption;
  }
}
