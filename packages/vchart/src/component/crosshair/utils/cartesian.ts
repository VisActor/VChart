import type { BandScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous, isDiscrete } from '@visactor/vscale';
import type { ICartesianSeries } from '../../../series';
import type { ILayoutPoint, StringOrNumber } from '../../../typings';
import type {
  AxisCurrentValueMap,
  CrossHairStateByField,
  CrossHairStateItem,
  IBound,
  ICrosshairInfo,
  ICrosshairLabelInfo,
  IHair
} from '../interface';
import { getDatumByValue } from './common';
import { getAxisLabelOffset } from '../../axis/util';
import { isValid } from '@visactor/vutils';
import type { IAxis, ILinearAxis } from '../../axis';
import { getFormatFunction } from '../../util';

export const layoutByValue = (
  stateByField: CrossHairStateByField,
  series: ICartesianSeries,
  layoutStartPoint: ILayoutPoint,
  enableRemain: boolean = false
) => {
  if (!layoutStartPoint) {
    layoutStartPoint = { x: 0, y: 0 };
  }

  Object.keys(stateByField).forEach(field => {
    const { currentValue, cacheInfo, labelsComp, attributes, coordKey } = stateByField[field];
    let axis = null;
    let coord = 0;

    if (currentValue.size) {
      const item = Array.from(currentValue.values())[0];
      coord =
        item.axis.getScale().scale(item.datum) +
        item.axis.getLayoutStartPoint()[coordKey as 'x' | 'y'] -
        layoutStartPoint[coordKey as 'x' | 'y'];
      axis = item.axis;
    }
    const isVisible = !!currentValue.size && Number.isFinite(coord);
    const useCache = enableRemain && !isVisible && isValid(cacheInfo);
    const newCacheInfo: ICrosshairInfo = useCache
      ? cacheInfo
      : {
          coordRange: [0, 0],
          sizeRange: [0, 0],
          coord,
          labelsTextStyle: {},
          labels: labelsComp
            ? Object.keys(labelsComp).reduce((res: Record<string, ICrosshairLabelInfo>, labelKey: string) => {
                res[labelKey] = { visible: false, text: '', dx: 0, dy: 0 };

                return res;
              }, {})
            : null,
          visible: isVisible,
          axis
        };
    if (newCacheInfo) {
      newCacheInfo._isCache = useCache;
    }
    let bandSize;
    let offsetSize: number = 0;

    // 计算x轴和y轴的数据，只允许最多一对x和一对y
    if (attributes) {
      currentValue.forEach(({ axis, datum: value = '' }) => {
        let niceLabelFormatter: (value: StringOrNumber) => StringOrNumber = null;
        const scale = axis.getScale();
        if (isDiscrete(scale.type)) {
          bandSize = (scale as BandScale).bandwidth();

          if (bandSize === 0 && (scale as BandScale).step) {
            offsetSize = (scale as BandScale).step();
          }
        } else if (isContinuous(scale.type)) {
          const field1 = field === 'xField' ? series.fieldX[0] : series.fieldY[0]; // todo
          const field2 = field === 'xField' ? series.fieldX2 : series.fieldY2; // todo
          const datum = getDatumByValue(series.getViewData().latestData, +value, field1, field2);
          if (datum) {
            const startX = field === 'xField' ? series.dataToPositionX(datum) : series.dataToPositionY(datum);
            if (field2) {
              bandSize = Math.abs(
                startX - (field === 'xField' ? series.dataToPositionX1(datum) : series.dataToPositionY1(datum))
              );
              value = `${datum[field1]} ~ ${datum[field2]}`;
            } else {
              bandSize = 1;
            }
            coord = startX;
          }
          niceLabelFormatter = (axis as ILinearAxis).niceLabelFormatter;
        }
        if (newCacheInfo && attributes.label?.visible && !useCache) {
          const labelOffset = getAxisLabelOffset(axis.getSpec());
          const axisOrient = axis.getOrient();

          if (newCacheInfo.labels[axisOrient]) {
            newCacheInfo.labels[axisOrient].visible = true;
            newCacheInfo.labels[axisOrient].text = value;
            if (axisOrient === 'left') {
              newCacheInfo.labels[axisOrient].dx = -labelOffset;
              newCacheInfo.labelsTextStyle[axisOrient] = {
                textAlign: 'right',
                textBaseline: 'middle'
              };
            } else if (axisOrient === 'right') {
              newCacheInfo.labels[axisOrient].dx = labelOffset;
              newCacheInfo.labelsTextStyle[axisOrient] = {
                textAlign: 'left',
                textBaseline: 'middle'
              };
            } else if (axisOrient === 'top') {
              newCacheInfo.labels[axisOrient].y = 0;
              newCacheInfo.labels[axisOrient].dy = -labelOffset;
              newCacheInfo.labelsTextStyle[axisOrient] = {
                textAlign: 'center',
                textBaseline: 'bottom'
              };
            } else if (axisOrient === 'bottom') {
              newCacheInfo.labels[axisOrient].dy = labelOffset;
              newCacheInfo.labelsTextStyle[axisOrient] = {
                textAlign: 'center',
                textBaseline: 'top'
              };
            }
            newCacheInfo.labels[axisOrient].defaultFormatter = niceLabelFormatter;
          }
        }
      });
    }

    if (newCacheInfo && !useCache) {
      const region = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
      setRegionArea(region, currentValue);
      if (field === 'xField') {
        newCacheInfo.coordRange = [region.x1, region.x2];
        newCacheInfo.sizeRange = [region.y1, region.y2];
        newCacheInfo.coord = coord + layoutStartPoint.x;
        if (newCacheInfo.labels) {
          newCacheInfo.labels.top.y = region.y1;
          newCacheInfo.labels.bottom.y = region.y2;
        }
      } else {
        newCacheInfo.coordRange = [region.y1, region.y2]; // todo
        newCacheInfo.sizeRange = [region.x1, region.x2];
        newCacheInfo.coord = coord + layoutStartPoint.y;

        if (newCacheInfo.labels) {
          newCacheInfo.labels.left.x = region.x1;
          newCacheInfo.labels.right.x = region.x2;
        }
      }

      if (newCacheInfo.coord < newCacheInfo.coordRange[0] || newCacheInfo.coord > newCacheInfo.coordRange[1]) {
        newCacheInfo.visible = false;
      }

      if (attributes && attributes.label) {
        Object.keys(newCacheInfo.labels).forEach(labelKey => {
          if (newCacheInfo.labels[labelKey].visible) {
            setFormattedCrosshairLabel(newCacheInfo.labels[labelKey], labelKey, attributes.label);
          }
        });
      }
    }

    stateByField[field].bandSize = bandSize ?? 0;
    stateByField[field].offsetSize = offsetSize;
    stateByField[field].cacheInfo = newCacheInfo;
  });

  return stateByField;
};

