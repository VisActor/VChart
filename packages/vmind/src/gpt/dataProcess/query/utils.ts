import { isString } from 'lodash';
import { Query } from '../../../calculator';
import { detectFieldType } from '../../../common/dataProcess/utils';
import { DataItem, SimpleFieldInfo } from '../../../typings';
import { ASTParserContext, ASTParserPipe } from './type';

function generateRandomString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const swapMap = (map: Map<string, string>) => {
  //swap the map
  const swappedMap = new Map();

  // Swap key with value
  map.forEach((value, key) => {
    swappedMap.set(value, key);
  });
  return swappedMap;
};

/**
 * replace operator and reserved words inside the field name in the sql str
 * @param fieldInfo
 */
export const replaceOperator = (fieldInfo: SimpleFieldInfo[]) => {
  const operatorMap = {
    '+': `_PLUS_`,
    '-': `_DASH_`,
    '*': `_ASTERISK_`,
    '/': `_SLASH_`
  };
  const replaceMap = new Map<string, string>();
  const validFieldInfo = fieldInfo.map((field: SimpleFieldInfo) => {
    const { fieldName } = field;
    let validFieldName = fieldName;
    Object.keys(operatorMap).forEach(operator => {
      validFieldName = validFieldName.split(operator).join(operatorMap[operator]);
      if (validFieldName !== fieldName) {
        replaceMap.set(validFieldName, fieldName);
      }
    });
    return {
      ...field,
      fieldName: validFieldName
    };
  });
  return { validFieldInfo, replaceMap };
};

/**
 * replace invalid characters in sql str and get the replace map
 * @param sql
 * @returns
 */
export const preprocessSQL = (sql: string, fieldInfo: SimpleFieldInfo[]) => {
  //replace \n to space
  const noNewLine = sql.replace('\n', ' ');
  //replace reserved words inside the field name in the sql str
  const reservedMap = {
    KEY: `_KEY_${generateRandomString(10)}_`
  };
  let validSQL = noNewLine;
  const reservedReplaceMap: Map<string, string> = new Map();

  fieldInfo.forEach(field => {
    const { fieldName } = field;
    let validFieldName = fieldName;
    Object.keys(reservedMap).forEach(reserveWord => {
      if (validFieldName.toUpperCase().includes(reserveWord)) {
        const validWord = reservedMap[reserveWord];
        validFieldName = validFieldName.toUpperCase().replace(new RegExp(reserveWord, 'g'), validWord);
      }
    });
    validSQL = validSQL.replace(new RegExp(fieldName, 'g'), validFieldName);
    if (fieldName !== validFieldName) {
      reservedReplaceMap.set(validFieldName, fieldName);
    }
  });
  const { validStr, replaceMap } = replaceNonASCIICharacters(validSQL);
  // merge the two replace map
  const mergedMap = mergeMap(replaceMap, reservedReplaceMap);

  return { validStr, replaceMap: mergedMap };
};

/**
 * replace all the non-ascii characters in the sql str into valid strings.
 * @param str
 * @returns
 */
export const replaceNonASCIICharacters = (str: string) => {
  const nonAsciiCharMap = new Map();

  const newStr = str.replace(/([^\x00-\x7F]+)/g, m => {
    let replacement;
    if (nonAsciiCharMap.has(m)) {
      replacement = nonAsciiCharMap.get(m);
    } else {
      replacement = generateRandomString(10);
      nonAsciiCharMap.set(m, replacement);
    }
    return replacement;
  });

  const swappedMap = swapMap(nonAsciiCharMap);

  return { validStr: newStr, replaceMap: swappedMap };
};

/**
 * replace random strings into its original string according to replaceMap
 * @param str
 * @param replaceMap
 * @returns
 */
export const getOriginalString = (str: string, replaceMap: Map<string, string>) => {
  if (!isString(str)) {
    return str;
  }
  if (replaceMap.has(str)) {
    return replaceMap.get(str);
  } else {
    //Some string may be linked by ASCII characters as non-ASCII characters.Traversing the replaceMap and replaced it to the original character
    const replaceKeys = [...replaceMap.keys()];
    return replaceKeys.reduce((prev, cur) => {
      return prev.replace(new RegExp(cur, 'g'), replaceMap.get(cur));
    }, str);
  }
};

export const addQuotes = (sqlString: string) => {
  let newSQLString = '';
  let startIdx = 0;

  while (startIdx < sqlString.length) {
    // try to find the start and end position of quotes
    let startQuoteIdx = sqlString.indexOf('[', startIdx);
    if (startQuoteIdx === -1) {
      // no quotes found
      startQuoteIdx = sqlString.length;
    }
    let endQuoteIdx = sqlString.indexOf(']', startQuoteIdx + 1);
    if (endQuoteIdx === -1) {
      endQuoteIdx = sqlString.length;
    }

    // handle the part without quotes
    let noQuotesPart = sqlString.substring(startIdx, startQuoteIdx);
    const regex = /([^\x00-\x7F]+)/g;
    noQuotesPart = noQuotesPart.replace(regex, match => `[${match}]`);

    // handle the part with quotes
    const quotesPart = sqlString.substring(startQuoteIdx, endQuoteIdx + 1);

    // add them to the result
    newSQLString += noQuotesPart + quotesPart;

    // move startIdx to the end of quotes
    startIdx = endQuoteIdx + 1;
  }

  return newSQLString;
};

export const execPipeline = (src: Partial<Query>, pipes: ASTParserPipe[], context: ASTParserContext) =>
  pipes.reduce((pre: Partial<Query>, pipe: ASTParserPipe) => {
    const result = pipe(pre, context);
    // console.log(result);
    return result;
  }, src);

export const toFirstUpperCase = (name = '') => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

export const checkIsColumnNode = (node: any, columns: any, fieldInfo: SimpleFieldInfo[]) => {
  if (node.type === 'column_ref') {
    return true;
  }
  return false;
  //else {
  //  const columnNameList = columns
  //    .map((c: any) => c.column)
  //    .concat(columns.map((c: any) => c.alias))
  //    .concat(fieldInfo.map(field => field.fieldName))
  //    .filter(Boolean);
  //  const columnName = node.column ?? node.value;
  //  return columnNameList.includes(columnName);
  //}
};

/**
 * parse the respond field in data query to get field type and role
 * @param fieldInfo
 * @param responseFieldInfo
 * @param dataset
 */
export const parseRespondField = (
  responseFieldInfo: { fieldName: string; description?: string }[],
  dataset: DataItem[],
  replaceMap: Map<string, string>
) =>
  responseFieldInfo.map(field => ({
    ...field,
    ...detectFieldType(dataset, field.fieldName),
    fieldName: getOriginalString(field.fieldName, replaceMap)
  }));

/**
 * merge two maps
 * @param map1
 * @param map2
 * @returns
 */
export const mergeMap = (map1: Map<string, string>, map2: Map<string, string>) => {
  // merge map2 into map1
  map2.forEach((value, key) => {
    map1.set(key, value);
  });
  return map1;
};

export const patchQueryInput = (userInput: string) => {
  return userInput + " Don't use JOIN and subquery in sql. Don't use Rank() in SQL.";
};
