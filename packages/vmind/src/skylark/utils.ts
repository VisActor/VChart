import yaml from 'js-yaml';

const startsWithTextAndColon = (str: string) => {
  const regex = /^.+\:/;
  return regex.test(str);
};

export const parseSkylarkResponse = (larkResponse: any): Record<string, any> => {
  try {
    if (larkResponse.error) {
      console.log(larkResponse.error);
      return { error: true, ...larkResponse.error };
    }
    const responseStr = larkResponse.choices[0].message.content;
    const usage = larkResponse.usage;
    //replace all the {key} into key:
    const replacedStr = responseStr.replace(
      /{(.*?)}/g,
      (matchedStr: string, matchedGroup: string) => matchedGroup + ':'
    );
    //remove lines that is not start with text and colon
    //remove blank space at the start of each line
    const patchedStr = responseStr
      .split('\n')
      .filter((str: string) => startsWithTextAndColon(str))
      .map((str: string) => str.replace(/^\s+/, ''))
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
