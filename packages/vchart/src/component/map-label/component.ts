import type { IPadding, IRect, IOrientType } from '../../typings/space';
import { DataView } from '@visactor/vdataset';
import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import { LayoutZIndex } from '../../constant';
import type { IMapLabelSpec, MapLabelSceneNodeMap } from './interface';
import type { ICartesianSeries, IGeoSeries } from '../../series/interface';
import type { IPoint, Datum } from '../../typings';
import type { IPairInfo } from './layout';
// eslint-disable-next-line no-duplicate-imports
import { layoutByPosition, layoutOuter, placeRectByOrient } from './layout';

import { CompilableData } from '../../compile/data/compilable-data';
import { normalizeLayoutPaddingSpec } from '../../util/space';
import { MarkPoint } from '@visactor/vrender-components';
import type { IGraphic, IGroup, INode, IRect as IRectGraphic } from '@visactor/vrender-core';
import { createGroup, createRect, createSymbol, createText } from '@visactor/vrender-core';
import { transformToGraphic } from '../../util/style';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid } from '@visactor/vutils';
import type { PanEventParam, ZoomEventParam } from '../../event/interface';
import type { IModel, IModelSpecInfo } from '../../model/interface';
import { Factory } from '../../core/factory';
import { TransformLevel } from '../../data/initialize';

export class MapLabelComponent extends BaseComponent<IMapLabelSpec> {
  static type = ComponentTypeEnum.mapLabel;
  type = ComponentTypeEnum.mapLabel;
  name: string = ComponentTypeEnum.mapLabel;

  static specKey = 'mapLabel';
  specKey = 'mapLabel';

  layoutType: 'none' = 'none';

  layoutZIndex = LayoutZIndex.MarkPoint;

  protected nameField: string;
  protected valueField?: string;

  protected _series: ICartesianSeries | IGeoSeries;
  protected _map: any[];
  protected _longitudeField: string;
  protected _latitudeField: string;

  protected _markerComponents: MarkPoint[];

