import type { IConversionFunnelChartSpecBase, IConversionFunnelSeriesSpecBase } from './interface';
import { VChart, FunnelChart, PREFIX, FunnelSeries, GroupMark } from '@visactor/vchart';
import { DataView } from '@visactor/vdataset';
import { ConversionFunnelChartSpecTransformer } from './conversion-funnel-transformer';
import { conversionArrowTransform } from './arrow-data-transform';

export class ConversionFunnelChart extends FunnelChart<IConversionFunnelChartSpecBase> {
  type = 'conversionFunnel';
  static type = 'conversionFunnel';

  declare _spec: IConversionFunnelChartSpecBase;

  static readonly transformerConstructor = ConversionFunnelChartSpecTransformer;
  readonly transformerConstructor = ConversionFunnelChartSpecTransformer;
}

export class ConversionFunnelSeries extends FunnelSeries<IConversionFunnelSeriesSpecBase> {
  protected _arrowData?: DataView;

  initData() {
    super.initData();
    const { conversionArrow } = this._spec;
    if (conversionArrow && conversionArrow.arrows?.length) {
      this._arrowData = new DataView(this._dataSet, { name: `${PREFIX}_series_${this.id}_arrowData` });
      if (!this._dataSet.getTransform('conversionArrow')) {
        this._dataSet.registerTransform('conversionArrow', conversionArrowTransform);
      }
      this._arrowData.parse(conversionArrow).transform({
        type: 'conversionArrow',
        options: {
          categoryField: this._spec.categoryField
        }
      });
    }
  }

  afterCompile() {
    // @ts-ignore
    super.afterCompile?.();
    const rightGroup = this.getMarkInName('arrowRight') as unknown as GroupMark;
    if (rightGroup) {
      rightGroup.getMarks().forEach(mark => {
        mark.setDataView(this._arrowData);
        mark.compileData();
        mark.getProduct().transform([
          {
            type: 'filter',
            callback: datum => datum.position === 'right'
          }
        ]);
      });
    }
    const leftGroup = this.getMarkInName('arrowLeft') as unknown as GroupMark;
    if (leftGroup) {
      leftGroup.getMarks().forEach(mark => {
        mark.setDataView(this._arrowData);
        mark.compileData();
        mark.getProduct().transform([
          {
            type: 'filter',
            callback: datum => datum.position === 'left'
          }
        ]);
      });
    }
  }
}

export const registerConversionFunnelChart = (option?: { VChart?: typeof VChart }) => {
  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([ConversionFunnelChart]);
    vchartConstructor.useSeries([ConversionFunnelSeries]);
  }
};

export const DEFAULT_ARROW_MARK_STYLE = {
  cornerRadius: 4,
  stroke: 'black',
  strokeOpacity: 1,
  lineWidth: 1,
  closePath: false,
  pickable: false
};

export const DEFAULT_ARROW_SYMBOL_MARK_STYLE = {
  symbolType: 'triangle',
  size: 8,
  scaleX: 0.7,
  fill: 'black'
};

export const DEFAULT_ARROW_TEXT_MARK_STYLE = {
  fill: '#606773',
  fontSize: 12
};

export const DEFAULT_FUNNEL_BACKGROUND_MARK_STYLE = {
  fill: '#eff1f9'
};
