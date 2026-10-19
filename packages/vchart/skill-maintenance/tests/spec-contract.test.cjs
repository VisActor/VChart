const test = require('node:test');
const assert = require('node:assert/strict');
const {validateSpec} = require('../../../../skills/vchart-development-assistant/scripts/spec-contract.cjs');
const {validateSource} = require('../../../../skills/vchart-development-assistant/scripts/validate_spec.cjs');
const edges = [{source:'Channel',target:'Product',value:37}, {source:'Product',target:'Order',value:12}];
const graph = {nodes:[{name:'Channel'},{name:'Product'},{name:'Order'}],links:edges};
const codes = spec => validateSpec(spec).errors.map(e => e.code);
for (const [name, spec] of [
  ['root array', {type:'sankey',data:[{values:edges}]}],
  ['series', {type:'sankey',series:[{type:'sankey',data:{values:edges}}]}],
  ['root object', {type:'sankey',data:{values:edges}}],
  ['dataset reference', {type:'common',data:[{id:'flow',values:edges}],series:[{type:'sankey',dataId:'flow'}]}]
]) test(`rejects flat edges: ${name}`,()=>assert.deepEqual(codes(spec),['SANKEY_GRAPH_REQUIRED']));
for (const [name,data] of [
  ['graph',{values:[graph]}], ['empty',{values:[]}],['empty graph',{values:[{nodes:[],links:[]}]}],
  ['hierarchy',{values:[{nodes:[{name:'Root',children:[{name:'Leaf',value:9}]}]}]}],
  ['named records',{values:[{id:'nodes',values:graph.nodes},{id:'links',values:edges}]}],
  ['deferred reference',{fromDataId:'upstream'}]
]) test(`accepts supported sankey input: ${name}`,()=>assert.equal(validateSpec({type:'sankey',data}).ok,true));
test('does not validate an unrelated combined-chart dataset as sankey',()=>{
  assert.equal(validateSpec({type:'common',data:[{id:'bars',values:[{x:'a',y:3}]},{id:'flow',values:[graph]}],series:[{type:'bar',dataId:'bars'},{type:'sankey',dataId:'flow'}]}).ok,true);
});
for (const [name, config] of [
  ['default first dataset', {}],
  ['explicit index zero', {dataIndex:0}],
  ['id takes precedence over index', {dataId:'flow',dataIndex:1}],
  ['inline data takes precedence', {data:{values:[graph]},dataId:'extra'}],
  ['unresolved id', {dataId:'missing'}],
  ['unresolved index', {dataIndex:9}],
]) test(`only checks selected sankey data: ${name}`,()=>{
  assert.equal(validateSpec({type:'common',data:[{id:'flow',values:[graph]},{id:'extra',values:[{x:'a',y:3}]}],series:[{type:'sankey',...config}]}).ok,true);
});
test('checks explicit nonzero dataset index',()=>assert.equal(validateSpec({type:'common',data:[{values:edges},{values:[graph]}],series:[{type:'sankey',dataIndex:1}]}).ok,true));
test('still rejects malformed default first dataset',()=>assert.deepEqual(codes({type:'common',data:[{values:edges},{values:[graph]}],series:[{type:'sankey'}]}),['SANKEY_GRAPH_REQUIRED']));
test('rejects singular data.value',()=>assert.deepEqual(codes({type:'treemap',data:{value:{children:[]}}}),['DATA_VALUES_REQUIRED']));
test('rejects object instead of tree roots array',()=>assert.deepEqual(codes({type:'treemap',data:{values:{children:[]}}}),['HIERARCHY_ROOT_ARRAY']));
test('permits arbitrary hierarchy field names and non-100 totals',()=>assert.equal(validateSpec({type:'treemap',categoryField:'item',valueField:'revenue',data:{values:[{item:'Group',children:[{item:'A',revenue:7},{item:'B',revenue:16}]}]}}).ok,true));
test('rejects function label formatter but retains tooltip callbacks',()=>{
  assert.deepEqual(codes({type:'treemap',data:{values:[]},label:{formatter:()=>''},nonLeafLabel:{formatMethod:()=>''},tooltip:{mark:{title:{value:()=>''}}}}),['FUNCTION_FORMATTER']);
});
test('evaluates complete source and helper closures',()=>assert.equal(validateSource('const rows = [{x:"P",y:31}]; function make() { return {type:"bar",data:{values:rows}}; } const spec = make();').ok,true));
test('rejects syntax errors',()=>assert.equal(validateSource('const spec = {').errors[0].code,'SOURCE_SYNTAX'));
test('reports deferred runtime globals without claiming spec was checked',()=>{
  const r=validateSource('const spec = window.buildChart();');assert.equal(r.specChecked,false);assert.equal(r.warnings[0].code,'RUNTIME_VALIDATION_DEFERRED');
});
test('limits source evaluation',()=>assert.equal(validateSource('while(true) {}').ok,false));

