import { Query } from '../../../calculator';
import { detectFieldType } from '../../../common/dataProcess/utils';
import { DataItem, SimpleFieldInfo } from '../../../typings';
import { ASTParserContext, ASTParserPipe } from './type';

/**
 * replace invalid characters in sql str and get the replace map
 * @param sql
 * @returns
 */
export const preprocessSQL = (sql: string) => {
  //replace \n to space
  return replaceNonASCIICharacters(sql.replace('\n', ' '));
};

/**
 * replace all the non-ascii characters in the sql str into valid strings.
 * @param str
 * @returns
 */
export const replaceNonASCIICharacters = (str: string) => {
  function generateRandomString(len: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const nonAsciiCharMap = new Map();

  const newStr = str.replace(/([^\x00-\x7F]+)/g, m => {
    let replacement;
    if (nonAsciiCharMap.has(m)) {
      replacement = nonAsciiCharMap.get(m);
    } else {
      replacement = generateRandomString(5);
      nonAsciiCharMap.set(replacement, m);
    }
    return replacement;
  });

  return { validStr: newStr, replaceMap: nonAsciiCharMap };
};

export const getOriginalString = (str: string, replaceMap: Map<string, string>) => {
  if (replaceMap.has(str)) {
    return replaceMap.get(str);
  }
  return str;
};

export const addQuotes = (sqlString: string) => {
  let newSQLString = '';
  let startIdx = 0;

  while (startIdx < sqlString.length) {
    // try to find the start and end position of quotes
    let startQuoteIdx = sqlString.indexOf('"', startIdx);
    if (startQuoteIdx === -1) {
      // no quotes found
      startQuoteIdx = sqlString.length;
    }
    let endQuoteIdx = sqlString.indexOf('"', startQuoteIdx + 1);
    if (endQuoteIdx === -1) {
      endQuoteIdx = sqlString.length;
    }

    // handle the part without quotes
    let noQuotesPart = sqlString.substring(startIdx, startQuoteIdx);
    const regex = /([^\x00-\x7F]+)/g;
    noQuotesPart = noQuotesPart.replace(regex, match => `"${match}"`);

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
