import yaml from 'js-yaml';

export const parseSkylarkResponse = (larkResponse: any): Record<string, any> => {
  try {
    const responseStr = larkResponse[0].message.content;
    //replace all the {key} into key:
    const replacedStr = responseStr.replace(
      /{(.*?)}/g,
      (matchedStr: string, matchedGroup: string) => matchedGroup + ':'
    );
    const resJson = yaml.load(replacedStr) as Record<string, any>;
    return resJson;
  } catch (err) {
    console.error(err);
    return { error: true };
  }
};
