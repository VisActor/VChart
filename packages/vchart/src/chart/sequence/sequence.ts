import type { IGridLayoutSpec } from './../../layout/interface';
import { BaseChart } from '../base-chart';
import type { ISequenceChartSpec, ISequenceSeriesSpec } from './interface';
import type { IRegion, IRegionSpec } from '../../region/interface';
import { dataToDataView } from '../../data/initialize';
import { Factory } from '../../core/factory';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface';
import type { Datum } from '../../typings';
import type { DataView } from '@visactor/vdataset';
import type { ISeriesOption } from '../../series/interface';

export class SequenceChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.sequence;
  static readonly view: string = 'singleDefault'; // csj-Q: view是什么含义
  readonly type: string = ChartTypeEnum.sequence;

  /**
   * @override
   * @description 主要是处理布局逻辑 & 部分仅针对sequenceChart的特殊属性
   */
  transformSpec(spec: ISequenceChartSpec): void {
    super.transformSpec(spec);

    // 初始化目标属性
    let rowNum = 0;
    const elements: any[] = [];
    const region: IRegionSpec[] = [];
    const axes: any = [];
    const rowHeight: any = [];

    // 计算默认series padding和series高度
    const defaultSeriesPadding = 20;
    const seriesRegionNum = spec.series.filter(d => d.type !== SeriesTypeEnum.link).length;
    const defaultSeriesRowHeight =
      (this._layoutRect.height - defaultSeriesPadding * (seriesRegionNum - 1)) / seriesRegionNum;
    const leftAppendPadding = spec?.appendPadding?.left || 0;
    const rightAppendPadding = spec?.appendPadding?.right || 0;

    if ((spec as any)?.legends) {
      elements.push({
        modelId: `legendRow${rowNum}`,
        col: 1,
        row: rowNum
      });
      (spec as any).legends[0].id = `legendRow${rowNum}`;
      rowHeight.push({
        index: rowNum,
        size: 20
      });
      rowNum++;
    }

    if ((spec as any)?.dataZoom) {
      elements.push({
        modelId: `dataZoomRow${rowNum}`,
        col: 1,
        row: rowNum
      });
      (spec as any).dataZoom[0].id = `dataZoomRow${rowNum}`;
      rowNum++;

      // 增加空行，拟合series padding效果
      rowHeight.push({
        index: rowNum,
        size: 10
      });
      rowNum++;
    }

    // 遍历axes
    // 1. 在elements中添加时间轴元素
    // 2. 并统计rowNum
    // 在sequenceChart中，axes有几种情况（本期先考虑1和2，也就是默认只有1个top轴）：1.不声明axes 2.声明且为仅有一个top axes 3.声明且仅有一个bottom axes 4.多个axes组合
    // if(spec.axes === null || spec?.axes[0]?.orient === 'top') {
    // Tips: id should not has duplicate name
    region.push({
      id: `regionAxesRow${rowNum}`
    });
    elements.push({
      modelId: `axesRow${rowNum}`,
      col: 1,
      row: rowNum
    });
    spec.axes[0].id = `axesRow${rowNum}`;
    spec.axes[0].regionIndex = Array.from(Array(this._spec.series.length - 1), (_, index) => index + 1);
    rowNum++;
    // }

    // 遍历series
    // 1. 在spec.layout => elements、region数组和spec.axes的数组中中添加元素
    // 2. 为series绑定regionIndex
    // 3. 统计rowNum
    // 4. 用空行拟合series padding
    spec?.series?.forEach((seriesSpec: ISequenceSeriesSpec) => {
      if (
        ([SeriesTypeEnum.bar, SeriesTypeEnum.line, SeriesTypeEnum.area, SeriesTypeEnum.dot] as string[]).includes(
          seriesSpec.type
        )
      ) {
        // elements数组
        elements.push({
          modelId: `${seriesSpec.type}Row${rowNum}`,
          col: 1,
          row: rowNum
        });
        elements.push({
          modelId: `axesLeftRow${rowNum}`,
          col: 0,
          row: rowNum
        });

        // region数组
        region.push({
          id: `${seriesSpec.type}Row${rowNum}`,
          clip: false
        });

        rowHeight.push({
          index: rowNum,
          size: seriesSpec?.height || defaultSeriesRowHeight
        });

        // axes数组添加left axes（每个series都需要一个left axes）
        axes.push({
          orient: 'left',
          id: `axesLeftRow${rowNum}`,
          type: seriesSpec.type === SeriesTypeEnum.dot ? 'band' : 'linear',
          visible: seriesSpec.type !== SeriesTypeEnum.dot,

          // 对于bar series，axes title模拟bar title
          title: {
            visible: true,
            // 特殊处理时序图的 title 样式，默认的坐标轴左右轴会进行旋转
            autoRotate: false,
            style: {
              text: (seriesSpec as any)?.barTitle,
              dx: -20,
              textBaseline: 'middle',
              textAlign: 'end'
            }
          },
          // 对于bar series，axes grid模拟series分割线
          grid: {
            visible:
              typeof (seriesSpec as any)?.grid?.visible === 'boolean' ? (seriesSpec as any)?.grid?.visible : true, // bar grid默认绘制
            style: (datum: Datum, index: number) => {
              let lineWidth = 0;
              if (index === 0) {
                const style = (seriesSpec as any)?.grid?.style;

                // 兼容一下spec中通过strokeWidth申明的方式
                lineWidth = style?.lineWidth ?? style?.strokeWidth ?? 1;
              }
              return {
                lineWidth,
                stroke: (seriesSpec as any)?.grid?.style?.stroke || '#dfdfdf',
                lineDash: [0, 0]
              };
            }
          },
          // 其他轴元素隐藏
          domainLine: {
            visible: false
          },
          tick: {
            visible: false
          },
          label: {
            visible: false
          },

          // 绑定regionIndex
          regionIndex: region.length - 1
        });

        // seriesSpec绑定regionIndex
        seriesSpec.regionIndex = region.length - 1;

        rowNum++;

        // 增加空行，拟合series padding效果
        rowHeight.push({
          index: rowNum,
          size: seriesSpec?.padding || defaultSeriesPadding
        });
        rowNum++;

        // chart的leftAppendPadding用于具体元素的dx偏移
        (seriesSpec as any).leftAppendPadding = leftAppendPadding;

        // title和subTitle自动定位到画布最左端
        if (seriesSpec.type === SeriesTypeEnum.dot) {
          (seriesSpec as any).title.style.dx = -leftAppendPadding;
          (seriesSpec as any).subTitle.style.dx = -leftAppendPadding;
        }
      }
    });

    // 对于link series，所有属性跟随它绑定的dot series
    spec?.series?.forEach((seriesSpec: ISequenceSeriesSpec) => {
      if (seriesSpec.type === SeriesTypeEnum.link) {
        const dotRowNum = seriesSpec.dotSeriesIndex + 1;
        elements.push({
          modelId: `${seriesSpec.type}Row${dotRowNum}`,
          col: 1,
          row: dotRowNum - 1
        });
        seriesSpec.regionIndex = spec.series[seriesSpec.dotSeriesIndex].regionIndex;
        (seriesSpec as any).leftAppendPadding = leftAppendPadding;
        (seriesSpec as any).height = (spec.series[seriesSpec.dotSeriesIndex] as any).height;
        (seriesSpec as any).clipHeight = (spec.series[seriesSpec.dotSeriesIndex] as any).clipHeight;
      }
    });

    // 添加legends和datazoom的regionIndex
    if ((spec as any)?.legends) {
      (spec as any).legends[0].regionIndex = [region.length - 1];
    }
    // if ((spec as any)?.dataZoom) {
    //   (spec as any).dataZoom[0].regionIndex = Array.from({length: region.length - 1},(item, index)=> index+1);
    // }

    const layout: IGridLayoutSpec = {
      type: 'grid',
      col: 3,
      row: rowNum,
      colWidth: [
        {
          index: 0,
          size: leftAppendPadding
        },
        {
          index: 2,
          size: rightAppendPadding
        }
      ],
      rowHeight: rowHeight,
      elements: elements
    };

    spec.layout = layout;
    spec.region = region;
    spec.axes?.push(...axes);
  }

  /**
   * @override
   * @description 主要是将link series关联的dot data放到link series中
   */
  createSeries(seriesSpec: ISequenceSeriesSpec[]) {
    seriesSpec.forEach((spec, index) => {
      // 自动填充数据
      if (!spec.data) {
        spec.data = this.getSeriesData(spec.dataId, spec.dataIndex);

        // link series添加关联的dot series data
        if (spec.type === SeriesTypeEnum.link) {
          spec.dataDot = this.getSeriesData(
            this._spec.series[spec.dotSeriesIndex].dataId,
            this._spec.series[spec.dotSeriesIndex].dataIndex
          );
        }
      } else {
        // 保证数据最终是 DataView 实例
        spec.data = dataToDataView(spec.data, this._dataSet, this._spec.data as DataView[]);
        // link series添加关联的dot series data
        if (spec.type === SeriesTypeEnum.link) {
          spec.dataDot = dataToDataView(
            this._spec.series[spec.dotSeriesIndex].data,
            this._dataSet,
            this._spec.data as DataView[]
          );
        }
      }

      if (spec.type === SeriesTypeEnum.link) {
        spec.dotSeriesSpec = this._spec.series[spec.dotSeriesIndex];
      }

      let region: IRegion | undefined;
      if (spec.regionId) {
        region = this.getRegionsInUserId(spec.regionId);
      }
      if (!region) {
        region = this.getRegionsInIndex(spec.regionIndex ? [spec.regionIndex] : undefined)[0];
      }
      if (!region) {
        return;
      }
      const series = Factory.createSeries(spec.type, spec, {
        ...this._modelOption,
        region,
        specIndex: index,
        specKey: 'series',
        getTheme: () => this._theme,
        globalScale: this._globalScale
      } as ISeriesOption);

      if (series) {
        series.created();
        this._series.push(series);
        region.addSeries(series);
      }
    });
  }
}
