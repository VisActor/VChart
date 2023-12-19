import yaml from 'js-yaml';

export const parseSkylarkResponse = (larkResponse: any): Record<string, string> => {
  try {
    const resJson = yaml.load(larkResponse[0].message.content);
    return resJson;
  } catch (err) {
    console.error(err);
    return { error: true };
  }
};
