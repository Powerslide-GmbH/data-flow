import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {findOpportunities} from '../src/opportunities.mjs';
import {systemNodes,connectionSides} from '../src/layout.mjs';
import {separate} from '../src/physics.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../data/map.json',import.meta.url),'utf8'));
const f=(id,system,label,level='model')=>({id,system,label,level,group:'identity'});
const flow=(source,target,from,to,mode)=>({source,target,mode,groups:['identity'],mappings:[{from:[from],to:[to]}]});

test('automatic mappings are excluded; manual candidates follow the creation direction',()=>{
 const fields=[f('m','master','Brand'),f('d','dev','Brand'),f('s','sl','Brand')];
 const flows=[flow('master','dev','m','d','Manual'),flow('dev','master','d','m','Manual'),flow('master','sl','m','s','Automatic')];
 const result=findOpportunities({fields,flows});
 assert.ok(!result.some(c=>[c.from,c.to].includes('m')&&[c.from,c.to].includes('s')));
 const candidate=result.find(c=>c.kind==='Manual transfer');
 assert.equal(candidate.from,'d');assert.equal(candidate.to,'m');assert.ok(candidate.cautions.some(c=>c.includes('both directions')));
});
test('generic repeated names do not imply identical values or new missing integrations',()=>{
 const fields=[f('a','master','Article Number'),f('b','weclapp','Article number','article'),f('c','sl','Article number','product')];
 const result=findOpportunities({fields,flows:[{source:'master',target:'sl',groups:['identity'],mappings:[]}]});
 assert.equal(result.find(c=>c.from==='a'&&c.to==='c').kind,'Mapping review');
 assert.ok(result.find(c=>c.from==='a'&&c.to==='b').cautions.some(c=>c.includes('Different entity levels')));
 assert.equal(findOpportunities({fields:[f('x','master','Net weight'),f('y','sl','VPE Net weight')],flows:[]}).length,0);
});
test('consolidation preserves every mapping endpoint and exposes six systems',()=>{
 assert.equal(data.systems.length,6);assert.ok(!data.systems.some(s=>s.id==='admin'));
 const fields=new Map(data.fields.map(f=>[f.id,f]));
 for(const flow of data.flows){assert.notEqual(flow.source,flow.target);for(const m of flow.mappings){for(const id of m.from)assert.equal(fields.get(id).system,flow.source);for(const id of m.to)assert.equal(fields.get(id).system,flow.target);}}
 assert.deepEqual(data.creation.stages.map(s=>s.systems),[['dev'],['master','weclapp'],['sl'],['b2b','b2c']]);
});
test('candidate discovery leaves documented transfers untouched',()=>{
 const before=JSON.stringify(data);const candidates=findOpportunities(data);const ids=new Set(data.fields.map(f=>f.id));
 assert.ok(candidates.length>0);assert.equal(new Set(candidates.map(c=>c.id)).size,candidates.length);
 for(const c of candidates){assert.ok(ids.has(c.from)&&ids.has(c.to));assert.ok(c.direction&&c.reason&&c.cautions.length);}
 assert.equal(JSON.stringify(data),before);
});
test('expanded systems own bounded child capsules and precede their children',()=>{
 const nodes=systemNodes(data,['sl','master']);const processed=new Set();
 for(const n of nodes){if(n.parentId){assert.ok(processed.has(n.parentId));const p=nodes.find(p=>p.id===n.parentId);assert.ok(n.position.x>=25&&n.position.y>=125);assert.ok(n.position.x+n.width<=p.width-25);assert.ok(n.position.y+n.height<=p.height-25);}processed.add(n.id);}
 assert.equal(nodes.find(n=>n.id==='sl').data.kind,'container');
 assert.ok(!nodes.some(n=>n.id==='admin'));
});
test('group collision moves systems apart without ejecting their children',()=>{
 const nodes=systemNodes(data,['sl']);const parent=nodes.find(n=>n.id==='sl');
 const child=nodes.find(n=>n.parentId==='sl');const relative={...child.position};
 const result=separate(nodes,null,90);assert.deepEqual(result.find(n=>n.id===child.id).position,relative);
 assert.ok(result.find(n=>n.id===parent.id).position);
 const roots=result.filter(n=>!n.parentId);for(let i=0;i<roots.length;i++)for(let j=i+1;j<roots.length;j++){const a=roots[i],b=roots[j];assert.ok(a.position.x+a.width<=b.position.x||b.position.x+b.width<=a.position.x||a.position.y+a.height<=b.position.y||b.position.y+b.height<=a.position.y);}
});
test('ports face the destination, including large expanded parents and reverse routes',()=>{
 const left={position:{x:0,y:0},width:800,height:500},right={position:{x:1000,y:0},width:260,height:116};
 assert.deepEqual(connectionSides(left,right),['right','left']);assert.deepEqual(connectionSides(right,left),['left','right']);
 assert.deepEqual(connectionSides(left,{position:{x:0,y:900},width:800,height:500}),['bottom','top']);
});
test('all price proposals originate in Master, including bidirectional manual transfers',()=>{
 const fields=[{...f('m','master','Quote'),group:'prices'},{...f('d','dev','Quote'),group:'prices'},{...f('s','sl','Quote'),group:'prices'}];
 const candidates=findOpportunities({fields,flows:[flow('dev','master','d','m','Manual'),flow('master','dev','m','d','Manual')]});
 assert.ok(candidates.length>0);for(const candidate of candidates)assert.equal(candidate.from,'m');
 assert.equal(data.ownership.prices.system,'master');assert.ok(data.flows.find(f=>f.id==='dev-master').ownershipConflict);
});
