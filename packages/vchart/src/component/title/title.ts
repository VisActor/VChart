import { LayoutLevel, LayoutZIndex } from '../../constant';
import { Factory } from '../../core/factory';
import type { IRegion } from '../../region/interface';
import type { IPoint, IOrientType, ILayoutType, ILayoutRect } from '../../typings';
import { isValidOrient } from '../../util/space';
import { BaseComponent } from '../base/base-component';
// eslint-disable-next-line no-duplicate-imports
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { ITitle, ITitleSpec, ITitleTheme } from './interface';
import { Title as TitleComponents } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { TitleAttrs } from '@visactor/vrender-components';
import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import { isEqual, isArray, isValidNumber, pickWithout } from '@visactor/vutils';

export class Title extends BaseComponent<ITitleSpec> implements ITitle {
  static type = ComponentTypeEnum.title;
  type = ComponentTypeEnum.title;
  static specKey = ComponentTypeEnum.title;
  specKey: string = ComponentTypeEnum.title;

  layoutType: ILayoutType = 'normal';
  layoutZIndex: number = LayoutZIndex.Title;
  layoutLevel: number = LayoutLevel.Title;

  protected declare _theme: ITitleTheme;

  protected _orient: IOrientType = 'top';

  private _titleComponent: TitleComponents;
  private _cacheAttrs: TitleAttrs;

  get orient() {
    return this._orient;
  }

  constructor(spec: ITitleSpec, options: IComponentOption) {
    super(spec, options);
    this._orient = isValidOrient(spec.orient) ? spec.orient : 'top';
  }

  initLayout(): void {
    super.initLayout();
    this._layout && (this._layout.layoutOrient = this._orient);
  }

  static createComponent(spec: any, options: IComponentOption) {
    const titleSpec = spec.title;
    if (!titleSpec || titleSpec.visible === false) {
      return null;
    }
    if (!isArray(titleSpec)) {
      return new Title(titleSpec, options);
    }
    const titles: Title[] = [];
    titleSpec.forEach((s: any, i: number) => {
      if (s.visible !== false) {
        titles.push(new Title(s, { ...options, specIndex: i }));
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
  _compareSpec() {
    const result = super._compareSpec();
    if (this._originalSpec?.orient !== this._spec?.orient) {
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

  afterSetLayoutStartPoint(pos: IPoint): void {
    if (isValidNumber(pos.x)) {
      this._titleComponent && this._titleComponent.setAttribute('x', pos.x);
    }
    if (isValidNumber(pos.y)) {
      this._titleComponent && this._titleComponent.setAttribute('y', pos.y);
    }
    super.afterSetLayoutStartPoint(pos);
  }

  getBoundsInRect(rect: ILayoutRect) {
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
    // 当 width 小于 0 时，设置为 0，负数场景容易引起不可预知的问题
    const realWidth = Math.max(0, this._spec.width ?? this.getLayoutRect().width);
    return {
      ...pickWithout(this._spec, ['padding']),
      textType: this._spec.textType ?? 'text',
      text: this._spec.text ?? '',
      subtextType: this._spec.subtextType ?? 'text',
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
        ...this._spec.textStyle
      },
      subtextStyle: {
        width: realWidth,
        ...this._spec.subtextStyle
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
      title.on('*', (event: any, type: string) => this._delegateEvent(title as unknown as IGraphic, event, type));
    }
    this._cacheAttrs = attrs;
    return this._titleComponent;
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._titleComponent] as unknown as IGroup[];
  }

  clear(): void {
    super.clear();
    this._cacheAttrs = null;
  }
}

export const registerTitle = () => {
  Factory.registerComponent(Title.type, Title);
};
