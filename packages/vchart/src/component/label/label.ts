import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelInitOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import { ChartEvent, LayoutZIndex, VGRAMMAR_HOOK_EVENT } from '../../constant';
import { MarkTypeEnum } from '../../mark/interface';
import { eachSeries, mergeSpec } from '../../util';
import type { ISeries } from '../../series/interface';
import type { IGroupMark, ILabel, IMark } from '@visactor/vgrammar';
import { labelRuleMap, textAttribute } from './util';
import type { IComponentMark } from '../../mark/component';
import { BaseLabelComponent } from './base-label';
import type { LooseFunction } from '@visactor/vutils';
import { isArray, pickWithout } from '@visactor/vutils';
import type { IGroup, IText } from '@visactor/vrender';
import type { LabelItem } from '@visactor/vrender-components';
import type { ILabelSpec } from './interface';
import { VChart } from '../../core';
import { LabelMark, type ILabelMark } from '../../mark/label';
import type { ICompilableMark } from '../../compile/mark';

export interface ILabelInfo {
  baseMark: ICompilableMark;
  labelMark: ILabelMark;
  series: ISeries;
  labelSpec: ILabelSpec;
}

export interface ILabelComponentContext {
  region: IRegion;
  labelInfo: ILabelInfo[];
}

VChart.useMark([LabelMark]);

export class Label<T extends ILabelSpec = ILabelSpec> extends BaseLabelComponent<T> {
  static type = ComponentTypeEnum.label;
  type = ComponentTypeEnum.label;
  name: string = ComponentTypeEnum.label;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Label;

  protected _labelInfoMap: Map<IRegion, ILabelInfo[]>;

  protected _labelComponentMap: Map<IComponentMark, ILabelInfo | ILabelInfo[]>;

  protected _layoutRule: 'series' | 'region';

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this._layoutRule = spec.labelLayout || 'series';
  }

  static createComponent(spec: any, options: IComponentOption) {
    const regions = options.getAllRegions();
    const labelComponents = [];
    for (let i = 0; i < regions.length; i++) {
      const marks = regions[i]
        .getSeries()
        .map(s => s.getMarksWithoutRoot())
        .flat();
      const labelVisible = marks.some(mark => {
        return mark.getLabelSpec()?.some(labelSpec => labelSpec.visible);
      });
      if (labelVisible) {
        labelComponents.push(new Label(spec, { ...options, specIndex: i, specKey: 'label' }));
        continue;
      }
    }
    return labelComponents;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    this.initEvent();
    this._initTextMark();
    this._initLabelComponent();
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

      if (this._option.getChart().getLayoutTag() === false && mark.context?.model === this) {
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
    eachSeries(this._regions, (s: ISeries) => {
      const marks = s.getMarks();
      const region = s.getRegion();

      if (!this._labelInfoMap.get(region)) {
        this._labelInfoMap.set(region, []);
      }
      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];
        if (mark.getLabelSpec()?.length > 0) {
          mark.getLabelSpec().forEach((labelSpec, index) => {
            if (labelSpec.visible) {
              const info = this._labelInfoMap.get(region);
              const labelMark = this._createMark({
                type: MarkTypeEnum.label,
                name: `${mark.name}-label-${index}`
              }) as ILabelMark;
              labelMark.setTarget(mark);
              info.push({ labelMark, baseMark: mark, series: s, labelSpec });
            }
          });
        }
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
            support3d: this._spec.support3d
          }
        );
        if (component) {
          this._marks.addMark(component);
          this._labelComponentMap.set(component, regionLabelInfo);
        }
      } else {
        regionLabelInfo.forEach(labelInfo => {
          const component = this._createMark(
            { type: MarkTypeEnum.component, name: `${labelInfo.labelMark.name}-component` },
            {
              componentType: 'label',
              support3d: labelInfo.baseMark.getSupport3d()
            }
          );
          if (component) {
            this._marks.addMark(component);
            this._labelComponentMap.set(component, labelInfo);
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
        this.initMarkStyleWithSpec(labelMark, labelSpec);
        series.initLabelMarkStyle?.(labelMark);
      });
    });
  }

  updateLayoutAttribute(): void {
    super.updateLayoutAttribute();
    this._labelComponentMap.forEach((labelInfo, labelComponent) => {
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
      labelInfo[0]
    );
  }

  protected _updateSingleLabelAttribute(labelInfo: ILabelInfo, labelComponent: IComponentMark) {
    const { baseMark } = labelInfo;
    this._updateLabelComponentAttribute(labelComponent.getProduct() as ILabel, baseMark.getProduct(), labelInfo);
  }

  protected _updateLabelComponentAttribute(component: ILabel, target: IMark | IMark[], labelInfo: ILabelInfo) {
    const { baseMark, labelSpec, series, labelMark } = labelInfo;
    const dependCmp = this._option.getAllComponents().filter(cmp => cmp.type === 'totalLabel');
    component
      .target(target)
      .configure({ interactive: false })
      .depend(dependCmp.map(cmp => cmp.getMarks()[0].getProduct()))
      .labelStyle(() => {
        const rule = labelMark.getRule() || baseMark.type;
        const configFunc = labelRuleMap[rule] ?? labelRuleMap.point;
        const interactive = this._interactiveConfig(labelSpec);
        const passiveLabelSpec = pickWithout(labelSpec, ['position', 'style', 'state']);
        /** arc label When setting the centerOffset of the spec, the label also needs to be offset accordingly, and the centerOffset is not in the labelSpec */
        const centerOffset = this._spec?.centerOffset ?? 0;
        return mergeSpec(
          {
            textStyle: { pickable: labelSpec.interactive === true, ...labelSpec.style },
            overlap: {
              avoidMarks: this._option
                .getAllComponents()
                .filter(cmp => cmp.type === 'totalLabel')
                .map(cmp => cmp.getMarks()[0].getProductId())
            }
          },
          configFunc(labelInfo),
          {
            ...passiveLabelSpec,
            ...interactive,
            centerOffset
          }
        );
      })
      .encode(datum => {
        return textAttribute(labelInfo, datum, labelSpec.formatMethod);
      })
      .size(() => series.getRegion().getLayoutRect());
  }

  compileMarks() {
    this.getMarks().forEach(m => {
      const labelInfo = this._labelComponentMap.get(m);
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
}