  private _activeDatum: Datum[] = [];

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    // TODO: 限制mapSeries使用
    const labelSpec = chartSpec[this.specKey];
    if (!labelSpec || !labelSpec.visible || isValid(labelSpec.series)) {
      return null;
    }
    return [
      {
        spec: labelSpec,
        specPath: [this.specKey],
        specInfoPath: ['component', this.specKey, 0],
        type: ComponentTypeEnum.mapLabel
      }
    ];
  }

  setAttrFromSpec(): void {
    this.nameField = this._spec.nameField ?? this._series?.getDimensionField()[0];
    this.valueField = this._spec.valueField ?? this._series?.getMeasureField()[0];
  }

  created() {
    super.created();
    if (!!this._spec.visible === false) {
      return;
    }
    this.initRelatedInfo();
    this.initData();
    this.initEvent();
  }

  initRelatedInfo(): void {
    this._series = this._option.getSeriesInUserIdOrIndex([this._spec.seriesId])[0] as ICartesianSeries;
    if (this._spec.position === 'outer') {
      // 需要获取region上的地理坐标系
      this._map = (this._regions[0].getSeriesInType('map')[0] as IGeoSeries)?.getMapViewData()?.latestData;

      this._longitudeField = this._regions[0].getSpec?.()?.longitudeField;
      this._latitudeField = this._regions[0].getSpec?.()?.latitudeField;
    }
  }

  initData() {
    const series = this._series;
    if (!series) {
      return;
    }
    const seriesData = series.getViewData();
    if (seriesData) {
      const data = new DataView(this._option.dataSet, { name: `${this.name}_data` });
      data.parse([seriesData], {
        type: 'dataview'
      });
      data.transform({ type: 'copyDataView', level: TransformLevel.copyDataView }, false);

      this._data = new CompilableData(this._option, data);
      data.target.addListener('change', () => {
        if (this._spec.trigger !== 'hover' && this._spec.trigger !== 'click') {
          this._activeDatum = this._data.getLatestData();
        }
      });
    }
  }

  initEvent() {
    this.event.on('zoom', { filter: params => this._isRelativeModel(params.model) }, e => {
      this.handleZoom(e as unknown as ZoomEventParam);
      return true;
    });

    this.event.on('panmove', { filter: params => this._isRelativeModel(params.model) }, e => {
      this.handlePan(e as unknown as PanEventParam);
      return true;
    });

    const trigger = this._spec.trigger;
    if (trigger === 'none') {
      return;
    }

    if (trigger === 'hover') {
      this.event.on('hovered', { filter: params => this._isRelativeSeries(params.model) }, params => {
        this._updateDatum(params.value);
      });
      this.event.on('unhovered', () => {
        this._updateDatum([]);
      });
    } else if (trigger === 'click') {
      this.event.on('selected', { filter: params => this._isRelativeSeries(params.model) }, params => {
        this._updateDatum(params.value);
      });
      this.event.on('unselected', () => {
        this._updateDatum([]);
      });
    }
  }

  handlePan(e: PanEventParam) {
    const { delta } = e;
    this._markerComponents.forEach(marker => {
      marker.translate(delta[0], delta[1]);
    });
  }

  handleZoom(e: ZoomEventParam) {
    this._updateMarkerLayoutAttribute();
  }

  private _updateDatum(datum: Datum[]) {
    this._activeDatum = datum;
    this._markerComponents.forEach((marker, index) => {
      const markerDatum = this._data?.getLatestData()[index];
      if (this._activeDatum.includes(markerDatum)) {
        marker.setAttribute('visible', true);
      } else {
        marker.setAttribute('visible', false);
      }
    });
  }

  dataToPosition(datum: any) {
    return this._series.dataToPosition(datum);
  }

  updateLayoutAttribute() {
    const markData = this._data?.getLatestData();
    if (!markData || markData.length === 0) {
      return;
    }
    super.updateLayoutAttribute();
    this._updateMarkerLayoutAttribute();
  }

  protected _updateMarkerLayoutAttribute() {
    const layoutPairInfo: IPairInfo[] = [];
    const markerMarks: MapLabelSceneNodeMap[] = [];
    if (!this._markerComponents) {
      this._markerComponents = this._data?.getLatestData().map((data: Datum, index: number) => {
        const cmp = new MarkPoint({
          position: undefined
        });
        if (cmp) {
          cmp.name = `${this.name}_marker_${index}`;
          cmp.id = this._spec.id ?? `${this.name}_marker_${this.id}`;
          cmp.setAttribute('zIndex', this.layoutZIndex);
        }
        return cmp;
      });
    }

    const markerComponents = this._markerComponents;
    markerComponents.forEach((marker, index) => {
      marker.removeAllChild();
      const { pairInfo, contentMarks } = this._evaluateMarker(this._data.getLatestData()[index], index);
      pairInfo && layoutPairInfo.push(pairInfo);
      contentMarks && markerMarks.push(contentMarks);
    });

    const positionedRects = this._layoutLabels(layoutPairInfo);
    this._layoutMarkers(positionedRects, markerMarks);
    this._renderMarkers();
  }

  protected _evaluateMarker(data: Datum, index: number) {
    let contentItemCount = 0;
    let paddingWidth = 0;
    let paddingHeight = 0;
    let contentWidth = 0;
    let contentHeight = 0;

    const position = this._spec.position || 'top';
    const offset = this._spec.offset;

    const padding = normalizeLayoutPaddingSpec(this._spec.background?.padding) as IPadding;
    const space = this._spec.space || 0;
    paddingWidth += (padding?.left || 0) + (padding?.right || 0);
    paddingHeight += (padding?.top || 0) + (padding?.bottom || 0);

    const contentMarks: MapLabelSceneNodeMap = {};
    const positionAttr = this.dataToPosition(data);

    const container = createGroup({});
    container.name = `${this.name}_marker_itemContainer_${index}`;
    contentMarks.container = container;

    if (this._spec.background?.visible) {
      const labelBackground = createRect(transformToGraphic({ ...this._spec.background.style }));
      labelBackground.setAttributes(positionAttr);
      contentMarks.labelBackground = labelBackground;
      container.appendChild(labelBackground);
    }

    if (this._spec.icon?.visible) {
      const icon = createSymbol(transformToGraphic({ ...this._spec.icon.style }));
      icon.setAttributes(positionAttr);
      icon.setAttribute('symbolType', this._spec.icon.style?.shape);
      const iconBound = icon.AABBBounds;
      const iconHeight = iconBound?.y2 - iconBound?.y1 ?? 0;
      const iconWidth = iconBound?.x2 - iconBound?.x1 ?? 0;
      contentMarks.icon = icon;
      container.appendChild(icon);

      contentHeight = iconHeight;
      contentWidth += iconWidth;
      contentItemCount++;
    }

    if (this._spec.nameLabel?.visible) {
      const nameLabel = createText(transformToGraphic({ ...this._spec.nameLabel.style }));
      nameLabel.setAttributes(positionAttr);
      nameLabel.setAttribute('text', data[this.nameField]);
      const nameLabelBound = nameLabel.AABBBounds;
      const nameLabelHeight = nameLabelBound?.y2 - nameLabelBound?.y1 ?? 0;
      const nameLabelWidth = nameLabelBound?.x2 - nameLabelBound?.x1 ?? 0;
      contentMarks.nameLabel = nameLabel;
      container.appendChild(nameLabel);

      contentHeight = Math.max(contentHeight, nameLabelHeight);
      contentWidth += nameLabelWidth;
      contentItemCount++;
    }

    if (this._spec.valueLabel?.visible && isValid(data[this.valueField])) {
      const valueLabel = createText(transformToGraphic({ ...this._spec.valueLabel.style }));
      valueLabel.setAttributes(positionAttr);
      valueLabel.setAttribute('text', data[this.valueField]);
      const valueLabelBound = valueLabel.AABBBounds;
      const valueLabelHeight = valueLabelBound?.y2 - valueLabelBound?.y1 ?? 0;
      const valueLabelWidth = valueLabelBound?.x2 - valueLabelBound?.x1 ?? 0;
      contentMarks.valueLabel = valueLabel;
      container.appendChild(valueLabel);

      contentHeight = Math.max(contentHeight, valueLabelHeight);
      contentWidth += valueLabelWidth;
      contentItemCount++;
    }

    const firstValidMark = Object.values(contentMarks).find(m => !!m && m.type !== 'group');

    const anchor: IPoint = {
      x: firstValidMark?.getComputedAttribute('x'),
      y: firstValidMark?.getComputedAttribute('y')
    };
    const itemRect = {
      x: anchor.x,
      y: anchor.y,
      width: 0,
      height: 0
    };

    itemRect.width = paddingWidth + contentWidth + (contentItemCount - 1) * space;
    itemRect.height = paddingHeight + contentHeight;

    const pairInfo: IPairInfo = {
      rect: itemRect,
      point: anchor,
      index
    };
    // 计算得到最终所有元素包围盒的布局位置
    if (position !== 'outer') {
      const anchors = ['top', 'right', 'left', 'bottom'].filter(a => a !== position);
      pairInfo.rect = placeRectByOrient(itemRect, position, offset);
      pairInfo.anchors = anchors as IOrientType[];
      pairInfo.offset = offset;
    } else {
      pairInfo.pointCoord = {
        x: +data?.[this._longitudeField],
        y: +data?.[this._latitudeField]
      };
    }
    return { pairInfo, contentMarks };
  }

  protected _layoutMarkers(positionedRects: IRect[], contentMarks: MapLabelSceneNodeMap[]) {
    for (let i = 0; i < contentMarks.length; i++) {
      if (!positionedRects[i] || !contentMarks[i]) {
        return;
      }
      const { icon, nameLabel, valueLabel, labelBackground, container } = contentMarks[i];

      const itemRect = positionedRects[i];
      const padding = normalizeLayoutPaddingSpec(this._spec.background?.padding) as IPadding;
      const space = this._spec.space || 0;

      const curY = itemRect.height / 2;
      let curX = padding?.left || 0;
      [icon, nameLabel, valueLabel].forEach((item, index) => {
        if (item) {
          const bounds = item.AABBBounds;
          let offset = 0;
          if (item.type === 'symbol') {
            // 文字的锚点在文字左侧，baseline在中心
            // symbol的锚点[0,0]在图形中心。所以x方向要偏移半个bound。
            offset += (bounds.x2 - bounds.x1 ?? 0) / 2;
          }
          item.setAttributes({
            x: curX + offset,
            y: curY
          });

          curX += bounds.x2 - bounds.x1 ?? 0;
          if (index !== 2) {
            curX += space;
          }
        }
      });
      (labelBackground as IRectGraphic)?.setAttributes({
        x: 0,
        y: 0,
        width: itemRect.width,
        height: itemRect.height
      });
      container?.setAttributes({
        dx: -itemRect.width / 2,
        dy: -itemRect.height / 2
      });
      const datum = this._data.getLatestData()[i];
      const anchor = this.dataToPosition(datum);
      const showLeader = !!(this._spec.leader?.visible && (icon || nameLabel || valueLabel));
      this._markerComponents[i].setAttributes({
        x: this.getRegions()[0].getLayoutStartPoint().x,
        y: this.getRegions()[0].getLayoutStartPoint().y,
        position: anchor,
        visible: this._activeDatum.includes(datum),
        itemContent: {
          refX: 0,
          type: 'custom',
          renderCustomCallback: () => container as unknown as IGroup,
          autoRotate: false,
          offsetX: itemRect.x + itemRect.width / 2 - anchor.x,
          offsetY: itemRect.y + itemRect.height / 2 - anchor.y
        },
        itemLine: {
          visible: showLeader,
          type: 'type-po',
          lineStyle: transformToGraphic({ ...this._spec.leader?.style }),
          startSymbol: { visible: false }
        }
      });
    }
  }

  protected _renderMarkers() {
    if (!this._markerComponents || !this._markerComponents.length) {
      return;
    }

    for (let i = 0; i < this._markerComponents.length; i++) {
      this.getContainer().add(this._markerComponents[i] as unknown as INode);
    }
  }

  protected _layoutLabels(rects: IPairInfo[]) {
    const result =
      this._spec.position === 'outer' && this._map
        ? layoutOuter(rects, this._map, (coord: number[]) =>
            this._series.dataToPosition({
              [this._longitudeField]: coord[0],
              [this._latitudeField]: coord[1]
            })
          )
        : layoutByPosition(rects);

    return result;
  }

  private _isRelativeModel(model: IModel) {
    const id =
      (this._series as ICartesianSeries).getXAxisHelper()?.getAxisId() ??
      (this._series as IGeoSeries).getCoordinateHelper()?.getCoordinateId();
    return model?.id === id;
  }

  private _isRelativeSeries(model: IModel) {
    return model?.id === this._series.id;
  }

  onRender(ctx: any): void {
    // do nothing
  }

  changeRegions(/** regions: IRegion[] */): void {
    // do nothing
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return this._markerComponents as unknown as IGroup[];
  }
}

export const registerMapLabel = () => {
  Factory.registerComponent(MapLabelComponent.type, MapLabelComponent);
};
