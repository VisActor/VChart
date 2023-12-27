import { GPTDataProcessResult, ILLMOptions } from '../typings';
import axios from 'axios';
import JSON5 from 'json5';

export const requestGPT = async (prompt: string, userMessage: string, options: ILLMOptions | undefined) => {
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  const url: string = options?.url ?? OPENAI_API_URL;

  const headers = { ...(options.headers ?? {}), 'Content-Type': 'application/json' };
  const res = await axios(url, {
    method: options?.method ?? 'POST',
    headers, //must has Authorization: `Bearer ${openAIKey}` if use openai api
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
      max_tokens: options?.max_tokens ?? 2000,
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
