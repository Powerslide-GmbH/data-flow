import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(new URL('../data/'+f,import.meta.url),'utf8'));
const d=read('map.json'),audit=read('saleslayer-channels.json');
test('store operations preserve product and order imports and one-way ERP stock',()=>{
 for(const store of ['b2b','b2c','disroyal','venerate']){
  assert.ok(d.flows.some(f=>f.source===store&&f.target==='weclapp'&&f.name==='Order import'));
  assert.ok(d.flows.some(f=>f.source==='weclapp'&&f.target===store&&f.name==='Stock synchronization'));
  assert.ok(!d.flows.some(f=>f.id===store+'-currency'));
  assert.ok(d.flows.find(f=>f.id===store+'-orders').rules.some(r=>r.includes('Currency correction')));
 }
 for(const store of ['b2c','disroyal','venerate'])assert.ok(d.flows.some(f=>f.source===store&&f.target==='weclapp'&&f.name==='Product import'));
 assert.ok(!d.flows.some(f=>f.source==='sl'&&f.target==='venerate'));
});
test('channel inventory separates unbound outputs and formulas from verified direct field traces',()=>{
 assert.deepEqual(audit.channels.map(c=>c.system).sort(),['b2b','b2c','disroyal']);
 for(const channel of audit.channels){
  const flow=d.flows.find(f=>f.id==='sl-'+channel.system);assert.ok(flow);assert.equal(channel.parameters.overwriteStock,false);
  assert.deepEqual(Object.keys(channel.tables).sort(),['categories','products','variants']);
  for(const [table,fields] of Object.entries(channel.tables))for(const f of fields){
   assert.ok(f.target&&f.targetKey);assert.equal(f.configured,!!f.hasFormula||!!f.sourceKey&&f.sourceKey!=='_void_');
   const id=channel.system+':output:'+table+':'+f.targetKey;
   if(f.hasFormula||!f.configured)assert.ok(!flow.mappings.some(m=>m.to.includes(id)));
   if(!f.configured)assert.ok(!d.fields.some(x=>x.id===id));
  }
 }
});
