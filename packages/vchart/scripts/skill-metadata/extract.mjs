import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { toDistributedMetadata, metadataFields, propertyFields, definitionFields } from './distribution.mjs';

const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = text => createHash('sha256').update(text).digest('hex');
const ordered = items => [...items].sort((a, b) => a.localeCompare(b, 'en'));

/** 维护工具只使用本仓库依赖；核心包的两个导入入口始终解析到同一源码。 */
export function createContext(repoRoot, sources, manifest = {}) {
  const require = createRequire(path.join(repoRoot, 'packages/vchart/package.json'));
  const ts = require('typescript');
  const config = ts.readConfigFile(path.join(repoRoot, 'packages/vchart/tsconfig.json'), ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.join(repoRoot, 'packages/vchart'));
  if (parsed.errors.length) throw new Error(ts.flattenDiagnosticMessageText(parsed.errors[0].messageText, '\n'));
  const options = { ...parsed.options, noEmit: true, composite: false, strictNullChecks: true, types: [] };
  const host = ts.createCompilerHost(options);
  const unresolved = [];
  host.resolveModuleNames = (names, containingFile) =>
    names.map(name => {
      if (name === '@visactor/vchart' || name.startsWith('@visactor/vchart/esm/')) {
        const subpath = name === '@visactor/vchart' ? 'index' : name.slice('@visactor/vchart/esm/'.length);
        const base = path.join(repoRoot, 'packages/vchart/src', subpath);
        const file = [base + '.ts', path.join(base, 'index.ts')].find(fs.existsSync);
        if (file) return { resolvedFileName: file, extension: ts.Extension.Ts, isExternalLibraryImport: false };
      }
      const resolved = ts.resolveModuleName(name, containingFile, options, ts.sys).resolvedModule;
      if (!resolved) unresolved.push({ file: containingFile, module: name });
      return resolved;
    });
  const program = ts.createProgram(
    sources.map(s => path.join(repoRoot, s.sourceFile)),
    options,
    host
  );
  const checker = program.getTypeChecker();
  const context = {
    repoRoot,
    sources,
    manifest,
    ts,
    program,
    checker,
    unresolved,
    referencesRoot: path.join(repoRoot, 'skills/vchart-development-assistant/references'),
    definitions: new Map(),
    version: json(path.join(repoRoot, 'packages/vchart/package.json')).version,
    extensionVersion: json(path.join(repoRoot, 'packages/vchart-extension/package.json')).version
  };
  // 包版本与实际读取的文件内容决定指纹；不把当前时间和无关文档的 HEAD 算作输入。
  const input = program.getSourceFiles().filter(f => !program.isSourceFileDefaultLibrary(f));
  const noteSources = sources.flatMap(s =>
    (s.contractNotes || []).map(n => `${n.sourceFile}\0${hash(fs.readFileSync(path.join(repoRoot, n.sourceFile)))}`)
  );
  context.sourceHash = hash(
    JSON.stringify({
      typescript: ts.version,
      vchart: context.version,
      extension: context.extensionVersion,
      manifest,
      files: ordered([...input.map(f => `${location(context, f).filePath}\0${hash(f.text)}`), ...noteSources])
    })
  );
  context.sourceRevision = execFileSync(
    'git',
    [
      'log',
      '-1',
      '--format=%H',
      '--',
      'packages/vchart/src',
      'packages/vchart-extension/src',
      'packages/vchart/package.json',
      'packages/vchart-extension/package.json'
    ],
    { cwd: repoRoot, encoding: 'utf8' }
  ).trim();
  return context;
}

