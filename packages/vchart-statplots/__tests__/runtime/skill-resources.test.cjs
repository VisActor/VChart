const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
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
    const bytes = Buffer.from('{}');
    const name = 'schema/plots/histogram.schema.json';
    await fs.mkdir(path.join(root, 'schema/plots'), { recursive: true });
    await fs.writeFile(path.join(root, name), bytes);
    await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify({
      version: '2.1.8-alpha.0', files: { [name]: { sha256: createHash('sha256').update(bytes).digest('hex') } }, workspaceAssets: {}
    }));
    await checkResources(root);
    await fs.writeFile(path.join(root, name), '{"changed":true}');
    await assert.rejects(checkResources(root), /sha256.*histogram/);
    await fs.unlink(path.join(root, name));
    await assert.rejects(checkResources(root), /histogram/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
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
