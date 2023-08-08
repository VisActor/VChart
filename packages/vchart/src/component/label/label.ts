import { BaseComponent } from '../base';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelInitOption, IModelRenderOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import { ChartEvent, LayoutZIndex, VGRAMMAR_HOOK_EVENT } from '../../constant';
import { MarkTypeEnum, type IMark } from '../../mark/interface';
import type { ITextMark } from '../../mark/text';
import { eachSeries, merge } from '../../util';
import type { ISeries } from '../../series/interface';
import type { IGroupMark, IView } from '@visactor/vgrammar';
import { markLabelConfigFunc, textAttribute } from './util';
import type { IComponentMark } from '../../mark/component';
import type { ILabelSpec } from './interface';
import type { IHoverSpec, ISelectSpec } from '../../interaction/interface';

export interface ILabelInfo {
  baseMark: IMark;
  labelMark: ITextMark;
  series: ISeries;
}

export interface ILabelComponentContext {
  region: IRegion;
  labelInfo: ILabelInfo[];
}

export class Label extends BaseComponent {
  static type = ComponentTypeEnum.label;
  type = ComponentTypeEnum.label;
  name: string = ComponentTypeEnum.label;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Label;

  protected _labelInfo: Map<IRegion, ILabelInfo[]>;

  protected _labelComponentMap: Map<IComponentMark, ILabelComponentContext>;

  protected _layoutRule: 'series' | 'region';

  constructor(spec: any, options: IComponentOption) {
    super(spec, options);
    this._regions = options.getRegionsInIndex([options.specIndex]);
    this.layoutBindRegionID = this._regions.map(x => x.id);
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
        labelComponents.push(new Label(spec, { ...options, specIndex: i }));
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
  protected _interactiveConfig(labelSpec: ILabelSpec) {
    const { interactive } = labelSpec;
    if (interactive !== true) {
      return { hover: false, select: false };
    }
    const result = { hover: false, select: false, state: labelSpec.state };

    const { hover, select } = this._option.getChart().getSpec();
    if (hover !== false || (hover as unknown as IHoverSpec).enable !== false) {
      result.hover = true;
    }
    if (select !== false || (select as unknown as ISelectSpec).enable !== false) {
      result.select = true;
    }
    return result;
  }

  setLayoutStartPosition() {
    // do nothing
  }

  updateLayoutAttribute(): void {
    super.updateLayoutAttribute();
    this._labelComponentMap.forEach(({ region, labelInfo }, labelComponent) => {
      const baseMarks = labelInfo.map(info => info.baseMark);
      const component = labelComponent.getProduct() as ReturnType<IView['label']>;
      component
        .target(baseMarks.map(mark => mark.getProduct()))
        .configure({ interactive: false })
        .labelStyle(mark => {
          const markId = mark.context.markId;
          const baseMark = this._option.getChart().getMarkById(markId);
          if (baseMark) {
            const configFunc = markLabelConfigFunc[baseMark.type] ?? markLabelConfigFunc.symbol;
            const labelSpec = baseMark.getLabelSpec() ?? {};
            const interactive = this._interactiveConfig(labelSpec);
            return merge(
              {
                textStyle: { pickable: labelSpec.interactive === true }
              },
              configFunc(labelInfo[baseMarks.findIndex(mark => mark === baseMark)]),
              {
                ...labelSpec,
                ...interactive
              }
            );
          }
        })
        .encode((datum, element) => {
          const markId = element.mark.context.markId;
          const baseMark = this._option.getChart().getMarkById(markId);
          return textAttribute(labelInfo[baseMarks.findIndex(mark => mark === baseMark)], datum);
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

  /** Update API **/
  updateSpec(spec: any) {
    const result = super.updateSpec(spec);
    result.reRender = true;
    result.reMake = true;
    return result;
  }

  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  clear(): void {
    super.clear();

    this._labelComponentMap.forEach((context, mark) => {
      if (mark.getProduct()) {
        mark.getProduct().release();
      }
    });
  }
}
