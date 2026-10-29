import type {Node} from '@xyflow/react';
import type {MapData} from './types';
export const initialPositions:Record<string,[number,number]>;
export function systemNodes(data:MapData,expanded:string[],saved?:Record<string,{x:number;y:number}>):Node[];
export function connectionSides(a:Node,b:Node):string[];
