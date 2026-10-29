export type Field = {id:string; system:string; group:string; key:string; label:string; level:string; type?:string; multilingual?:boolean; evidence:string; context?:string};
export type System = {id:string; name:string; short:string; role:string; color:string; description:string; x:number; y:number; channels?:{name:string;status:string}[]};
export type Flow = {ownershipConflict?:string;id:string; source:string; target:string; name:string; groups:string[]; mode:string; schedule:string; platform:string; evidence:string; activation:string; rules:string[]; sourceRef:string; mappings:{from:string[]; to:string[]; rule:string}[]};
export type MapData = {ownership:Record<string,{system:string;evidence:string;note:string}>;creation:Creation;reviewed:string; systems:System[]; groups:{id:string; name:string}[]; fields:Field[]; flows:Flow[]};
export type Creation = {evidence:string;note:string;stages:{title:string;systems:string[];description:string}[]};
