// Interpolate node geometry so React Flow can keep edges attached during layout changes.
export function tweenNodes(previous,target,progress){
 const old=new Map(previous.map(n=>[n.id,n])),ids=new Set(target.map(n=>n.id));
 const mix=(a,b)=>a+(b-a)*progress;
 const next=target.map(n=>{
  const from=old.get(n.id);
  if(!from)return {...n,style:{...n.style,opacity:progress}};
  const width=mix(from.width||from.measured?.width||n.width,n.width),height=mix(from.height||from.measured?.height||n.height,n.height);
  return {...n,position:{x:mix(from.position.x,n.position.x),y:mix(from.position.y,n.position.y)},width,height,style:{...n.style,width,height}};
 });
 if(progress<1)for(const n of previous)if(!ids.has(n.id)&&n.parentId)next.push({...n,style:{...n.style,opacity:1-progress},selectable:false,draggable:false});
 return next;
}
