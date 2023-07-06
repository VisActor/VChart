import { DataView } from '@visactor/vdataset';
import type { IMarkLine, IMarkLineSpec, IMarkLineTheme } from './interface';
import { isNil, isArray } from '../../../util';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface';
import type { IOptionAggrs } from '../../../data/transforms/aggregation';
// eslint-disable-next-line no-duplicate-imports
import { markerAggregation } from '../../../data/transforms/aggregation';
import { xLayout, yLayout, coordinateLayout } from '../utils';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid } from '@visactor/vutils';
import { transformToGraphic } from '../../../util/style';
import { BaseMarker } from '../base-marker';
import type { INode } from '@visactor/vrender';
import type { LayoutItem } from '../../../model/layout-item';
import type { IDataPos } from '../interface';
import type { IOptionRegr } from '../../../data/transforms/regression';
// eslint-disable-next-line no-duplicate-imports
import { markerRegression } from '../../../data/transforms/regression';
import { LayoutZIndex } from '../../../constant';

export class MarkLine extends BaseMarker implements IMarkLine {
  static type = ComponentTypeEnum.markLine;
  type = ComponentTypeEnum.markLine;
  name: string = ComponentTypeEnum.markLine;

  layoutZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.MarkLine;

  static speckey = 'markLine';

  protected declare _spec: IMarkLineSpec & IMarkLineTheme;
  protected declare _theme: IMarkLineTheme;

  protected declare _markerComponent: MarkLineComponent;

  static createComponent(spec: any, options: IComponentOption) {
    const markLineSpec = spec.markLine || options.defaultSpec;
    if (isNil(markLineSpec)) {
      return undefined;
    }
    if (!isArray(markLineSpec) && markLineSpec.visible !== false) {
      return new MarkLine(markLineSpec, { ...options, specKey: MarkLine.speckey });
    }
    const markLines: MarkLine[] = [];
    markLineSpec.forEach((m: any, i: number) => {
      if (m.visible !== false) {
        markLines.push(new MarkLine(m, { ...options, specIndex: i, specKey: MarkLine.speckey }));
      }
    });
    return markLines;
  }

  protected _createMarkerComponent() {
    const markLine = new MarkLineComponent({
      zIndex: this.layoutZIndex,
      interactive: this._spec.interactive ?? false,
      points: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 0
        }
      ],
      lineStyle: transformToGraphic(this._spec?.line.style),
      startSymbol: {
        ...this._spec?.startSymbol,
        visible: this._spec.startSymbol?.visible,
        style: transformToGraphic(this._spec.startSymbol?.style)
      },
      endSymbol: {
        ...this._spec?.endSymbol,
        visible: this._spec.endSymbol?.visible,
        style: transformToGraphic(this._spec.endSymbol?.style)
      },
      label: {
        ...this._spec.label,
        padding: this._spec.label?.labelBackground?.padding,
        shape: {
          ...transformToGraphic(this._spec.label?.shape),
          visible: this._spec.label?.shape?.visible ?? false
        },
        panel: {
          ...transformToGraphic(this._spec.label?.labelBackground.style),
          visible: this._spec.label?.labelBackground?.visible ?? true
        },
        textStyle: transformToGraphic(this._spec.label?.style)
      }
    });
    this._markerComponent = markLine;
    this._markerComponent.name = 'markLine';
    this._markerComponent.id = this._spec.id ?? `markLine-${this.id}`;
    this.getContainer().add(this._markerComponent as unknown as INode);
  }

  protected _markerLayout() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    // eslint-disable-next-line max-len
    const isXLayout =
      isValid(spec.x) || (isValid(spec.coordinates) && isValid(spec.process) && isValid(spec.process.x));
    // eslint-disable-next-line max-len
    const isYLayout =
      isValid(spec.y) || (isValid(spec.coordinates) && isValid(spec.process) && isValid(spec.process.y));
    const isCoordinateLayout =
      isValid(spec.coordinates) && (!isValid(spec.process) || ('process' in spec && 'xy' in spec.process));
    const isPositionLayout = isValid(spec.positions);

    let points: IPointLike[] = [];
    if (isXLayout) {
      points = xLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries)[0];
    } else if (isYLayout) {
      points = yLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries)[0];
    } else if (isCoordinateLayout) {
      points = coordinateLayout(data, relativeSeries);
    } else if (isPositionLayout) {
      points = spec.positions;
    }
    this._markerComponent.setAttributes({
      points: points
    });
  }

  protected _initDataView(): void {
    const spec = this._spec;
    const relativeSeries = this._relativeSeries;
    const isXProcess = 'x' in spec;
    const isYProcess = 'y' in spec;
    const isCoordinateProcess = 'coordinates' in spec;

    if (!isXProcess && !isYProcess && !isCoordinateProcess) {
      return;
    }

    let options: IOptionAggrs | IOptionRegr;
    let processData: DataView;
    let needAgggr: boolean = false;
    let needRegr: boolean = false;

    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    // eslint-disable-next-line no-undef
    registerDataSetInstanceTransform(this._option.dataSet, 'markerRegression', markerRegression);

    if (isXProcess) {
      options = [this._processSpecX(spec.x as unknown as IDataPos)];
      processData = relativeSeries.getViewData();
      needAgggr = true;
    } else if (isYProcess) {
      options = [this._processSpecY(spec.y as unknown as IDataPos)];
      processData = relativeSeries.getViewData();
      needAgggr = true;
    } else if (isCoordinateProcess) {
      options = this._processSpecCoo(spec);

      processData = new DataView(this._option.dataSet)
        .parse([relativeSeries.getViewData()], {
          type: 'dataview'
        })
        .transform({
          type: 'markerAggregation',
          options
        });
      if (spec.process && 'x' in spec.process) {
        options = [this._processSpecX(spec.process.x as unknown as IDataPos)];
        needAgggr = true;
      }
      if (spec.process && 'y' in spec.process) {
        options = [this._processSpecY(spec.process.y as unknown as IDataPos)];
        needAgggr = true;
      }
      if (spec.process && 'xy' in spec.process) {
        options = {
          fieldX: relativeSeries.getSpec().xField,
          fieldY: relativeSeries.getSpec().yField
        };
        needRegr = true;
      }
    }

    const data = new DataView(this._option.dataSet);
    data.parse([processData], {
      type: 'dataview'
    });
    if (needAgggr) {
      data.transform({
        type: 'markerAggregation',
        options
      });
    }
    if (needRegr) {
      data.transform({
        type: 'markerRegression',
        options
      });
    }

    data.target.on('change', () => {
      this._markerLayout();
    });
    this._markerData = data;
  }
}
