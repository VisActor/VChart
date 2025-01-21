import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelInitOption, IModelSpecInfo } from '../../model/interface';
import { STACK_FIELD_TOTAL_BOTTOM, STACK_FIELD_TOTAL_TOP } from '../../constant/data';
import { ChartEvent, VGRAMMAR_HOOK_EVENT } from '../../constant/event';
import { AttributeLevel } from '../../constant/attribute';
import { LayoutZIndex } from '../../constant/layout';
import type { IComponentMark, ILabelMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import { mergeSpec } from '@visactor/vutils-extension';
import { eachSeries } from '../../util/model';
import type { ISeries, SeriesMarkNameEnum } from '../../series/interface';
import type { IGroupMark, ILabel, IMark as IVGrammarMark } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import { registerLabel as registerVGrammarLabel } from '@visactor/vgrammar-core';
import { defaultLabelConfig, textAttribute } from './util';
// eslint-disable-next-line no-duplicate-imports
import { registerComponentMark } from '../../mark/component';
import { BaseLabelComponent } from './base-label';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, isArray, isFunction, isValid, pickWithout } from '@visactor/vutils';
import type { ILabelInfo, ILabelSpec, TransformedLabelSpec } from './interface';
import { Factory } from '../../core/factory';
// eslint-disable-next-line no-duplicate-imports
import { registerLabelMark } from '../../mark/label';
import type { IChartSpecInfo } from '../../chart/interface';
import type { IChartSpec } from '../../typings';
import { LabelSpecTransformer } from './label-transformer';
import type { IGraphic } from '@visactor/vrender-core';

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
      if (hasVisibleLabel) {
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
        markLabelSpec[markName as SeriesMarkNameEnum].forEach((spec: TransformedLabelSpec, index: number) => {
          if (spec.visible) {
            const info = this._labelInfoMap.get(region);
            const labelMark = this._createMark(
              {
                type: MarkTypeEnum.label,
                name: `${markName}-label-${index}`
              },
              { noSeparateStyle: true, attributeContext: series.getMarkAttributeContext() }
            ) as ILabelMark;
            if (spec.showRelatedMarkTooltip) {
              series.tooltipHelper?.activeTriggerSet.mark?.add(labelMark);
            }
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
            noSeparateStyle: true
          },
          {
            support3d: (this._spec as any).support3d
          }
        );
        if (component) {
          component.setSkipBeforeLayouted(true);

          if (regionLabelInfo[0] && isValid(regionLabelInfo[0].labelSpec.zIndex)) {
            component.setMarkConfig({ zIndex: regionLabelInfo[0].labelSpec.zIndex });
          }
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
              noSeparateStyle: true
            },
            {
              support3d: labelInfo.baseMark.getMarkConfig().support3d
            }
          );
          if (component) {
            if (isValid(labelInfo.labelSpec.zIndex)) {
              component.setMarkConfig({ zIndex: labelInfo.labelSpec.zIndex });
            }

            component.setSkipBeforeLayouted(true);
            this._marks.addMark(component);
            this._labelComponentMap.set(component, () => {
              return this._labelInfoMap.get(region)[i];
            });
          }
        });
      }
    });
  }

  protected _initTextMarkStyle() {
    this._labelComponentMap.forEach((labelInfoCb, labelComponent) => {
      const labelInfoArray = array(labelInfoCb());
      labelInfoArray.forEach(({ labelMark }) => {
        labelMark.setComponent(labelComponent);
      });
    });
    this._labelInfoMap.forEach(labelInfos => {
      labelInfos.forEach(info => {
        const { labelMark, labelSpec, series } = info;
        this.initMarkStyleWithSpec(labelMark, labelSpec, undefined);
        if (isFunction(labelSpec?.getStyleHandler)) {
          const styleHandler = labelSpec.getStyleHandler(series);
          styleHandler?.call(series, labelMark, labelSpec);
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
          const { labelSpec, labelMark, series } = labelInfo;
          const rule = labelMark.getRule();
          const interactive = this._interactiveConfig(labelSpec);
          /** arc label When setting the centerOffset of the spec, the label also needs to be offset accordingly, and the centerOffset is not in the labelSpec */
          const centerOffset = (this._spec as any)?.centerOffset ?? 0;
          let spec = mergeSpec(
            {
              textStyle: { pickable: labelSpec.interactive === true, ...labelSpec.style },
              overlap: {
                avoidMarks: dependCmp.map(cmp => cmp.getMarks()[0].getProductId())
              }
            },
            defaultLabelConfig(rule, labelInfo),
            {
              ...pickWithout(labelSpec, [
                'position',
                'style',
                'state',
                'type',
                'stackDataFilterType',
                'getStyleHandler'
              ]),
              ...interactive,
              centerOffset
            },
            labelSpec.stackDataFilterType
              ? {
                  dataFilter:
                    labelSpec.stackDataFilterType === 'min'
                      ? (data: any) => {
                          return data.filter((d: any) => d.data[STACK_FIELD_TOTAL_BOTTOM]);
                        }
                      : (data: any) => {
                          return data.filter((d: any) => d.data[STACK_FIELD_TOTAL_TOP]);
                        }
                }
              : {}
          );

          if (series && series.parseLabelStyle) {
            spec = series.parseLabelStyle(spec, labelSpec, labelMark);
          }
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
      m.compile({ group, context: { model: this, labelInfo } });
    });
  }

  getVRenderComponents() {
    const labels: any[] = [];
    this._labelComponentMap.forEach((infoFunc, component) => {
      const graphicItem = component.getProduct().getGroupGraphicItem();
      if (graphicItem) {
        labels.push(graphicItem);
      }
    });
    return labels;
  }

  getLabelInfoByTextGraphic(text: IGraphic): ILabelInfo {
    let labelInfo: ILabelInfo;
    const vrenderLabel = text?.parent;
    const vrenderDataLabel = vrenderLabel?.parent;
    if (vrenderDataLabel) {
      const labelIndex = vrenderDataLabel.getChildren().indexOf(vrenderLabel as any);
      this._labelComponentMap.forEach((infoFunc, component) => {
        const graphicItem = component.getProduct().getGroupGraphicItem();
        if (graphicItem === vrenderDataLabel) {
          labelInfo = array(infoFunc())[labelIndex];
        }
      });
    }
    return labelInfo;
  }
}

export const registerLabel = () => {
  registerVGrammarLabel();
  registerLabelMark();
  registerComponentMark();
  Factory.registerComponent(Label.type, Label, true);
};
