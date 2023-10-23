/**
 * @description 复合增长 & 总计差异标注标记交互
 * 1. 双击出现编辑框
 * 2. DEFAULT_OFFSET_FOR_GROWTH_MARKLINE 这个偏移量还是在坐标点内部计算比较好
 * 3. 不支持的系列类型的处理
 */
import type { IGroup, ILine, ISymbol } from '@visactor/vrender-core';
import { type IGraphic, createGroup, vglobal, createLine, createSymbol } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import type { IPointLike } from '@visactor/vutils';
import { array, last, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, ICartesianSeries, IComponent, IStepMarkLineSpec } from '@visactor/vchart';
import { DEFAULT_DATA_KEY, STACK_FIELD_TOTAL_TOP } from '@visactor/vchart';
import { findClosestPoint } from '../utils/math';
import { DEFAULT_OFFSET_FOR_GROWTH_MARKLINE, getInsertPoints, getTextOffset } from '../utils/marker';
import type { DataPoint, Point } from './types';
import { MarkerTypeEnum } from '../interface';

const START_LINK_HANDLER = 'overlay-growth-mark-line-start-handler';
const END_LINK_HANDLER = 'overlay-growth-mark-line-end-handler';

export class GrowthMarkLineEditor extends BaseEditorElement {
  private _model: MarkLine;
  private _element: MarkLineComponent;

  private _editComponent: IGroup;
  private _overlayLine: ILine;
  private _overlayStartHandler: IGraphic;
  private _overlayEndHandler: IGraphic;
  private _currentHandler: IGraphic;
  private _fixedHandler: IGraphic;
  private _dataAnchors: IGroup;

  private _selected: boolean = false;