function location(context, declaration) {
  const file = declaration.getSourceFile ? declaration.getSourceFile().fileName : declaration.fileName;
  const real = fs.realpathSync(file);
  if (!real.includes(`${path.sep}node_modules${path.sep}`))
    return { filePath: path.relative(context.repoRoot, file).split(path.sep).join('/') };
  let directory = path.dirname(real);
  while (!fs.existsSync(path.join(directory, 'package.json'))) {
    const parent = path.dirname(directory);
    if (parent === directory) throw new Error(`外部类型缺少包来源：${file}`);
    directory = parent;
  }
  const pkg = json(path.join(directory, 'package.json'));
  return {
    filePath: `${pkg.name}/${path.relative(directory, real).split(path.sep).join('/')}`,
    package: pkg.name,
    version: pkg.version
  };
}

function resolveSymbol(context, node) {
  const { ts, checker } = context;
  let symbol = checker.getSymbolAtLocation(node);
  const imported = symbol?.declarations?.[0];
  let importDeclaration = imported;
  while (importDeclaration && !ts.isImportDeclaration(importDeclaration) && !ts.isExportDeclaration(importDeclaration))
    importDeclaration = importDeclaration.parent;
  const module = importDeclaration?.moduleSpecifier?.text;
  if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
  if (!symbol?.declarations?.length || symbol.name === 'unknown')
    throw new Error(
      `无法解析导入类型：${node.getText()}${module ? `，模块 ${module}` : ''} (${location(context, node).filePath})`
    );
  return symbol;
}

function identity(context, symbol) {
  context.identities ||= new Map();
  if (!context.identities.has(symbol)) {
    const declaration = symbol.declarations[0];
    const names = [symbol.name];
    for (let parent = declaration.parent; parent; parent = parent.parent)
      if (
        (context.ts.isModuleDeclaration(parent) ||
          context.ts.isClassDeclaration(parent) ||
          context.ts.isInterfaceDeclaration(parent) ||
          context.ts.isEnumDeclaration(parent)) &&
        parent.name
      )
        names.unshift(parent.name.getText());
    context.identities.set(symbol, `${location(context, declaration).filePath}#${names.join('.')}`);
  }
  return context.identities.get(symbol);
}

function addEdge(context, found, symbol, expression) {
  const { ts, program } = context;
  const declaration = symbol.declarations?.[0];
  if (
    !declaration ||
    ts.isTypeParameterDeclaration(declaration) ||
    program.isSourceFileDefaultLibrary(declaration.getSourceFile())
  )
    return;
  const id = identity(context, symbol);
  let edge = found.get(id);
  if (!edge) found.set(id, (edge = { id, symbol, expressions: new Set() }));
  if (expression) edge.expressions.add(expression);
}

function mergeEdges(...maps) {
  const result = new Map();
  for (const map of maps)
    for (const [id, edge] of map) {
      const previous = result.get(id);
      if (previous) for (const expression of edge.expressions) previous.expressions.add(expression);
      else result.set(id, { ...edge, expressions: new Set(edge.expressions) });
    }
  return result;
}

/** 只读取声明中的类型位置；不访问函数体或无关导入。 */
function dependencies(context, declaration) {
  context.dependencyNodes ||= new Map();
  if (context.dependencyNodes.has(declaration)) return context.dependencyNodes.get(declaration);
  const { ts } = context;
  const result = new Map();
  function visit(node) {
    if (ts.isBlock(node)) return;
    if (ts.isTypeReferenceNode(node) || ts.isExpressionWithTypeArguments(node)) {
      const name = node.typeName || node.expression;
      addEdge(context, result, resolveSymbol(context, name), name.getText());
    } else if (ts.isTypeQueryNode(node)) {
      let symbol = resolveSymbol(context, node.exprName);
      const target = symbol.declarations[0];
      // 枚举成员必须连同所属枚举展示，不能摘录为无上下文的孤立成员。
      if (ts.isEnumMember(target)) symbol = resolveSymbol(context, target.parent.name);
      addEdge(context, result, symbol, node.exprName.getText());
    }
    ts.forEachChild(node, visit);
  }
  if (declaration?.type) visit(declaration.type);
  for (const heritage of declaration?.heritageClauses || []) visit(heritage);
  for (const member of declaration?.members || []) visit(member);
  for (const parameter of declaration?.parameters || []) if (parameter.type) visit(parameter.type);
  for (const parameter of declaration?.typeParameters || []) {
    if (parameter.constraint) visit(parameter.constraint);
    if (parameter.default) visit(parameter.default);
  }
  context.dependencyNodes.set(declaration, result);
  return result;
}

