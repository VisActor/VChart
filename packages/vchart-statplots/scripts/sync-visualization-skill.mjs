// Maintainer-only sync; installed skills never run npm or this script.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs, { mkdir, mkdtemp, readFile, writeFile, rm, access, readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { posix } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import ts from 'typescript';

const repository = fileURLToPath(new URL('../../../', import.meta.url));
const skill = join(repository, 'skills/data-science-visualization');
export function readReleaseVersion(file) {
  const release = JSON.parse(readFileSync(file, 'utf8'));
  const value = release?.version;
  if (typeof value !== 'string' || !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?$/.test(value) || value.trim() !== value) {
    throw new Error(`${file}: version 需要固定发布版本（主.次.补丁，可含预发布标识）`);
  }
  return value;
}
export const version = readReleaseVersion(join(skill, 'release.json'));
const defaultRoot = join(skill, 'references/statplots');
const defaultManifestPath = join(repository, 'packages/vchart-statplots/skill-maintenance/manifest.json');
const selectorsPath = join(repository, 'packages/vchart-statplots/scripts/visualization-skill-resources.json');
const generatorPath = 'packages/vchart-statplots/scripts/sync-visualization-skill.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const releaseURL = name => `https://unpkg.com/@visactor/vchart-statplots@${version}/${name}`;
const variantExamplePattern = /^examples\/specs\/variants\/[A-Za-z0-9_-]+\.json$/;
function resourceManifestPath(root, manifestPath) {
  if (manifestPath === undefined) {
    if (resolve(root) !== defaultRoot) throw new Error('Custom resource root requires manifestPath (--manifest)');
    return defaultManifestPath;
  }
  const path = resolve(manifestPath);
  if (path === resolve(root) || path.startsWith(resolve(root) + sep)) throw new Error('Manifest must be outside the resource root');
  return path;
}
function declarationPath(from, target) {
  if (!target.startsWith('.')) throw new Error(`External declaration import: ${target}`);
  const name = posix.normalize(posix.join(posix.dirname(from), target));
  if (!name.startsWith('esm/')) throw new Error(`Declaration path escape: ${target}`);
  return name.endsWith('.d.ts') ? name : `${name}.d.ts`;
}
export function collectTypeFiles(entry, readText) {
  const files = new Map();
  function visit(name) {
    if (files.has(name)) return;
    if (!name.startsWith('esm/') || !name.endsWith('.d.ts')) throw new Error(`Invalid declaration: ${name}`);
    const content = readText(name);
    const source = ts.createSourceFile(name, content, ts.ScriptTarget.Latest, true);
    if (source.parseDiagnostics.length) throw new Error(`Invalid declaration syntax: ${name}`);
    if (source.typeReferenceDirectives.length || source.referencedFiles.length) throw new Error(`External declaration reference: ${name}`);
    files.set(name, content);
    function walk(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        visit(declarationPath(name, node.moduleSpecifier.text));
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
        visit(declarationPath(name, node.argument.literal.text));
      } else if (ts.isImportEqualsDeclaration(node)) throw new Error(`External declaration import: ${name}`);
      ts.forEachChild(node, walk);
    }
    walk(source);
  }
  visit(entry);
  return files;
}
function typeProgram(files) {
  const virtualRoot = '/__statplots_release__/';
  const options = { strict: true, noEmit: true, types: [], target: ts.ScriptTarget.ES2020 };
  const host = ts.createCompilerHost(options);
  const originals = { fileExists: host.fileExists, readFile: host.readFile, getSourceFile: host.getSourceFile };
  const content = name => files.get(name.replace(virtualRoot, ''));
  host.fileExists = name => content(name) !== undefined || originals.fileExists(name);
  host.readFile = name => content(name) ?? originals.readFile(name);
  host.getSourceFile = (name, languageVersion) => content(name) === undefined ? originals.getSourceFile(name, languageVersion)
    : ts.createSourceFile(name, content(name), languageVersion, true);
  host.directoryExists = name => name.startsWith(virtualRoot) || ts.sys.directoryExists(name);
  return ts.createProgram([...files.keys()].map(name => virtualRoot + name), options, host);
}
export function buildPlotIndex(catalog, typeFiles) {
  const program = typeProgram(typeFiles);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name, getCurrentDirectory: () => '/', getNewLine: () => '\n'
  }));
  const source = program.getSourceFile('/__statplots_release__/esm/types.d.ts');
  const alias = source.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === 'StatPlotSpec');
  if (!alias) throw new Error('Missing StatPlotSpec declaration');
  const checker = program.getTypeChecker();
  const mapping = new Map();
  const references = ts.isUnionTypeNode(alias.type) ? alias.type.types : [alias.type];
  for (const reference of references) {
    if (!ts.isTypeReferenceNode(reference)) throw new Error('StatPlotSpec requires named references');
    const property = checker.getTypeFromTypeNode(reference).getProperty('type');
    if (!property) throw new Error('Missing plot type discriminant');
    const discriminant = checker.getTypeOfSymbolAtLocation(property, reference);
    if (!discriminant.isStringLiteral()) throw new Error('Plot type discriminant must be unique');
    let symbol = checker.getSymbolAtLocation(reference.typeName);
    if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declaration = symbol.declarations[0];
    const archivePath = declaration.getSourceFile().fileName.replace('/__statplots_release__/', '');
    if (mapping.has(discriminant.value)) throw new Error('Duplicate plot declaration');
    mapping.set(discriminant.value, { typeName: reference.typeName.getText(source), typeFile: archivePath.replace(/^esm\//, 'types/') });
  }
  if (mapping.size !== catalog.length || new Set(catalog.map(entry => entry.type)).size !== catalog.length) throw new Error('Declaration/catalog coverage mismatch');
  return catalog.map(entry => {
    if (!mapping.has(entry.type)) throw new Error(`Missing catalog declaration: ${entry.type}`);
    return { type: entry.type, name: entry.name, useWhen: entry.useWhen, avoidWhen: entry.avoidWhen,
      ...mapping.get(entry.type), guide: `guides/${entry.type}.md`, example: entry.example,
      ...(entry.variants.length ? { variantFile: 'variants.json' } : {}) };
  });
}
export function buildVariantIndex(catalog) {
  return Object.fromEntries(catalog.filter(entry => entry.variants.length).map(entry => [entry.type,
    entry.variants.map(({ name, aliases, options, example }) => ({ name, aliases, options, example }))]));
}
function markdownSections(text) {
  const clean = text.replace(/```[^\n]*\n[\s\S]*?```/g, '').trim();
  const sections = new Map([['$intro', []]]);
  let current = '$intro';
  for (const line of clean.split('\n')) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      current = heading[1];
      if (sections.has(current)) throw new Error(`Duplicate section: ${current}`);
      sections.set(current, []);
    } else if (!/^# /.test(line)) sections.get(current).push(line);
  }
  return sections;
}
function selectedMarkdown(text, selectors) {
  const settings = Array.isArray(selectors) ? { sections: selectors } : selectors;
  const sections = markdownSections(text);
  const usedOmissions = new Set();
  const blocks = [];
  for (const name of settings.sections) {
    if (!sections.has(name)) throw new Error(`Missing section: ${name}`);
    const paragraphs = sections.get(name).join('\n').trim().split(/\n\s*\n/).filter(Boolean);
    const kept = paragraphs.filter(paragraph => {
      if (settings.paragraphs && !settings.paragraphs.some(prefix => paragraph.startsWith(prefix))) return false;
      const omission = (settings.omit || []).find(prefix => paragraph.startsWith(prefix));
      if (omission) { usedOmissions.add(omission); return false; }
      return !paragraph.startsWith('[') && !paragraph.startsWith('最小示例中的配置：');
    });
    if (kept.length) blocks.push((name === '$intro' ? '' : `## ${name}\n\n`) + kept.join('\n\n'));
  }
  for (const prefix of settings.omit || []) if (!usedOmissions.has(prefix)) throw new Error(`Missing omitted paragraph: ${prefix}`);
  for (const fragment of settings.fragments || []) {
    const source = sections.get(fragment.section)?.join('\n');
    const start = source?.indexOf(fragment.from) ?? -1;
    const end = start < 0 ? -1 : source.indexOf(fragment.until, start);
    if (start < 0 || end < 0) throw new Error(`Missing semantic fragment: ${fragment.from}`);
    blocks.push(source.slice(start, end + fragment.until.length));
  }
  let content = blocks.join('\n\n');
  for (const fragment of settings.omitFragments || []) {
    const start = content.indexOf(fragment.from);
    const end = start < 0 ? -1 : content.indexOf(fragment.until, start);
    if (start < 0 || end < 0) throw new Error(`Missing omitted fragment: ${fragment.from}`);
    content = content.slice(0, start) + (fragment.keepTerminator ? fragment.until : '') + content.slice(end + fragment.until.length);
  }
  return content.split('\n').map(line => line.startsWith('|') ?
    '|' + line.split('|').slice(1, -1).map(cell => /^-+$/.test(cell.trim()) ? '---' : cell.trim()).join('|') + '|' : line).join('\n');
}
function rewriteLinks(content, links) {
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, target) => {
    if (target.startsWith('#')) return match;
    const resolved = new URL(target, links.sourceUrl);
    const name = resolved.href.startsWith(releaseURL('')) ? resolved.pathname.split(`@${version}/`)[1] : null;
    if (name?.startsWith('schema/plots/') && links.typeFile) return `[TS 类型](${links.typeFile})`;
    if (name?.startsWith('examples/specs/minimal/')) return `[${label}](../${name}${resolved.hash})`;
    if (name?.startsWith('docs/plots/')) return `[${label}](${posix.basename(name)}${resolved.hash})`;
    if (name === 'docs/spec.md' || name === 'docs/colors.md') return `[${label}](common.md${resolved.hash})`;
    throw new Error(`Unmapped guide link: ${links.sourceUrl} -> ${target}`);
  });
}
export function buildPlotGuide(sourceText, selectors, links) {
  const title = sourceText.split('\n')[0];
  const body = rewriteLinks(selectedMarkdown(sourceText, selectors), links);
  return `${title}\n\n[TS 类型](${links.typeFile}) · [最小输入](${links.example}) · [公共约束](common.md)\n\n${body}\n`;
}
export function verifyTarball(bytes, integrity) {
  const [algorithm, expected] = integrity.split('-');
  if (createHash(algorithm).update(bytes).digest('base64') !== expected) throw new Error('npm tarball integrity mismatch');
}
async function get(url) {
  const result = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!result.ok) throw new Error(`${url}: HTTP ${result.status}`);
  return result;
}
export async function checkResources(root = defaultRoot, { manifestPath, checkWorkspace = true } = {}) {
  manifestPath = resourceManifestPath(root, manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const snapshot = JSON.parse(await readFile(join(root, 'snapshot.json'), 'utf8'));
  if (manifest.version !== version || snapshot.version !== version || manifest.formatVersion !== 3) throw new Error('Unexpected resource version/format; sync required');
  if (hash(await readFile(join(repository, generatorPath))) !== manifest.generator.sha256 ||
      hash(await readFile(selectorsPath)) !== manifest.generator.selectorsSha256) throw new Error('Resource generator/selectors changed; sync required');
  for (const [name, record] of Object.entries(manifest.files)) {
    if (hash(await readFile(join(root, name))) !== record.sha256) throw new Error(`sha256 mismatch: ${name}`);
  }
  const names = [];
  async function walk(directory, prefix = '') {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const name = prefix + item.name;
      if (item.isDirectory()) await walk(join(directory, item.name), name + '/');
      else if (item.isFile()) names.push(name);
      else throw new Error(`Unexpected resource entry: ${name}`);
    }
  }
  await walk(root);
  const expected = new Set(Object.keys(manifest.files));
  for (const name of names) if (!expected.has(name)) throw new Error(`Unexpected/stale resource: ${name}`);
  for (const name of expected) {
    if (!['snapshot.json','index.json','variants.json','LICENSE','THIRD_PARTY_LICENSES.md'].includes(name) &&
        !/^(types\/.+\.d\.ts|guides\/[a-zA-Z]+\.md|examples\/specs\/minimal\/[a-zA-Z]+\.json)$/.test(name) &&
        !variantExamplePattern.test(name)) {
      throw new Error(`Unexpected/stale resource: ${name}`);
    }
  }
  const files = collectTypeFiles('esm/types.d.ts', name => {
    const target = name.replace(/^esm\//, 'types/');
    if (!manifest.files[target]) throw new Error(`Missing declaration: ${target}`);
    return readFileSync(join(root, target), 'utf8');
  });
  const index = JSON.parse(await readFile(join(root, 'index.json'), 'utf8'));
  const variants = JSON.parse(await readFile(join(root, 'variants.json'), 'utf8'));
  if (Object.keys(variants).some(type => !index.some(entry => entry.type === type))) throw new Error('Unknown variant type');
  const catalog = index.map(entry => {
    if (entry.variantFile && (entry.variantFile !== 'variants.json' || !Array.isArray(variants[entry.type]) || !variants[entry.type].length)) throw new Error(`Missing variant metadata: ${entry.type}`);
    return { ...entry, variants: variants[entry.type] ?? [] };
  });
  const derived = buildPlotIndex(catalog, files);
  for (let i = 0; i < index.length; i++) {
    if (Object.hasOwn(index[i], 'fullDocsUrl')) throw new Error(`Remote index documentation: ${index[i].type}`);
    for (const key of ['typeFile','guide','example']) {
      const target = index[i][key];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) throw new Error(`Local index target required: ${target}`);
      if (!manifest.files[target]) throw new Error(`Missing index target: ${target}`);
    }
    if (index[i].typeFile !== derived[i].typeFile || index[i].typeName !== derived[i].typeName || index[i].variantFile !== derived[i].variantFile) throw new Error(`Type index mismatch: ${index[i].type}`);
    for (const variant of catalog[i].variants) {
      if (Object.hasOwn(variant, 'exampleUrl')) throw new Error(`Remote variant example: ${index[i].type}`);
      if (!variantExamplePattern.test(variant.example)) throw new Error(`Local variant example required: ${variant.example}`);
      if (!manifest.files[variant.example]) throw new Error(`Missing variant example: ${variant.example}`);
      const spec = JSON.parse(await readFile(join(root, variant.example), 'utf8'));
      if (spec.type !== index[i].type) throw new Error(`Variant example type mismatch: ${variant.example}`);
      for (const [key, value] of Object.entries(variant.options)) {
        if (!isDeepStrictEqual(spec[key], value)) throw new Error(`Variant example option mismatch: ${variant.example}: ${key}`);
      }
    }
  }
  if (JSON.stringify(index.map(entry => entry.type)) !== JSON.stringify(manifest.supportedTypes)) throw new Error('Supported type list mismatch');
  const referenced = new Set(['snapshot.json','index.json','variants.json','LICENSE','THIRD_PARTY_LICENSES.md','guides/common.md',
    ...[...files.keys()].map(name => name.replace(/^esm\//,'types/')),
    ...index.flatMap(entry => [entry.guide, entry.example]),
    ...Object.values(variants).flat().map(variant => variant.example)]);
  for (const name of expected) if (!referenced.has(name)) throw new Error(`Unreferenced resource: ${name}`);
  for (const name of names.filter(name => name.endsWith('.md'))) {
    const text = await readFile(join(root, name), 'utf8');
    if (name.startsWith('guides/') && /```json/.test(text)) throw new Error(`Duplicated inline example: ${name}`);
    for (const [,target] of text.matchAll(/\]\(([^)]+)\)/g)) {
      if (name.startsWith('guides/') && /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) throw new Error(`Remote guide link: ${name} -> ${target}`);
      if (/^(https?:|#)/.test(target)) continue;
      const local = posix.normalize(posix.join(posix.dirname(name), target.split('#')[0]));
      if (!manifest.files[local]) throw new Error(`Broken local link: ${name} -> ${target}`);
    }
  }
  for (const [target, record] of Object.entries(checkWorkspace ? manifest.workspaceAssets : {})) {
    const original = await readFile(join(repository, record.source));
    const copied = await readFile(join(repository, target));
    if (hash(original) !== record.sha256 || hash(copied) !== record.sha256) throw new Error(`workspace sha256 mismatch: ${target}`);
  }
  return manifest;
}
export async function publishSnapshot({ root, stagingRoot, manifestPath, stagingManifestPath, controllerPath, controllerBytes, validate }) {
  const backupRoot = `${root}.backup-${process.pid}`;
  const backupManifest = `${manifestPath}.backup-${process.pid}`;
  let rootBackedUp = false, manifestBackedUp = false, rootInstalled = false, manifestInstalled = false, controllerTouched = false;
  const previousController = controllerBytes === undefined ? undefined : await fs.readFile(controllerPath).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  try {
    try { await fs.rename(root, backupRoot); rootBackedUp = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await fs.rename(manifestPath, backupManifest); manifestBackedUp = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await fs.rename(stagingRoot, root); rootInstalled = true;
    await fs.rename(stagingManifestPath, manifestPath); manifestInstalled = true;
    if (controllerBytes !== undefined) {
      await fs.mkdir(dirname(controllerPath), { recursive: true });
      controllerTouched = true;
      await fs.writeFile(controllerPath, controllerBytes);
    }
    await validate();
  } catch (error) {
    const rollback = await Promise.allSettled([
      (async () => {
        if (rootInstalled) await fs.rm(root, { recursive: true, force: true });
        if (rootBackedUp) await fs.rename(backupRoot, root);
      })(),
      (async () => {
        if (manifestInstalled) await fs.rm(manifestPath, { force: true });
        if (manifestBackedUp) await fs.rename(backupManifest, manifestPath);
      })(),
      (async () => {
        if (!controllerTouched) return;
        if (previousController === null) await fs.rm(controllerPath, { force: true });
        else await fs.writeFile(controllerPath, previousController);
      })()
    ]);
    const failures = rollback.filter(result => result.status === 'rejected').map(result => result.reason);
    if (failures.length) throw new AggregateError([error, ...failures], 'Snapshot publication and rollback failed; preserve remaining backups');
    throw error;
  } finally {
    await fs.rm(stagingRoot, { recursive: true, force: true });
    await fs.rm(stagingManifestPath, { force: true });
  }
  await fs.rm(backupRoot, { recursive: true, force: true });
  await fs.rm(backupManifest, { force: true });
}
export async function syncResources(root = defaultRoot, { manifestPath } = {}) {
  manifestPath = resourceManifestPath(root, manifestPath);
  const metadata = await (await get(`https://registry.npmjs.org/@visactor%2fvchart-statplots/${version}`)).json();
  const tarball = Buffer.from(await (await get(metadata.dist.tarball)).arrayBuffer());
  verifyTarball(tarball, metadata.dist.integrity);
  const temp = await mkdtemp(join(tmpdir(), 'dsv-sync-'));
  const staging = `${root}.staging-${process.pid}`;
  const stagingManifestPath = `${manifestPath}.staging-${process.pid}`;
  try {
    const archive = join(temp, 'package.tgz');
    await writeFile(archive, tarball);
    const extract = name => {
      if (!/^[a-zA-Z0-9_./-]+$/.test(name) || name.split('/').includes('..')) throw new Error(`Invalid archive path: ${name}`);
      return execFileSync('tar', ['-xOf', archive, `package/${name}`], { maxBuffer: 20 * 1024 * 1024 });
    };
    const cache = new Map();
    const read = name => { if (!cache.has(name)) cache.set(name, extract(name)); return cache.get(name); };
    const catalog = JSON.parse(read('docs/plot-catalog.json'));
    const selectorsBytes = await readFile(selectorsPath);
    const selectors = JSON.parse(selectorsBytes);
    if (Object.keys(selectors.plots).length !== catalog.length) throw new Error('Selector coverage mismatch');
    const typeFiles = collectTypeFiles('esm/types.d.ts', name => read(name).toString());
    const index = buildPlotIndex(catalog, typeFiles);
    const manifest = { formatVersion: 3, package: metadata.name, version, license: metadata.license,
      integrity: metadata.dist.integrity, tarball: metadata.dist.tarball,
      generator: { source: generatorPath, sha256: hash(await readFile(join(repository, generatorPath))), selectorsSha256: hash(selectorsBytes) },
      supportedTypes: catalog.map(entry => entry.type), files: {}, workspaceAssets: {} };
    const sourceRecord = name => ({ source: releaseURL(name), sourceSha256: hash(read(name)) });
    async function write(name, bytes, origin) {
      await mkdir(dirname(join(staging, name)), { recursive: true });
      await writeFile(join(staging, name), bytes);
      manifest.files[name] = { ...origin, sha256: hash(bytes) };
    }
    await write('snapshot.json', Buffer.from(JSON.stringify({ version }, null, 2) + '\n'), {
      sources: [], transform: { rule: 'snapshot-version-v1' }
    });
    await write('THIRD_PARTY_LICENSES.md', read('THIRD_PARTY_LICENSES.md'), sourceRecord('THIRD_PARTY_LICENSES.md'));
    for (const [name, content] of typeFiles) await write(name.replace(/^esm\//,'types/'), Buffer.from(content), sourceRecord(name));
    for (const entry of index) {
      await write(entry.example, read(entry.example), sourceRecord(entry.example));
      const name = `docs/plots/${entry.type}.md`;
      const guide = buildPlotGuide(read(name).toString(), selectors.plots[entry.type], {
        typeFile: '../' + entry.typeFile, example: '../' + entry.example, sourceUrl: releaseURL(name)
      });
      await write(entry.guide, Buffer.from(guide), { sources: [sourceRecord(name)], transform: { rule: 'plot-guide-v2', selectors: selectors.plots[entry.type] } });
    }
    const common = selectors.common.map(settings => rewriteLinks(selectedMarkdown(read(settings.source).toString(), settings), {
      sourceUrl: releaseURL(settings.source)
    })).join('\n\n');
    await write('guides/common.md', Buffer.from('# 公共输入与表达约束\n\n' + common + '\n'), {
      sources: [...new Set(selectors.common.map(item => item.source))].map(sourceRecord), transform: { rule: 'common-guide-v1', selectors: selectors.common }
    });
    await write('index.json', Buffer.from('[\n' + index.map(entry => JSON.stringify(entry)).join(',\n') + '\n]\n'), {
      sources: [sourceRecord('docs/plot-catalog.json'), ...[...typeFiles.keys()].map(sourceRecord)], transform: { rule: 'type-index-v2' }
    });
    const variants = buildVariantIndex(catalog);
    for (const name of new Set(Object.values(variants).flat().map(variant => variant.example))) {
      await write(name, read(name), sourceRecord(name));
    }
    await write('variants.json', Buffer.from('{\n' + Object.entries(variants).map(([type,values]) => `${JSON.stringify(type)}:${JSON.stringify(values)}`).join(',\n') + '\n}\n'), {
      sources: [sourceRecord('docs/plot-catalog.json')], transform: { rule: 'variant-index-v2' }
    });
    const license = await readFile(join(repository, 'LICENSE'));
    await writeFile(join(staging, 'LICENSE'), license);
    manifest.files.LICENSE = { source: 'workspace:LICENSE', sha256: hash(license) };
    const controllerPath = 'packages/vchart-statplots/examples/shared/statplot-controller.js';
    const target = 'skills/data-science-visualization/assets/statplot-controller.js';
    let controller;
    try {
      await access(join(repository, controllerPath));
      controller = await readFile(join(repository, controllerPath));
      manifest.workspaceAssets[target] = { source: controllerPath, sha256: hash(controller) };
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await mkdir(dirname(stagingManifestPath), { recursive: true });
    await writeFile(stagingManifestPath, JSON.stringify(manifest, null, 2) + '\n');
    await checkResources(staging, { manifestPath: stagingManifestPath, checkWorkspace: false });
    await publishSnapshot({
      root, stagingRoot: staging, manifestPath, stagingManifestPath,
      controllerPath: join(repository, target), controllerBytes: controller,
      validate: () => checkResources(root, { manifestPath })
    });
    console.log(`Synced ${typeFiles.size} declarations, ${index.length} guides/minimal inputs`);
  } finally {
    await rm(temp, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
    await rm(stagingManifestPath, { force: true });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const root = args.includes('--root') ? resolve(args[args.indexOf('--root') + 1]) : defaultRoot;
  const manifestPath = args.includes('--manifest') ? resolve(args[args.indexOf('--manifest') + 1]) : undefined;
  try {
    if (args.includes('--check')) { await checkResources(root, { manifestPath }); console.log('Skill resources verified offline'); }
    else await syncResources(root, { manifestPath });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
