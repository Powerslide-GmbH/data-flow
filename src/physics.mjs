// Soft rectangle collision. Dragged capsules are anchors; neighbours move aside.
export function separate(items, anchored=null, passes=1){
  const out=items.map(n=>({...n,position:{...n.position}}));
  for(let pass=0;pass<passes;pass++)for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){
    const a=out[i],b=out[j],aw=a.measured?.width||a.width||250,ah=a.measured?.height||a.height||120,bw=b.measured?.width||b.width||250,bh=b.measured?.height||b.height||120;
    const dx=(b.position.x+bw/2)-(a.position.x+aw/2),dy=(b.position.y+bh/2)-(a.position.y+ah/2);
    const overlapX=(aw+bw)/2+35-Math.abs(dx),overlapY=(ah+bh)/2+35-Math.abs(dy);
    if(overlapX<=0||overlapY<=0)continue;
    const horizontal=overlapX<overlapY,amount=(horizontal?overlapX:overlapY)*.55;
    const sign=(horizontal?dx:dy)>=0?1:-1,key=horizontal?'x':'y';
    if(a.id===anchored)b.position[key]+=sign*amount;
    else if(b.id===anchored)a.position[key]-=sign*amount;
    else {a.position[key]-=sign*amount/2;b.position[key]+=sign*amount/2;}
  }return out;
}