  private _dataPoints: DataPoint[];

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: 'markLine', consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: 'markLine', consume: true }, this._onDown);
  }

  private _checkEventEnable(e: EventParams) {
    const markerComponent = (e.model as unknown as IComponent).getVRenderComponents()[0];
    return (
      markerComponent?.name === MarkerTypeEnum.growthLine || markerComponent?.name === MarkerTypeEnum.totalDiffLine
    );
  }

  private _onHover = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e.event as PointerEvent);
  };

  private _onDown = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    this._element = (<MarkLine>e.model).getVRenderComponents()[0] as unknown as MarkLineComponent;
    this._model = <MarkLine>e.model;
    this._selected = true;

    const el = this._getEditorElement(e);
    if (e) {
      this.startEditor(el, e.event as PointerEvent);
    }
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as unknown as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: {
          stroke: '#3073F2'
        },
        startSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        endSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        pickable: false,
        childrenPickable: false,
        dx: markLine.attribute.dx ?? 0,
        dy: markLine.attribute.dy ?? 0
      })
    );
    overlayLine.name = 'overlay-growth-mark-line-line';

    return overlayLine as unknown as IGraphic;
  }

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const element: IEditorElement = new CommonChartEditorElement(this, {
      model,
      id: this._chart.vchart.id + '-growth-markLine-' + model.id + (this._selected ? '-selected' : '')
    });
    return element;
  }

  protected startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!super.startEditor(el, e)) {
      return false;
    }
    this._createEditorGraphic(el, e);
    return true;
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    if (this._editComponent) {
      return this._editComponent;
    }
    const dataPoints = this._getAnchorPoints();
    const lineShape = this._element.getLine();

    const editComponent = createGroup({
      pickable: false
    });
    editComponent.name = 'overlay-growth-mark-line';
    const overlayLine = createLine({
      points: lineShape.attribute.points as IPointLike[],
      lineDash: [0],
      lineWidth: 3,
      stroke: '#3073F2',
      dx: this._element.attribute.dx ?? 0,
      dy: this._element.attribute.dy ?? 0,
      pickable: false
    });
    overlayLine.name = 'overlay-growth-mark-line-line';
    this._overlayLine = overlayLine;
    editComponent.add(overlayLine);

    const relativeDataPoints = [
      (lineShape.attribute.points as Point[])[0],
      last(lineShape.attribute.points as Point[])
    ].map(point => {
      return dataPoints.find((dataPoint: DataPoint) => dataPoint.x === point.x && dataPoint.y === point.y);
    });

    let startLinkLine;
    let endLinkLine;
    if (this._element.name === MarkerTypeEnum.growthLine) {
      startLinkLine = new Segment({
        zIndex: 1,
        points: [
          relativeDataPoints[0],
          {
            x: relativeDataPoints[0].x + (this._element.attribute.dx ?? 0),
            y: relativeDataPoints[0].y + (this._element.attribute.dy ?? 0)
          }
        ],
        startSymbol: {
          visible: true,
          symbolType: 'circle',
          size: 10,
          style: {
            fill: '#fff',
            stroke: '#3073F2',
            lineWidth: 1,
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        },
        endSymbol: { visible: false },
        lineStyle: {
          stroke: '#89909D',
          lineWidth: 1
        },
        childrenPickable: false
      });

      endLinkLine = new Segment({
        zIndex: 1,
        points: [
          relativeDataPoints[1],
          {
            x: relativeDataPoints[1].x + (this._element.attribute.dx ?? 0),
            y: relativeDataPoints[1].y + (this._element.attribute.dy ?? 0)
          }
        ],
        startSymbol: {
          visible: true,
          symbolType: 'circle',
          size: 10,
          style: {
            fill: '#fff',
            stroke: '#3073F2',
            lineWidth: 1,
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        },
        endSymbol: { visible: false },
        lineStyle: {
          stroke: '#89909D',
          lineWidth: 1
        },
        childrenPickable: false
      });
    } else {
      startLinkLine = createSymbol({
        zIndex: 1,
        x: relativeDataPoints[0].x,
        y: relativeDataPoints[0].y,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#3073F2',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)'
      });

      endLinkLine = createSymbol({
        zIndex: 1,
        x: relativeDataPoints[1].x,
        y: relativeDataPoints[1].y,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#3073F2',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)'
      });
    }

    startLinkLine.name = START_LINK_HANDLER;
    this._overlayStartHandler = startLinkLine as unknown as IGraphic;
    editComponent.add(startLinkLine as unknown as IGraphic);

    endLinkLine.name = END_LINK_HANDLER;
    this._overlayEndHandler = endLinkLine as unknown as IGraphic;
    editComponent.add(endLinkLine as unknown as IGraphic);

    this._layer.editorGroup.add(editComponent as unknown as IGraphic);
    this._editComponent = editComponent;

    startLinkLine.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);
    endLinkLine.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);

    const dataAnchors = createGroup({
      pickable: false,
      childrenPickable: false
    });
    dataPoints.forEach((point: DataPoint) => {
      const anchor = createSymbol({
        ...point,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#FFC528',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        visible: false
      });
      anchor.data = point.data;
      dataAnchors.add(anchor);
    });
    editComponent.add(dataAnchors as unknown as IGraphic);
    this._dataAnchors = dataAnchors;

    return this._editComponent as unknown as IGraphic;
  }

  // 交互描述：拖拽过程中，根据当前的鼠标垫查找最近的数据点，然后更新图形位置
  private _onHandlerDragStart = (e: any) => {
    e.stopPropagation();
    const handler = e.target;
    this._currentHandler = handler as unknown as IGraphic;
    this._fixedHandler = handler.name === START_LINK_HANDLER ? this._overlayEndHandler : this._overlayStartHandler;

    vglobal.addEventListener('pointermove', this._onHandlerDrag);
    vglobal.addEventListener('pointerup', this._onHandlerDragEnd);
  };

  private _onHandlerDrag = (e: any) => {
    e.stopPropagation();

    // Important: 拖拽过程中，关闭所有标注的交互
    this._silentAllMarkers();

    // 展示可吸附的数据锚点
    // 对于数据锚点，不允许拖拽至另一个固定的锚点
    const enableDataPoints: any[] = [];
    const unenableDataPoint =
      this._element.name === MarkerTypeEnum.growthLine
        ? ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point)
        : {
            x: (this._fixedHandler as unknown as ISymbol).attribute.x,
            y: (this._fixedHandler as unknown as ISymbol).attribute.y
          };
    this._dataAnchors.getChildren().forEach((child: any) => {
      if (child.attribute.x === unenableDataPoint.x && child.attribute.y === unenableDataPoint.y) {
        child.setAttribute('visible', false);
        // @ts-ignore
        this._fixedHandler.data = child.data;
      } else {
        enableDataPoints.push({
          x: child.attribute.x,
          y: child.attribute.y,
          data: child.data
        });
        child.setAttribute('visible', true);
      }
    });

    // 转换为画布坐标
    const currentPoint = vglobal.mapToCanvasPoint(e);
    const closestPoint = findClosestPoint(currentPoint, enableDataPoints) as Point;
    // @ts-ignore
    this._currentHandler.data = closestPoint.data;
    if (this._element.name === MarkerTypeEnum.growthLine) {
      (this._currentHandler as unknown as Segment).setAttributes({
        points: [
          closestPoint,
          {
            x:
              closestPoint.x +
              (this._model.getRelativeSeries().direction === 'horizontal' ? DEFAULT_OFFSET_FOR_GROWTH_MARKLINE : 0),
            y:
              closestPoint.y +
              (this._model.getRelativeSeries().direction === 'horizontal' ? 0 : -DEFAULT_OFFSET_FOR_GROWTH_MARKLINE)
          }
        ]
      });
      (this._fixedHandler as unknown as Segment).setAttributes({
        points: [
          (this._fixedHandler as unknown as Segment).attribute.points[0] as Point,
          {
            x:
              ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).x +
              (this._model.getRelativeSeries().direction === 'horizontal' ? DEFAULT_OFFSET_FOR_GROWTH_MARKLINE : 0),
            y:
              ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).y +
              (this._model.getRelativeSeries().direction === 'horizontal' ? 0 : -DEFAULT_OFFSET_FOR_GROWTH_MARKLINE)
          }
        ]
      });
      let attrKey;
      let attrValue;
      if (this._model.getRelativeSeries().direction === 'horizontal') {
        attrKey = 'dx';
        attrValue = DEFAULT_OFFSET_FOR_GROWTH_MARKLINE;
      } else {
        attrKey = 'dy';
        attrValue = -DEFAULT_OFFSET_FOR_GROWTH_MARKLINE;
      }
      this._overlayLine.setAttributes({
        points: [
          closestPoint,
          {
            x: ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).x,
            y: ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).y
          }
        ],
        [attrKey]: attrValue
      });
    } else {
      (this._currentHandler as unknown as Segment).setAttributes({
        x: closestPoint.x,
        y: closestPoint.y
      });

      // TODO: 优化，可以缓存
      this._overlayLine.setAttributes({
        points: getInsertPoints(
          {
            x: this._overlayStartHandler.attribute.x,
            y: this._overlayStartHandler.attribute.y
          },
          {
            x: this._overlayEndHandler.attribute.x,
            y: this._overlayEndHandler.attribute.y
          },
          (this._model.getSpec() as IStepMarkLineSpec).connectDirection,
          DEFAULT_OFFSET_FOR_GROWTH_MARKLINE
        )
      });
    }
  };

  private _onHandlerDragEnd = (e: any) => {
    e.preventDefault();

    // Important: 拖拽结束，恢复所有 marker 交互
    this._activeAllMarkers();
    // 隐藏可吸附数据锚点
    this._dataAnchors?.hideAll();
    // 更新 markLine
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const valueField = series.direction === 'horizontal' ? series.fieldX[0] : series.fieldY[0];
    const valueFieldInData = series.direction === 'horizontal' ? series.getSpec().xField : series.getSpec().yField;
    const startDatum = (this._overlayStartHandler as unknown as any).data;
    const endDatum = (this._overlayEndHandler as unknown as any).data;
    const labelText = `${(((endDatum[valueField] - startDatum[valueField]) / startDatum[valueField]) * 100).toFixed(
      0
    )}%`;
    // 1. 生成新的 markLine spec，用于存储
    const newMarkLineSpec = merge({}, model.getSpec(), {
      coordinates: [
        {
          ...startDatum,
          [valueFieldInData]: startDatum[valueField]
        },
        {
          ...endDatum,
          [valueFieldInData]: endDatum[valueField]
        }
      ],
      label: {
        text: labelText
      }
    });

    // 2. 更新当前 markLine 组件
    if (this._element.name === MarkerTypeEnum.growthLine) {
      let attrKey;
      let attrValue;
      if (this._model.getRelativeSeries().direction === 'horizontal') {
        attrKey = 'dx';
        attrValue = DEFAULT_OFFSET_FOR_GROWTH_MARKLINE;
      } else {
        attrKey = 'dy';
        attrValue = -DEFAULT_OFFSET_FOR_GROWTH_MARKLINE;
      }
      this._element.setAttributes({
        pickable: true,
        childrenPickable: true,
        // @ts-ignore
        points: [
          (this._overlayStartHandler as unknown as Segment).attribute.points[0],
          (this._overlayEndHandler as unknown as Segment).attribute.points[0]
        ],
        label: {
          text: labelText
        },
        [attrKey]: attrValue
      });
      newMarkLineSpec[attrKey === 'dx' ? 'offsetX' : 'offsetY'] = attrValue;
    } else {
      this._element.setAttributes({
        pickable: true,
        childrenPickable: true,
        // @ts-ignore
        points: getInsertPoints(
          {
            x: this._overlayStartHandler.attribute.x,
            y: this._overlayStartHandler.attribute.y
          },
          {
            x: this._overlayEndHandler.attribute.x,
            y: this._overlayEndHandler.attribute.y
          },
          (this._model.getSpec() as IStepMarkLineSpec).connectDirection,
          DEFAULT_OFFSET_FOR_GROWTH_MARKLINE
        ),
        label: {
          text: labelText,
          ...getTextOffset(
            {
              x: this._overlayStartHandler.attribute.x,
              y: this._overlayStartHandler.attribute.y
            },
            {
              x: this._overlayEndHandler.attribute.x,
              y: this._overlayEndHandler.attribute.y
            },
            (this._model.getSpec() as IStepMarkLineSpec).connectDirection,
            DEFAULT_OFFSET_FOR_GROWTH_MARKLINE
          )
        }
      });
      newMarkLineSpec.expandDistance = DEFAULT_OFFSET_FOR_GROWTH_MARKLINE;
    }

    vglobal.removeEventListener('pointermove', this._onHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onHandlerDragEnd);

    this._chart.specProcess.updateElementAttribute(this._currentEl.model, {
      markLine: {
        spec: newMarkLineSpec
      }
    });
    this._chart.reRenderWithUpdateSpec();
  };

  releaseLast() {
    super.releaseLast();
    if (this._editComponent) {
      this._layer.editorGroup.removeChild(this._editComponent as unknown as IGraphic);
      this._editComponent = null;
    }
    this._dataPoints = null;
  }

  release(): void {
    const vchart = this._chart.vchart;

    vchart.off('pointermove', this._onHover);
    vchart.off('pointerdown', this._onDown);
    super.release();
  }

  private _getAnchorPoints() {
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();

    if (series.type === 'bar') {
      // TODO: 需要根据不同的系列名称获取不同的图形节点
      const rectMark = series.getMarks().find((mark: any) => mark.type === 'rect');
      const vgrammarElements = rectMark.getProduct().elements;

      let source;
      // 如果存在堆叠，则只取包含了 STACK_FIELD_TOTAL_TOP 的数据
      if (series.getStack() && series.getStackData()) {
        source = vgrammarElements.filter((element: any) => {
          const data = array(element.data)[0];
          return data[STACK_FIELD_TOTAL_TOP];
        });
      } else {
        source = vgrammarElements;
      }

      const dataPoints = source.map((element: any) => {
        const graphItem = element.getGraphicItem();
        return {
          x:
            (series.direction === 'horizontal'
              ? graphItem.attribute.x + graphItem.attribute.width
              : graphItem.attribute.x + graphItem.attribute.width / 2) + regionStartX,
          y:
            (series.direction === 'horizontal'
              ? graphItem.attribute.y + graphItem.attribute.height / 2
              : graphItem.attribute.y) + regionStartY,
          data: array(element.data)[0],
          length: series.direction === 'horizontal' ? graphItem.attribute.width : graphItem.attribute.height
        };
      });

      return dataPoints;
    }

    if (series.type === 'line' || series.type === 'area') {
      const seriesData = series.getRawData().latestData;
      let source;
      // 如果存在堆叠，则只取包含了 STACK_FIELD_TOTAL_TOP 的数据
      if (series.getStack() && series.getStackData()) {
        source = seriesData.filter((data: any) => {
          return data[STACK_FIELD_TOTAL_TOP];
        });
      } else {
        source = seriesData;
      }

      const dataPoints = source.map((data: any) => {
        const position = series.dataToPosition(data);
        return {
          x: position.x + regionStartX,
          y: position.y + regionStartY,
          data,
          length: series.direction === 'horizontal' ? position.x : position.y
        };
      });

      return dataPoints;
    }
  }

  // TODO: 抽取到 marker 基类中
  private _silentAllMarkers() {
    const vchart = this._chart.vchart;
    const root = vchart.getStage().getElementsByName('root')[0];
    const marks: string[] = [
      MarkerTypeEnum.growthLine,
      MarkerTypeEnum.hierarchyDiffLine,
      MarkerTypeEnum.verticalLine,
      MarkerTypeEnum.horizontalLine,
      MarkerTypeEnum.totalDiffLine,
      MarkerTypeEnum.verticalArea,
      MarkerTypeEnum.horizontalArea
    ];
    root.getChildren().forEach(child => {
      if (marks.includes(child.name)) {
        (child as IGroup).setAttributes({
          pickable: false,
          childrenPickable: false
        });
      }
    });
  }

  private _activeAllMarkers() {
    const vchart = this._chart.vchart;
    const root = vchart.getStage().getElementsByName('root')[0];
    const marks: string[] = [
      MarkerTypeEnum.growthLine,
      MarkerTypeEnum.hierarchyDiffLine,
      MarkerTypeEnum.verticalLine,
      MarkerTypeEnum.horizontalLine,
      MarkerTypeEnum.totalDiffLine,
      MarkerTypeEnum.verticalArea,
      MarkerTypeEnum.horizontalArea
    ];
    root.getChildren().forEach(child => {
      if (marks.includes(child.name)) {
        (child as IGroup).setAttributes({
          pickable: true,
          childrenPickable: true
        });
      }
    });
  }
}
