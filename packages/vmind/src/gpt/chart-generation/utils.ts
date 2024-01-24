import { isNil } from 'lodash';
import { CARTESIAN_CHART_LIST, detectAxesType } from '../../common/vizDataToSpec/utils';

export const patchUserInput = (userInput: string) => {
  const FULL_WIDTH_SYMBOLS = ['，', '。'];
  const HALF_WIDTH_SYMBOLS = [',', '.'];

  const BANNED_WORD_LIST = ['动态'];
  const ALLOWED_WORD_LIST = ['动态条形图', '动态柱状图', '动态柱图'];
  const PLACEHOLDER = '_USER_INPUT_PLACE_HOLDER';
  const tempStr1 = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(cur).join(PLACEHOLDER + '_' + index);
  }, userInput);
  const tempStr2 = BANNED_WORD_LIST.reduce((prev, cur) => {
    return prev.split(cur).join('');
  }, tempStr1);
  const replacedStr = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(PLACEHOLDER + '_' + index).join(cur);
  }, tempStr2);

  let finalStr = HALF_WIDTH_SYMBOLS.reduce((prev, cur, index) => {
    return prev.split(HALF_WIDTH_SYMBOLS[index]).join(FULL_WIDTH_SYMBOLS[index]);
  }, replacedStr);
  const lastCharacter = finalStr[finalStr.length - 1];
  if (!FULL_WIDTH_SYMBOLS.includes(lastCharacter) && !HALF_WIDTH_SYMBOLS.includes(lastCharacter)) {
    finalStr += '。';
  }
  finalStr +=
    '严格按照prompt中的格式回复，不要有任何多余内容。 Use the original fieldName and DO NOT change or translate any word of the data fields in the response.';
  return finalStr;
};

export const patchChartTypeAndCell = (chartTypeOutter: string, cell: any, dataset: any[]) => {
  //对GPT返回结果进行修正
  //某些时候由于用户输入的意图不明确，GPT返回的cell中可能缺少字段。
  //此时需要根据规则补全
  //TODO: 多个y字段时，使用fold

  const { x, y } = cell;

  let chartType = chartTypeOutter;
  // y轴字段有多个时，处理方式:
  // 1. 图表类型为: 箱型图, 图表类型不做矫正
  // 2. 图表类型为: 柱状图 或 折线图, 图表类型矫正为双轴图
  // 3. 其他情况, 图表类型矫正为散点图
  if (y && typeof y !== 'string' && y.length > 1) {
    if (chartType === 'BOX PLOT') {
      return {
        chartTypeNew: chartType,
        cellNew: cell
      };
    }
    if (chartType === 'BAR CHART' || chartType === 'LINE CHART') {
      chartType = 'DUAL AXIS CHART';
    } else {
      return {
        chartTypeNew: 'SCATTER PLOT',
        cellNew: {
          ...cell,
          x: y[0],
          y: y[1],
          color: typeof x === 'string' ? x : x[0]
        }
      };
    }
  }
  if (chartType === 'BOX PLOT') {
    if (typeof y === 'string' && y.split(',').length > 1) {
      return {
        chartTypeNew: 'BOX PLOT',
        cellNew: {
          ...cell,
          y: y.split(',').map(str => str.trim())
        }
      };
    } else if (isNil(y) || y.length === 0) {
      const { lower_whisker, min, lower, q1, median, q3, upper_whisker, max, upper } = cell;
      return {
        chartTypeNew: 'BOX PLOT',
        cellNew: {
          ...cell,
          y: [lower_whisker, min, lower, q1, median, q3, upper_whisker, max, upper].filter(Boolean)
        }
      };
    }
  }
  //双轴图 订正yLeft和yRight
  if (chartType === 'DUAL AXIS CHART' && cell.yLeft && cell.yRight) {
    return {
      chartTypeNew: chartType,
      cellNew: { ...cell, y: [cell.yLeft, cell.yRight] }
    };
  }
  //饼图 必须有color字段和angle字段
  if (chartType === 'PIE CHART' || chartType === 'ROSE CHART') {
    const cellNew = { ...cell, color: cell.color ?? cell.category };
    if (!cellNew.color || !cellNew.angle) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      if (!cellNew.color) {
        //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
        const colorField = remainedFields.find(f => {
          const fieldType = detectAxesType(dataset, f);
          return fieldType === 'band';
        });
        if (colorField) {
          cellNew.color = colorField;
        } else {
          cellNew.color = remainedFields[0];
        }
      }
      if (!cellNew.angle) {
        //没有分配角度字段，从剩下的字段里选择一个连续字段分配到角度上
        const angleField = remainedFields.find(f => {
          const fieldType = detectAxesType(dataset, f);
          return fieldType === 'linear';
        });
        if (angleField) {
          cellNew.angle = angleField;
        } else {
          cellNew.angle = remainedFields[0];
        }
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }
  //词云 必须有color字段和size字段
  if (chartType === 'WORD CLOUD') {
    const cellNew = { ...cell };
    if (!cellNew.size || !cellNew.color || cellNew.color === cellNew.size) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      //首先根据cell中的其他字段选择size和color
      //若没有，则从数据的剩余字段中选择
      if (!cellNew.size || cellNew.size === cellNew.color) {
        const newSize = cellNew.weight ?? cellNew.fontSize;
        if (newSize) {
          cellNew.size = newSize;
        } else {
          const sizeField = remainedFields.find(f => {
            const fieldType = detectAxesType(dataset, f);
            return fieldType === 'linear';
          });
          if (sizeField) {
            cellNew.size = sizeField;
          } else {
            cellNew.size = remainedFields[0];
          }
        }
      }
      if (!cellNew.color) {
        const newColor = cellNew.text ?? cellNew.word ?? cellNew.label ?? cellNew.x;
        if (newColor) {
          cellNew.color = newColor;
        } else {
          const colorField = remainedFields.find(f => {
            const fieldType = detectAxesType(dataset, f);
            return fieldType === 'band';
          });
          if (colorField) {
            cellNew.color = colorField;
          } else {
            cellNew.color = remainedFields[0];
          }
        }
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }
  if (chartType === 'DYNAMIC BAR CHART') {
    const cellNew = { ...cell };

    if (!cell.time || cell.time === '' || cell.time.length === 0) {
      const flattenedXField = Array.isArray(cell.x) ? cell.x : [cell.x];
      const usedFields = Object.values(cellNew).filter(f => !Array.isArray(f));
      usedFields.push(...flattenedXField);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));

      //动态条形图没有time字段，选择一个离散字段作为time
      const timeField = remainedFields.find(f => {
        const fieldType = detectAxesType(dataset, f);
        return fieldType === 'band';
      });
      if (timeField) {
        cellNew.time = timeField;
      } else {
        cellNew.time = remainedFields[0];
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }
  //直角坐标图表 必须有x字段
  if (CARTESIAN_CHART_LIST.map(chart => chart.toUpperCase()).includes(chartType)) {
    const cellNew = { ...cell };
    if (!cellNew.x) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      //没有分配x字段，从剩下的字段里选择一个离散字段分配到x上
      const xField = remainedFields.find(f => {
        const fieldType = detectAxesType(dataset, f);
        return fieldType === 'band';
      });
      if (xField) {
        cellNew.x = xField;
      } else {
        cellNew.x = remainedFields[0];
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }

  return {
    chartTypeNew: chartType,
    cellNew: cell
  };
};