test('treemap example computes shares from changed data and preserves original records',()=>{
  const fs=require('node:fs'),vm=require('node:vm');
  const source=fs.readFileSync(require.resolve('../../../../skills/vchart-development-assistant/references/examples/treemap/hierarchy-treemap.js'),'utf8');
  const ctx={document:{createElement:()=>({getContext:()=>({measureText:text=>({width:text.length*7})})})}};
  vm.runInNewContext(source,ctx);
  const rows=[{region:'East',sku:'Blueberry',units:11},{region:'East',sku:'Cherry',units:32},{region:'West',sku:'Apple',units:7}];
  const spec=ctx.createTreemapSpec(rows,{hierarchyFields:['region','sku'],valueField:'units',groupField:'region',palette:{East:'#123456',West:'#654321'}});
  const raw=spec.data.values[0].children[0].children[0];
  const node={datum:[{sku:'Total'},{sku:'East'},raw],x0:0,x1:220,y0:0,y1:100};
  assert.equal(spec.label.formatMethod('',node),'Blueberry 22%');
  assert.equal(spec.leaf.style.fill(node),'#123456');
  assert.equal(spec.tooltip.mark.content[1].value(node),'11');
  assert.equal(spec.label.formatMethod('',{...node,x1:20}), '');
  assert.deepEqual(JSON.parse(JSON.stringify(spec.data.values[0].children.flatMap(p=>p.children))),rows);
});

test('treemap example preserves empty input without synthetic leaves',()=>{
  const fs=require('node:fs'),vm=require('node:vm'),ctx={};
  vm.runInNewContext(fs.readFileSync(require.resolve('../../../../skills/vchart-development-assistant/references/examples/treemap/hierarchy-treemap.js'),'utf8'),ctx);
  const spec=ctx.createTreemapSpec([],{hierarchyFields:['category','item'],valueField:'quantity',groupField:'category',palette:{}});
  assert.equal(spec.data.values.length,0);
});

for (const axis of ['x','y']) test(`rejects CSS percentage custom-mark ${axis} regardless of chart and text`,()=>{
  const result=validateSpec({type:'line',data:{values:[]},customMark:[{type:'text',style:{[axis]:' 50% ',text:'No matching measurements'}}]});
  assert.deepEqual(result.errors.map(({code,path})=>({code,path})),[{code:'CUSTOM_MARK_PIXEL_COORDINATE',path:`spec.customMark[0].style.${axis}`}]);
});
test('validates graphic coordinates nested inside custom groups',()=>assert.deepEqual(codes({type:'bar',customMark:[{type:'group',children:[{type:'text',style:{x:'25%'}}]}]}),['CUSTOM_MARK_PIXEL_COORDINATE']));
test('accepts numeric coordinates and layout callbacks without executing them',()=>{
  const callback=()=>{throw Error('needs browser layout')};
  assert.equal(validateSpec({type:'treemap',customMark:[{type:'text',style:{x:callback,y:0,text:'Empty'}},{type:'text',style:{x:12,y:callback}}]}).ok,true);
});
test('leaves percentage layout properties and percentage text untouched',()=>assert.equal(validateSpec({type:'bar',padding:'5%',customMark:[{type:'text',style:{x:20,y:30,text:'50%'}}]}).ok,true));
test('accepts no custom marks after restoring data',()=>assert.equal(validateSpec({type:'bar',data:{values:[{category:'A',count:0}]},customMark:[]}).ok,true));

for (const value of ['(text, datum) => datum.count', '__CALLBACK__', 5, true, {}]) {
  for (const key of ['label', 'nonLeafLabel']) {
    test(`rejects non-function ${key}.formatMethod: ${JSON.stringify(value)}`, () => {
      assert.deepEqual(codes({type:'treemap',[key]:{formatMethod:value}}), ['LABEL_FORMAT_METHOD_FUNCTION']);
    });
  }
}
test('checks series label callbacks', () => {
  assert.deepEqual(validateSpec({type:'common',series:[{type:'bar',label:{formatMethod:'bad'}}]}).errors.map(e=>e.path), ['spec.series[0].label.formatMethod']);
});
test('preserves declarative formatting, tooltip strings and ordinary data fields', () => {
  assert.equal(validateSpec({type:'bar',data:{values:[{formatMethod:'ordinary data'}]},label:{formatter:'{count}',formatMethod:(text,datum)=>datum.count},tooltip:{mark:{title:{value:'Total'}}}}).ok,true);
});
test('source validation rejects serialized callbacks before HTML generation', () => {
  assert.deepEqual(validateSource('const spec = {type:"bar",label:{formatMethod:"(text) => text"}};').errors.map(e=>e.code), ['LABEL_FORMAT_METHOD_FUNCTION']);
});

