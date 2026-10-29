// Metadata-based suggestions only. Never adds these pairs to the documented graph.
export const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases = new Map([
  ['model name','product name'], ['article number','article number'],
  ['country of origin','coo'], ['country of origin code','coo'],
  ['customs tariff number','hs code'], ['main segment','segment 1'],
]);
const concept = f => aliases.get(normalize(f.label)) || normalize(f.label);
const pairKey = (a,b) => [a,b].sort().join('|');
export function findOpportunities(data) {
  const ranked = ['dev','master','weclapp','sl','b2b','b2c'];
  const candidates = [];
  const eligible = data.fields.filter(f => !['order','projection','connector'].includes(f.level));
  const buckets = new Map();
  for (const f of eligible) { const k=concept(f); if(k.length<3)continue; const bucket=buckets.get(k)||[];bucket.push(f);buckets.set(k,bucket); }
  const direct=new Map();
  for(const flow of data.flows)for(const m of flow.mappings)for(const a of m.from)for(const b of m.to){const k=pairKey(a,b);const routes=direct.get(k)||[];routes.push(flow);direct.set(k,routes);}
  for(const [name,fields] of buckets)for(let i=0;i<fields.length;i++)for(let j=i+1;j<fields.length;j++){
    let a=fields[i],b=fields[j];if(a.system===b.system)continue;
    const known=direct.get(pairKey(a.id,b.id))||[];
    // Implemented mappings are already covered; manual mappings remain automation candidates.
    if(known.some(f=>f.mode!=='Manual'))continue;
    const price=a.group==='prices'||b.group==='prices';
    if(price&&a.system!=='master'&&b.system!=='master')continue;
    const manual=known.length>0;
    if(ranked.indexOf(a.system)>ranked.indexOf(b.system))[a,b]=[b,a];
    if(manual&&!known.some(f=>f.source===a.system))[a,b]=[b,a];
    if(price&&a.system!=='master')[a,b]=[b,a];
    const exact=normalize(a.label)===normalize(b.label);
    const familyRoute=data.flows.some(f=>((f.source===a.system&&f.target===b.system)||(f.source===b.system&&f.target===a.system))&&f.mappings.length===0&&f.groups.includes(a.group));
    const levelMatch=a.level===b.level||['model','product'].includes(a.level)&&['model','product'].includes(b.level);
    const duplicate=fields.some(f=>f.id!==a.id&&f.system===a.system)||fields.some(f=>f.id!==b.id&&f.system===b.system);
    const cautions=['Confirm the source of truth and whether both fields are currently entered manually.','Check record matching, blank values, overwrite policy and update frequency.'];
    if(manual&&known.some(f=>f.source===a.system)&&known.some(f=>f.source===b.system))cautions.unshift('The current manual transfer works in both directions. Choose one owner per field before automating to avoid loops.');
    if(data.flows.some(f=>f.mappings.some(m=>m.to.includes(b.id)&&m.from.some(id=>id!==a.id))))cautions.unshift('The proposed destination already receives a documented mapping. Check for competing writers and overwrites.');
    if(!levelMatch)cautions.unshift(`Different entity levels: ${a.level} / ${b.level}. Confirm variant vs. model aggregation.`);
    if(duplicate)cautions.unshift('Several fields share this concept. Confirm the exact column, period or variant before choosing a mapping.');
    if(a.group==='prices'||b.group==='prices')cautions.unshift('Confirm currency, tax basis, customer group and price period.');
    if(familyRoute)cautions.unshift('A family-level connector is already reported. This field may already be transferred; inspect its mapping first.');
    candidates.push({id:'candidate:'+pairKey(a.id,b.id),title:manual?'Automate the manual transfer':familyRoute?'Check the connector mapping':'Review repeated information',from:a.id,to:b.id,kind:manual?'Manual transfer':familyRoute?'Mapping review':'Repeated field',reason:manual?'These exact fields already have a documented manual transfer.':exact?`Both fields have the same normalized label: “${a.label}”.`:`Possible alias: “${a.label}” / “${b.label}”.`,direction:price?'Confirmed ownership: Master price list is the source of all pricing information.':manual?'Direction follows a documented manual route; confirm ownership before automating.':'Suggested direction follows the product creation sequence; it is not a verified source of truth.',cautions,score:(manual?100:exact?70:50)+(a.system==='master'||b.system==='master'?20:0)-(levelMatch?0:10)-(duplicate?10:0),concept:name});
  }
  return candidates.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
