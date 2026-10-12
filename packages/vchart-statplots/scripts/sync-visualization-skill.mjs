// Maintainer-only sync; installed skills never run npm or this script.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm, rename, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { posix } from 'node:path';
import ts from 'typescript';

export const version = '2.1.8-alpha.0';
const repository = fileURLToPath(new URL('../../../', import.meta.url));
const skill = join(repository, 'skills/data-science-visualization');
const defaultRoot = join(skill, 'references/statplots');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const releaseURL = name => `https://unpkg.com/@visactor/vchart-statplots@${version}/${name}`;
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
      variants: entry.variants.map(({ name, aliases, options, example }) => ({ name, aliases, options, exampleUrl: releaseURL(example) })),
      fullDocsUrl: releaseURL(`docs/plots/${entry.type}.md`) };
  });
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
export async function checkResources(root = defaultRoot) {
  const manifest = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
  if (manifest.version !== version) throw new Error('Unexpected resource version');
  for (const [name, record] of Object.entries(manifest.files)) {
    if (hash(await readFile(join(root, name))) !== record.sha256) throw new Error(`sha256 mismatch: ${name}`);
  }
  for (const [target, record] of Object.entries(manifest.workspaceAssets)) {
    const original = await readFile(join(repository, record.source));
    const copied = await readFile(join(repository, target));
    if (hash(original) !== record.sha256 || hash(copied) !== record.sha256) throw new Error(`workspace sha256 mismatch: ${target}`);
  }
  return manifest;
}
export async function syncResources(root = defaultRoot) {
  const metadata = await (await get(`https://registry.npmjs.org/@visactor%2fvchart-statplots/${version}`)).json();
  const tarball = Buffer.from(await (await get(metadata.dist.tarball)).arrayBuffer());
  verifyTarball(tarball, metadata.dist.integrity);
  const temp = await mkdtemp(join(tmpdir(), 'dsv-sync-'));
  const staging = `${root}.staging-${process.pid}`;
  const backup = `${root}.backup-${process.pid}`;
  let backedUp = false;
  try {
    const archive = join(temp, 'package.tgz');
    await writeFile(archive, tarball);
    const extract = name => {
      if (!/^[a-zA-Z0-9_./-]+$/.test(name) || name.split('/').includes('..')) throw new Error(`Invalid archive path: ${name}`);
      return execFileSync('tar', ['-xOf', archive, `package/${name}`], { maxBuffer: 20 * 1024 * 1024 });
    };
    const catalog = JSON.parse(extract('docs/plot-catalog.json'));
    const paths = new Set(['package.json', 'README.md', 'THIRD_PARTY_LICENSES.md', 'docs/plot-catalog.json',
      'docs/spec.md', 'docs/colors.md', 'docs/computation-contract.md', 'docs/skill-authoring.md']);
    for (const entry of catalog) {
      paths.add(entry.schema);
      paths.add(`docs/plots/${entry.type}.md`);
      paths.add(entry.example);
      entry.variants.forEach(variant => paths.add(variant.example));
    }
    const manifest = { package: metadata.name, version, license: metadata.license,
      integrity: metadata.dist.integrity, tarball: metadata.dist.tarball,
      supportedTypes: catalog.map(entry => entry.type), files: {}, workspaceAssets: {} };
    for (const name of paths) {
      const original = extract(name);
      const source = `https://unpkg.com/@visactor/vchart-statplots@${version}/${name}`;
      const content = name.endsWith('.md') ? Buffer.from(original.toString().replace(/\]\(([^)]+)\)/g, (match, target) => {
        if (/^(https?:|#)/.test(target)) return match;
        const resolved = new URL(target, source);
        const packagePath = resolved.pathname.split(`@${version}/`)[1];
        return paths.has(packagePath?.split('#')[0]) ? match : `](${resolved.href})`;
      })) : original;
      await mkdir(dirname(join(staging, name)), { recursive: true });
      await writeFile(join(staging, name), content);
      manifest.files[name] = { source, sourceSha256: hash(original), sha256: hash(content) };
    }
    const license = await readFile(join(repository, 'LICENSE'));
    await writeFile(join(staging, 'LICENSE'), license);
    manifest.files.LICENSE = { source: 'workspace:LICENSE', sha256: hash(license) };
    const controllerPath = 'packages/vchart-statplots/examples/shared/statplot-controller.js';
    try {
      await access(join(repository, controllerPath));
      const controller = await readFile(join(repository, controllerPath));
      const target = 'skills/data-science-visualization/assets/statplot-controller.js';
      await mkdir(dirname(join(repository, target)), { recursive: true });
      await writeFile(join(repository, target), controller);
      manifest.workspaceAssets[target] = { source: controllerPath, sha256: hash(controller) };
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await writeFile(join(staging, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    await mkdir(dirname(root), { recursive: true });
    try { await rename(root, backup); backedUp = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await rename(staging, root); } catch (error) { if (backedUp) await rename(backup, root); throw error; }
    await rm(backup, { recursive: true, force: true });
    console.log(`Synced ${paths.size} published resources (${catalog.length} types)`);
  } finally {
    await rm(temp, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const root = args.includes('--root') ? resolve(args[args.indexOf('--root') + 1]) : defaultRoot;
  try {
    if (args.includes('--check')) { await checkResources(root); console.log('Skill resources verified offline'); }
    else await syncResources(root);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
