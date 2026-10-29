export const initialPositions={dev:[0,125],master:[390,0],weclapp:[390,290],sl:[790,145],b2b:[1190,0],b2c:[1190,300]};
export function systemNodes(data,expanded,saved={}){
  const parents=[],children=[];
  const valid=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
  for(const s of data.systems){
    const fields=data.fields.filter(f=>f.system===s.id);
    const groups=data.groups.filter(g=>fields.some(f=>f.group===g.id));
    const open=expanded.includes(s.id),columns=Math.min(3,groups.length)||1;
    const width=open?columns*280+40:260,height=open?Math.ceil(groups.length/columns)*130+150:116;
    parents.push({id:s.id,type:'bubble',position:valid(saved[s.id])?saved[s.id]:{x:initialPositions[s.id]?.[0]??s.x,y:initialPositions[s.id]?.[1]??s.y},width,height,style:{width,height},data:{kind:open?'container':'hub',system:s,count:fields.length,routes:data.flows.filter(f=>f.source===s.id||f.target===s.id).length}});
    if(open)groups.forEach((g,i)=>{
      const id=s.id+'~'+g.id,base={x:35+(i%columns)*280,y:135+Math.floor(i/columns)*130};
      const p=valid(saved[id])?saved[id]:base;
      children.push({id,type:'bubble',parentId:s.id,extent:[[25,125],[width-25,height-25]],position:{x:Math.max(25,Math.min(width-270,p.x)),y:Math.max(125,Math.min(height-115,p.y))},width:245,height:90,zIndex:2,data:{kind:'family',system:s,group:g.id,label:g.name,count:fields.filter(f=>f.group===g.id).length}});
    });
  }
  return [...parents,...children];
}
export function connectionSides(a,b){
  const dx=b.position.x+(b.width||260)/2-a.position.x-(a.width||260)/2;
  const dy=b.position.y+(b.height||116)/2-a.position.y-(a.height||116)/2;
  return Math.abs(dx)>Math.abs(dy)?(dx>0?['right','left']:['left','right']):(dy>0?['bottom','top']:['top','bottom']);
}