for (const [name, spec] of [
  ['root graph object', {type:'sankey',data:{values:graph}}],
  ['inline series graph object', {type:'common',series:[{type:'sankey',data:{values:graph}}]}],
  ['referenced graph object', {type:'common',data:[{id:'flow',values:graph}],series:[{type:'sankey',dataId:'flow'}]}],
  ['indexed graph object', {type:'common',data:[{values:[graph]},{values:graph}],series:[{type:'sankey',dataIndex:1}]}],
  ['null values', {type:'sankey',data:{values:null}}]
]) test(`rejects malformed inline Sankey values: ${name}`,()=>assert.deepEqual(codes(spec),['SANKEY_GRAPH_REQUIRED']));
test('reports the field containing the bare graph',()=>assert.equal(validateSpec({type:'sankey',data:{values:graph}}).errors[0].path,'spec.data[0].values'));
for (const [name, data] of [
  ['parsed text', {values:'source,target,value\nA,B,3',parser:{type:'csv'}}],
  ['parsed object', {values:graph,parser:{type:'custom'}}],
  ['transformed rows', {values:edges,transforms:[{type:'customGraph'}]}],
  ['transformed object', {values:graph,transforms:[{type:'customGraph'}]}],
  ['referenced data', {values:graph,fromDataId:'upstream'}]
]) test(`defers Sankey input requiring runtime data processing: ${name}`,()=>assert.equal(validateSpec({type:'sankey',data}).ok,true));
test('does not impose the Sankey graph wrapper on another chart',()=>assert.equal(validateSpec({type:'custom',data:{values:graph}}).ok,true));
test('source validator catches a bare graph before generation',()=>assert.deepEqual(validateSource('const spec = {type:"sankey", data:{values:{nodes:[],links:[]}}};').errors.map(e=>e.code),['SANKEY_GRAPH_REQUIRED']));

test('does not confuse root datasets with named graph records',()=>assert.deepEqual(codes({type:'sankey',data:[{id:'nodes',values:graph.nodes},{id:'links',values:edges}]}),['SANKEY_GRAPH_REQUIRED','SANKEY_GRAPH_REQUIRED']));
test('rejects malformed named graph record values',()=>assert.deepEqual(codes({type:'sankey',data:{values:[{id:'nodes',values:{}},{id:'links',values:edges}]}}),['SANKEY_GRAPH_REQUIRED']));

for (const data of [[], [{label:'A'}], 'items', {}]) {
  test(`rejects non-function discrete legend data: ${JSON.stringify(data)}`,()=>assert.deepEqual(codes({type:'bar',legends:{data}}),['DISCRETE_LEGEND_DATA_FUNCTION']));
}
test('checks explicit discrete legends in an array with a field path',()=>assert.deepEqual(validateSpec({legends:[{type:'color',data:[]},{type:'discrete',data:[]}]}).errors.map(({code,path})=>({code,path})),[{code:'DISCRETE_LEGEND_DATA_FUNCTION',path:'spec.legends[1].data'}]));
test('accepts legend data callbacks without evaluating runtime dependencies',()=>assert.equal(validateSpec({legends:{data:()=>{throw Error('requires runtime legend items')}}}).ok,true));
for (const legends of [undefined, {}, {data:null}, {type:'color',data:[]}, {type:'size',data:[]}]) {
  test(`leaves omitted and continuous legend data alone: ${JSON.stringify(legends)}`,()=>assert.equal(validateSpec({legends}).ok,true));
}
test('source validation rejects discrete legend arrays',()=>assert.deepEqual(validateSource('const spec={type:"bar",legends:{data:[]}};').errors.map(e=>e.code),['DISCRETE_LEGEND_DATA_FUNCTION']));


test('treemap helper omits legends even when explicit group colors are supplied',()=>{
  const fs=require('node:fs'),vm=require('node:vm'),ctx={};
  vm.runInNewContext(fs.readFileSync(require.resolve('../../../../skills/vchart-development-assistant/references/examples/treemap/hierarchy-treemap.js'),'utf8'),ctx);
  const spec=ctx.createTreemapSpec([{department:'Ops',name:'Service',amount:9}],{hierarchyFields:['department','name'],valueField:'amount',groupField:'department',palette:{Ops:'#123456'}});
  assert.equal(Object.hasOwn(spec, 'legends'),false);
});
