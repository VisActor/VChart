import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelInitOption, IModelSpecInfo } from '../../model/interface';
import { AttributeLevel, ChartEvent, LayoutZIndex, VGRAMMAR_HOOK_EVENT } from '../../constant';
import { MarkTypeEnum } from '../../mark/interface';
import { mergeSpec } from '../../util/spec/merge-spec';
import { eachSeries } from '../../util/model';
import type { ISeries } from '../../series/interface';
import type { IGroupMark, ILabel, IMark as IVGrammarMark } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import { registerLabel as registerVGrammarLabel } from '@visactor/vgrammar-core';
import { labelRuleMap, textAttribute } from './util';
import { registerComponentMark, type IComponentMark } from '../../mark/component';
import { BaseLabelComponent } from './base-label';
import type { LooseFunction, Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isArray, isFunction, pickWithout } from '@visactor/vutils';
import type { IGroup, IText } from '@visactor/vrender-core';
import type { ILabelSpec, TransformedLabelSpec } from './interface';
import { Factory } from '../../core/factory';
import { type ILabelMark, registerLabelMark } from '../../mark/label';
import type { ICompilableMark } from '../../compile/mark';
import type { IChartSpecInfo } from '../../chart/interface';
import type { IChartSpec } from '../../typings';
import { LabelSpecTransformer } from './label-transformer';
import type { LabelItem } from '@visactor/vrender-components';

export interface ILabelInfo {
  baseMark: ICompilableMark;
  labelMark: ILabelMark;
  series: ISeries;
  labelSpec: TransformedLabelSpec;
}

export interface ILabelComponentContext {
  region: IRegion;
  labelInfo: ILabelInfo[];
}

export class Label<T extends IChartSpec = any> extends BaseLabelComponent<T> {
  static type = ComponentTypeEnum.label;
  type = ComponentTypeEnum.label;
  name: string = ComponentTypeEnum.label;

  static specKey = 'label';
  specKey = 'label';

  static readonly transformerConstructor = LabelSpecTransformer as any;
  readonly transformerConstructor = LabelSpecTransformer;

  layoutZIndex: number = LayoutZIndex.Label;

  protected _labelInfoMap: Map<IRegion, ILabelInfo[]>;

  protected _labelComponentMap: Map<IComponentMark, () => ILabelInfo | ILabelInfo[]>;

