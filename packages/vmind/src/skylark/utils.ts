import yaml from 'js-yaml';
import { LLMResponse } from '../typings';

const startsWithTextAndColon = (str: string) => {
  const regex = /^.+\:/;
  return regex.test(str);
};

const isStringArray = (str: string) => {
  const regex = /^(.*)\: ".+"(, ".+")+$/;
  return regex.test(str);
};
export const parseSkylarkResponse = (larkResponse: LLMResponse): Record<string, any> => {
  try {
    if (larkResponse.error) {
      console.error(larkResponse.error);
      return { error: true, ...larkResponse.error };
    }
    const responseStr = larkResponse.choices[0].message.content;
    const usage = larkResponse.usage;
    //replace all the {key} into key:
    const replacedStr = responseStr.replace(
      /{(.*?)}/g,
      (matchedStr: string, matchedGroup: string) => matchedGroup + ':'
    );
    const patchedStr = replacedStr
      .split('\n')
      //remove lines that is not start with text and colon
      .filter((str: string) => startsWithTextAndColon(str))
      //remove blank space at the start of each line
      .map((str: string) => str.replace(/^\s+/, ''))
      //wrap string list with []
      .map((str: string) => {
        if (isStringArray(str)) {
          return str.replace(/(.*): (.*)/, '$1: [$2]');
        }
        return str;
      })
      .join('\n');

    const resJson = yaml.load(patchedStr) as Record<string, any>;
    resJson.usage = usage;
    //replace all the keys to lower case.
    return Object.keys(resJson).reduce((prev, cur) => ({ ...prev, [cur.toLocaleLowerCase()]: resJson[cur] }), {});
  } catch (err) {
    console.error(err);
    return { error: true };
  }
};