const setFormattedCrosshairLabel = (labelInfo: ICrosshairLabelInfo, position: string, labelSpec: IHair['label']) => {
  const { formatMethod, formatter } = labelSpec;
  const { formatFunc, args } = getFormatFunction(formatMethod, formatter, labelInfo.text, {
    label: labelInfo.text,
    position
  });
  if (formatFunc) {
    labelInfo.text = formatFunc(...args);
  } else if (labelInfo.defaultFormatter) {
    labelInfo.text = labelInfo.defaultFormatter(labelInfo.text);
  }
};

// 计算x轴和y轴对应的region区域
const setRegionArea = (outRegion: IBound, currentValue: AxisCurrentValueMap) => {
  currentValue.forEach(({ axis }) => {
    const regions = axis.getRegions();
    regions.forEach(r => {
      const { x, y } = r.getLayoutStartPoint();
      const { width, height } = r.getLayoutRect();

      outRegion.x1 = Math.min(outRegion.x1, x);
      outRegion.y1 = Math.min(outRegion.y1, y);
      outRegion.x2 = Math.max(outRegion.x2, x + width);
      outRegion.y2 = Math.max(outRegion.y2, y + height);
    });
  });
};

export const layoutCrosshair = (stateItem: CrossHairStateItem) => {
  const { cacheInfo, attributes, bandSize, offsetSize, coordKey, anotherAxisKey } = stateItem;
  const { coord, sizeRange } = cacheInfo;

  // 外部设置的size
  const type = attributes.type;
  let positionAttribute;
  if (type === 'line') {
    const pos = coord + bandSize / 2;

    positionAttribute = {
      visible: true,
      start: { [coordKey]: pos, [anotherAxisKey]: sizeRange[0] },
      end: { [coordKey]: pos, [anotherAxisKey]: sizeRange[1] }
    };
  } else if (type === 'rect') {
    const extend = getRectSize(attributes, bandSize, cacheInfo.axis);
    const { coordRange } = cacheInfo;

    positionAttribute = {
      visible: true,
      start: {
        [coordKey]: Math.max(coord - extend / 2 - offsetSize / 2, coordRange[0]),
        [anotherAxisKey]: sizeRange[0]
      },
      end: {
        [coordKey]: Math.min(coord + bandSize + extend / 2 + offsetSize / 2, coordRange[1]),
        [anotherAxisKey]: sizeRange[1]
      }
    };
  }

  return positionAttribute;
};

const getRectSize = (hair: IHair, bandSize: number, axis: IAxis) => {
  // 外部设置的size
  let extend = 0;
  if (hair.style?.sizePercent) {
    extend = (hair.style.sizePercent - 1) * bandSize;
  } else if (typeof hair.style?.size === 'number') {
    extend = hair.style.size - bandSize;
  } else if (typeof hair.style?.size === 'function') {
    const axisRect = axis.getLayoutRect();
    extend = hair.style.size(axisRect, axis) - bandSize;
  }

  return extend;
};
