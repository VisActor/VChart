// @ts-nocheck
export function mockData(fields: { [key in string]: { linear?: boolean; count?: number } }): unknown[] {
  const keys = Object.keys(fields);
  const linearKey = keys.find(key => fields[key].linear === true);
  if (!linearKey) {
    return [];
  }
  const ordinalFields = keys
    .filter(key => fields[key].linear !== true)
    .map(key => {
      return {
        key,
        ...fields[key]
      };
    });
  const result = [];
  mockFieldData(result, linearKey, ordinalFields, {});
  return result;
}

function mockFieldData(result: unknown[], linearKey: string, fields: unknown[], keyMap: { [key in string]: string }) {
  if (fields.length === 0) {
    result.push({
      ...keyMap,
      [linearKey]: Math.floor(Math.random() * 100)
    });
    return;
  }
  const temp = [...fields] as unknown[];
  const lastField = temp.pop() as unknown;
  const tempKeyMap = { ...keyMap };
  for (let i = 0; i < lastField.count; i++) {
    tempKeyMap[lastField.key] = `${lastField.key}_${i}`;
    mockFieldData(result, linearKey, temp, tempKeyMap);
  }
}
