// eslint-disable-next-line no-duplicate-imports
import { registerLabelMark } from '../../mark/label';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import { STACK_FIELD_TOTAL, STACK_FIELD_TOTAL_BOTTOM, STACK_FIELD_TOTAL_TOP } from '../../constant/data';
import { LayoutZIndex } from '../../constant/layout';
import { AttributeLevel } from '../../constant/attribute';
import type { ILabelMark, IMark, MarkType } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from '../../mark/interface';
import { mergeSpec } from '@visactor/vutils-extension';
import type { ICartesianSeries, ISeries } from '../../series/interface';
import type { IGroupMark, IView } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import { registerLabel as registerVGrammarLabel } from '@visactor/vgrammar-core';
import { textAttribute } from './util';
import { BaseLabelComponent } from './base-label';
import type { IModelInitOption, IModelSpecInfo } from '../../model/interface';
import type { Datum, Maybe } from '../../typings';
import { Factory } from '../../core/factory';
import { registerComponentMark } from '../../mark/component';
import type { IChartSpecInfo } from '../../chart/interface';

export class TotalLabel extends BaseLabelComponent {
  static type = ComponentTypeEnum.totalLabel;
  type = ComponentTypeEnum.totalLabel;
  name: string = ComponentTypeEnum.totalLabel;

  static specKey = 'totalLabel';
  specKey = 'totalLabel';

  layoutZIndex: number = LayoutZIndex.Label;

  private _textMark?: ILabelMark;
  private _baseMark?: IMark;

  static getSpecInfo(chartSpec: any, chartSpecInfo?: IChartSpecInfo): Maybe<IModelSpecInfo[]> {
    const specInfo: IModelSpecInfo[] = [];
    chartSpecInfo?.region?.forEach((regionInfo, regionIndex) => {
      regionInfo.seriesIndexes?.forEach(seriesIndex => {
        const { spec } = chartSpecInfo.series[seriesIndex];
        const labelSpec = spec[this.specKey];
        if (labelSpec?.visible) {
          specInfo.push({
            spec: labelSpec,
            type: ComponentTypeEnum.totalLabel,
            specPath: ['series', seriesIndex, this.specKey],
            specInfoPath: ['component', this.specKey, seriesIndex],
            regionIndexes: [regionIndex],
            seriesIndexes: [seriesIndex]
          });
        }
      });
    });
    return specInfo;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    this._initTextMark();
    this._initLabelComponent();
  }

  reInit(spec?: any) {
    super.reInit(spec);
    this._initTextMark();
  }

  protected _initTextMark() {
    const series = this._getSeries();
    if (series.getSpec().totalLabel?.visible) {
      const mark = series.getSeriesMark();
      if (mark) {
        const textMark = this._createMark({ type: MarkTypeEnum.label, name: `${mark.name}-total-label` }) as ILabelMark;
        this._baseMark = mark;
        this._textMark = textMark;
        this._initTextMarkStyle();
      }
    }
  }

  _initTextMarkStyle() {
    super.initMarkStyleWithSpec(this._textMark, this._spec);
    this.setMarkStyle(
      this._textMark,
      {
        text: (datum: Datum) => {
          return datum[STACK_FIELD_TOTAL];
        }
      },
      'normal',
      AttributeLevel.Default
    );

    const series = this._getSeries();
    series.initTotalLabelMarkStyle?.(this._textMark);
  }

  protected _initLabelComponent() {
    const series = this._getSeries();
    const component = this._createMark(
      { type: MarkTypeEnum.component, name: `${series.name}-total-label-component` },
      {
        componentType: 'label',
        noSeparateStyle: true
      },
      {
        support3d: this._spec.support3d
      }
    );
    if (component) {
      this._marks.addMark(component);
    }
  }

  updateLayoutAttribute(): void {
    super.updateLayoutAttribute();
    const series = this._getSeries();
    this._marks.forEach((componentMark, index) => {
      const component = componentMark.getProduct() as ReturnType<IView['label']>;
      component
        .target(this._baseMark.getProduct())
        .configure({ interactive: false })
        .labelStyle(() => {
          if (this._baseMark) {
            const { offset, animation, overlap, position = 'top' } = this._spec;
            const interactive = this._interactiveConfig(this._spec);
            return mergeSpec(
              {
                textStyle: { pickable: this._spec.interactive === true },
                position: totalLabelPosition(series, this._baseMark.type, position),
                x: 0,
                y: 0
              },
              series.getTotalLabelComponentStyle?.({
                baseMark: this._baseMark,
                labelMark: this._textMark
              }) ?? {},
              {
                offset,
                animation,
                overlap,
                dataFilter: (data: any) => {
                  return data.filter((d: any) =>
                    position === 'bottom' ? d.data[STACK_FIELD_TOTAL_BOTTOM] : d.data[STACK_FIELD_TOTAL_TOP]
                  );
                },
                ...interactive
              }
            );
          }
        })
        .encode(datum => {
          return textAttribute(
            {
              baseMark: this._baseMark,
              labelMark: this._textMark,
              series,
              labelSpec: series.getSpec().totalLabel
            },
            datum,
            this._spec.formatMethod
          );
        })
        .size(() => {
          return {
            padding: this._spec.overlap?.padding,
            ...this._regions[0].getLayoutRect()
          };
        });
    });
  }

  compileMarks() {
    this.getMarks().forEach(m => {
      const group = this._regions[0].getGroupMark().getProduct() as IGroupMark;
      m.compile({ group, context: { model: this } });
    });
  }

  getVRenderComponents() {
    const labels: any[] = [];
    this.getMarks().forEach(m => {
      const graphicItem = m.getProduct().getGroupGraphicItem();
      if (graphicItem) {
        labels.push(graphicItem);
      }
    });
    return labels;
  }

  protected _getSeries() {
    return this._option.getSeriesInIndex([this.getSpecPath()[1] as number])[0];
  }
}

export function totalLabelPosition(series: ISeries, type: MarkType, position: 'top' | 'bottom' = 'top') {
  let finalPosition;
  const { direction } = series as ICartesianSeries;
  const isInverse =
    direction === 'horizontal'
      ? (series as ICartesianSeries).getXAxisHelper()?.isInverse()
      : (series as ICartesianSeries).getYAxisHelper()?.isInverse();
  let positionMap;
  if (position === 'bottom') {
    positionMap = { vertical: ['bottom', 'top'], horizontal: ['left', 'right'] };
  } else {
    positionMap = { vertical: ['top', 'bottom'], horizontal: ['right', 'left'] };
  }
  const index = isInverse ? 1 : 0;
  switch (type) {
    case 'rect':
    case 'symbol':
      finalPosition = positionMap[direction][index];
      break;
    default:
      finalPosition = 'top';
  }
  return finalPosition;
}

export const registerTotalLabel = () => {
  registerVGrammarLabel();
  registerLabelMark();
  registerComponentMark();
  Factory.registerComponent(TotalLabel.type, TotalLabel, true);
};
