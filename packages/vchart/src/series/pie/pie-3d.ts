import {
  AttributeLevel,
  ARC_START_ANGLE,
  ARC_END_ANGLE,
  ARC_MIDDLE_ANGLE,
  DEFAULT_LABEL_X,
  DEFAULT_LABEL_Y,
  DEFAULT_LABEL_TEXT,
  DEFAULT_LABEL_LIMIT,
  DEFAULT_LABEL_ALIGN,
  DEFAULT_LABEL_VISIBLE
} from '../../constant';
import type { Datum } from '../../typings';
import { field } from '../../util/object';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { IArcSeries, SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IPie3dSeriesSpec } from './interface';
import { Arc3dMark, registerArc3dMark } from '../../mark/arc-3d';
import { BasePieSeries } from './pie';
import { pie3dSeriesMark } from './constant';
import { radianToDegree } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import { registerPie3dAnimation } from './animation/animation';

export class Pie3dSeries<T extends IPie3dSeriesSpec = IPie3dSeriesSpec> extends BasePieSeries<T> implements IArcSeries {
  static readonly type: string = SeriesTypeEnum.pie3d;
  type = SeriesTypeEnum.pie3d;
  protected _pieMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.pie3d;
  protected _pieMarkType: MarkTypeEnum = MarkTypeEnum.arc3d;

  static readonly mark: SeriesMarkMap = pie3dSeriesMark;

  protected _angle3d: number;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this._angle3d = this._spec?.angle3d ?? -Math.PI / 3;
  }

  initMarkStyle(): void {
    const pieMark = this._pieMark;
    if (pieMark) {
      this.setMarkStyle(
        pieMark,
        {
          x: () => this._center?.x ?? this._region.getLayoutRect().width / 2,
          y: () => this._center?.y ?? this._region.getLayoutRect().height / 2,
          beta: () => this._angle3d,
          fill: this.getColorAttribute(),
          outerRadius: () => this.computeLayoutRadius() * this._outerRadius,
          innerRadius: () => this.computeLayoutRadius() * this._innerRadius,
          cornerRadius: () => this.computeLayoutRadius() * this._cornerRadius,
          startAngle: field(ARC_START_ANGLE).bind(this),
          endAngle: field(ARC_END_ANGLE).bind(this),
          padAngle: this._padAngle,
          centerOffset: this._centerOffset
        },
        'normal',
        AttributeLevel.Series
      );

      // radius 配置需要额外处理比例值
      const pieSpec = this.getSpec()[pieMark.name];
      if (pieSpec) {
        // pieMark.setStyle(pieSpec.style, 'normal', AttributeLevel.User_Mark);
        for (const state in pieSpec.state || {}) {
          this.setMarkStyle(pieMark, this.generateRadiusStyle(pieSpec.state[state]), state, AttributeLevel.User_Mark);
        }
      }

      this._trigger.registerMark(pieMark);
    }

    const labelMark = this._labelMark;
    const spec = this.getSpec();
    const params3d: {
      beta?: number;
      anchor3d?: (datum: Datum) => any;
    } = {};
    if (spec?.label?.support3d) {
      params3d.beta = -Math.PI / 3;
      params3d.anchor3d = (datum: Datum) => {
        const anchor = [
          (this._center?.x ?? this._region.getLayoutRect().width / 2) - field(DEFAULT_LABEL_X).bind(this)(datum),
          (this._center?.y ?? this._region.getLayoutRect().height / 2) - field(DEFAULT_LABEL_Y).bind(this)(datum)
        ];
        return anchor;
      };
    }
    if (labelMark) {
      this.setMarkStyle(
        labelMark,
        {
          visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
          x: field(DEFAULT_LABEL_X).bind(this),
          y: field(DEFAULT_LABEL_Y).bind(this),
          text: field(DEFAULT_LABEL_TEXT).bind(this),
          fill: this._spec.label?.style?.fill || this.getColorAttribute(),
          textAlign: field(DEFAULT_LABEL_ALIGN).bind(this),
          textBaseline: this._spec.label?.position === 'inside' ? 'middle' : 'top',
          angle: (datum: Datum) => {
            const angle = datum[ARC_MIDDLE_ANGLE];
            return this._spec.label?.position === 'inside' ? radianToDegree(angle) : 0;
          },
          limit: field(DEFAULT_LABEL_LIMIT).bind(this),
          ...params3d
        },
        undefined,
        // 标签属性基于用户配置生成，样式优先级应当为用户级
        AttributeLevel.User_Mark
      );

      this._trigger.registerMark(labelMark);
    }

    const labelLineMark = this._labelLineMark;
    if (labelLineMark) {
      this.setMarkStyle(labelLineMark, {
        visible: field(DEFAULT_LABEL_VISIBLE).bind(this),
        stroke: (this._spec.label?.line?.style?.stroke as any) || this.getColorAttribute(),
        lineWidth: 1,
        ...this.generateLinePath('normal'),
        ...params3d,
        anchor3d: () => {
          return [
            this._center?.x ?? this._region.getLayoutRect().width / 2,
            this._center?.y ?? this._region.getLayoutRect().height / 2
          ];
        }
      });
      this.setMarkStyle(labelLineMark, this.generateLinePath('hover'), 'hover');
      this.setMarkStyle(labelLineMark, this.generateLinePath('selected'), 'selected');

      this._trigger.registerMark(labelLineMark);
    }
  }
}

export const registerPie3dSeries = () => {
  registerPie3dAnimation();
  registerArc3dMark();
  Factory.registerSeries(Pie3dSeries.type, Pie3dSeries);
};
