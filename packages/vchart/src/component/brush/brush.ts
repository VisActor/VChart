import type { DataView } from '@visactor/vdataset';
import { ChartEvent, LayoutZIndex } from '../../constant';
import type { LayoutItem } from '../../model/layout-item';
import { BaseComponent } from '../base';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { Brush as BrushComponent } from '@visactor/vrender-components';
import type { IBounds, IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, polygonContainPoint, isNil, polygonIntersectPolygon, isValid } from '@visactor/vutils';
import type { IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { IGraphic, INode, IPolygon, IRectGraphicAttribute } from '@visactor/vrender';
import { transformToGraphic } from '../../util/style';
import type { ISeries } from '../../series/interface';
import type { IMark } from '../../mark/interface';
import type { IElement } from '@visactor/vgrammar';
import type { IBrush, selectedItemStyle } from './interface';

export class Brush extends BaseComponent implements IBrush {
  layoutType: LayoutItem['layoutType'] = 'absolute';
  static type = ComponentTypeEnum.brush;
  type = ComponentTypeEnum.brush;
  name: string = ComponentTypeEnum.brush;

  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.Brush;

  static speckey = 'inBrush';

  // brush组件
  protected _brushComponents: BrushComponent[] = [];
  protected _relativeRegions!: IRegion[];
  protected _linkedSeries: ISeries[] = [];

  private _itemMap: { [regionId: string | number]: IMark[] } = {};
  private _linkedItemMap: { [seriesId: string | number]: IMark[] } = {};

  // 用brushName做分组管理的原因是: 如果有多个brush, 某个图元A brush内, 但在B brush外, 该图元state会被B误变成out of brush。 但其实该图元只有在A brush外才能被判断out of brush
  // 用dict做存储因为方便查找和删减对应图元
  protected _inBrushElementsMap: { [brushName: string]: { [elementKey: string]: IElement } } = {};
  protected _outOfBrushElementsMap: { [key in string]: { [elementKey: string]: IElement } } = {};
  protected _linkedInBrushElementsMap: { [brushName: string]: { [elementKey: string]: IElement } } = {};
  protected _linkedOutOfBrushElementsMap: { [key in string]: { [elementKey: string]: IElement } } = {};

  // FIXME: @chensiji 为了只执行一次initState
  private _isFirstState: boolean = true;

  static createComponent(spec: any, options: IComponentOption) {
    const brushSpec = spec.brush || options.defaultSpec;
    // brush不支持数组的形式配置
    if (isNil(brushSpec) || brushSpec.visible === false) {
      return undefined;
    }
    return [new Brush(brushSpec, { ...options, specKey: Brush.speckey })];
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

  protected _extendDatumOutOfBrush(elementsMap: { [key in string]: { [elementKey: string]: IElement } }) {
    const data = {};
    for (const key in elementsMap) {
      data[key] = [];
      for (const elementKey in elementsMap[key]) {
        data[key].push(elementsMap[key][elementKey].data[0]);
      }
    }
    return data;
  }

  protected _createBrushComponent(region: IRegion, componentIndex: number) {
    const seriesRegionStartX = region.getLayoutStartPoint().x;
    const seriesRegionEndX = seriesRegionStartX + region.getLayoutRect().width;
    const seriesRegionStartY = region.getLayoutStartPoint().y;
    const seriesRegionEndY = seriesRegionStartY + region.getLayoutRect().height;
    const brush = new BrushComponent({
      zIndex: this.layoutZIndex,
      brushStyle: transformToGraphic(this._spec?.style),
      interactiveRange: {
        minY: seriesRegionStartY,
        maxY: seriesRegionEndY,
        minX: seriesRegionStartX,
        maxX: seriesRegionEndX
      },
      xRange: [seriesRegionStartX, seriesRegionEndX],
      yRange: [seriesRegionStartY, seriesRegionEndY],
      ...this._spec
    });

    brush.id = this._spec.id ?? `brush-${this.id}`;
    this.getContainer().add(brush as unknown as INode);

    const { brushMode = 'single', removeOnClick = true } = this._spec;
    brush.setUpdateDragMaskCallback(
      (operateParams: {
        operateType: string;
        operateMask: IPolygon;
        operatedMaskAABBBounds: { [name: string]: IBounds };
      }) => {
        const { operateType, operateMask } = operateParams;
        // 需要重置状态的情况：
        // 1. 组件第一次创建时, 前提是有 VGrammarMark, 目前只找到这个时机, 为了标记是否执行过, 添加_stateTag来识别
        // 2. 框选模式为'single' 且 removeOnClick 为true时, 单击会清空之前所有的mask, 此时也需要重置图元状态
        if (this._isFirstState || (brushMode === 'single' && removeOnClick && operateType === 'drawStart')) {
          this._initMarkBrushState(componentIndex);
        }

        this._reconfigItem(operateMask, region);
        this._reconfigLinkedItem(operateMask, region);

        let eventType: string = ChartEvent.brushChange;
        if (operateType === 'brushStart' || operateType === 'brushDown') {
          eventType = ChartEvent.brushStart;
        } else if (operateType === 'brushEnd' || operateType === 'brushMaskUp') {
          eventType = ChartEvent.brushEnd;
        } else {
          eventType = ChartEvent.brushChange;
        }

        this.event.emit(eventType, {
          model: this,
          value: {
            // 操作类型
            operateType,
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
    );
    this._brushComponents.push(brush);
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

        // 判断逻辑:
        // 应该被置为inBrush状态的图元:
        // before: 在out brush elment map, 即不在任何brush中
        // now: 在当前brush图元中

        // 应该被置为outOfBrush状态的图元:
        // before: 在当前brush 的 in brush element map中, 即在当前brush中
        // now: 不在当前brush中
        if (this._outOfBrushElementsMap?.[mark.id]?.[el.key] && this._isBrushContainItem(operateMask, graphicItem)) {
          graphicItem.addState('inBrush');
          if (!this._inBrushElementsMap[operateMask?.name]) {
            this._inBrushElementsMap[operateMask?.name] = {};
          }
          this._inBrushElementsMap[operateMask?.name][el.key] = el;
          delete this._outOfBrushElementsMap[mark.id][el.key];
        } else if (
          this._inBrushElementsMap?.[operateMask?.name]?.[el.key] &&
          !this._isBrushContainItem(operateMask, graphicItem)
        ) {
          graphicItem.removeState('inBrush');
          graphicItem.addState('outOfBrush');
          this._outOfBrushElementsMap[mark.id][el.key] = el;
          delete this._inBrushElementsMap[operateMask.name][el.key];
        }
      });
    });
  }

  private _reconfigLinkedItem(operateMask: IPolygon, region: IRegion) {
    const seriesId = region.getSeries().map(s => s.id);
    this._linkedSeries.forEach((s: ISeries) => {
      if (!seriesId.includes(s.id)) {
        const regionOffsetX = s.getRegion().getLayoutStartPoint().x - region.getLayoutStartPoint().x;
        const regionOffsetY = s.getRegion().getLayoutStartPoint().y - region.getLayoutStartPoint().y;

        this._linkedItemMap[s.id].forEach((mark: IMark) => {
          const grammarMark = mark.getProduct();
          if (!grammarMark || !grammarMark.elements || !grammarMark.elements.length) {
            return;
          }
          const elements = grammarMark.elements;
          elements.forEach((el: IElement) => {
            const graphicItem = el.getGraphicItem();
            // 判断逻辑:
            // 应该被置为inBrush状态的图元:
            // before: 在out brush elment map, 即不在任何brush中
            // now: 在当前brush图元中

            // 应该被置为outOfBrush状态的图元:
            // before: 在当前brush 的 in brush element map中, 即在当前brush中
            // now: 不在当前brush中
            if (
              this._linkedOutOfBrushElementsMap?.[mark.id]?.[el.key] &&
              this._isBrushContainItem(operateMask, graphicItem, { dx: regionOffsetX, dy: regionOffsetY })
            ) {
              graphicItem.addState('inBrush');
              if (!this._linkedInBrushElementsMap[operateMask?.name]) {
                this._linkedInBrushElementsMap[operateMask?.name] = {};
              }
              this._linkedInBrushElementsMap[operateMask?.name][el.key] = el;
              delete this._linkedOutOfBrushElementsMap[mark.id][el.key];
            } else if (
              this._linkedInBrushElementsMap?.[operateMask?.name]?.[el.key] &&
              !this._isBrushContainItem(operateMask, graphicItem, { dx: regionOffsetX, dy: regionOffsetY })
            ) {
              graphicItem.removeState('inBrush');
              graphicItem.addState('outOfBrush');
              this._linkedOutOfBrushElementsMap[mark.id][el.key] = el;
            }
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

    const globalAABBBoundsOffset = brushMask.globalAABBBounds
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
    if (item.type === 'symbol') {
      return globalAABBBoundsOffset.contains(x, y) && polygonContainPoint(pointsCoord, x, y);
    } else if (item.type === 'rect') {
      const { width = 0, height = 0 } = item?.attribute as IRectGraphicAttribute;
      const pointsRect = [
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
      return polygonIntersectPolygon(pointsCoord, pointsRect);
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
    const seriesRawData: DataView[] = [];
    this._relativeRegions.forEach(r => {
      const allMarks: IMark[] = [];
      r.getSeries().forEach((s: ISeries) => {
        if (
          (seriesUserId && array(seriesUserId).includes(s.userId)) ||
          (seriesIndex && array(seriesIndex).includes(s.getSpecIndex())) ||
          (!seriesIndex && !seriesUserId)
        ) {
          seriesRawData.push(s.getRawData());
          allMarks.push(...s.getMarksWithoutRoot());
        }
        this._itemMap[r.id] = allMarks;
      });
    });

    this._linkedSeries.forEach(s => {
      this._linkedItemMap[s.id] = s.getMarksWithoutRoot();
    });
    this._option.dataSet.multipleDataViewAddListener(seriesRawData, 'change', () => {
      // if series raw data change, will re make link marks
      this._isFirstState = true;
    });
  }

  protected _initMarkBrushState(componentIndex: number) {
    this._brushComponents.forEach((brush, index) => {
      if (index !== componentIndex) {
        brush.children[0].removeAllChild();
      }
    });

    this._inBrushElementsMap = {};
    this._outOfBrushElementsMap = {};
    this._linkedInBrushElementsMap = {};
    this._linkedOutOfBrushElementsMap = {};

    const inBrushMarkAttr = this._transformBrushedMarkAttr(this._spec?.inBrush);
    const outOfBrushMarkAttr = this._transformBrushedMarkAttr(this._spec?.outOfBrush);
    this._option.getAllSeries().forEach((s: ISeries) => {
      s.getMarksWithoutRoot().forEach((mark: IMark) => {
        const grammarMark = mark.getProduct();
        if (!grammarMark || !grammarMark.elements || !grammarMark.elements.length) {
          return;
        }
        const elements = grammarMark.elements;
        elements.forEach((el: IElement) => {
          const graphicItem = el.getGraphicItem();
          // 注册状态
          graphicItem.stateProxy = (stateName: string) => {
            if (stateName === 'inBrush') {
              return inBrushMarkAttr;
            }
            if (stateName === 'outOfBrush') {
              return outOfBrushMarkAttr;
            }
            return;
          };
          // 所有图元置为out brush状态
          graphicItem.addState('outOfBrush');
          this._outOfBrushElementsMap[mark.id] = this._outOfBrushElementsMap[mark.id] ?? {};
          this._outOfBrushElementsMap[mark.id][el.key] = el;
          this._linkedOutOfBrushElementsMap[mark.id] = this._linkedOutOfBrushElementsMap[mark.id] ?? {};
          this._linkedOutOfBrushElementsMap[mark.id][el.key] = el;
        });
      });
    });
    this._isFirstState = false;
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

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    const brushVisible = this._spec.visible ?? true;
    if (brushVisible) {
      // 创建marker组件
      if (this._brushComponents.length === 0) {
        this._relativeRegions.forEach((region: IRegion, index: number) => {
          this._createBrushComponent(region, index);
        });
      }
    }
  }
}
