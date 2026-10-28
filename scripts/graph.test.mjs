import test from 'node:test';
import assert from 'node:assert/strict';
import {traceField} from '../src/graph.mjs';
import {separate} from '../src/physics.mjs';
const branch=[{id:'a',mappings:[{from:['x'],to:['y','z']}]},{id:'b',mappings:[{from:['z'],to:['w']}]}];
test('upstream tracing does not add a sibling destination',()=>{
  const r=traceField(branch,'y');
  assert.deepEqual(new Set(r.fields),new Set(['x','y']));
  assert.deepEqual(r.downstream,['y']);assert.deepEqual(r.origins,['x']);
});
test('source tracing includes downstream branches',()=>{
  const r=traceField(branch,'x');
  assert.deepEqual(new Set(r.fields),new Set(['x','y','z','w']));
  assert.deepEqual(r.upstream,['x']);assert.equal(r.flows.length,2);
});
test('cycles terminate without inventing a single source',()=>{
  const r=traceField([...branch,{id:'c',mappings:[{from:['y'],to:['x']}]}],'x');
  assert.equal(r.fields.length,4);assert.deepEqual(r.origins,[]);
});
test('approximate routes do not invent field mappings',()=>{
  const r=traceField([{id:'approx',mappings:[]}],'unmapped');
  assert.deepEqual(r.fields,['unmapped']);assert.deepEqual(r.flows,[]);
});
const overlaps=(a,b)=>Math.abs(a.position.x-b.position.x)<100&&Math.abs(a.position.y-b.position.y)<80;
test('capsules separate without mutating the input',()=>{
  const input=Array.from({length:7},(_,i)=>({id:String(i),position:{x:0,y:0},width:100,height:80}));
  const result=separate(input,null,150);
  for(let i=0;i<result.length;i++)for(let j=i+1;j<result.length;j++)assert.equal(overlaps(result[i],result[j]),false);
  assert.deepEqual(input[0].position,{x:0,y:0});
});
test('dragged capsule stays under the pointer while neighbours separate',()=>{
  const result=separate([{id:'a',position:{x:0,y:0},width:100,height:80},{id:'b',position:{x:5,y:5},width:100,height:80}],'a',40);
  assert.deepEqual(result[0].position,{x:0,y:0});assert.equal(overlaps(...result),false);
});
