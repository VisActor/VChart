import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createContext, extractChart, supplementalDetails, auditReferences } from './skill-metadata/extract.mjs';
import { toDistributedMetadata } from './skill-metadata/distribution.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const references = path.join(repoRoot, 'skills/vchart-development-assistant/references');

export function buildArtifacts(context, sources) {
  const files = new Map();
  for (const source of sources)
    files.set(
      `type-meta/${source.chart}.json`,
      JSON.stringify(toDistributedMetadata(extractChart(context, source)), null, 2) + '\n'
    );
  files.set('type-details/AdditionalTypes-Type-Definition.md', supplementalDetails(context));
  return files;
}

export function compareArtifacts(files, directory) {
  return [...files]
    .filter(
      ([name, content]) =>
        !fs.existsSync(path.join(directory, name)) || fs.readFileSync(path.join(directory, name), 'utf8') !== content
    )
    .map(([file]) => file);
}

export function run(args) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      output: { type: 'string' },
      report: { type: 'string' },
      references: { type: 'string' },
      write: { type: 'boolean' },
      help: { type: 'boolean' }
    }
  });
  if (values.help) {
    console.log(
      '维护命令（Node.js 22，仓库已有依赖）：audit [--references DIR] [--report FILE]；generate --output DIR 或 --write；check。用户生成图表无需运行。'
    );
    return;
  }
  const command = positionals[0];
  if (positionals.length !== 1 || !['audit', 'generate', 'check'].includes(command))
    throw new Error('需要 audit、generate 或 check 命令');
  if (command === 'generate' && !!values.output === !!values.write)
    throw new Error('generate 必须且只能指定 --output 或 --write');
  if (command !== 'generate' && (values.output || values.write)) throw new Error('--output/--write 只用于 generate');
  if (command !== 'audit' && (values.references || values.report))
    throw new Error('--references/--report 只用于 audit');
  const manifest = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'packages/vchart/scripts/skill-metadata/metadata-sources.json'), 'utf8')
  );
  const context = createContext(repoRoot, manifest.sources, manifest);
  if (command === 'audit') {
    const report = auditReferences(
      context,
      manifest.sources,
      values.references ? path.resolve(values.references) : references
    );
    report.provenance = {
      vchartVersion: context.version,
      extensionVersion: context.extensionVersion,
      typescriptVersion: context.ts.version,
      sourceHash: context.sourceHash,
      sourceRevision: context.sourceRevision
    };
    if (values.report) fs.writeFileSync(values.report, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report.summary));
    if (report.errors.length || report.changes.length) process.exitCode = 1;
    return report;
  }
  const files = buildArtifacts(context, manifest.sources);
  if (command === 'check') {
    const changed = compareArtifacts(files, references);
    const orphans = fs.readdirSync(path.join(references, 'type-meta')).filter(n => !files.has('type-meta/' + n));
    const audit = auditReferences(context, manifest.sources, references);
    console.log(JSON.stringify({ files: files.size, changed, orphanMetadata: orphans, audit: audit.summary }));
    if (changed.length || orphans.length || audit.errors.length || audit.changes.length) process.exitCode = 1;
    return;
  }
  const directory = values.write ? references : path.resolve(values.output);
  // 完整抽取成功后才写入；未知类型/缺依赖不产生一半的新元数据。
  for (const [name, content] of files) {
    const file = path.join(directory, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  console.log(JSON.stringify({ files: files.size, output: path.relative(repoRoot, directory) || '.' }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    run(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