/** 展示入口不能决定校验范围；成功完成整条类型链后才提交缓存。 */
function validateReachableDependencies(context, declaration, trace) {
  context.validatedDeclarations ||= new Set();
  const visiting = new Set(),
    completed = new Set();
  function validate(node, chain) {
    if (context.validatedDeclarations.has(node) || visiting.has(node) || completed.has(node)) return;
    visiting.add(node);
    try {
      for (const edge of dependencies(context, node).values())
        for (const child of edge.symbol.declarations) validate(child, [...chain, edge.symbol.name]);
      completed.add(node);
    } catch (error) {
      if (!error.metadataTrace) {
        error.message = `类型依赖解析失败：${chain.join(' → ')}：${error.message}`;
        error.metadataTrace = true;
      }
      throw error;
    } finally {
      visiting.delete(node);
    }
  }
  validate(declaration, trace);
  for (const node of completed) context.validatedDeclarations.add(node);
}

function describe(context, type, declaration, expand = false) {
  const { ts, checker } = context;
  const text = checker.typeToString(
    type,
    declaration,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
      (expand ? ts.TypeFormatFlags.InTypeAlias : 0)
  );
  return canonicalType(context, text);
}

function canonicalType(context, text, optional = false) {
  const { ts } = context;
  const key = `${optional}\0${text}`;
  context.typeText ||= new Map();
  if (context.typeText.has(key)) return context.typeText.get(key);
  // TS 会按首次查询时的类型缓存排列联合成员。按语法节点规范化，保持无关查询后的稳定输出。
  const source = ts.createSourceFile('metadata-type.ts', `type Result = ${text};`, ts.ScriptTarget.Latest, true);
  if (source.parseDiagnostics.length) throw new Error(`无法序列化真实类型：${text}`);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
  let original = source.statements[0].type;
  if (optional && ts.isUnionTypeNode(original))
    original = ts.factory.updateUnionTypeNode(
      original,
      original.types.filter(t => t.kind !== ts.SyntaxKind.UndefinedKeyword)
    );
  const transformed = ts.transform(original, [
    transform => {
      const visit = node => {
        node = ts.visitEachChild(node, visit, transform);
        if (ts.isStringLiteral(node)) return ts.factory.createStringLiteral(node.text);
        if (ts.isUnionTypeNode(node))
          return ts.factory.updateUnionTypeNode(
            node,
            [...node.types].sort((a, b) =>
              printer
                .printNode(ts.EmitHint.Unspecified, a, source)
                .localeCompare(printer.printNode(ts.EmitHint.Unspecified, b, source), 'en')
            )
          );
        return node;
      };
      return node => ts.visitNode(node, visit);
    }
  ]);
  try {
    const result = printer.printNode(ts.EmitHint.Unspecified, transformed.transformed[0], source);
    context.typeText.set(key, result);
    return result;
  } finally {
    transformed.dispose();
  }
}

function boundDependencies(context, type, found = new Map(), visited = new Set()) {
  if (visited.has(type)) return found;
  visited.add(type);
  const { ts, checker } = context;
  const symbol = type.aliasSymbol || type.symbol;
  const declaration = symbol?.declarations?.[0];
  if (declaration && !symbol.name.startsWith('__')) addEdge(context, found, symbol);
  for (const argument of type.aliasTypeArguments || []) boundDependencies(context, argument, found, visited);
  if (type.aliasSymbol) return found;
  for (const child of type.types || []) boundDependencies(context, child, found, visited);
  if (type.objectFlags & ts.ObjectFlags.Reference)
    for (const argument of checker.getTypeArguments(type)) boundDependencies(context, argument, found, visited);
  return found;
}

