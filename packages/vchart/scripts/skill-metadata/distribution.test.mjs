import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toDistributedMetadata } from './distribution.mjs';

test('分发保留配置语义和合法空值，不携带维护字段或修改输入', () => {
  const raw = {
    typeName: 'Spec',
    formatVersion: 2,
    vchartVersion: '2.1.7',
    sourceHash: 'maintenance-only',
    inheritanceTree: {},
    effectiveProperties: [
      {
        name: 'enabled',
        description: '是否启用',
        type: 'boolean | undefined',
        originalType: 'boolean',
        required: false,
        isSimple: true,
        dependencies: [],
        defaultValue: false,
        since: '1.11.2 支持百分比字符串',
        deprecated: false,
        source: 'packages/example.ts',
        inheritedFrom: 'Spec',
        category: '未分类'
      }
    ],
    complexTypeDefinitions: {}
  };
  const before = structuredClone(raw);
  const published = toDistributedMetadata(raw);
  assert.deepEqual(published, {
    typeName: 'Spec',
    formatVersion: 3,
    vchartVersion: '2.1.7',
    effectiveProperties: [
      {
        name: 'enabled',
        description: '是否启用',
        type: 'boolean | undefined',
        required: false,
        isSimple: true,
        dependencies: [],
        defaultValue: false,
        since: '1.11.2 支持百分比字符串',
        deprecated: false
      }
    ],
    complexTypeDefinitions: {}
  });
  assert.deepEqual(raw, before);
  assert.deepEqual(toDistributedMetadata(raw), published);
  for (const value of [0, '', null]) {
    raw.effectiveProperties[0].defaultValue = value;
    assert.equal(toDistributedMetadata(raw).effectiveProperties[0].defaultValue, value);
  }
});

test('分发保留同名导航、别名绑定、外部版本和扩展行为约束', () => {
  const raw = {
    typeName: 'Spec',
    vchartVersion: '2.1.7',
    extensionVersion: '2.1.7',
    registration: ['registerChart'],
    registrationNote: '由宿主注册',
    initializationIncludes: ['register3DPlugin'],
    openContract: '开放契约',
    contractNotes: [{ description: '真实行为差异', sourceFile: 'example.ts', example: { width: 20 } }],
    effectiveProperties: [
      {
        name: 'value',
        description: '配置',
        type: 'A | B',
        required: true,
        isSimple: false,
        dependencies: ['Item_a', 'Item_b'],
        dependencyBindings: { A: 'Item_a', B: 'Item_b' }
      }
    ],
    complexTypeDefinitions: {
      Item_a: { typeName: 'Item', filePath: 'a.ts', reference: 'details.md#a' },
      Item_b: {
        typeName: 'Item',
        filePath: 'b.ts',
        reference: 'details.md#b',
        package: '@example/pkg',
        version: '1.2.3'
      }
    }
  };
  const doc = toDistributedMetadata(raw);
  assert.deepEqual(doc.effectiveProperties, raw.effectiveProperties);
  assert.deepEqual(doc.complexTypeDefinitions, {
    Item_a: { typeName: 'Item', reference: 'details.md#a' },
    Item_b: { typeName: 'Item', reference: 'details.md#b', package: '@example/pkg', version: '1.2.3' }
  });
  assert.deepEqual(doc.contractNotes, [{ description: '真实行为差异', example: { width: 20 } }]);
  for (const key of ['registration', 'registrationNote', 'initializationIncludes', 'openContract', 'extensionVersion'])
    assert.deepEqual(doc[key], raw[key]);
});
