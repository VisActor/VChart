import axios from 'axios';
import { GPTDataProcessResult, IGPTOptions } from '../typings';
import { isValid } from '@visactor/vutils';
import JSON5 from 'json5';

export const requestGPT = async (
  openAIKey: string | undefined,
  prompt: string,
  userMessage: string,
  options: IGPTOptions | undefined
) => {
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  const url: string = options?.url ?? OPENAI_API_URL;
  const defaultHeaders: HeadersInit = isValid(openAIKey)
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIKey}`
      }
    : { 'Content-Type': 'application/json' };

  const res = await axios(url, {
    method: options?.method ?? 'POST',
    headers: options?.headers ?? (defaultHeaders as any),
    data: {
      model: options?.model ?? 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: options?.max_tokens ?? 1500,
      temperature: options?.temperature ?? 0
    }
  })
    .then(response => response.data)
    .then(data => data.choices);

  return res;
};

export const parseGPTJson = (JsonStr: string, prefix?: string) => {
  const parseNoPrefixStr = (str: string) => {
    //尝试不带前缀的解析
    try {
      return JSON5.parse(str);
    } catch (err) {
      console.info(err);
      return {
        error: true
      };
    }
  };
  //解析GPT返回的JSON格式
  if (prefix) {
    //被某些字符包裹
    const splittedStr = JsonStr.split(prefix)[1];
    const res = parseNoPrefixStr(splittedStr);
    if (!res.error) {
      return res;
    }
  }
  //没有被前缀包裹，或者解析被前缀包裹的json失败，尝试直接解析返回结果
  const res2 = parseNoPrefixStr(JsonStr);
  return res2;
};

export const parseGPTResponse = (GPTRes: any) => {
  const content = GPTRes[0].message.content;
  const resJson: GPTDataProcessResult = parseGPTJson(content, '```');
  return resJson;
};

export const readTopNLine = (csvFile: string, n: number) => {
  let res = '';
  //可能的分隔符：\r,\n,\r\n
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

export const detectAxesType = (values: any[], field: string) => {
  const isNumber = values.every(d => !d[field] || !isNaN(Number(d[field])));
  if (isNumber) {
    return 'linear';
  } else {
    return 'band';
  }
};

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

export const CARTESIAN_CHART_LIST = [
  'Dynamic Bar Chart',
  'Bar Chart',
  'Line Chart',
  'Scatter Plot',
  'Funnel Chart',
  'Dual Axis Chart',
  'Waterfall Chart',
  'Box Plot Chart'
];
