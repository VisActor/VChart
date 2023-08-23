import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { LayoutItem } from '../../model/layout-item';
import { AttributeLevel, LayoutZIndex, STACK_FIELD_TOTAL, STACK_FIELD_TOTAL_TOP } from '../../constant';
import type { MarkType } from '../../mark/interface';
import { MarkTypeEnum, type IMark } from '../../mark/interface';
import type { ITextMark } from '../../mark/text';
import { getSeries, merge } from '../../util';
import type { ICartesianSeries, ISeries } from '../../series/interface';
import type { IGroupMark, IView } from '@visactor/vgrammar';
import { textAttribute } from './util';
import { BaseLabelComponent } from './base-label';
import type { ITotalLabelSpec, ITotalLabelTheme } from './interface';
import type { IModelInitOption } from '../../model/interface';

export class TotalLabel extends BaseLabelComponent {
  static type = ComponentTypeEnum.totalLabel;
  type = ComponentTypeEnum.totalLabel;
  name: string = ComponentTypeEnum.totalLabel;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Label;

  private _textMark?: ITextMark;
  private _baseMark?: IMark;

  series: ISeries;

  protected declare _theme: ITotalLabelTheme;

  static createComponent(spec: ITotalLabelSpec, options: IComponentOption) {
    const regions = options.getAllRegions();
    const labelComponents: TotalLabel[] = [];
    for (let i = 0; i < regions.length; i++) {
      const series = getSeries(regions);
      series.forEach(s => {
        if (s.getSpec()?.totalLabel?.visible) {
          const cmp = new TotalLabel(s.getSpec().totalLabel, { ...options, specIndex: i, specKey: 'totalLabel' });
          cmp.series = s;
          labelComponents.push(cmp);
        }
      });
    }
    return labelComponents;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    this._initTextMark();
    this._initLabelComponent();
  }

  protected _initTextMark() {
    if (this.series.getSpec().totalLabel?.visible) {
      const mark = this.series.getMarksInType([MarkTypeEnum.rect, MarkTypeEnum.symbol])[0];
      const textMark = this._createMark({ type: MarkTypeEnum.text, name: `${mark.name}-total-label` });
      this._baseMark = mark;
      this._textMark = textMark;
      this._initTextMarkStyle();
    }
  }

  _initTextMarkStyle() {
    super.initMarkStyleWithSpec(this._textMark, this._spec);
    this.setMarkStyle(
      this._textMark,
      {
        text: datum => {
          return datum[STACK_FIELD_TOTAL];
        }
      },
      'normal',
      AttributeLevel.Default
    );
  }

  protected _initLabelComponent() {
    const component = this._createMark(
      { type: MarkTypeEnum.component, name: `${this.series.name}-total-label-component` },
      {
        componentType: 'label',
        support3d: this._spec.support3d
      }
    );
    if (component) {
      this._marks.addMark(component);
    }
  }

  updateLayoutAttribute(): void {
    super.updateLayoutAttribute();
    this._marks.forEach((componentMark, index) => {
      const component = componentMark.getProduct() as ReturnType<IView['label']>;
      component
        .target(this._baseMark.getProduct())
        .configure({ interactive: false })
        .labelStyle(() => {
          if (this._baseMark) {
            const { offset, animation, overlap } = this._spec;
            const interactive = this._interactiveConfig(this._spec);
            return merge(
              {
                textStyle: { pickable: this._spec.interactive === true },
                position: totalLabelPosition(this.series, this._baseMark.type)
              },
              {
                offset,
                animation,
                overlap,
                dataFilter: (data: any) => {
                  return data.filter((d: any) => d.data[STACK_FIELD_TOTAL_TOP]);
                },
                ...interactive
              }
            );
          }
        })
        .encode((datum, element) => {
          return textAttribute(
            { baseMark: this._baseMark, labelMark: this._textMark, series: this.series },
            datum,
            this._spec.formatMethod
          );
        })
        .size(() => this._regions[0].getLayoutRect());
    });
  }

  compileMarks() {
    this.getMarks().forEach(m => {
      const group = this._regions[0].getGroupMark().getProduct() as IGroupMark;
      m.compile({ group });
      m.getProduct()?.configure({
        context: {
          model: this
        }
      });
    });
  }
}

export function totalLabelPosition(series: ISeries, type: MarkType) {
  let position;
  switch (type) {
    case 'rect':
      position = (series as ICartesianSeries).direction === 'horizontal' ? 'right' : 'top';
      break;
    case 'symbol':
    default:
      position = 'top';
  }
  return position;
}
