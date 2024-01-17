import { Query } from '../../../common/vizCalculator';
import { ASTParserContext, ASTParserPipe } from './type';

export const preprocessSQL = (sql: string) => {
  //replace \n to space and add quotes to wrap non-ascii characters
  return addQuotes(sql.replace('\n', ' '));
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
