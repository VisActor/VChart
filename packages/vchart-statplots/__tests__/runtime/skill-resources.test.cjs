const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const {execFileSync}=require('node:child_process');
const moduleURL = new URL('../../scripts/sync-visualization-skill.mjs', require('node:url').pathToFileURL(__filename));
const resourceRoot = path.resolve(__dirname, '../../../../skills/data-science-visualization/references/statplots');
const maintenanceManifest = path.resolve(__dirname, '../../skill-maintenance/manifest.json');
async function resourceFixture(prefix) {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  const root = path.join(temp, 'resources');
  const manifestPath = path.join(temp, 'manifest.json');
  await fs.cp(resourceRoot, root, { recursive: true });
  await fs.copyFile(maintenanceManifest, manifestPath);
  return { temp, root, manifestPath };
}

test('installed skill uses only its generated snapshot marker', async () => {
  const { checkResources, version } = await import(moduleURL);
  await checkResources();
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(resourceRoot, 'snapshot.json'), 'utf8')), { version });
  await assert.rejects(fs.access(path.join(resourceRoot, 'manifest.json')), /ENOENT/);
  await assert.rejects(fs.access(path.join(resourceRoot, 'package.json')), /ENOENT/);
});

test('custom resource roots require an independent manifest path', async () => {
  const { checkResources, syncResources } = await import(moduleURL);
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-custom-root-'));
  try {
    await assert.rejects(checkResources(temp), /requires manifestPath/);
    await assert.rejects(syncResources(temp), /requires manifestPath/);
    await assert.rejects(checkResources(temp, { manifestPath: path.join(temp, 'manifest.json') }), /outside/);
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
});

test('CLI checks a copied resource tree using its explicit external manifest', async () => {
  const { temp, root, manifestPath } = await resourceFixture('dsv-cli-check-');
  try {
    const output = execFileSync(process.execPath, [
      require('node:url').fileURLToPath(moduleURL), '--root', root, '--manifest', manifestPath, '--check'
    ], { encoding: 'utf8' });
    assert.match(output, /Skill resources verified offline/);
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
});

for (const entry of [
  { name: 'missing external manifest', error: /ENOENT/, change: async (root, manifestPath) => fs.unlink(manifestPath) },
  { name: 'snapshot version mismatch', error: /version/, change: async root => {
    await fs.writeFile(path.join(root, 'snapshot.json'), JSON.stringify({ version: '9.9.9-test.0' }));
  } },
  { name: 'snapshot hash mismatch', error: /sha256 mismatch: snapshot.json/, change: async root => {
    const file = path.join(root, 'snapshot.json');
    await fs.appendFile(file, '\n');
  } },
  ...['manifest.json', 'package.json'].map(name => ({
    name: `old embedded ${name}`, error: /Unexpected\/stale resource/, change: async root => fs.writeFile(path.join(root, name), '{}')
  }))
]) {
  test(`external manifest layout rejects ${entry.name}`, async () => {
    const { checkResources } = await import(moduleURL);
    const { temp, root, manifestPath } = await resourceFixture('dsv-layout-');
    try {
      await entry.change(root, manifestPath);
      await assert.rejects(checkResources(root, { manifestPath }), entry.error);
    } finally { await fs.rm(temp, { recursive: true, force: true }); }
  });
}

test('release configuration accepts pinned versions and rejects tags or ranges', async () => {
  const { readReleaseVersion } = await import(moduleURL);
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-release-'));
  const file = path.join(root, 'release.json');
  try {
    for (const version of ['9.9.9', '9.9.9-test.0']) {
      await fs.writeFile(file, JSON.stringify({ version }));
      assert.equal(readReleaseVersion(file), version);
    }
    for (const release of [{ version: 'latest' }, { version: '^2.0.0' }, {}, { version: 2 }, null]) {
      await fs.writeFile(file, JSON.stringify(release));
      assert.throws(() => readReleaseVersion(file), /release.json/);
    }
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('offline check rejects a snapshot with a different release version', async () => {
  const { checkResources } = await import(moduleURL);
  const { temp, root, manifestPath } = await resourceFixture('dsv-release-mismatch-');
  try {

    const file = manifestPath;
    const manifest = JSON.parse(await fs.readFile(file, 'utf8'));
    manifest.version = '9.9.9-test.0';
    await fs.writeFile(file, JSON.stringify(manifest));
    await assert.rejects(checkResources(root, { manifestPath }), /version/);
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
});

function packageFetch(version, bytes, integrity) {
  const metadataURL = `https://registry.npmjs.org/@visactor%2fvchart-statplots/${version}`;
  const tarballURL = 'https://fixture.test/package.tgz';
  return async url => {
    if (String(url) === metadataURL) {
      return new Response(
        JSON.stringify({ name: '@visactor/vchart-statplots', dist: { tarball: tarballURL, integrity } })
      );
    }
    if (String(url) === tarballURL) return new Response(bytes);
    throw new Error(`Unexpected fixture request: ${url}`);
  };
}

test('package fetch fixture accepts exact requests and rejects deceptive URLs', async () => {
  const { version } = await import(moduleURL);
  const bytes = Buffer.from('fixture tarball');
  const fetch = packageFetch(version, bytes, 'sha512-fixture');
  const metadata = await (await fetch(`https://registry.npmjs.org/@visactor%2fvchart-statplots/${version}`)).json();
  assert.equal(metadata.name, '@visactor/vchart-statplots');
  assert.equal(metadata.dist.integrity, 'sha512-fixture');
  assert.deepEqual(Buffer.from(await (await fetch(metadata.dist.tarball)).arrayBuffer()), bytes);
  for (const url of [
    'https://registry.npmjs.org.attacker.invalid/package',
    'https://attacker.invalid/registry.npmjs.org',
    'https://attacker.invalid/?host=registry.npmjs.org',
    'https://registry.npmjs.org/wrong-package',
    'https://registry.npmjs.org/@visactor%2fvchart-statplots/wrong-version',
    `http://registry.npmjs.org/@visactor%2fvchart-statplots/${version}`,
    'https://fixture.test/unexpected.tgz'
  ]) {
    await assert.rejects(fetch(url), /Unexpected fixture request/);
  }
});

function typeFixture() {
  return new Map([
    ['esm/types.d.ts', "import type {A} from './plots/a/types'; import type {B} from './plots/b/types'; export type StatPlotSpec=A|B;"],
    ['esm/plots/a/types.d.ts', "import type {Base} from '../../common/types'; export interface A extends Base {type:'a';data:number[];}"],
    ['esm/plots/b/types.d.ts', "import type {Base} from '../../common/types'; interface BBase extends Base {type:'b'} export type B=BBase&({input:'raw';data:number[]}|{input:'results';data:string[]});"],
    ['esm/common/types.d.ts', 'export interface Base {title?:string;}']
  ]);
}
test('variant index preserves published metadata and uses local examples', async () => {
  const { buildVariantIndex } = await import(moduleURL);
  const item = {
    name: '类别比例图', aliases: ['类别占比'], options: { statistic: 'proportion' },
    example: 'examples/specs/variants/countPlot-proportion.json'
  };
  const variants = buildVariantIndex([
    { type: 'countPlot', variants: [item] }, { type: 'missingValueMatrix', variants: [] }
  ]);
  assert.deepEqual(variants, { countPlot: [item] });
  assert.equal(Object.hasOwn(variants.countPlot[0], 'exampleUrl'), false);
});

test('published declaration imports close exactly and map inherited discriminants', async () => {
  const {collectTypeFiles,buildPlotIndex}=await import(moduleURL);
  const files=typeFixture();
  const closure=collectTypeFiles('esm/types.d.ts',name=>{
    if(!files.has(name))throw new Error(`Missing declaration: ${name}`);
    return files.get(name);
  });
  assert.equal(closure.size,4);
  assert.equal(closure.get('esm/common/types.d.ts'),files.get('esm/common/types.d.ts'));
  const catalog=['a','b'].map(type=>({type,name:type,useWhen:'真实输入',avoidWhen:[],example:`examples/specs/minimal/${type}.json`,variants:[]}));
  const index=buildPlotIndex(catalog,closure);
  assert.equal(index[0].typeName,'A');assert.equal(index[1].typeName,'B');
  assert.equal(index[1].typeFile,'types/plots/b/types.d.ts');
  assert.equal(index[0].schema,undefined);
  assert.equal(Object.hasOwn(index[0], 'fullDocsUrl'), false);
  assert.throws(()=>buildPlotIndex([...catalog,{...catalog[0],type:'missing'}],closure),/catalog|目录/);
});
test('declaration closure rejects external, escaping and absent imports',async()=>{
  const {collectTypeFiles}=await import(moduleURL);
  for(const target of ['outside-package','../../escape','./absent']){
    assert.throws(()=>collectTypeFiles('esm/types.d.ts',name=>{
      if(name==='esm/types.d.ts')return `export * from '${target}';`;
      throw new Error('Missing declaration');
    }),/External|escape|Missing/);
  }
});
test('guides keep semantics, link examples and reject missing sections',async()=>{
  const {buildPlotGuide,version}=await import(moduleURL);
  const source='# 图\n简介\n\n## 输入\n每行是真实观测。[类型](../../schema/plots/a.json)、[另一图](b.md)、[公共口径](../spec.md)。\n```json\n{"type":"a"}\n```\n\n## 边界\n常数组需要明确带宽。\n\n## 迁移\n旧版历史。\n';
  const links={typeFile:'../types/a.d.ts',example:'../examples/a.json',sourceUrl:`https://unpkg.com/@visactor/vchart-statplots@${version}/docs/plots/a.md`};
  const guide=buildPlotGuide(source,['输入','边界'],links);
  assert.match(guide,/真实观测/);assert.match(guide,/明确带宽/);assert.doesNotMatch(guide,/```json|旧版历史/);
  assert.match(guide,/\.\.\/types\/a.d.ts/);assert.match(guide,/\.\.\/examples\/a.json/);
  assert.match(guide,/\[另一图\]\(b\.md\)/);
  assert.match(guide,/\[公共口径\]\(common\.md\)/);
  assert.doesNotMatch(guide,/https?:\/\//);
  assert.throws(()=>buildPlotGuide(source,['缺少'],links),/Missing section/);
  for (const target of ['../../README.md', 'https://example.test/a.md']) {
    assert.throws(()=>buildPlotGuide(`# 图\n\n## 输入\n更多[说明](${target})。\n`,['输入'],links),/Unmapped guide link/);
  }
});

for (const entry of [
  { name: 'remote guide navigation', file: 'guides/histogram.md', change: () => '[远端文档](https://example.test/histogram.md)', error: /Remote guide link/ },
  { name: 'removed fullDocsUrl index field', file: 'index.json', change: text => {
    const index = JSON.parse(text); index[0].fullDocsUrl = 'https://example.test/count.md'; return JSON.stringify(index);
  }, error: /Remote index documentation/ },
  ...['guide', 'typeFile', 'example'].map(key => ({
    name: `remote index ${key}`, file: 'index.json', change: text => {
      const index = JSON.parse(text); index[0][key] = 'https://example.test/resource'; return JSON.stringify(index);
    }, error: /Local index target/
  })),
  { name: 'missing local guide target', file: 'guides/histogram.md', change: () => '[说明](absent.md)', error: /Broken local link/ }
]) {
  test(`offline check rejects ${entry.name} even with updated file hashes`, async () => {
    const { checkResources } = await import(moduleURL);
    const { temp, root, manifestPath } = await resourceFixture('dsv-navigation-');
    try {

      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      const file = path.join(root, entry.file);
      const bytes = Buffer.from(entry.change(await fs.readFile(file, 'utf8')));
      await fs.writeFile(file, bytes);
      manifest.files[entry.file].sha256 = createHash('sha256').update(bytes).digest('hex');
      await fs.writeFile(manifestPath, JSON.stringify(manifest));
      await assert.rejects(checkResources(root, { manifestPath }), entry.error);
    } finally { await fs.rm(temp, { recursive: true, force: true }); }
  });
}

test('local navigation retains pinned release sources and transformation records', async () => {
  const { version } = await import(moduleURL);
  const root = resourceRoot;
  const manifestPath = maintenanceManifest;
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  for (const [file, rule] of [['index.json', 'type-index-v2'], ['guides/countPlot.md', 'plot-guide-v2']]) {
    const entry = manifest.files[file];
    assert.equal(entry.transform.rule, rule);
    assert.ok(entry.sources.length > 0);
    for (const source of entry.sources) {
      assert.ok(source.source.startsWith(`https://unpkg.com/@visactor/vchart-statplots@${version}/`));
      assert.match(source.sourceSha256, /^[0-9a-f]{64}$/);
    }
  }
});

for (const entry of [
  { name: 'missing file', error: /ENOENT/, change: async (root, variants) => {
    await fs.unlink(path.join(root, variants.countPlot[0].example));
  } },
  { name: 'changed bytes without hash update', error: /sha256 mismatch/, change: async (root, variants) => {
    await fs.writeFile(path.join(root, variants.countPlot[0].example), '{}');
  } },
  ...['https://example.test/count.json', '/tmp/count.json', '../count.json'].map(example => ({
    name: `nonlocal path ${example}`, error: /Local variant example required/, change: async (root, variants) => {
      variants.countPlot[0].example = example;
    }
  })),
  { name: 'legacy remote field', error: /Remote variant example/, change: async (root, variants) => {
    variants.countPlot[0].exampleUrl = 'https://example.test/count.json';
  } },
  { name: 'unregistered reference', error: /Missing variant example/, change: async (root, variants) => {
    variants.countPlot[0].example = 'examples/specs/variants/absent.json';
  } },
  { name: 'invalid JSON', error: SyntaxError, change: async (root, variants, write) => {
    await write(variants.countPlot[0].example, '{');
  } },
  { name: 'wrong plot type', error: /Variant example type mismatch/, change: async (root, variants, write) => {
    const file = variants.countPlot[0].example;
    const spec = JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
    spec.type = 'histogram';
    await write(file, JSON.stringify(spec));
  } },
  { name: 'wrong variant option', error: /Variant example option mismatch/, change: async (root, variants, write) => {
    const file = variants.countPlot[0].example;
    const spec = JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
    spec.statistic = 'count';
    await write(file, JSON.stringify(spec));
  } },
  { name: 'wrong nested option', error: /Variant example option mismatch/, change: async (root, variants, write) => {
    const item = variants.kdePlot.find(item => item.options.estimation?.bandwidth);
    const spec = JSON.parse(await fs.readFile(path.join(root, item.example), 'utf8'));
    spec.estimation.bandwidth += 1;
    await write(item.example, JSON.stringify(spec));
  } },
  { name: 'unreferenced file', error: /Unreferenced resource/, change: async (root, variants, write) => {
    await write('examples/specs/variants/orphan.json', '{}');
  } }
]) {
  test(`offline variant check rejects ${entry.name}`, async () => {
    const { checkResources } = await import(moduleURL);
    const { temp, root, manifestPath } = await resourceFixture('dsv-variants-');
    try {

      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      const variants = JSON.parse(await fs.readFile(path.join(root, 'variants.json'), 'utf8'));
      const write = async (file, text) => {
        const bytes = Buffer.from(text);
        await fs.writeFile(path.join(root, file), bytes);
        manifest.files[file] = { ...manifest.files[file], sha256: createHash('sha256').update(bytes).digest('hex') };
      };
      await entry.change(root, variants, write);
      await write('variants.json', JSON.stringify(variants));
      await fs.writeFile(manifestPath, JSON.stringify(manifest));
      await assert.rejects(checkResources(root, { manifestPath }), entry.error);
    } finally { await fs.rm(temp, { recursive: true, force: true }); }
  });
}

test('all local variants retain original release bytes and pinned sources', async () => {
  const { version } = await import(moduleURL);
  const root = resourceRoot;
  const manifestPath = maintenanceManifest;
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const variants = JSON.parse(await fs.readFile(path.join(root, 'variants.json'), 'utf8'));
  assert.equal(manifest.files['variants.json'].transform.rule, 'variant-index-v2');
  for (const item of Object.values(variants).flat()) {
    const record = manifest.files[item.example];
    assert.equal(record.source, `https://unpkg.com/@visactor/vchart-statplots@${version}/${item.example}`);
    assert.equal(record.sourceSha256, record.sha256);
    assert.equal(record.sha256, createHash('sha256').update(await fs.readFile(path.join(root, item.example))).digest('hex'));
  }
});

test('tarball integrity is checked before extraction', async () => {
  const { verifyTarball } = await import(moduleURL);
  const bytes = Buffer.from('fixed release');
  const integrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
  verifyTarball(bytes, integrity);
  assert.throws(() => verifyTarball(Buffer.from('changed'), integrity), /integrity/);
});

test('offline check detects altered resources and missing files', async () => {
  const { checkResources } = await import(moduleURL);
  const { temp, root, manifestPath } = await resourceFixture('dsv-resources-');
  try {

    const name = 'types/plots/histogram/types.d.ts';
    await checkResources(root, { manifestPath });
    await fs.writeFile(path.join(root, name), '{"changed":true}');
    await assert.rejects(checkResources(root, { manifestPath }), /sha256.*histogram/);
    await fs.unlink(path.join(root, name));
    await assert.rejects(checkResources(root, { manifestPath }), /histogram/);
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
});

test('offline check detects stale files, changed selectors and broken references beyond hashes',async()=>{
  const {checkResources}=await import(moduleURL);
  const { temp, root, manifestPath } = await resourceFixture('dsv-graph-');
  try{

    await fs.writeFile(path.join(root,'old-schema.json'),'{}');
    await assert.rejects(checkResources(root, { manifestPath }),/stale resource/);await fs.unlink(path.join(root,'old-schema.json'));
    const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
    const file='guides/histogram.md';const bytes=Buffer.from('[断链](absent.md)');
    await fs.writeFile(path.join(root,file),bytes);manifest.files[file].sha256=createHash('sha256').update(bytes).digest('hex');
    await fs.writeFile(manifestPath,JSON.stringify(manifest));
    await assert.rejects(checkResources(root, { manifestPath }),/Broken local link/);
    manifest.generator.selectorsSha256='changed';await fs.writeFile(manifestPath,JSON.stringify(manifest));
    await assert.rejects(checkResources(root, { manifestPath }),/selectors changed/);
  }finally{await fs.rm(temp, {recursive:true,force:true});}
});

test('a failed synchronization preserves the previous snapshot', async () => {
  const { syncResources, version } = await import(moduleURL);
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-failed-sync-'));
  const root = path.join(temp, 'resources');
  const manifestPath = path.join(temp, 'manifest.json');
  const fetch = global.fetch;
  try {
    await fs.mkdir(root);
    await fs.writeFile(path.join(root, 'old.txt'), 'previous snapshot');
    await fs.writeFile(manifestPath, 'previous manifest');
    global.fetch = packageFetch(version, Buffer.from('not the expected tarball'), 'sha512-invalid');
    await assert.rejects(syncResources(root, { manifestPath }), /integrity/);
    assert.equal(await fs.readFile(path.join(root, 'old.txt'), 'utf8'), 'previous snapshot');
    assert.deepEqual(await fs.readdir(root), ['old.txt']);
    assert.equal(await fs.readFile(manifestPath, 'utf8'), 'previous manifest');
  } finally {
    global.fetch = fetch;
    await fs.rm(temp, {recursive:true,force:true});
  }
});

test('a verified tarball with missing declarations preserves snapshot and controller',async()=>{
  const {syncResources,version}=await import(moduleURL);
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'dsv-invalid-package-'));
  const root=path.join(temp,'snapshot');const manifestPath=path.join(temp,'manifest.json');const fetch=global.fetch;
  const controller=path.resolve(__dirname,'../../../../skills/data-science-visualization/assets/statplot-controller.js');
  const before=await fs.readFile(controller);
  try{
    await fs.mkdir(root);await fs.writeFile(path.join(root,'old.txt'),'previous');
    await fs.writeFile(manifestPath,'previous manifest');
    const index=JSON.parse(await fs.readFile(path.resolve(__dirname,'../../../../skills/data-science-visualization/references/statplots/index.json'),'utf8'));
    await fs.mkdir(path.join(temp,'package/docs'),{recursive:true});
    await fs.writeFile(path.join(temp,'package/docs/plot-catalog.json'),JSON.stringify(index));
    for(const [name,content] of typeFixture()){
      if(name==='esm/plots/b/types.d.ts')continue;
      await fs.mkdir(path.dirname(path.join(temp,'package',name)),{recursive:true});
      await fs.writeFile(path.join(temp,'package',name),content);
    }
    const archive=path.join(temp,'package.tgz');execFileSync('tar',['-czf',archive,'-C',temp,'package']);
    const bytes=await fs.readFile(archive);const integrity='sha512-'+createHash('sha512').update(bytes).digest('base64');
    global.fetch=packageFetch(version,bytes,integrity);
    await assert.rejects(syncResources(root, { manifestPath }),/esm\/plots\/b\/types/);
    assert.equal(await fs.readFile(path.join(root,'old.txt'),'utf8'),'previous');
    assert.deepEqual(await fs.readFile(controller),before);
    assert.equal(await fs.readFile(manifestPath,'utf8'),'previous manifest');
  }finally{global.fetch=fetch;await fs.rm(temp,{recursive:true,force:true});}
});
