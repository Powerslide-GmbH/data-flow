import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../data/map.json',import.meta.url),'utf8'));
function check(ok,message){if(!ok)throw new Error(message);}
for(const collection of ['systems','groups','fields','flows'])check(new Set(data[collection].map(x=>x.id)).size===data[collection].length,'Duplicate IDs in '+collection);
const fields=new Set(data.fields.map(f=>f.id)),systems=new Set(data.systems.map(s=>s.id)),groups=new Set(data.groups.map(g=>g.id));
for(const f of data.fields){check(systems.has(f.system),'Invalid field system '+f.id);check(groups.has(f.group),'Invalid field group '+f.id);check(f.evidence,'Missing field evidence '+f.id);}
for(const f of data.flows){check(systems.has(f.source)&&systems.has(f.target),'Invalid flow endpoint '+f.id);check(f.sourceRef&&f.evidence&&f.schedule,'Missing flow evidence/schedule '+f.id);check(f.groups.every(g=>groups.has(g)),'Invalid flow family '+f.id);for(const m of f.mappings){check(m.from.length&&m.to.length&&m.rule,'Incomplete mapping '+f.id);for(const id of [...m.from,...m.to])check(fields.has(id),'Unresolved field '+id);for(const id of m.from)check(data.fields.find(v=>v.id===id).system===f.source,'Source mismatch '+id);for(const id of m.to)check(data.fields.find(v=>v.id===id).system===f.target,'Target mismatch '+id);}}
console.log(`Validated ${data.systems.length} systems, ${data.fields.length} fields, ${data.flows.length} routes.`);
