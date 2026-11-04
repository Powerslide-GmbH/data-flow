export function arrangeSystems(nodes,data){
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const ranks=new Map();
  for(const [rank,stage] of (data.creation?.stages||[]).entries())for(const id of stage.systems)if(byId.has(id))ranks.set(id,rank);
  const neighbours=new Map(nodes.map(n=>[n.id,new Set()]));
  for(const f of data.flows)if(byId.has(f.source)&&byId.has(f.target)&&f.source!==f.target){neighbours.get(f.source).add(f.target);neighbours.get(f.target).add(f.source);}
  // The documented creation stages anchor direction despite return routes and cycles.
  const lastRank=Math.max(0,...ranks.values());
  for(const n of nodes)if(!ranks.has(n.id)){
    const linked=[...neighbours.get(n.id)];
    const known=linked.filter(id=>ranks.has(id)).map(id=>ranks.get(id));
    ranks.set(n.id,linked.length===1?lastRank:known.length?Math.round(known.reduce((a,b)=>a+b,0)/known.length):lastRank+1);
  }
  const layers=new Map();
  for(const n of nodes){const rank=ranks.get(n.id);if(!layers.has(rank))layers.set(rank,[]);layers.get(rank).push(n);}
  const ordered=[...layers.keys()].sort((a,b)=>a-b).map(rank=>layers.get(rank).sort((a,b)=>a.id.localeCompare(b.id)));
  // Barycentre sweeps keep connected systems near each other within each stage.
  const centres=new Map();
  const measure=()=>{for(const layer of ordered)layer.forEach((n,i)=>centres.set(n.id,(i+.5)/layer.length));};
  for(let pass=0;pass<6;pass++){
    measure();
    for(const layer of pass%2?[...ordered].reverse():ordered){
      const score=n=>{const ys=[...neighbours.get(n.id)].map(id=>centres.get(id));return ys.length?ys.reduce((a,b)=>a+b,0)/ys.length:centres.get(n.id);};
      layer.sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));
    }
  }
  const heights=ordered.map(layer=>layer.reduce((h,n)=>h+n.height,0)+Math.max(0,layer.length-1)*80);
  const totalHeight=Math.max(0,...heights);let x=0;
  for(const [i,layer] of ordered.entries()){
    let y=(totalHeight-heights[i])/2;
    for(const n of layer){n.position={x,y};y+=n.height+80;}
    x+=Math.max(...layer.map(n=>n.width))+140;
  }
  return nodes;
}
