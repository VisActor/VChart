import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { createContext, extractChart, supplementalDetails, auditReferences } from './skill-metadata/extract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const references = path.join(root, 'skills/vchart-development-assistant/references');
const manifest = JSON.parse(fs.readFileSync(path.join(references, 'metadata-sources.json'), 'utf8'));
const context = createContext(root, manifest.sources, manifest);
const source = chart => manifest.sources.find(s => s.chart === chart);
const metadata = chart => extractChart(context, source(chart));

function withFixture(files, fn, detailReferences = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-navigation-'));
  try {
    for (const [name, text] of Object.entries(files)) {
      const file = path.join(directory, name);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
    }
    const item = {
      chart: 'fixture',
      typeName: 'Spec',
      sourceFile: path.relative(root, path.join(directory, 'index.ts')),
      package: '@visactor/vchart'
    };
    const mapped = Object.fromEntries(
      Object.entries(detailReferences).map(([name, target]) => {
        const [file, symbol] = name.split('#');
        return [`${path.relative(root, path.join(directory, file)).split(path.sep).join('/')}#${symbol}`, target];
      })
    );
    const fixtureManifest = { ...manifest, detailReferences: mapped };
    return fn(createContext(root, [item], fixtureManifest), item, directory, fixtureManifest);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function section(details, definition) {
  const start = details.indexOf(`id="${definition.anchor}"`);
  assert(start >= 0, definition.id);
  const end = details.indexOf('<a id=', start + 1);
  return details.slice(start, end < 0 ? undefined : end);
}

function fixtureReferences(directory, details) {
  const refs = path.join(directory, 'references');
  fs.mkdirSync(path.join(refs, 'topkey'), { recursive: true });
  fs.mkdirSync(path.join(refs, 'type-details'), { recursive: true });
  fs.writeFileSync(path.join(refs, 'topkey/fixture.json'), '{}');
  fs.writeFileSync(path.join(refs, 'type-details/AdditionalTypes-Type-Definition.md'), details);
  return refs;
}

test('真实模块的 DirectionType 不与播放器同名类型混淆', () => {
  const actual = metadata('bar').effectiveProperties.find(p => p.name === 'direction');
  assert.deepEqual(actual.literalValues.sort(), ['horizontal', 'vertical']);
  const file = context.program.getSourceFile(path.join(root, 'packages/vchart/src/component/player/interface/spec.ts'));
  const node = file.statements.find(n => n.name?.text === 'DirectionType');
  const type = context.checker.getTypeAtLocation(node);
  assert.deepEqual(type.types.map(t => t.value).sort(), ['default', 'reverse']);
});

test('多层继承、映射类型和完整字段来自真实公开契约', () => {
  for (const [chart, requiredNames] of [
    ['rangeArea', ['xField', 'yField', 'label', 'area', 'animationNormal']],
    ['radar', ['categoryField', 'valueField', 'radiusField']],
    ['bar', ['animationDisappear', 'animationState', 'large', 'progressiveStep']]
  ]) {
    const properties = metadata(chart).effectiveProperties;
    for (const name of requiredNames)
      assert(
        properties.some(p => p.name === name),
        `${chart}.${name}`
      );
  }
  const properties = metadata('bar').effectiveProperties;
  assert.equal(properties.find(p => p.name === 'type').required, true);
  assert.equal(properties.find(p => p.name === 'series').required, false);
});

test('审查拒绝错误枚举和伪造动画类型，而非仅比较生成文件', () => {
  const bar = metadata('bar');
  const wrong = structuredClone(bar);
  wrong.effectiveProperties.find(p => p.name === 'direction').type = "'default' | 'reverse'";
  wrong.effectiveProperties.find(p => p.name === 'animationAppear').type = "'grow' | IAnimationConfig";
  const report = auditReferences(context, [source('bar')], references, new Map([['bar', wrong]]));
  assert(report.errors.some(e => e.property === 'direction' && e.code === 'TYPE_MISMATCH'));
  assert(report.errors.some(e => e.property === 'animationAppear' && e.code === 'TYPE_MISMATCH'));
});

test('明确的开放契约被记录，扩展来源与注册前提不被核心包替代', () => {
  const pictogram = metadata('pictogram');
  assert(pictogram.openContract);
  assert(pictogram.sourceFile.startsWith('packages/vchart-extension/src/'));
  for (const chart of ['bar3d', 'pie3d', 'funnel3d', 'histogram3d', 'rangeColumn3d', 'wordCloud3d']) {
    const meta = metadata(chart);
    assert(meta.registration.length > 0);
    assert(meta.extensionVersion);
    assert.equal(meta.effectiveProperties.find(p => p.name === 'type').literalValues[0], chart);
  }
});

test('相同输入重复抽取逐字节一致，输出没有个人路径或非法依赖名', () => {
  for (const item of manifest.sources) {
    const first = JSON.stringify(extractChart(context, item));
    assert.equal(first, JSON.stringify(extractChart(context, item)));
    assert(!first.includes('/Users/'));
    const meta = JSON.parse(first);
    for (const prop of meta.effectiveProperties)
      for (const dep of prop.dependencies) {
        assert(/^[A-Za-z_$][\w$]*$/.test(dep), dep);
        assert(meta.complexTypeDefinitions[dep], dep);
      }
  }
});

test('真实 TypeScript 拒绝错误写法，同时保留合法预设与 false', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-contract-'));
  const file = path.join(directory, 'cases.ts');
  try {
    fs.writeFileSync(
      file,
      [
        `import type { IBarChartSpec } from '${root}/packages/vchart/src/chart/bar/interface';`,
        `const badDirection: Pick<IBarChartSpec, 'direction'> = {direction:'reverse'};`,
        `const correctDirection: Pick<IBarChartSpec, 'direction'> = {direction:'horizontal'};`,
        `const badAnimation: Pick<IBarChartSpec, 'animationAppear'> = {animationAppear:'grow'};`,
        `const correctAnimation: Pick<IBarChartSpec, 'animationAppear'> = {animationAppear:{preset:'grow'}};`,
        `const disabled: Pick<IBarChartSpec, 'animationAppear'> = {animationAppear:false};`
      ].join('\n')
    );
    const c = createContext(root, [...manifest.sources, { sourceFile: path.relative(root, file) }], manifest);
    const diagnostics = c.program.getSemanticDiagnostics(c.program.getSourceFile(file));
    assert.deepEqual(
      diagnostics.map(d => d.file.getLineAndCharacterOfPosition(d.start).line + 1),
      [2, 4]
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('Omit 的图表展开不能冒充完整系列定义', () => {
  const seriesFile = context.program.getSourceFile(path.join(root, 'packages/vchart/src/series/bar/interface.ts'));
  const declaration = seriesFile.statements.find(n => n.name?.text === 'IBarSeriesSpec');
  const series = context.checker.getTypeAtLocation(declaration);
  assert(context.checker.getPropertyOfType(series, 'data'));
  assert(context.checker.getPropertyOfType(series, 'tooltip'));
  const mapped = metadata('bar').inheritanceTree['IChartExtendsSeriesSpec<IBarSeriesSpec>'].ownProperties;
  assert(!mapped.some(p => ['data', 'tooltip', 'morph', 'stackValue'].includes(p.name)));
});

test('缺少导入不能被 silently any 掩盖', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-unresolved-'));
  const file = path.join(directory, 'missing.ts');
  try {
    fs.writeFileSync(
      file,
      "import type { MissingType } from '@vchart-test/missing-module';\nexport interface BrokenSpec {value: MissingType}\n"
    );
    const item = {
      chart: 'broken',
      typeName: 'BrokenSpec',
      sourceFile: path.relative(root, file),
      package: '@visactor/vchart'
    };
    const c = createContext(root, [item], manifest);
    assert.throws(() => extractChart(c, item), /缺少依赖|无法解析导入类型/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('全部现有入口的导航和作用域可核对', () => {
  const result = auditReferences(context, manifest.sources, references);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.changes, []);
});

test('check 运行真实 CLI 且不修改任何已生成文件', () => {
  const files = [
    ...fs.readdirSync(path.join(references, 'type-meta')).map(f => `type-meta/${f}`),
    'type-details/AdditionalTypes-Type-Definition.md'
  ];
  const before = files.map(f => fs.readFileSync(path.join(references, f), 'utf8'));
  const result = spawnSync(process.execPath, [path.join(root, 'packages/vchart/scripts/skill-metadata.mjs'), 'check'], {
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.deepEqual(JSON.parse(result.stdout).changed, []);
  assert.deepEqual(
    files.map(f => fs.readFileSync(path.join(references, f), 'utf8')),
    before
  );
});

test('独立上下文以不同入口顺序解析，属性输出仍一致', () => {
  const reversed = createContext(root, [...manifest.sources].reverse(), manifest);
  for (const { chart } of manifest.sources) {
    assert.deepEqual(extractChart(reversed, source(chart)), metadata(chart));
  }
});

test('JSON 中重复键不会因标准解析覆盖而被漏报', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-duplicate-'));
  try {
    fs.mkdirSync(path.join(directory, 'topkey'));
    fs.writeFileSync(path.join(directory, 'topkey/bar.json'), '{"type":{"key":"type"},"type":{"key":"type"}}');
    const result = auditReferences(context, [source('bar')], directory, new Map([['bar', metadata('bar')]]));
    assert(result.errors.some(e => e.code === 'DUPLICATE_JSON_KEY' && e.property === 'type'));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('依赖导航：同一属性的同名类型与别名各自定位', () => {
  withFixture(
    {
      'index.ts':
        "import type { Item as A } from './a'; import type { Item as B } from './b'; export interface Spec { value: A | B }",
      'a.ts': 'export interface Item { a: string }',
      'b.ts': 'export interface Item { b: number }'
    },
    (c, item, directory, fixtureManifest) => {
      const doc = extractChart(c, item);
      const value = doc.effectiveProperties.find(p => p.name === 'value');
      assert.equal(value.dependencies.length, 2);
      const targets = value.dependencies.map(key => doc.complexTypeDefinitions[key]);
      assert.equal(new Set(targets.map(t => t.filePath)).size, 2);
      assert(targets.every(t => t.typeName === 'Item'));
      assert.notEqual(value.dependencyBindings.A, value.dependencyBindings.B);
      assert(doc.complexTypeDefinitions[value.dependencyBindings.A].filePath.endsWith('/a.ts'));
      assert(doc.complexTypeDefinitions[value.dependencyBindings.B].filePath.endsWith('/b.ts'));
      assert(value.dependencies.every(k => /^Item__[a-f0-9]{12}$/.test(k)));
      const refs = fixtureReferences(directory, supplementalDetails(c));
      assert.deepEqual(auditReferences(c, [item], refs, new Map([['fixture', doc]])).errors, []);
      const wrong = structuredClone(doc);
      wrong.effectiveProperties.find(p => p.name === 'value').dependencyBindings.A = value.dependencyBindings.B;
      assert(
        auditReferences(c, [item], refs, new Map([['fixture', wrong]])).errors.some(
          e => e.code === 'DEPENDENCY_BINDING_MISMATCH'
        )
      );
      fs.writeFileSync(
        path.join(directory, 'index.ts'),
        "import type { Item as B } from './b'; import type { Item as A } from './a'; export interface Spec { value: B | A }"
      );
      const reversed = extractChart(createContext(root, [item], fixtureManifest), item);
      assert.deepEqual(reversed.complexTypeDefinitions, doc.complexTypeDefinitions);
      assert.deepEqual(reversed.effectiveProperties[0].dependencies, value.dependencies);
    }
  );
});

test('依赖导航：同符号的两个别名去重且保持短键', () => {
  withFixture(
    {
      'index.ts': "import type { Item as A, Item as B } from './a'; export interface Spec { value: A | B }",
      'a.ts': 'export interface Item { a: string }'
    },
    (c, item) => {
      const doc = extractChart(c, item),
        value = doc.effectiveProperties[0];
      assert.deepEqual(value.dependencies, ['Item']);
      assert.deepEqual(value.dependencyBindings, { A: 'Item', B: 'Item' });
    }
  );
});

test('依赖导航：跨属性、泛型及同文件命名空间不覆盖', () => {
  withFixture(
    {
      'index.ts':
        'namespace A { export interface Item { a: string } }; namespace B { export interface Item { b: number } }; export interface Spec { first: A.Item; second: Record<string, A.Item | B.Item> }'
    },
    (c, item) => {
      const doc = extractChart(c, item),
        [first, second] = doc.effectiveProperties;
      assert.equal(first.dependencies.length, 1);
      assert.equal(second.dependencies.length, 2);
      const targets = Object.values(doc.complexTypeDefinitions);
      assert.equal(targets.length, 2);
      assert.equal(new Set(targets.map(t => t.reference)).size, 2);
      const details = supplementalDetails(c);
      assert(details.includes('interface Item { a: string }'));
      assert(details.includes('interface Item { b: number }'));
    }
  );
});

test('依赖导航：补充父类型的同名符号链接分别保留', () => {
  withFixture(
    {
      'index.ts': "import type { Child } from './child'; export interface Spec { value: Child }",
      'child.ts':
        "import type { Item as A } from './a'; import type { Item as B } from './b'; export interface Child extends A, B {}",
      'a.ts': 'export interface Item { a: string }',
      'b.ts': 'export interface Item { b: number }'
    },
    (c, item) => {
      extractChart(c, item);
      const details = supplementalDetails(c);
      const child = [...c.definitions.values()].find(d => d.symbol.name === 'Child');
      const parents = [...c.definitions.values()].filter(d => d.symbol.name === 'Item');
      assert.equal(parents.length, 2);
      for (const parent of parents) assert(section(details, child).includes(`#${parent.anchor}`));
    }
  );
});

test('依赖导航：人工详情不能掩盖传递缺模块或缺导出', () => {
  for (const missing of [true, false]) {
    withFixture(
      {
        'index.ts': "import type { Broken } from './middle'; export interface Spec { value: Broken }",
        'middle.ts': `import type { Missing } from './${
          missing ? 'absent' : 'present'
        }'; export type Broken = Missing;`,
        'present.ts': 'export interface Other {}'
      },
      (c, item) => {
        assert.throws(
          () => extractChart(c, item),
          error => {
            assert.match(error.message, /Missing/);
            assert.match(error.message, /value/);
            assert.match(error.message, /Broken/);
            assert.match(error.message, /middle.ts/);
            assert.match(error.message, missing ? /absent/ : /present/);
            return true;
          }
        );
      },
      { 'middle.ts#Broken': 'type-details/IData-Type-Definition.md' }
    );
  }
});

test('依赖导航：无关缺失导入不阻断，显式 any 与循环契约保留', () => {
  withFixture(
    {
      'index.ts':
        "import type { Unused } from './absent'; import type { Valid } from './middle'; interface Cycle { next?: Cycle }; export interface Spec { value: Valid; open: any; dictionary: {[key: string]: any}; cycle: Cycle }",
      'middle.ts': "import type { Unused } from './also-absent'; export type Valid = string;"
    },
    (c, item) => {
      const doc = extractChart(c, item);
      assert.equal(doc.effectiveProperties.find(p => p.name === 'value').type, 'string');
      assert.equal(doc.effectiveProperties.find(p => p.name === 'open').type, 'any');
      assert(doc.effectiveProperties.some(p => p.name === 'cycle'));
    },
    { 'middle.ts#Valid': 'type-details/IData-Type-Definition.md' }
  );
});

test('依赖导航：typeof 本地枚举具有定义、相关链接及 audit 反例', () => {
  withFixture(
    {
      'index.ts':
        "enum AxisDirection { horizontal = 'horizontal', vertical = 'vertical' }; type Direction = keyof typeof AxisDirection; export interface Spec { config: { direction: Direction } }"
    },
    (c, item, directory) => {
      const doc = extractChart(c, item),
        details = supplementalDetails(c);
      const alias = [...c.definitions.values()].find(d => d.symbol.name === 'Direction');
      const enumeration = [...c.definitions.values()].find(d => d.symbol.name === 'AxisDirection');
      assert(enumeration);
      assert(section(details, alias).includes(`#${enumeration.anchor}`));
      assert(section(details, enumeration).includes("horizontal = 'horizontal'"));
      const refs = fixtureReferences(directory, details);
      assert.deepEqual(auditReferences(c, [item], refs, new Map([['fixture', doc]])).errors, []);
      fs.writeFileSync(
        path.join(refs, 'type-details/AdditionalTypes-Type-Definition.md'),
        details.replace(`id="${enumeration.anchor}"`, 'id="removed"')
      );
      assert(
        auditReferences(c, [item], refs, new Map([['fixture', doc]])).errors.some(
          e => e.code === 'MISSING_DETAIL_ANCHOR'
        )
      );
    }
  );
});

test('依赖导航：typeof 导入、限定成员、同名值和常量对象不串来源', () => {
  withFixture(
    {
      'index.ts':
        "import { Mode as A } from './a'; import { Mode as B } from './b'; import * as Namespace from './b'; const Values = { alpha: 'alpha', beta: 'beta' } as const; type First = keyof typeof A; type Second = keyof typeof Namespace.Mode; type Member = typeof B.beta; type Keys = keyof typeof Values; export interface Spec { config: { first: First; second: Second; member: Member; keys: Keys } }",
      'a.ts': "export enum Mode { alpha = 'alpha' }",
      'b.ts': "export enum Mode { beta = 'beta' }"
    },
    (c, item) => {
      extractChart(c, item);
      const details = supplementalDetails(c);
      const definitions = [...c.definitions.values()];
      const modes = definitions.filter(d => d.symbol.name === 'Mode');
      assert.equal(modes.length, 2);
      const first = definitions.find(d => d.symbol.name === 'First');
      assert(section(details, first).includes(`#${modes.find(d => d.filePath.endsWith('/a.ts')).anchor}`));
      const member = definitions.find(d => d.symbol.name === 'Member');
      const secondMode = modes.find(d => d.filePath.endsWith('/b.ts'));
      assert(section(details, member).includes(`#${secondMode.anchor}`));
      assert(section(details, secondMode).includes('enum Mode'));
      assert(definitions.some(d => d.symbol.name === 'Values'));
      assert(details.includes("alpha: 'alpha'"));
    }
  );
});

test('依赖导航：typeof 缺失导入被人工详情校验拒绝，循环类型查询不死循环', () => {
  withFixture(
    {
      'index.ts': "import type { Broken } from './middle'; export interface Spec { value: Broken }",
      'middle.ts': "import { Missing } from './absent'; export type Broken = keyof typeof Missing;"
    },
    (c, item) => assert.throws(() => extractChart(c, item), /Missing/),
    {
      'middle.ts#Broken': 'type-details/IData-Type-Definition.md'
    }
  );
  withFixture(
    {
      'index.ts':
        'declare const current: Config; interface Config { next?: typeof current }; export interface Spec { config: Config }'
    },
    (c, item) => assert(extractChart(c, item).effectiveProperties.some(p => p.name === 'config'))
  );
});

test('依赖导航：真实 Direction 和 RenderMode 枚举来自正确模块', () => {
  for (const item of manifest.sources) extractChart(context, item);
  const details = supplementalDetails(context);
  for (const [aliasName, targetName, expectedSource] of [
    ['DirectionType', 'Direction', 'packages/vchart/src/typings/space.ts'],
    ['RenderMode', 'RenderModeEnum', 'packages/vchart/src/typings/spec/common.ts']
  ]) {
    const definitions = [...context.definitions.values()];
    const alias = definitions.find(d => d.symbol.name === aliasName && d.filePath === expectedSource);
    const enumeration = definitions.find(d => d.symbol.name === targetName && d.filePath === expectedSource);
    assert(enumeration, targetName);
    assert(section(details, alias).includes(`#${enumeration.anchor}`));
    if (targetName === 'Direction') {
      assert(section(details, enumeration).includes("horizontal = 'horizontal'"));
      assert(!section(details, enumeration).includes("reverse = 'reverse'"));
    }
  }
});

test('依赖导航：generate 在传递依赖错误时不写部分文件', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-cli-'));
  const write = (name, text) => {
    const file = path.join(directory, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  };
  try {
    for (const name of ['skill-metadata.mjs', 'skill-metadata/extract.mjs'])
      write(`packages/vchart/scripts/${name}`, fs.readFileSync(path.join(root, 'packages/vchart/scripts', name)));
    for (const name of [
      'packages/vchart/package.json',
      'packages/vchart/tsconfig.json',
      'packages/vchart-extension/package.json'
    ])
      write(name, fs.readFileSync(path.join(root, name)));
    fs.symlinkSync(
      path.join(root, 'packages/vchart/node_modules'),
      path.join(directory, 'packages/vchart/node_modules'),
      'dir'
    );
    const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: root, encoding: 'utf8' }).trim();
    write('.git', `gitdir: ${gitDir}\n`);
    write(
      'packages/vchart/src/index.ts',
      "import type { Broken } from './middle'; export interface Spec { value: Broken }"
    );
    write('packages/vchart/src/good.ts', 'export interface GoodSpec { value: string }');
    write('packages/vchart/src/middle.ts', "import type { Missing } from './absent'; export type Broken = Missing;");
    write(
      'skills/vchart-development-assistant/references/metadata-sources.json',
      JSON.stringify({
        sources: [
          {
            chart: 'good',
            typeName: 'GoodSpec',
            sourceFile: 'packages/vchart/src/good.ts',
            package: '@visactor/vchart'
          },
          {
            chart: 'fixture',
            typeName: 'Spec',
            sourceFile: 'packages/vchart/src/index.ts',
            package: '@visactor/vchart'
          }
        ],
        detailReferences: { 'packages/vchart/src/middle.ts#Broken': 'type-details/IData-Type-Definition.md' }
      })
    );
    write(
      'skills/vchart-development-assistant/references/type-details/IData-Type-Definition.md',
      fs.readFileSync(path.join(references, 'type-details/IData-Type-Definition.md'))
    );
    const output = path.join(directory, 'output');
    write('output/sentinel.txt', 'keep');
    const result = spawnSync(
      process.execPath,
      [
        fs.realpathSync(path.join(directory, 'packages/vchart/scripts/skill-metadata.mjs')),
        'generate',
        '--output',
        output
      ],
      { encoding: 'utf8' }
    );
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /Missing|absent/);
    assert.match(result.stderr, /value/);
    assert.equal(fs.readFileSync(path.join(output, 'sentinel.txt'), 'utf8'), 'keep');
    assert.deepEqual(fs.readdirSync(output), ['sentinel.txt']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('依赖导航：跨模块属性与嵌套泛型使用各自同名目标', () => {
  withFixture(
    {
      'index.ts':
        "import type { Item as A } from './a'; import type { Item as B } from './b'; export interface Spec { first: A; second: B; nested: Record<string, A | B> }",
      'a.ts': 'export interface Item { a: string }',
      'b.ts': 'export interface Item { b: number }'
    },
    (c, item) => {
      const doc = extractChart(c, item);
      const prop = name => doc.effectiveProperties.find(p => p.name === name);
      assert.notDeepEqual(prop('first').dependencies, prop('second').dependencies);
      assert.equal(prop('nested').dependencies.length, 2);
      assert.equal(prop('nested').dependencyBindings.A, prop('first').dependencies[0]);
      assert.equal(prop('nested').dependencyBindings.B, prop('second').dependencies[0]);
    }
  );
});

test('依赖导航：循环链校验失败后不会缓存部分成功状态', () => {
  withFixture(
    {
      'index.ts':
        "import type { Missing } from './absent'; interface A { b: B; c: C }; interface B { a: A }; interface C { missing: Missing }; export interface Spec { value: A }; export interface SecondSpec { value: B }"
    },
    (c, item) => {
      assert.throws(() => extractChart(c, item), /Missing/);
      assert.throws(() => extractChart(c, { ...item, typeName: 'SecondSpec' }), /Missing/);
    }
  );
});
