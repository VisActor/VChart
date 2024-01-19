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
 * replace invalid characters in sql str and get the replace map
 * @param sql
 * @returns
 */
export const preprocessSQL = (sql: string, fieldInfo: SimpleFieldInfo[]) => {
  //replace \n to space
  const noNewLine = sql.replace('\n', ' ');
  //replace operator inside the field name in the sql str
  const operatorMap = {
    '+': `_PLUS_${generateRandomString(10)}_`,
    '-': `_MINUS_${generateRandomString(10)}_`,
    '*': `_MULTI_${generateRandomString(10)}_`,
    '/': `_DIVIDE_${generateRandomString(10)}_`,
    key: `_KEY_${generateRandomString(10)}_`,
    KEY: `_KEY_${generateRandomString(10)}_`
  };
  let validSQL = noNewLine;
  fieldInfo.forEach(field => {
    const { fieldName } = field;
    let validFieldName = fieldName;
    Object.keys(operatorMap).forEach(operator => {
      const validOperator = operatorMap[operator];
      validFieldName = validFieldName.replace(operator, validOperator);
    });
    validSQL = validSQL.replace(fieldName, validFieldName);
  });
  const { validStr, replaceMap } = replaceNonASCIICharacters(validSQL);
  Object.keys(operatorMap).forEach(key => {
    replaceMap.set(operatorMap[key], key);
  });
  return { validStr, replaceMap };
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
  if (replaceMap.has(str)) {
    return replaceMap.get(str);
  } else {
    //Some string may be linked by ASCII characters as non-ASCII characters.Traversing the replaceMap and replaced it to the original character
    const replaceKeys = [...replaceMap.keys()];
    return replaceKeys.reduce((prev, cur) => {
      return prev.replace(cur, replaceMap.get(cur));
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
  dataset: DataItem[]
) => responseFieldInfo.map(field => ({ ...field, ...detectFieldType(dataset, field.fieldName) }));
