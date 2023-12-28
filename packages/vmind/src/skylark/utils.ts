import yaml from 'js-yaml';

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
    const resJson = yaml.load(replacedStr) as Record<string, any>;
    resJson.usage = usage;
    return resJson;
  } catch (err) {
    console.error(err);
    return { error: true };
  }
};
