export const metadataFields = [
  'typeName',
  'formatVersion',
  'vchartVersion',
  'extensionVersion',
  'effectiveProperties',
  'complexTypeDefinitions',
  'registration',
  'registrationNote',
  'initializationIncludes',
  'openContract',
  'contractNotes'
];
export const propertyFields = [
  'name',
  'description',
  'type',
  'required',
  'isSimple',
  'dependencies',
  'defaultValue',
  'since',
  'deprecated',
  'literalValues',
  'dependencyBindings'
];
export const definitionFields = ['typeName', 'reference', 'package', 'version'];
export const contractNoteFields = ['description', 'example'];

const pick = (value, fields) =>
  Object.fromEntries(fields.filter(key => Object.hasOwn(value, key)).map(key => [key, value[key]]));

/** 内部抽取模型保留来源和继承过程；技能只分发配置知识和导航。 */
export function toDistributedMetadata(metadata) {
  return {
    ...pick(metadata, metadataFields),
    formatVersion: 3,
    effectiveProperties: metadata.effectiveProperties.map(property => pick(property, propertyFields)),
    complexTypeDefinitions: Object.fromEntries(
      Object.entries(metadata.complexTypeDefinitions).map(([key, value]) => [key, pick(value, definitionFields)])
    ),
    ...(metadata.contractNotes
      ? { contractNotes: metadata.contractNotes.map(note => pick(note, contractNoteFields)) }
      : {})
  };
}
