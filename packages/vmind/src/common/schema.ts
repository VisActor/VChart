import { LOCATION, SimpleFieldInfo, VizSchema } from '../typings';

/**
 * generate vizSchema from fieldInfo
 * @param fieldInfo SimpleFieldInfo
 * @returns
 */
export const getSchemaFromFieldInfo = (fieldInfo: SimpleFieldInfo[]): Partial<VizSchema> => {
  const schema = {
    fields: fieldInfo
      //.filter(d => usefulFields.includes(d.fieldName))
      .map(d => ({
        id: d.fieldName,
        alias: d.fieldName,
        description: d.description,
        visible: true,
        type: d.type,
        role: d.role,
        location: d.role as unknown as LOCATION
      }))
  };
  return schema;
};
