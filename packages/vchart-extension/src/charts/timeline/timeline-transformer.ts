import { BaseChartSpecTransformer, merge } from '@visactor/vchart';
import type { ICartesianAxisSpec, ICartesianLinearAxisSpec } from '@visactor/vchart';
import type { ITimelineChartSpec } from './interface';

export class TimelineChartSpecTransformer<
  T extends ITimelineChartSpec = ITimelineChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return super._getDefaultSeriesSpec(spec, [
      'timeField',
      'eventField',
      'seriesField',
      'dotTypeField',
      'titleField',
      'subTitleField',
      'dot',
      'title',
      'subTitle',
      'symbol'
    ]);
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    this.transformSeriesSpec(spec);

    // 确定 direction（通过轴方向推断）
    const rawAxis = spec.axes?.[0];
    const axisOrient = rawAxis?.orient;

    // 默认为 horizontal
    let direction: 'horizontal' | 'vertical' = 'horizontal';
    if (axisOrient === 'left' || axisOrient === 'right') {
      direction = 'vertical';
    } else if (axisOrient === 'bottom' || axisOrient === 'top') {
      direction = 'horizontal';
    }

    // 确定默认的轴方向和类型
    const defaultOrient = direction === 'vertical' ? 'left' : 'bottom';
    const allowedOrients = direction === 'vertical' ? ['left', 'right'] : ['bottom', 'top'];
    const orientNormalized: ICartesianAxisSpec['orient'] = allowedOrients.includes(axisOrient ?? '')
      ? (axisOrient as ICartesianAxisSpec['orient'])
      : (defaultOrient as ICartesianAxisSpec['orient']);

    // 确定轴类型，默认为 band
    const axisType = rawAxis?.type ?? 'band';
    const typeNormalized: ICartesianAxisSpec['type'] =
      axisType === 'linear' || axisType === 'time' || axisType === 'band' ? (axisType as any) : 'band';

    // 构建轴配置
    const baseAxis: ICartesianAxisSpec = merge(
      {
        label: {
          visible: false
        },
        tick: {
          visible: false
        },
        grid: {
          visible: false
        },
        domainLine: {
          visible: false
        }
      },
      orientNormalized === 'left' || orientNormalized === 'right'
        ? {
            inverse: true
          }
        : {},
      typeNormalized === 'band' ? { paddingInner: 0, paddingOuter: 0 } : {},
      {
        ...((rawAxis ?? {}) as ICartesianAxisSpec),
        orient: orientNormalized,
        type: typeNormalized
      }
    );

    // 检查是否有 seriesField，如果有则需要创建第二个分类轴
    const hasSeriesField = spec.series?.some(s => s.seriesField);

    if (baseAxis.type === 'linear') {
      const linearAxis: ICartesianLinearAxisSpec = {
        ...(baseAxis as ICartesianLinearAxisSpec),
        zero: (rawAxis as ICartesianLinearAxisSpec)?.zero ?? false
      };
      spec.axes = [linearAxis];
    } else {
      spec.axes = [baseAxis];
    }

    // 如果有 seriesField，需要创建第二个分类轴
    if (hasSeriesField) {
      const categoryAxisOrient = direction === 'vertical' ? 'bottom' : 'left';
      const categoryAxis: ICartesianAxisSpec = {
        orient: categoryAxisOrient,
        type: 'band',
        label: {
          visible: false
        },
        tick: {
          visible: false
        },
        grid: {
          visible: false
        },
        domainLine: {
          visible: false
        }
      };

      // 将分类轴添加到轴列表中
      if (direction === 'vertical') {
        // vertical: 时间轴在前，分类轴在后
        spec.axes = [spec.axes[0], categoryAxis];
      } else {
        // horizontal: 时间轴在前，分类轴在后
        spec.axes = [spec.axes[0], categoryAxis];
      }
    }

    // 将 direction 传递给 series，并设置 xField/yField 以便轴系统收集数据
    spec.series?.forEach(seriesSpec => {
      if (!seriesSpec.direction) {
        seriesSpec.direction = direction;
      }

      // 根据 direction 将 timeField 映射到 xField 或 yField
      // 这样轴系统才能正确收集数据
      if (direction === 'vertical') {
        // vertical 布局：y 轴是时间方向
        if (seriesSpec.timeField && !seriesSpec.yField) {
          seriesSpec.yField = seriesSpec.timeField;
        }
        // x 轴是分类方向（如果没有 seriesField，创建一个虚拟字段）
        if (!seriesSpec.xField) {
          seriesSpec.xField = seriesSpec.seriesField || '__vchart_timeline_dummy__';
        }
      } else {
        // horizontal 布局：x 轴是时间方向
        if (seriesSpec.timeField && !seriesSpec.xField) {
          seriesSpec.xField = seriesSpec.timeField;
        }
        // y 轴是分类方向（如果没有 seriesField，创建一个虚拟字段）
        if (!seriesSpec.yField) {
          seriesSpec.yField = seriesSpec.seriesField || '__vchart_timeline_dummy__';
        }
      }
    });
  }
}