  protected _layoutRule: 'series' | 'region';

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this._layoutRule = (spec as any).labelLayout || 'series';
  }

  static getSpecInfo(chartSpec: any, chartSpecInfo: IChartSpecInfo): Maybe<IModelSpecInfo[]> {
    const specInfo: IModelSpecInfo[] = [];
    const regionSpecInfo = chartSpecInfo?.region || [];
    const isLabelVisible = (labelSpecList: ILabelSpec[]) => {
      return labelSpecList.some(labelSpec => labelSpec.visible);
    };

    regionSpecInfo.forEach((regionInfo, i) => {
      const seriesIndexes = regionInfo.seriesIndexes || [];
      const hasVisibleLabel = seriesIndexes.some(seriesIndex => {
        const seriesInfo = chartSpecInfo.series[seriesIndex];
        const { markLabelSpec = {} } = seriesInfo;
        return Object.values(markLabelSpec).some(
          labelSpecList => Array.isArray(labelSpecList) && isLabelVisible(labelSpecList)
        );
      });

      if (chartSpec.labelLayout !== 'region' || hasVisibleLabel) {
        specInfo.push({
          spec: chartSpec,
          type: ComponentTypeEnum.label,
          specInfoPath: ['component', this.specKey, i],
          regionIndexes: [i]
        });
      }
    });
    return specInfo;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    this.initEvent();
    this._initTextMark();
    this._initLabelComponent();
    this._initTextMarkStyle();
  }

  reInit(spec?: T) {
    super.reInit(spec);
    this._labelInfoMap && this._labelInfoMap.clear();
    this._initTextMark();
    this._initTextMarkStyle();
  }

  initEvent() {
    this.event.on(ChartEvent.dataZoomChange, () => {
      this._labelComponentMap.forEach((info, component) => {
        const graphicItem = component.getProduct().getGroupGraphicItem();
        if (graphicItem) {
          graphicItem.disableAnimation();
        }
      });
      this.event.on(VGRAMMAR_HOOK_EVENT.AFTER_MARK_RENDER_END, enableAnimation);
    });
    const enableAnimation = () => {
      this._labelComponentMap.forEach((info, component) => {
        const graphicItem = component.getProduct().getGroupGraphicItem();
        if (graphicItem) {
          graphicItem.enableAnimation();
        }
      });
      this.event.off(VGRAMMAR_HOOK_EVENT.AFTER_MARK_RENDER_END, enableAnimation);
    };

    this.event.on('afterElementEncode', eventParams => {
      const mark = eventParams.item;

      if (this._option.getChart().getLayoutTag() === false && mark.getContext()?.model === this) {
        this._delegateLabelEvent(mark.getGroupGraphicItem());
      }
    });
  }

  protected _delegateLabelEvent(component: IGroup) {
    const textNodes = component
      ?.findAll(node => node.type === 'text', true)
      // label 组件的底层实现是有 text 图元复用的，这里为了避免重复的事件监听
      .filter(text => !(text as any).__vchart_event) as IText[];
    if (textNodes && textNodes.length > 0) {
      textNodes.forEach(text => {
        text.__vchart_event = true;
        text.addEventListener('*', ((event: any, type: string) =>
          this._delegateEvent(component, event, type, text, (text.attribute as LabelItem).data)) as LooseFunction);
      });
    }
  }

  protected _initTextMark() {
    if (!this._labelInfoMap) {
      this._labelInfoMap = new Map();
    }

    if (!this._labelComponentMap) {
      this._labelComponentMap = new Map();
    }
    eachSeries(this._regions, (series: ISeries) => {
      const { markLabelSpec = {} } = series.getSpecInfo();
      const markNames = Object.keys(markLabelSpec);
      const region = series.getRegion();

      if (!this._labelInfoMap.get(region)) {
        this._labelInfoMap.set(region, []);
      }
      for (let i = 0; i < markNames.length; i++) {
        const markName = markNames[i];
        const mark = series.getMarkInName(markName);
        if (!mark) {
          continue;
        }
        markLabelSpec[markName].forEach((spec: TransformedLabelSpec, index: number) => {
          if (spec.visible) {
            const info = this._labelInfoMap.get(region);
            const labelMark = this._createMark(
              {
                type: MarkTypeEnum.label,
                name: `${markName}-label-${index}`
              },
              { noSeparateStyle: true, attributeContext: series.getMarkAttributeContext() }
            ) as ILabelMark;
            labelMark.setTarget(mark);
            info.push({
              labelMark,
              baseMark: mark,
              series,
              labelSpec: spec
            });
          }
        });
      }
    });
  }

  protected _initLabelComponent() {
    this._labelInfoMap.forEach((regionLabelInfo, region) => {
      if (this._layoutRule === 'region') {
        const component = this._createMark(
          { type: MarkTypeEnum.component, name: `${region.getGroupMark().name}-label-component` },
          {
            componentType: 'label',
            noSeparateStyle: true,
            support3d: (this._spec as any).support3d
          }
        );
        if (component) {
          component.setSkipBeforeLayouted(true);
          this._marks.addMark(component);
          this._labelComponentMap.set(component, () => {
            return this._labelInfoMap.get(region);
          });
        }
      } else {
        regionLabelInfo.forEach((labelInfo, i) => {
          const component = this._createMark(
            { type: MarkTypeEnum.component, name: `${labelInfo.labelMark.name}-component` },
            {
              componentType: 'label',
              noSeparateStyle: true,
              support3d: labelInfo.baseMark.getSupport3d()
            }
          );
          if (component) {
            component.setSkipBeforeLayouted(true);
            this._marks.addMark(component);
            this._labelComponentMap.set(component, () => {
              return this._labelInfoMap.get(region)[i];
            });
            labelInfo.labelMark.setComponent(component);
          }
        });
      }
    });
  }

  protected _initTextMarkStyle() {
    this._labelInfoMap.forEach(labelInfos => {
      labelInfos.forEach(info => {
        const { labelMark, labelSpec, series } = info;
        this.initMarkStyleWithSpec(labelMark, labelSpec, undefined);
        if (isFunction(labelSpec?.getStyleHandler)) {
          const styleHandler = labelSpec.getStyleHandler(series);
          styleHandler?.call(series, labelMark);
        }
        if (labelMark.stateStyle?.normal?.lineWidth) {
          labelMark.setAttribute('stroke', series.getColorAttribute(), 'normal', AttributeLevel.Base_Series);
        }
      });
    });
  }

  updateLayoutAttribute(): void {
    super.updateLayoutAttribute();
    this._labelComponentMap.forEach((labelInfoCb, labelComponent) => {
      const labelInfo = labelInfoCb();
      if (isArray(labelInfo)) {
        this._updateMultiLabelAttribute(labelInfo, labelComponent);
      } else {
        this._updateSingleLabelAttribute(labelInfo, labelComponent);
      }
    });
  }

  protected _updateMultiLabelAttribute(labelInfo: ILabelInfo[], labelComponent: IComponentMark) {
    this._updateLabelComponentAttribute(
      labelComponent.getProduct() as ILabel,
      labelInfo.map(({ baseMark }) => baseMark.getProduct()),
      labelInfo
    );
  }

  protected _updateSingleLabelAttribute(labelInfo: ILabelInfo, labelComponent: IComponentMark) {
    const { baseMark } = labelInfo;
    this._updateLabelComponentAttribute(labelComponent.getProduct() as ILabel, baseMark.getProduct(), [labelInfo]);
  }

  protected _updateLabelComponentAttribute(
    component: ILabel,
    target: IVGrammarMark | IVGrammarMark[],
    labelInfos: ILabelInfo[]
  ) {
    const dependCmp = this._option.getComponentsByType('totalLabel');
    component
      .target(target)
      .configure({ interactive: false })
      .depend(dependCmp.map(cmp => cmp.getMarks()[0].getProduct()))
      .labelStyle((mark: IVGrammarMark, params: Record<string, any>) => {
        const labelInfo = labelInfos[params.labelIndex];
        if (labelInfo) {
          const { labelSpec, labelMark } = labelInfo;
          const rule = labelMark.getRule();
          const configFunc = labelRuleMap[rule] ?? labelRuleMap.point;
          const interactive = this._interactiveConfig(labelSpec);
          const passiveLabelSpec = pickWithout(labelSpec, ['position', 'style', 'state', 'type']);
          /** arc label When setting the centerOffset of the spec, the label also needs to be offset accordingly, and the centerOffset is not in the labelSpec */
          const centerOffset = (this._spec as any)?.centerOffset ?? 0;
          const spec = mergeSpec(
            {
              textStyle: { pickable: labelSpec.interactive === true, ...labelSpec.style },
              overlap: {
                avoidMarks: dependCmp.map(cmp => cmp.getMarks()[0].getProductId())
              }
            },
            configFunc(labelInfo),
            {
              ...passiveLabelSpec,
              ...interactive,
              centerOffset
            }
          );
          // TODO 可以优化。vgrammar 的 label 图元类型分发是完全依赖 baseMark 的类型。默认情况下，line/area 图元的标签会使用'line-data'标签，此时需要 vchart 将类型传给 vgrammar
          if (rule === 'line' || rule === 'area') {
            spec.type = rule;
          }
          return spec;
        }
      })
      .encode((datum, element, params: Record<string, any>) => {
        const labelInfo = labelInfos[params.labelIndex];
        if (labelInfo) {
          const { labelSpec, labelMark } = labelInfos[params.labelIndex];
          return labelMark.skipEncode
            ? { data: datum }
            : textAttribute(labelInfos[params.labelIndex], datum, labelSpec.formatMethod, labelSpec.formatter);
        }
      })
      .size(() => labelInfos[0].series.getRegion().getLayoutRect());
  }

  compileMarks() {
    this.getMarks().forEach(m => {
      const labelInfo = this._labelComponentMap.get(m)();
      let group;
      if (isArray(labelInfo)) {
        group = labelInfo[0].series.getRegion().getGroupMark().getProduct() as IGroupMark;
      } else {
        group = labelInfo.series.getRegion().getGroupMark().getProduct() as IGroupMark;
      }
      m.compile({ group });
      m.getProduct()?.configure({
        context: {
          model: this,
          labelInfo
        }
      });
    });
  }

  getVRenderComponents() {
    const labels: any[] = [];
    this._labelComponentMap.forEach((info, component) => {
      const graphicItem = component.getProduct().getGroupGraphicItem();
      if (graphicItem) {
        labels.push(graphicItem);
      }
    });
    return labels;
  }
}

export const registerLabel = () => {
  registerVGrammarLabel();
  registerLabelMark();
  registerComponentMark();
  Factory.registerComponent(Label.type, Label, true);
};
