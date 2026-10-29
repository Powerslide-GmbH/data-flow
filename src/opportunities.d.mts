import type {MapData} from './types';
export type Opportunity={id:string;title:string;from:string;to:string;kind:string;reason:string;direction:string;cautions:string[];score:number;concept:string};
export function normalize(value:string):string;
export function findOpportunities(data:MapData):Opportunity[];
