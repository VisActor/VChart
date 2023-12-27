import { sampleSize, isNumber, isInteger } from 'lodash';
import { DataItem, DataType, ROLE, SimpleFieldInfo } from '../../typings';
import dayjs from 'dayjs';
export const readTopNLine = (csvFile: string, n: number) => {
  // get top n lines of a csv file
  let res = '';
  //possible separators.：\r,\n,\r\n
  const finish = ['\r\n', '\r', '\n'].some(splitter => {
    if (csvFile.includes(splitter)) {
      res = csvFile
        .split(splitter)
        .slice(0, n + 1)
        .join(splitter);
      return true;
    }
    return false;
  });
  if (finish) {
    return res;
  }
  return csvFile;
};
function isDecimal(n: any) {
  return isNumber(n) && !isInteger(n);
}
function validateDate(date: any) {
  //check if the string is a data string
  //only support YYYY-MM-DD and MM-DD
  return dayjs(date, 'YYYY-MM-DD').isValid() || dayjs(date, 'MM-DD').isValid();
}
export const getFieldInfoFromDataset = (dataset: DataItem[], columns: string[]): SimpleFieldInfo[] => {
  let sampledDataset = dataset;
  if (dataset.length > 1000) {
    //sample the dataset if too large
    sampledDataset = sampleSize(dataset, 1000);
  }
  return columns.map(column => {
    let fieldType: DataType | undefined = undefined;
    //detect field type based on rules
    //The data types have the following inclusion relationships:
    //date=>string
    //int=>float=>string
    //detect field type from strict to loose
    sampledDataset.every(data => {
      const value = data[column];
      const numberValue = Number(value);
      if (!fieldType) {
        //no accurate fieldType at the beginning, make the first one as fieldType
        if (!isNaN(numberValue)) {
          if (isInteger(numberValue)) {
            fieldType = DataType.INT;
          } else {
            fieldType = DataType.FLOAT;
          }
        } else if (validateDate(value)) {
          //check if the value is date
          fieldType = DataType.DATE;
        } else {
          fieldType = DataType.STRING;
        }
        return true;
      } else {
        //already has a fieldType, check consistency
        if (fieldType == DataType.DATE && !validateDate(value)) {
          //current value is not date, field is string type
          fieldType = DataType.STRING;
          return false;
        }
        if (fieldType == DataType.INT) {
          if (isNaN(numberValue)) {
            //current value is not number, field is string type
            fieldType = DataType.STRING;
            return false;
          } else if (!isInteger(numberValue)) {
            //current value is not int, convert to float type and continue checking
            fieldType = DataType.FLOAT;
            return true;
          }
          return true;
        }
        if (fieldType == DataType.FLOAT) {
          if (isNaN(numberValue)) {
            //current value is not number, field is string type
            fieldType = DataType.STRING;
            return false;
          }
          return true;
        }
        if (fieldType == DataType.STRING) {
          //no need to detect.
          return false;
        }
        return true;
      }
    });
    return {
      fieldName: column,
      type: fieldType,
      role: [DataType.STRING, DataType.DATE].includes(fieldType) ? ROLE.DIMENSION : ROLE.MEASURE
    };
  });
};
