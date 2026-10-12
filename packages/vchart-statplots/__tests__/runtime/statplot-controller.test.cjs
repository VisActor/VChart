const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.resolve(__dirname, '../../examples/shared/statplot-controller.js');
function harness() {
  const calls = { constructed:0, compiled:0, released:0, exports:[], fail:false, delay:null };
  class Chart {
    constructor(spec) { calls.constructed++; this.value = spec; }
    async renderAsync() { if (calls.delay) await calls.delay; }
    async updateSpec(spec) { if (calls.fail) { calls.fail=false; throw new Error('native failure'); } this.value=spec; }
    release() { calls.released++; }
    async exportImg(name) { calls.exports.push(name); }
  }
  const context = {VChart:{default:Chart},VChartStatPlots:{registerStatPlots(){},
    validateStatPlot(spec){return {valid:!spec.invalid,errors:[{path:'/data',message:'invalid'}]};},
    compileStatPlot(spec){calls.compiled++;if(spec.overflow)throw new Error('overflow');return {...spec};}}};
  vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
  return {calls,create:context.StatPlotController.create};
}
test('updates keep one instance and export uses a filename', async () => {
  const {calls,create}=harness(); const c=create({dom:'plot'});
  await c.update({type:'histogram',data:[{value:0}]});const original=c.chart;
  await c.update({type:'histogram',data:[{value:1}]});
  assert.equal(c.chart,original);assert.equal(calls.constructed,1);assert.equal(calls.compiled,2);
  await c.exportPNG('income');assert.deepEqual(calls.exports,['income']);
  await c.release();await c.release();assert.equal(calls.released,1);
  await assert.rejects(c.update({}),/released/);
});
test('validation and compilation errors do not touch successful state',async()=>{
  const {create}=harness();const c=create({dom:'plot'});const good={type:'histogram',data:[]};
  await c.update(good);const chart=c.chart;
  await assert.rejects(c.update({invalid:true}),/\/data/);
  await assert.rejects(c.update({overflow:true}),/overflow/);
  assert.equal(c.chart,chart);assert.equal(c.spec,good);await c.update(good);
});
test('native failure restores last input and subsequent updates work',async()=>{
  const {calls,create}=harness();const c=create({dom:'plot'});const good={type:'histogram',data:[]};
  await c.update(good);calls.fail=true;await assert.rejects(c.update({type:'histogram',data:[1]}),/native failure/);
  assert.equal(c.spec,good);assert.equal(calls.released,1);assert.deepEqual(c.chart.value,good);
  await c.update({type:'histogram',data:[2]});assert.equal(calls.constructed,2);
});
test('release waits for rendering and prevents queued updates from creating instances',async()=>{
  const {calls,create}=harness();let done;calls.delay=new Promise(r=>{done=r;});const c=create({dom:'plot'});
  const first=c.update({type:'histogram',data:[]});await Promise.resolve();await Promise.resolve();
  const queued=c.update({type:'histogram',data:[1]});const rejected=assert.rejects(queued,/released/);
  const releasing=c.release();done();await first;await rejected;await releasing;
  assert.equal(calls.constructed,1);assert.equal(calls.released,1);assert.equal(c.chart,null);
});
