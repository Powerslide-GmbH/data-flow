// Traverse field mappings, never infer a connection from a shared label.
export function traceField(flows, fieldId) {
  const links=new Set();
  function traverse(upstream){const visited=new Set([fieldId]);let changed=true;
    while(changed){changed=false;for(const f of flows)for(const m of f.mappings){
      const starts=upstream?m.to:m.from,ends=upstream?m.from:m.to;
      if(starts.some(id=>visited.has(id))){links.add(f.id);for(const id of ends)if(!visited.has(id)){visited.add(id);changed=true;}}
    }}return [...visited];}
  const upstream=traverse(true),downstream=traverse(false);const fields=[...new Set([...upstream,...downstream])];
  const origins=upstream.filter(id=>!flows.some(f=>f.mappings.some(m=>m.to.includes(id))));
  return {fields,flows:[...links],upstream,downstream,origins};
}
