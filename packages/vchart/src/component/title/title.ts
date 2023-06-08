import { BaseComponent } from '../base';
import { ComponentTypeEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import type { IComponentOption } from '../interface';
import { isArray, merge, isValidNumber, isValidOrient } from '../../util';
import type { ITitle, ITitleSpec, ITitleTheme } from './interface';
import type { IRegion } from '../../region/interface';
import type { ILayoutRect } from '../../model/interface';
import { Title as TitleComponents } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { TitleAttrs } from '@visactor/vrender-components';
import type { INode } from '@visactor/vrender';
import type { IPoint, IOrientType } from '../../typings';
import { transformFillAndStroke } from './utils';
import { isEqual } from '@visactor/vutils';
import type { LayoutItem } from '../../model/layout-item';
import { LayoutLevel, LayoutZIndex } from '../../constant';

export class Title extends BaseComponent implements ITitle {
  static type = ComponentTypeEnum.title;

  layoutType: LayoutItem['layoutType'] = 'normal';
  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Title;
  layoutLevel: number = LayoutLevel.Title;

  protected declare _spec: ITitleSpec;
  protected declare _theme: ITitleTheme;

  protected _orient: IOrientType = 'top';

  private _titleComponent: TitleComponents;
  private _cacheAttrs: TitleAttrs;

  get orient() {
    return this._orient;
  }

  get layoutOrient() {
    return this._layoutOrient;
  }

  set layoutOrient(v: IOrientType) {
    this._orient = v;
    this._layoutOrient = v;
  }

  constructor(spec: ITitleSpec, options: IComponentOption) {
    super(spec, {
      ...options
    });
    this._orient = isValidOrient(spec.orient) ? spec.orient : 'top';
    this._layoutOrient = this._orient;
  }

  static createComponent(spec: any, options: IComponentOption) {
    const titleSpec = spec.title;
    if (!titleSpec || titleSpec.visible === false) {
      return null;
    }
    if (!isArray(titleSpec)) {
      return new Title(titleSpec, { ...options, specKey: 'title' });
    }
    const titles: Title[] = [];
    titleSpec.forEach((s: any, i: number) => {
      if (s.visible !== false) {
        titles.push(new Title(s, { ...options, specIndex: i, specKey: 'title' }));
      }
    });
    return titles;
  }

  onRender(ctx: any): void {
    // do nothing
  }

  /**
   * updateSpec
   */
  updateSpec(spec: any) {
    const originalSpec = this._originalSpec;
    const result = super.updateSpec(spec);
    if (originalSpec.orient !== spec.orient) {
      result.reMake = true;
    }

    result.change = true;
    result.reRender = true;
    return result;
  }

  // region
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  update(ctx: IComponentOption) {
    // TODO
  }

  resize(ctx: IComponentOption) {
    // TODO
  }

  setLayoutStartPosition(pos: Partial<IPoint>): void {
    const { x, y } = pos;
    if (isValidNumber(x)) {
      this._titleComponent && this._titleComponent.setAttribute('x', x);
    }
    if (isValidNumber(y)) {
      this._titleComponent && this._titleComponent.setAttribute('y', y);
    }
    super.setLayoutStartPosition({ x, y });
  }

  boundsInRect(rect: ILayoutRect) {
    let result: Partial<ILayoutRect> = {};
    this.setLayoutRect(rect);

    const attrs = this._getTitleAttrs();
    this._createOrUpdateTitleComponent(attrs);

    result = this._getTitleLayoutRect();
    const { x, y } = this.getLayoutStartPoint();
    return {
      x1: x,
      y1: y,
      x2: x + result.width,
      y2: y + result.height
    };
  }

  private _getTitleLayoutRect() {
    const titleBounds = this._titleComponent.AABBBounds;
    const width = this._spec.width ? this._spec.width : isValidNumber(titleBounds.width()) ? titleBounds.width() : 0;
    const height = this._spec.height
      ? this._spec.height
      : isValidNumber(titleBounds.height())
      ? titleBounds.height()
      : 0;
    return {
      width,
      height
    };
  }

  private _getTitleAttrs() {
    const realWidth = this._spec.width ?? this.getLayoutRect().width;
    return {
      text: this._spec.text ?? '',
      subtext: this._spec.subtext ?? '',
      x: this._spec.x ?? 0,
      y: this._spec.y ?? 0,
      width: realWidth,
      height: this._spec.height,
      minWidth: this._spec.minWidth,
      maxWidth: this._spec.maxWidth,
      minHeight: this._spec.minHeight,
      maxHeight: this._spec.maxHeight,
      padding: this._spec.innerPadding,
      align: this._spec.align ?? 'left',
      verticalAlign: this._spec.verticalAlign ?? 'top',
      textStyle: {
        width: realWidth,
        ...transformFillAndStroke({
          style: merge({}, this._spec.textStyle)
        }).style
      },
      subtextStyle: {
        width: realWidth,
        ...transformFillAndStroke({
          style: merge({}, this._spec.subtextStyle)
        }).style
      }
    } as TitleAttrs;
  }

  private _createOrUpdateTitleComponent(attrs: TitleAttrs): TitleComponents {
    if (this._titleComponent) {
      if (!isEqual(attrs, this._cacheAttrs)) {
        this._titleComponent.setAttributes(attrs);
      }
    } else {
      const container = this.getContainer();
      const title = new TitleComponents(attrs);
      title.name = 'title';
      container.add(title as unknown as INode);
      this._titleComponent = title;
      // 代理 title 组件上的事件
      title.on('*', (event: any, type: string) => this._delegateEvent(title as unknown as INode, event, type));
    }
    this._cacheAttrs = attrs;
    return this._titleComponent;
  }

  clear(): void {
    super.clear();
    this._titleComponent = null;
    this._cacheAttrs = null;
  }

  reInit() {
    super.reInit();
    this._initTheme();
  }
}
