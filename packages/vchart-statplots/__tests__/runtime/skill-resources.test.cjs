const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const {execFileSync}=require('node:child_process');
const moduleURL = new URL('../../scripts/sync-visualization-skill.mjs', require('node:url').pathToFileURL(__filename));

function typeFixture() {
  return new Map([
    ['esm/types.d.ts', "import type {A} from './plots/a/types'; import type {B} from './plots/b/types'; export type StatPlotSpec=A|B;"],
    ['esm/plots/a/types.d.ts', "import type {Base} from '../../common/types'; export interface A extends Base {type:'a';data:number[];}"],
    ['esm/plots/b/types.d.ts', "import type {Base} from '../../common/types'; interface BBase extends Base {type:'b'} export type B=BBase&({input:'raw';data:number[]}|{input:'results';data:string[]});"],
    ['esm/common/types.d.ts', 'export interface Base {title?:string;}']
  ]);
}
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
  const {buildPlotGuide}=await import(moduleURL);
  const source='# 图\n简介\n\n## 输入\n每行是真实观测。\n```json\n{"type":"a"}\n```\n\n## 边界\n常数组需要明确带宽。\n\n## 迁移\n旧版历史。\n';
  const links={typeFile:'../types/a.d.ts',example:'../examples/a.json',fullDocsUrl:'https://example.test/plots/a.md'};
  const guide=buildPlotGuide(source,['输入','边界'],links);
  assert.match(guide,/真实观测/);assert.match(guide,/明确带宽/);assert.doesNotMatch(guide,/```json|旧版历史/);
  assert.match(guide,/\.\.\/types\/a.d.ts/);assert.match(guide,/\.\.\/examples\/a.json/);
  assert.throws(()=>buildPlotGuide(source,['缺少'],links),/Missing section/);
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
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-resources-'));
  try {
    await fs.cp(path.resolve(__dirname,'../../../../skills/data-science-visualization/references/statplots'),root,{recursive:true});
    const name = 'types/plots/histogram/types.d.ts';
    await checkResources(root);
    await fs.writeFile(path.join(root, name), '{"changed":true}');
    await assert.rejects(checkResources(root), /sha256.*histogram/);
    await fs.unlink(path.join(root, name));
    await assert.rejects(checkResources(root), /histogram/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('offline check detects stale files, changed selectors and broken references beyond hashes',async()=>{
  const {checkResources}=await import(moduleURL);
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'dsv-graph-'));
  try{
    await fs.cp(path.resolve(__dirname,'../../../../skills/data-science-visualization/references/statplots'),root,{recursive:true});
    await fs.writeFile(path.join(root,'old-schema.json'),'{}');
    await assert.rejects(checkResources(root),/stale resource/);await fs.unlink(path.join(root,'old-schema.json'));
    const manifest=JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8'));
    const file='guides/histogram.md';const bytes=Buffer.from('[断链](absent.md)');
    await fs.writeFile(path.join(root,file),bytes);manifest.files[file].sha256=createHash('sha256').update(bytes).digest('hex');
    await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest));
    await assert.rejects(checkResources(root),/Broken local link/);
    manifest.generator.selectorsSha256='changed';await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest));
    await assert.rejects(checkResources(root),/selectors changed/);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});

test('a failed synchronization preserves the previous snapshot', async () => {
  const { syncResources } = await import(moduleURL);
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-failed-sync-'));
  const fetch = global.fetch;
  try {
    await fs.writeFile(path.join(root, 'manifest.json'), 'previous snapshot');
    global.fetch = async url => String(url).includes('registry.npmjs.org')
      ? new Response(JSON.stringify({name:'@visactor/vchart-statplots', dist:{tarball:'https://fixture.test/package.tgz',integrity:'sha512-invalid'}}))
      : new Response(Buffer.from('not the expected tarball'));
    await assert.rejects(syncResources(root), /integrity/);
    assert.equal(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'), 'previous snapshot');
    assert.deepEqual(await fs.readdir(root), ['manifest.json']);
  } finally {
    global.fetch = fetch;
    await fs.rm(root, {recursive:true,force:true});
  }
});

test('a verified tarball with missing declarations preserves snapshot and controller',async()=>{
  const {syncResources}=await import(moduleURL);
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'dsv-invalid-package-'));
  const root=path.join(temp,'snapshot');const fetch=global.fetch;
  const controller=path.resolve(__dirname,'../../../../skills/data-science-visualization/assets/statplot-controller.js');
  const before=await fs.readFile(controller);
  try{
    await fs.mkdir(root);await fs.writeFile(path.join(root,'manifest.json'),'previous');
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
    global.fetch=async url=>String(url).includes('registry.npmjs.org')?
      new Response(JSON.stringify({name:'@visactor/vchart-statplots',dist:{tarball:'https://fixture.test/package.tgz',integrity}})):new Response(bytes);
    await assert.rejects(syncResources(root),/esm\/plots\/b\/types/);
    assert.equal(await fs.readFile(path.join(root,'manifest.json'),'utf8'),'previous');
    assert.deepEqual(await fs.readFile(controller),before);
  }finally{global.fetch=fetch;await fs.rm(temp,{recursive:true,force:true});}
});