function simple(context, type) {
  const { ts } = context;
  if (type.isUnion()) return type.types.every(t => simple(context, t));
  return !!(
    type.flags &
    (ts.TypeFlags.StringLike |
      ts.TypeFlags.NumberLike |
      ts.TypeFlags.BooleanLike |
      ts.TypeFlags.Null |
      ts.TypeFlags.Undefined |
      ts.TypeFlags.Never)
  );
}

function addDefinition(context, symbol) {
  const declaration = symbol.declarations[0];
  const source = location(context, declaration);
  const id = identity(context, symbol);
  if (!context.definitions.has(id)) {
    const anchor = `type-${hash(id).slice(0, 12)}`;
    const reference =
      context.manifest.detailReferences?.[id] || `type-details/AdditionalTypes-Type-Definition.md#${anchor}`;
    context.definitions.set(id, { id, symbol, declaration, anchor, reference, ...source });
    // 没有人工详情时补真实声明及必要父类型；已有详情不展开成整个依赖手册。
    if (reference.includes('AdditionalTypes-') && !source.package) {
      for (const dependency of dependencies(context, declaration).values())
        if (dependency.symbol !== symbol) addDefinition(context, dependency.symbol);
    }
  }
  const item = context.definitions.get(id);
  return {
    typeName: symbol.name,
    filePath: item.filePath,
    reference: item.reference,
    ...(item.package ? { package: item.package, version: item.version } : {})
  };
}

function property(context, symbol, owner, trace) {
  const { ts, checker } = context;
  const declaration = symbol.declarations?.[0];
  if (!declaration) throw new Error(`属性缺少真实声明：${symbol.name}`);
  validateReachableDependencies(context, declaration, trace);
  const type = checker.getTypeOfSymbolAtLocation(symbol, owner);
  const isSimple = simple(context, type);
  const edges = isSimple ? new Map() : mergeEdges(dependencies(context, declaration), boundDependencies(context, type));
  const definitions = new Map();
  for (const [id, edge] of edges) definitions.set(id, addDefinition(context, edge.symbol));
  const raw = declaration.type?.getText() || describe(context, type, declaration);
  const result = {
    name: symbol.name,
    description: ts.displayPartsToString(symbol.getDocumentationComment(checker)) || `${symbol.name} 配置`,
    type: describe(context, type, declaration, simple(context, type)),
    originalType: raw,
    required: !(symbol.flags & ts.SymbolFlags.Optional),
    category: '未分类',
    isSimple,
    dependencies: [],
    source: location(context, declaration).filePath,
    ...(declaration.parent?.name ? { inheritedFrom: declaration.parent.name.getText() } : {})
  };
  const tags = symbol.getJsDocTags(checker);
  for (const [tag, key] of [
    ['default', 'defaultValue'],
    ['since', 'since'],
    ['deprecated', 'deprecated']
  ]) {
    const found = tags.find(t => t.name === tag);
    if (found) result[key] = ts.displayPartsToString(found.text || []) || true;
  }
  const parts = type.isUnion() ? type.types : [type];
  const literals = parts
    .filter(t => t.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral))
    .map(t => t.value);
  if (literals.length)
    result.literalValues = [...new Set(literals)].sort((a, b) => String(a).localeCompare(String(b), 'en'));
  return { result, definitions, edges };
}

