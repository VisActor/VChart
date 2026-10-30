const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const skill=path.resolve(__dirname,'../../../../skills/data-science-visualization');
function api(){const c={};vm.runInNewContext(fs.readFileSync(path.join(skill,'assets/data-bindings.js'),'utf8'),c);return c.StatPlotData;}
const columns=[{name:'x',type:'number',label:'年龄',unit:'岁'},{name:'y',type:'number'},{name:'group',type:'string'}];
const rows=[{id:'001',values:{x:0,y:1,group:'A'}},{id:'002',values:{x:null,y:2,group:'B'}},{id:'003',values:{x:2,y:3,group:'B'}}];
test('scatter omits mapped null, keeps zero and stable ids without modifying input',()=>{
 const a=api();const original=JSON.stringify(rows);const r=a.buildBoundSpec({type:'scatterPlot',fields:{x:'x',y:'y'}},rows,columns);
 assert.equal(r.inputN,2);assert.equal(r.omittedN,1);assert.equal(r.spec.data[0].id,'001');assert.equal(r.spec.data[0].x,0);
 assert.equal(r.spec.fieldLabels.x,'年龄（岁）');assert.equal(JSON.stringify(rows),original);
});
test('all 12 mappings use raw inputs and only their allowed semantic roles',()=>{
 const a=api();const fixtures={countPlot:{category:'group'},histogram:{value:'x'},kdePlot:{value:'x'},ecdfPlot:{value:'x'},
 boxPlot:{category:'group',value:'x'},violinPlot:{category:'group',value:'x'},stripPlot:{category:'group',value:'x'},
 scatterPlot:{x:'x',y:'y'},hexbinPlot:{x:'x',y:'y'},missingValueMatrix:{variables:['x','group']},
 correlationMatrix:{variables:['x','y']},pairPlot:{variables:['x','y']}};
 for(const [type,fields]of Object.entries(fixtures)){
   const r=a.buildBoundSpec({type,fields},rows,columns);assert.equal(r.spec.type,type);
   if(type.endsWith('Matrix')||type==='pairPlot'){assert.equal(r.spec.data.observations.length,3);assert.equal(r.spec.data.observations[1].values.x,null);}
   else if(type==='histogram'){assert.equal(Object.keys(r.spec.data[0]).join(','),'value');}
   else if(type==='stripPlot')assert.equal(r.spec.data[0].id,'001');
 }
});
test('invalid roles, columns, overrides and matrix budgets fail at the boundary',()=>{
 const a=api();for(const binding of [{type:'histogram',fields:{value:'x',series:'group'}},{type:'scatterPlot',fields:{x:'x',y:'group'}},
 {type:'histogram',fields:{value:'absent'}},{type:'histogram',fields:{value:'x'},options:{data:[]}},
 {type:'pairPlot',fields:{variables:['x','y','x']}}])assert.throws(()=>a.buildBoundSpec(binding,rows,columns));
});
test('closed ranges, category filtering and clear preserve observations',()=>{
 const a=api();const selected=a.filterRows(rows,[{field:'x',kind:'range',value:[0,2]}]);
 assert.deepEqual(Array.from(selected,r=>r.id),['001','003']);
 assert.equal(a.filterRows(rows,[{field:'group',kind:'category',value:'B'}])[0].id,'002');
 assert.equal(a.filterRows(rows,[]).length,3);assert.equal(a.filterRows(rows,[{field:'group',kind:'category',value:'C'}]).length,0);
});
test('matrix null handling and missing series only omit the group-null row',()=>{
 const a=api();const input=[...rows,{id:'004',values:{x:null,y:4,group:null}}];
 const pair=a.buildBoundSpec({type:'pairPlot',fields:{variables:['x','y'],series:'group'}},input,columns);
 assert.equal(pair.inputN,3);assert.equal(pair.omittedN,1);assert.equal(pair.spec.data.observations[1].values.x,null);
});
