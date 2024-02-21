import { LOCATION, SimpleFieldInfo, VizSchema } from '../typings';

/**
 * generate vizSchema from fieldInfo
 * @param fieldInfo SimpleFieldInfo[] - 字段信息数组，每个元素包含字段名、描述、类型和角色等信息。
 * @returns Partial<VizSchema> - 返回一个部分的 VizSchema 对象，包含转换后的字段信息。
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
