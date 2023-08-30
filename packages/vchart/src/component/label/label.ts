import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelInitOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import { ChartEvent, LayoutZIndex, VGRAMMAR_HOOK_EVENT } from '../../constant';
import { MarkTypeEnum, type IMark } from '../../mark/interface';
import type { ITextMark } from '../../mark/text';
import { eachSeries, mergeSpec } from '../../util';
import type { ISeries } from '../../series/interface';
import type { IGroupMark, IView } from '@visactor/vgrammar';
import { markLabelConfigFunc, textAttribute } from './util';
import type { IComponentMark } from '../../mark/component';
import { BaseLabelComponent } from './base-label';
import type { LooseFunction } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { pickWithout } from '@visactor/vutils';
import type { IGroup, IText } from '@visactor/vrender';
import type { LabelItem } from '@visactor/vrender-components';
import type { ILabelSpec } from './interface';

export interface ILabelInfo {
  baseMark: IMark;
  labelMark: ITextMark;
  series: ISeries;
}

export interface ILabelComponentContext {
  region: IRegion;
  labelInfo: ILabelInfo[];
}

export class Label<T extends ILabelSpec = ILabelSpec> extends BaseLabelComponent<T> {
  static type = ComponentTypeEnum.label;
  type = ComponentTypeEnum.label;
  name: string = ComponentTypeEnum.label;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Label;

  protected _labelInfo: Map<IRegion, ILabelInfo[]>;

  protected _labelComponentMap: Map<IComponentMark, ILabelComponentContext>;

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
      const labelVisible = marks.some(mark => mark.getLabelSpec()?.visible === true);
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
    if (!this._labelInfo) {
      this._labelInfo = new Map();
    }

    if (!this._labelComponentMap) {
      this._labelComponentMap = new Map();
    }
    eachSeries(this._regions, (s: ISeries) => {
      const marks = s.getMarks();
      const region = s.getRegion();

      if (!this._labelInfo.get(region)) {
        this._labelInfo.set(region, []);
      }
      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];
        if (mark.getLabelSpec()?.visible) {
          const info = this._labelInfo.get(region);
          const labelMark = this._createMark({ type: MarkTypeEnum.text, name: `${mark.name}-label` });
          this.initMarkStyleWithSpec(labelMark, mark.getLabelSpec());
          s.initLabelMarkStyle?.(labelMark);
          const labelInfo = { labelMark, baseMark: mark, series: s };
          info.push(labelInfo);
        }
      }
    });
  }

  protected _initLabelComponent() {
    this._labelInfo.forEach((regionLabelInfo, region) => {
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
          this._labelComponentMap.set(component, { region, labelInfo: regionLabelInfo });
        }
      } else {
        regionLabelInfo.forEach(labelInfo => {
          const component = this._createMark(
            { type: MarkTypeEnum.component, name: `${labelInfo.labelMark.name}-component` },
            {
              componentType: 'label',
              support3d: this._spec.support3d
            }
          );
          if (component) {
            this._marks.addMark(component);
            this._labelComponentMap.set(component, { region, labelInfo: [labelInfo] });
          }
        });
      }
    });
  }

  updateLayoutAttribute(): void {
    super.updateLayoutAttribute();
    this._labelComponentMap.forEach(({ region, labelInfo }, labelComponent) => {
      const baseMarks = labelInfo.map(info => info.baseMark);
      const component = labelComponent.getProduct() as ReturnType<IView['label']>;
      const dependCmp = this._option.getAllComponents().filter(cmp => cmp.type === 'totalLabel');

      component
        .target(baseMarks.map(mark => mark.getProduct()))
        .configure({ interactive: false })
        .depend(dependCmp.map(cmp => cmp.getMarks()[0].getProduct()))
        .labelStyle(mark => {
          const markId = mark.context.markId;
          const baseMark = this._option.getChart().getMarkById(markId);
          if (baseMark) {
            const configFunc = markLabelConfigFunc[baseMark.type] ?? markLabelConfigFunc.symbol;
            const labelSpec = baseMark.getLabelSpec() ?? {};
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
              configFunc(labelInfo[baseMarks.findIndex(mark => mark === baseMark)]),
              {
                ...passiveLabelSpec,
                ...interactive,
                centerOffset,
                pickable: false
              }
            );
          }
        })
        .encode((datum, element) => {
          const markId = element.mark.context.markId;
          const baseMark = this._option.getChart().getMarkById(markId);
          return textAttribute(
            labelInfo[baseMarks.findIndex(mark => mark === baseMark)],
            datum,
            baseMark.getLabelSpec()?.formatMethod
          );
        })
        .size(() => region.getLayoutRect());
    });
  }

  compileMarks() {
    this.getMarks().forEach(m => {
      const group = this._labelComponentMap.get(m).region.getGroupMark().getProduct() as IGroupMark;
      m.compile({ group });
      m.getProduct()?.configure({
        context: {
          model: this
        }
      });
    });
  }
}