export function extractChart(context, source) {
  const { checker, ts, program } = context;
  const file = program.getSourceFile(path.join(context.repoRoot, source.sourceFile));
  const node = file?.statements.find(s => s.name?.text === source.typeName);
  if (!node) throw new Error(`入口缺少公开声明：${source.sourceFile}#${source.typeName}`);
  const root = checker.getTypeAtLocation(node);
  const tree = {},
    definitions = new Map(),
    pending = [];
  const visited = new Set();
  function properties(type, owner) {
    return checker
      .getPropertiesOfType(type)
      .map(symbol => {
        const { result, definitions: found, edges } = property(context, symbol, owner, [source.chart, symbol.name]);
        for (const [id, target] of found) definitions.set(id, target);
        pending.push({ result, edges });
        return result;
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }
  function walk(type, label, owner) {
    if (visited.has(type)) return;
    visited.add(type);
    const symbol = type.aliasSymbol || type.symbol;
    const declaration = symbol?.declarations?.[0] || owner;
    const bases = type.getBaseTypes?.() || [];
    const hasMembers = !!declaration.members;
    const all = properties(type, owner);
    const own = hasMembers
      ? all.filter(p => checker.getPropertyOfType(type, p.name)?.declarations?.some(d => d.parent === declaration))
      : all;
    tree[label] = {
      description: `${label} 的真实类型声明`,
      directExtends: bases.map(b => describe(context, b, owner)),
      ownProperties: own,
      ...(!hasMembers ? { resolvedMapping: true } : {})
    };
    for (const base of bases) walk(base, describe(context, base, owner), owner);
  }
  walk(root, source.typeName, node);
  const effectiveProperties = properties(root, node);
  const groups = new Map(),
    keys = new Map(),
    usedKeys = new Set();
  for (const [id, target] of definitions) {
    const group = groups.get(target.typeName) || [];
    group.push(id);
    groups.set(target.typeName, group);
  }
  for (const [name, ids] of groups)
    for (const id of ids) {
      const key = ids.length === 1 ? name : `${name}__${hash(id).slice(0, 12)}`;
      if (usedKeys.has(key)) throw new Error(`类型导航键冲突：${key}`);
      usedKeys.add(key);
      keys.set(id, key);
    }
  for (const { result, edges } of pending) {
    result.dependencies = ordered([...edges.keys()].map(id => keys.get(id)));
    const bindings = new Map();
    for (const [id, edge] of edges)
      for (const expression of edge.expressions) {
        if (expression === keys.get(id)) continue;
        if (bindings.has(expression) && bindings.get(expression) !== keys.get(id))
          throw new Error(`同一声明的类型拼写无法区分：${source.chart}.${result.name}.${expression}`);
        bindings.set(expression, keys.get(id));
      }
    if (bindings.size)
      result.dependencyBindings = Object.fromEntries(ordered(bindings.keys()).map(k => [k, bindings.get(k)]));
  }
  const doc = {
    typeName: source.typeName,
    description: `${source.typeName} 公开配置类型`,
    inheritanceTree: tree,
    effectiveProperties,
    formatVersion: 2,
    version: '2.0.0',
    vchartVersion: context.version,
    typescriptVersion: ts.version,
    ...(source.package === '@visactor/vchart-extension' ? { extensionVersion: context.extensionVersion } : {}),
    sourceFile: source.sourceFile,
    sourceHash: context.sourceHash,
    sourceRevision: context.sourceRevision,
    ...(source.registration
      ? {
          registration: source.registration,
          registrationNote: source.registrationNote || '由宿主注册扩展图型，注册代码不属于 spec。'
        }
      : {}),
    ...(source.initializationIncludes ? { initializationIncludes: source.initializationIncludes } : {}),
    ...(source.openContract ? { openContract: source.openContract } : {}),
    ...(source.contractNotes ? { contractNotes: source.contractNotes } : {}),
    complexTypeDefinitions: Object.fromEntries(
      [...definitions].map(([id, target]) => [keys.get(id), target]).sort(([a], [b]) => a.localeCompare(b, 'en'))
    ),
    statistics: {
      totalInterfaces: Object.keys(tree).length,
      totalProperties: Object.values(tree).reduce((n, t) => n + t.ownProperties.length, 0),
      effectiveProperties: effectiveProperties.length,
      complexTypes: definitions.size
    }
  };
  if (JSON.stringify(doc).includes(context.repoRoot)) throw new Error(`类型序列化泄漏绝对路径：${source.chart}`);
  return doc;
}

export function supplementalDetails(context) {
  const lines = [
    '# 补充公开类型声明',
    '',
    '本文件由维护工具按实际符号生成，保留类型与继承，不代替已有人工说明。外部声明注明包及版本；类型参数按各调用处实例化。',
    ''
  ];
  const items = [...context.definitions.values()]
    .filter(i => i.reference.includes('AdditionalTypes-'))
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
  lines.push('## 类型索引', '', ...items.map(i => `- [${i.symbol.name}](#${i.anchor})`), '');
  for (const item of items) {
    lines.push(
      `<a id="${item.anchor}"></a>`,
      `## ${item.symbol.name}`,
      '',
      `来源：\`${item.filePath}\`${item.package ? `，${item.package}@${item.version}` : `，VChart ${context.version}`}`,
      '',
      '```typescript',
      item.declaration.getText(),
      '```',
      ''
    );
    if (item.package)
      lines.push(
        '这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。',
        ''
      );
    const related = item.package
      ? []
      : [...dependencies(context, item.declaration).values()].filter(edge => edge.symbol !== item.symbol);
    if (related.length)
      lines.push(
        '相关定义：' +
          related
            .map(edge => {
              const target = addDefinition(context, edge.symbol);
              const label = ordered(edge.expressions).join(' / ') || edge.symbol.name;
              return `[${label}](${path.posix.relative('type-details', target.reference.split('#')[0])}${
                target.reference.includes('#') ? '#' + target.reference.split('#')[1] : ''
              })`;
            })
            .join('、'),
        ''
      );
  }
  return lines.join('\n');
}

export function auditReferences(context, sources, referencesRoot, supplied = new Map()) {
  const errors = [],
    changes = [],
    boundaries = [];
  function readDocument(file, chart) {
    const text = fs.readFileSync(file, 'utf8');
    const parsed = context.ts.parseJsonText(file, text);
    function visit(node) {
      if (context.ts.isObjectLiteralExpression(node)) {
        const names = new Set();
        for (const property of node.properties) {
          const name = property.name?.text;
          if (names.has(name)) errors.push({ chart, code: 'DUPLICATE_JSON_KEY', property: name });
          names.add(name);
        }
      }
      context.ts.forEachChild(node, visit);
    }
    visit(parsed);
    return JSON.parse(text);
  }
  const extracted = new Map(sources.map(source => [source.chart, extractChart(context, source)]));
  const allProperties = new Set([...extracted.values()].flatMap(d => d.effectiveProperties.map(p => p.name)));
  for (const source of sources) {
    const expectedRaw = extracted.get(source.chart);
    const expected = toDistributedMetadata(expectedRaw);
    const filename = path.join(referencesRoot, 'type-meta', `${source.chart}.json`);
    const actual =
      supplied.get(source.chart) || (fs.existsSync(filename) ? readDocument(filename, source.chart) : null);
    const emit = (code, extra = {}) => errors.push({ chart: source.chart, code, ...extra });
    if (!actual) {
      emit('MISSING_METADATA');
      continue;
    }
    function checkFields(value, expectedValue, fields, code, extra = {}, skip = []) {
      for (const field of Object.keys(value))
        if (!fields.includes(field)) emit('UNEXPECTED_FIELD', { ...extra, field });
      for (const field of fields)
        if (
          Object.hasOwn(value, field) !== Object.hasOwn(expectedValue, field) ||
          (!skip.includes(field) && !isDeepStrictEqual(value[field], expectedValue[field]))
        )
          emit(code, { ...extra, field, metadata: value[field], actual: expectedValue[field] });
    }
    checkFields(actual, expected, metadataFields, 'METADATA_FIELD_MISMATCH', {}, [
      'effectiveProperties',
      'complexTypeDefinitions'
    ]);
    if (actual.formatVersion !== 3 || !Array.isArray(actual.effectiveProperties)) {
      emit('INVALID_METADATA_FORMAT');
      continue;
    }
    const recorded = actual.effectiveProperties;
    const byName = new Map(recorded.map(p => [p.name, p]));
    if (byName.size !== recorded.length) emit('DUPLICATE_METADATA_PROPERTY');
    const rawByName = new Map(expectedRaw.effectiveProperties.map(p => [p.name, p]));
    const knownNames = new Set(expected.effectiveProperties.map(p => p.name));
    if (!source.openContract)
      for (const name of byName.keys())
        if (!knownNames.has(name)) emit('UNKNOWN_METADATA_PROPERTY', { property: name });
    for (const property of expected.effectiveProperties) {
      const old = byName.get(property.name);
      if (!old) {
        changes.push({
          chart: source.chart,
          code: 'SOURCE_PROPERTY_MISSING',
          property: property.name,
          source: rawByName.get(property.name).source
        });
        continue;
      }
      checkFields(old, property, propertyFields, 'PROPERTY_FIELD_MISMATCH', { property: property.name }, [
        'type',
        'required',
        'dependencies',
        'dependencyBindings'
      ]);
      if (
        typeof old.type !== 'string' ||
        canonicalType(context, old.type, !old.required) !== canonicalType(context, property.type, !property.required)
      )
        emit('TYPE_MISMATCH', {
          property: property.name,
          metadata: old.type,
          actual: property.type,
          source: rawByName.get(property.name).source
        });
      if (old.required !== property.required)
        emit('REQUIRED_MISMATCH', { property: property.name, metadata: old.required, actual: property.required });
      if (JSON.stringify(ordered(old.dependencies || [])) !== JSON.stringify(property.dependencies))
        emit('DEPENDENCY_MISMATCH', { property: property.name });
      const oldBindings = old.dependencyBindings || {},
        bindings = property.dependencyBindings || {};
      for (const expression of new Set([...Object.keys(oldBindings), ...Object.keys(bindings)]))
        if (oldBindings[expression] !== bindings[expression])
          emit('DEPENDENCY_BINDING_MISMATCH', { property: property.name, expression });
      for (const name of property.dependencies)
        if (!actual.complexTypeDefinitions?.[name]) emit('MISSING_DEPENDENCY_DEFINITION', { property: name });
    }
    if (!actual.vchartVersion || actual.vchartVersion !== context.version) emit('VERSION_MISMATCH');
    if (JSON.stringify(actual).includes('/Users/')) emit('ABSOLUTE_PATH');
    for (const [name, target] of Object.entries(actual.complexTypeDefinitions || {})) {
      if (!/^[A-Za-z_$][\w$]*$/.test(name)) emit('INVALID_DEPENDENCY', { property: name });
      if (!target.reference || !fs.existsSync(path.join(referencesRoot, target.reference.split('#')[0])))
        emit('MISSING_DETAIL', { property: name, reference: target.reference });
      const exp = expected.complexTypeDefinitions[name];
      if (exp) checkFields(target, exp, definitionFields, 'DEFINITION_MISMATCH', { property: name }, ['reference']);
      else emit('UNKNOWN_DEPENDENCY_DEFINITION', { property: name });
      if (exp && target.reference !== exp.reference)
        emit('DETAIL_TARGET_MISMATCH', { property: name, metadata: target.reference, actual: exp.reference });
      if (target.reference?.includes('#')) {
        const [file, anchor] = target.reference.split('#');
        const destination = path.join(referencesRoot, file);
        if (fs.existsSync(destination) && !fs.readFileSync(destination, 'utf8').includes(`id="${anchor}"`))
          emit('MISSING_DETAIL_ANCHOR', { property: name, reference: target.reference });
      }
    }
    for (const name of Object.keys(expected.complexTypeDefinitions))
      if (!actual.complexTypeDefinitions?.[name]) emit('MISSING_DEPENDENCY_DEFINITION', { property: name });
    const topkeyFile = path.join(referencesRoot, 'topkey', `${source.chart}.json`);
    if (!fs.existsSync(topkeyFile)) emit('MISSING_TOPKEY');
    else
      for (const [key, item] of Object.entries(readDocument(topkeyFile, source.chart))) {
        if (item.key !== key) emit('TOPKEY_KEY_MISMATCH', { property: key });
        const names = new Set(expected.effectiveProperties.map(p => p.name));
        if (item.scope === 'series') {
          if (source.chart !== 'common' || !allProperties.has(key) || item.specPath !== `series[].${key}`)
            emit('TOPKEY_SCOPE_MISMATCH', { property: key });
        } else if (!names.has(key) && !source.openContract) emit('TOPKEY_PROPERTY_MISSING', { property: key });
      }
    if (source.openContract) boundaries.push({ chart: source.chart, note: source.openContract });
    for (const note of source.contractNotes || []) {
      if (!fs.existsSync(path.join(context.repoRoot, note.sourceFile)))
        emit('CONTRACT_NOTE_SOURCE_MISSING', { source: note.sourceFile });
      boundaries.push({ chart: source.chart, note: note.description, source: note.sourceFile });
    }
  }
  const sharedFile = path.join(referencesRoot, 'topkey/all_common.json');
  if (fs.existsSync(sharedFile))
    for (const [key, item] of Object.entries(readDocument(sharedFile, 'all_common'))) {
      if (item.key !== key) errors.push({ chart: 'all_common', code: 'TOPKEY_KEY_MISMATCH', property: key });
      if (key === 'state') {
        const file = context.program.getSourceFile(
          path.join(context.repoRoot, 'packages/vchart/src/typings/spec/common.ts')
        );
        const declaration = file.statements.find(n => n.name?.text === 'IMarkSpec');
        const state = context.checker.getPropertyOfType(context.checker.getTypeAtLocation(declaration), 'state');
        if (!state || item.scope !== 'mark' || item.specPath !== '<mark>.state')
          errors.push({ chart: 'all_common', code: 'TOPKEY_SCOPE_MISMATCH', property: key });
      } else if (!allProperties.has(key))
        errors.push({ chart: 'all_common', code: 'TOPKEY_PROPERTY_MISSING', property: key });
    }
  // 补充声明中的传递导航也属于交付资源；不能只检查根属性的直接详情目标。
  const detailCache = new Map();
  for (const item of context.definitions.values()) {
    if (!item.reference.includes('AdditionalTypes-')) continue;
    const file = path.join(referencesRoot, item.reference.split('#')[0]);
    const emit = code => errors.push({ chart: 'type-details', code, property: item.id, reference: item.reference });
    if (!fs.existsSync(file)) {
      emit('MISSING_DETAIL');
      continue;
    }
    if (!detailCache.has(file)) detailCache.set(file, fs.readFileSync(file, 'utf8'));
    const text = detailCache.get(file),
      start = text.indexOf(`id="${item.anchor}"`);
    if (start < 0) {
      emit('MISSING_DETAIL_ANCHOR');
      continue;
    }
    const end = text.indexOf('<a id=', start + 1);
    const section = text.slice(start, end < 0 ? undefined : end);
    if (!section.includes(item.declaration.getText())) emit('DETAIL_DECLARATION_MISMATCH');
    if (item.package) continue;
    for (const edge of dependencies(context, item.declaration).values()) {
      if (edge.symbol === item.symbol) continue;
      const target = addDefinition(context, edge.symbol);
      const [targetFile, anchor] = target.reference.split('#');
      const relative = path.posix.relative('type-details', targetFile) + (anchor ? '#' + anchor : '');
      if (!section.includes(`](${relative})`)) emit('MISSING_DETAIL_DEPENDENCY_LINK');
    }
  }
  return {
    errors,
    changes,
    boundaries,
    summary: {
      errors: errors.length,
      sourceChanges: changes.length,
      openBoundaries: sources.filter(s => s.openContract).length,
      runtimeContractNotes: sources.reduce((n, s) => n + (s.contractNotes?.length || 0), 0)
    }
  };
}
