import test from 'node:test';
import assert from 'node:assert/strict';
import {tweenNodes} from '../src/tween.mjs';
test('capsule transitions interpolate positions and sizes without changing target parents',()=>{
 const before=[{id:'a',position:{x:0,y:20},width:260,height:136}];
 const target=[{id:'a',position:{x:100,y:60},width:900,height:670},{id:'child',parentId:'a',position:{x:35,y:155},width:245,height:90}];
 const halfway=tweenNodes(before,target,.5);assert.deepEqual(halfway[0].position,{x:50,y:40});assert.equal(halfway[0].width,580);assert.equal(halfway[1].parentId,'a');assert.equal(halfway[1].style.opacity,.5);assert.deepEqual(before[0].position,{x:0,y:20});
 const finished=tweenNodes(before,target,1);assert.deepEqual(finished[0].position,target[0].position);assert.equal(finished[0].height,670);
});
test('collapse keeps children for the fade and removes them only at completion',()=>{
 const before=[{id:'a',position:{x:0,y:0},width:900,height:670},{id:'child',parentId:'a',position:{x:35,y:155},width:245,height:90}];
 const target=[{id:'a',position:{x:0,y:0},width:260,height:136}];
 assert.equal(tweenNodes(before,target,.5).find(n=>n.id==='child').style.opacity,.5);
 assert.ok(!tweenNodes(before,target,1).some(n=>n.id==='child'));
});
