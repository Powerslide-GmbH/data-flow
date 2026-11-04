import {ArrowUpRight} from 'lucide-react';
import type {System} from './types';
import {Localized} from './i18n';
export function SystemLinks({system}:{system:System}){
 if(!system.links?.length)return null;
 return <Localized><nav className="system-links" aria-label={'Open '+system.name} onClick={e=>e.stopPropagation()}>{system.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}><span>{link.label}</span><ArrowUpRight size={14}/></a>)}</nav></Localized>;
}
