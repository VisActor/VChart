import { AttributeLevel, ChartEvent, LayoutZIndex } from '../../constant';
import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import { Brush as BrushComponent, IOperateType as BrushEvent } from '@visactor/vrender-components';
import type { IBounds, IPointLike, Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, isNil, polygonIntersectPolygon, isValid } from '@visactor/vutils';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type {
  IGraphic,
  IGroup,
  INode,
  IPolygon,
  IRectGraphicAttribute,
  ISymbolGraphicAttribute
} from '@visactor/vrender-core';
import { transformToGraphic } from '../../util/style';
import type { ISeries } from '../../series/interface';
import type { IMark } from '../../mark/interface';
import type { IElement } from '@visactor/vgrammar-core';
import type { BrushInteractiveRangeAttr, IBrush, IBrushSpec, selectedItemStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { isEqual } from '@visactor/vutils';
import { Factory } from '../../core/factory';

const IN_BRUSH_STATE = 'inBrush';
const OUT_BRUSH_STATE = 'outOfBrush';

export class Brush<T extends IBrushSpec = IBrushSpec> extends BaseComponent<T> implements IBrush {
  layoutType: 'none' = 'none';
  static type = ComponentTypeEnum.brush;
  type = ComponentTypeEnum.brush;
  name: string = ComponentTypeEnum.brush;

  static specKey = 'brush';
  specKey = 'brush';

  layoutZIndex: number = LayoutZIndex.Brush;

  // brush组件
  protected _brushComponents!: BrushComponent[];
  protected _relativeRegions!: IRegion[];
  protected _linkedSeries: ISeries[] = [];

  private _itemMap: { [regionId: string | number]: IMark[] } = {};
  private _linkedItemMap: { [seriesId: string | number]: IMark[] } = {};

  // 用brushName做分组管理的原因是: 如果有多个brush, 某个图元A brush内, 但在B brush外, 该图元state会被B误变成out of brush。 但其实该图元只有在A brush外才能被判断out of brush
  // 用dict做存储因为方便查找和删减对应图元
  protected _inBrushElementsMap: { [brushName: string]: { [elementKey: string]: IElement } } = {};
  protected _outOfBrushElementsMap: { [elementKey: string]: IElement } = {};
  protected _linkedInBrushElementsMap: { [brushName: string]: { [elementKey: string]: IElement } } = {};
  protected _linkedOutOfBrushElementsMap: { [elementKey: string]: IElement } = {};

  private _needInitOutState: boolean = true;
  private _cacheInteractiveRangeAttrs: BrushInteractiveRangeAttr[] = [];

  private _needDisablePickable: boolean = false;

  init() {
    const inBrushMarkAttr = this._transformBrushedMarkAttr(this._spec.inBrush);
    const outOfBrushMarkAttr = this._transformBrushedMarkAttr(this._spec.outOfBrush);
    // 写入mark state, 便于后续state管理
    this._option.getAllSeries().forEach((s: ISeries) => {
      s.getActiveMarks().forEach((m: IMark) => {
        if (m) {
          s.setMarkStyle(
            m,
            {
              ...inBrushMarkAttr
            },
            IN_BRUSH_STATE,
            AttributeLevel.Series
          );
          s.setMarkStyle(
            m,
            {
              ...outOfBrushMarkAttr
            },
            OUT_BRUSH_STATE,
            AttributeLevel.Series
          );
        }
      });
    });
  }

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const brushSpec = chartSpec[this.specKey];
    // brush不支持数组的形式配置
    if (isNil(brushSpec) || brushSpec.visible === false) {
      return undefined;
    }
    return [
      {
        spec: brushSpec,
        specPath: [this.specKey],
        type: ComponentTypeEnum.brush
      }
    ];
  }

  created() {
    super.created();

    // event
    this.initEvent();
    this._bindRegions();
    this._bindLinkedSeries();
    this._initNeedOperatedItem();
  }

  protected _extendDataInBrush(elementsMap: { [brushName: string]: { [elementKey: string]: IElement } }) {
    const data = [];
    for (const brushName in elementsMap) {
      for (const elementKey in elementsMap[brushName]) {
        data.push(elementsMap[brushName][elementKey].data[0]);
      }
    }
    return data;
  }

  protected _extendDatumOutOfBrush(elementsMap: { [elementKey: string]: IElement }) {
    const data = [];
    for (const elementKey in elementsMap) {
      data.push(elementsMap[elementKey].data[0]);
    }
    return data;
  }

  protected _getBrushInteractiveAttr(region: IRegion) {
    const regionLayoutPosition = region.getLayoutPositionExcludeIndent();
    const regionLayoutRect = region.getLayoutRectExcludeIndent();
    const seriesRegionStartX = regionLayoutPosition.x;
    const seriesRegionEndX = seriesRegionStartX + regionLayoutRect.width;
    const seriesRegionStartY = regionLayoutPosition.y;
    const seriesRegionEndY = seriesRegionStartY + regionLayoutRect.height;
    return {
      interactiveRange: {
        minY: seriesRegionStartY,
        maxY: seriesRegionEndY,
        minX: seriesRegionStartX,
        maxX: seriesRegionEndX
      },
      xRange: [seriesRegionStartX, seriesRegionEndX],
      yRange: [seriesRegionStartY, seriesRegionEndY]
    } as BrushInteractiveRangeAttr;
  }

  protected _updateBrushComponent(region: IRegion, componentIndex: number) {
    const interactiveAttr = this._getBrushInteractiveAttr(region);
    // 布局变化后, 更新可交互范围
    const brushComponent = this._brushComponents[componentIndex];
    brushComponent.setAttributes(interactiveAttr as any);

    // 布局变化后, 更新brush 和 图元状态
    // 方案一:
    // TODO: 更新mask位置（保持选框在画布中的相对位置）
    // TODO: 是否更新mask大小有待商榷（保持选框位置和图元高亮区域一致）

    // 方案二: 清空brushMask 和 图元高亮状态
    this._initMarkBrushState(componentIndex, '');
    brushComponent.children[0].removeAllChild();
    this._needInitOutState = true;
  }

  protected _createBrushComponent(region: IRegion, componentIndex: number) {
    const interactiveAttr = this._getBrushInteractiveAttr(region);
    const brush = new BrushComponent({
      zIndex: this.layoutZIndex,
      brushStyle: transformToGraphic(this._spec?.style),
      ...interactiveAttr,
      ...this._spec,
      disableTriggerEvent: this._option.disableTriggerEvent
    });
    brush.id = this._spec.id ?? `brush-${this.id}`;
    this.getContainer().add(brush as unknown as INode);
    const { brushMode = 'single' } = this._spec;
    this._brushComponents.push(brush);
    this._cacheInteractiveRangeAttrs.push(interactiveAttr);

    brush.addEventListener(BrushEvent.drawStart, (e: any) => {
      this._emitEvent(ChartEvent.brushStart, region);
    });

    brush.addEventListener(BrushEvent.moveStart, (e: any) => {
      this._emitEvent(ChartEvent.brushStart, region);
    });

    brush.addEventListener(BrushEvent.drawing, (e: any) => {
      // 需要重置out状态的情况：
      // _needInitOutState：框选模式为'single' 且 开始后的第一次drawing时（这里不选择drawStart而选择第一次触发drawing的时机是因为点击空白处也会触发drawStart）, 需要重置图元状态
      if (this._needInitOutState && brushMode === 'single') {
        this._initMarkBrushState(componentIndex, OUT_BRUSH_STATE);
      }
      this._needInitOutState = false;
      this._needDisablePickable = true;

      this._handleBrushChange(ChartEvent.brushChange, region, e);
    });

    brush.addEventListener(BrushEvent.moving, (e: any) => {
      this._handleBrushChange(ChartEvent.brushChange, region, e);
    });

    brush.addEventListener(BrushEvent.brushClear, (e: any) => {
      this._initMarkBrushState(componentIndex, '');
      this._needInitOutState = true;
      this._needDisablePickable = false;
      this._handleBrushChange(ChartEvent.brushChange, region, e);
      this._handleBrushChange(ChartEvent.brushClear, region, e);
    });

    brush.addEventListener(BrushEvent.drawEnd, (e: any) => {
      this._needInitOutState = true;
      this._needDisablePickable = false;
      this._handleBrushChange(ChartEvent.brushEnd, region, e);
    });

    brush.addEventListener(BrushEvent.moveEnd, (e: any) => {
      this._handleBrushChange(ChartEvent.brushEnd, region, e);
    });
  }

  private _handleBrushChange(eventType: string, region: IRegion, e: any) {
    const { operateMask } = e.detail as any;
    this._reconfigItem(operateMask, region);
    this._reconfigLinkedItem(operateMask, region);

    this._emitEvent(eventType, region);
  }

  private _emitEvent(eventType: string, region: IRegion) {
    this.event.emit(eventType, {
      model: this,
      value: {
        // 操作类型
        operateType: eventType,
        // 正在操作的region
        operateRegion: region,
        // 在选框内的 element data
        inBrushData: this._extendDataInBrush(this._inBrushElementsMap),
        // 在选框外的 element data
        outOfBrushData: this._extendDatumOutOfBrush(this._outOfBrushElementsMap),
        // 被链接的系列中：在选框内的 element data
        linkInBrushData: this._extendDataInBrush(this._linkedInBrushElementsMap),
        // 被链接的系列中：在选框外的 element data
        linkOutOfBrushData: this._extendDatumOutOfBrush(this._linkedOutOfBrushElementsMap),
        // 在选框内的 vgrammar elements
        inBrushElementsMap: this._inBrushElementsMap,
        // 在选框外的 vgrammar elements
        outOfBrushElementsMap: this._outOfBrushElementsMap,
        // 被链接的系列中：在选框内的 vgrammar elements
        linkedInBrushElementsMap: this._linkedInBrushElementsMap,
        // 被链接的系列中：在选框外的 vgrammar elements
        linkedOutOfBrushElementsMap: this._linkedOutOfBrushElementsMap
      }
    });
  }

  private _transformBrushedMarkAttr(brushedStyle: selectedItemStyle) {
    const styleResult: any = {};
    if (brushedStyle?.symbol) {
      styleResult.symbolType = brushedStyle.symbol;
    }
    if (brushedStyle?.symbolSize) {
      styleResult.size = brushedStyle.symbolSize;
    }
    if (brushedStyle?.color) {
      styleResult.fill = brushedStyle.color;
    }
    if (brushedStyle?.colorAlpha) {
      styleResult.fillOpacity = brushedStyle.colorAlpha;
    }
    return {
      ...transformToGraphic(brushedStyle),
      ...styleResult
    };
  }

  private _reconfigItem(operateMask: IPolygon, region: IRegion) {
    // 遍历图元, 更新状态
    this._itemMap[region.id].forEach((mark: IMark) => {
      const grammarMark = mark.getProduct();
      if (!grammarMark || !grammarMark.elements || !grammarMark.elements.length) {
        return;
      }
      const elements = grammarMark.elements;
      elements.forEach((el: IElement) => {
        const graphicItem = el.getGraphicItem();
        const elementKey = mark.id + '_' + el.key;
        // 判断逻辑:
        // 应该被置为inBrush状态的图元:
        // before: 在out brush elment map, 即不在任何brush中
        // now: 在当前brush图元中

        // 应该被置为outOfBrush状态的图元:
        // before: 在当前brush 的 in brush element map中, 即在当前brush中
        // now: 不在当前brush中
        if (this._outOfBrushElementsMap?.[elementKey] && this._isBrushContainItem(operateMask, graphicItem)) {
          el.addState(IN_BRUSH_STATE);
          if (!this._inBrushElementsMap[operateMask?.name]) {
            this._inBrushElementsMap[operateMask?.name] = {};
          }
          this._inBrushElementsMap[operateMask?.name][elementKey] = el;
          delete this._outOfBrushElementsMap[elementKey];
        } else if (
          this._inBrushElementsMap?.[operateMask?.name]?.[elementKey] &&
          !this._isBrushContainItem(operateMask, graphicItem)
        ) {
          el.removeState(IN_BRUSH_STATE);
          el.addState(OUT_BRUSH_STATE);
          this._outOfBrushElementsMap[elementKey] = el;
          delete this._inBrushElementsMap[operateMask.name][elementKey];
        }
        graphicItem.setAttribute('pickable', !this._needDisablePickable);
      });
    });
  }

  private _reconfigLinkedItem(operateMask: IPolygon, region: IRegion) {
    const regionLayoutPos = region.getLayoutPositionExcludeIndent();
    const seriesId = region.getSeries().map(s => s.id);
    this._linkedSeries.forEach((s: ISeries) => {
      if (!seriesId.includes(s.id)) {
        const sRegionLayoutPos = s.getRegion().getLayoutPositionExcludeIndent();

        const regionOffsetX = sRegionLayoutPos.x - regionLayoutPos.x;
        const regionOffsetY = sRegionLayoutPos.y - regionLayoutPos.y;

        this._linkedItemMap[s.id].forEach((mark: IMark) => {
          const grammarMark = mark.getProduct();
          if (!grammarMark || !grammarMark.elements || !grammarMark.elements.length) {
            return;
          }
          const elements = grammarMark.elements;
          elements.forEach((el: IElement) => {
            const graphicItem = el.getGraphicItem();
            const elementKey = mark.id + '_' + el.key;
            // 判断逻辑:
            // 应该被置为inBrush状态的图元:
            // before: 在out brush elment map, 即不在任何brush中
            // now: 在当前brush图元中

            // 应该被置为outOfBrush状态的图元:
            // before: 在当前brush 的 in brush element map中, 即在当前brush中
            // now: 不在当前brush中
            if (
              this._linkedOutOfBrushElementsMap?.[elementKey] &&
              this._isBrushContainItem(operateMask, graphicItem, { dx: regionOffsetX, dy: regionOffsetY })
            ) {
              el.addState(IN_BRUSH_STATE);
              if (!this._linkedInBrushElementsMap[operateMask?.name]) {
                this._linkedInBrushElementsMap[operateMask?.name] = {};
              }
              this._linkedInBrushElementsMap[operateMask?.name][elementKey] = el;
              delete this._linkedOutOfBrushElementsMap[elementKey];
            } else if (
              this._linkedInBrushElementsMap?.[operateMask?.name]?.[elementKey] &&
              !this._isBrushContainItem(operateMask, graphicItem, { dx: regionOffsetX, dy: regionOffsetY })
            ) {
              el.removeState(IN_BRUSH_STATE);
              el.addState(OUT_BRUSH_STATE);
              this._linkedOutOfBrushElementsMap[elementKey] = el;
            }
            graphicItem.setAttribute('pickable', !this._needDisablePickable);
          });
        });
      }
    });
  }

  private _isBrushContainItem(brushMask: IPolygon, item: IGraphic, linkedOffset?: { dx: number; dy: number }) {
    if (!brushMask?.globalTransMatrix || !brushMask?.attribute?.points) {
      return false;
    }

    // 根据变换矩阵得到brushMask的实际坐标
    const points = brushMask?.attribute?.points ?? [];
    const { a, b, c, d, e, f } = brushMask.globalTransMatrix;

    const dx = linkedOffset?.dx || 0;
    const dy = linkedOffset?.dy || 0;

    const pointsCoord = points.map((p: IPointLike) => {
      return {
        x: a * p.x + c * p.y + e + dx,
        y: b * p.x + d * p.y + f + dy
      };
    });

    brushMask.globalAABBBounds
      .clone()
      .set(
        brushMask.globalAABBBounds.x1 + dx,
        brushMask.globalAABBBounds.y1 + dy,
        brushMask.globalAABBBounds.x2 + dx,
        brushMask.globalAABBBounds.y2 + dy
      );

    // 根据变换矩阵得到item的实际坐标
    const x = item.globalTransMatrix.e;
    const y = item.globalTransMatrix.f;

    // brush与图表图元进行相交 或 包含判断
    let itemBounds: { x: number; y: number }[] = [];
    if (item.type === 'symbol') {
      const { size: itemSize = 0 } = item?.attribute as ISymbolGraphicAttribute;
      const size = array(itemSize)[0] / 2;
      itemBounds = [
        {
          x: x - size,
          y: y - size
        },
        {
          x: x + size,
          y: y - size
        },
        {
          x: x + size,
          y: y + size
        },
        {
          x: x - size,
          y: y + size
        }
      ];
      return polygonIntersectPolygon(pointsCoord, itemBounds);
    } else if (item.type === 'rect') {
      const { x1, x2, y1, y2 } = item?.AABBBounds;
      const width = Math.abs(x1 - x2);
      const height = Math.abs(y1 - y2);
      itemBounds = [
        {
          x: x,
          y: y
        },
        {
          x: x + width,
          y: y
        },
        {
          x: x + width,
          y: y + height
        },
        {
          x: x,
          y: y + height
        }
      ];
      return polygonIntersectPolygon(pointsCoord, itemBounds);
    }
    return brushMask.globalAABBBounds.intersects(item.globalAABBBounds);
  }

  protected _bindRegions() {
    if (isValid(this._spec.regionId) && isValid(this._spec.regionIndex)) {
      this._relativeRegions = this._option.getAllRegions();
    }
    this._relativeRegions = this._option.getRegionsInUserIdOrIndex(
      array(this._spec.regionId),
      array(this._spec.regionIndex)
    );
  }

  protected _bindLinkedSeries() {
    if (isValid(this._spec.brushLinkSeriesId) && isValid(this._spec.brushLinkSeriesIndex)) {
      return;
    }
    this._linkedSeries = this._option.getSeriesInUserIdOrIndex(
      array(this._spec.brushLinkSeriesId),
      array(this._spec.brushLinkSeriesIndex)
    );
  }

  private _initNeedOperatedItem() {
    const seriesUserId = this._spec.seriesId;
    const seriesIndex = this._spec.seriesIndex;
    this._relativeRegions.forEach(r => {
      const allMarks: IMark[] = [];
      r.getSeries().forEach((s: ISeries) => {
        if (
          (seriesUserId && array(seriesUserId).includes(s.userId.toString())) ||
          (seriesIndex && array(seriesIndex).includes(s.getSpecIndex())) ||
          (!seriesIndex && !seriesUserId)
        ) {
          allMarks.push(...s.getMarksWithoutRoot());
        }
        this._itemMap[r.id] = allMarks;
      });
    });

    this._linkedSeries.forEach(s => {
      this._linkedItemMap[s.id] = s.getMarksWithoutRoot();
    });
  }

  protected _initMarkBrushState(componentIndex: number, stateName: string) {
    this._brushComponents.forEach((brush, index) => {
      if (index !== componentIndex) {
        brush.children[0].removeAllChild();
      }
    });

    this._inBrushElementsMap = {};
    this._outOfBrushElementsMap = {};
    this._linkedInBrushElementsMap = {};
    this._linkedOutOfBrushElementsMap = {};

    this._option.getAllSeries().forEach((s: ISeries) => {
      s.getMarksWithoutRoot().forEach((mark: IMark) => {
        const grammarMark = mark.getProduct();
        if (!grammarMark || !grammarMark.elements || !grammarMark.elements.length) {
          return;
        }
        const elements = grammarMark.elements;
        elements.forEach((el: IElement) => {
          const elementKey = mark.id + '_' + el.key;
          el.removeState(IN_BRUSH_STATE);
          el.removeState(OUT_BRUSH_STATE);
          el.addState(stateName);
          this._outOfBrushElementsMap[elementKey] = el;
          this._linkedOutOfBrushElementsMap[elementKey] = el;
        });
      });
    });
  }

  protected initEvent() {
    // do nothing
  }
  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return this._brushComponents as unknown as IGroup[];
  }

  /**
   * updateSpec
   */
  _compareSpec(spec: T, prevSpec: T) {
    if (this._brushComponents) {
      // FIXME: 这个逻辑放在这个方法里不太妥当？
      this._relativeRegions.forEach((region: IRegion, index: number) => {
        this._updateBrushComponent(region, index);
      });
    }
    const result = super._compareSpec(spec, prevSpec);
    if (!isEqual(prevSpec, spec)) {
      result.reRender = true;
      result.reMake = true;
    }
    return result;
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    if (this._option.disableTriggerEvent) {
      return;
    }
    const brushVisible = this._spec.visible ?? true;
    if (brushVisible) {
      // 创建或更新marker组件
      if (!this._brushComponents) {
        this._brushComponents = [];
        this._relativeRegions.forEach((region: IRegion, index: number) => {
          this._createBrushComponent(region, index);
        });
      } else {
        this._relativeRegions.forEach((region: IRegion, index: number) => {
          this._updateBrushComponent(region, index);
        });
      }
    }
  }

  clearGraphic(): void {
    if (this._brushComponents) {
      this._brushComponents.forEach(brush => {
        (brush as any)._container.incrementalClearChild();
      });
    }
  }

  clear(): void {
    if (this._brushComponents) {
      this.getContainer()?.removeChild(this._brushComponents as unknown as INode);
      this._brushComponents.forEach(brush => {
        brush.removeAllChild();
        brush.releaseBrushEvents();
      });
      this._brushComponents = null;
    }
    super.clear();
  }
}

export const registerBrush = () => {
  Factory.registerComponent(Brush.type, Brush);
};
