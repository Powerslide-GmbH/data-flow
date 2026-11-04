import {Children,cloneElement,createContext,isValidElement,useContext,useEffect,useState,type ReactNode,type ReactElement} from 'react';
import {translate,type Language} from './translations.mjs';
const LanguageContext=createContext<{language:Language;setLanguage:(value:Language)=>void}>({language:'en',setLanguage:()=>{}});
export function I18nProvider({children}:{children:ReactNode}){
 const [language,setLanguage]=useState<Language>(()=>{try{const value=localStorage.getItem('data-flow-language');return value==='de'||value==='es'?value:'en';}catch{return 'en';}});
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem('data-flow-language',language);}catch{}},[language]);
 return <LanguageContext.Provider value={{language,setLanguage}}>{children}</LanguageContext.Provider>;
}
export function LanguagePicker(){const {language,setLanguage}=useContext(LanguageContext);return <select className="language-picker" aria-label={translate('Language',language)} value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="en">English</option><option value="de">Deutsch</option><option value="es">Español</option></select>;}
// Translate rendered copy only. IDs, URLs, form values, technical keys and stored drafts stay intact.
export function Localized({children}:{children:ReactNode}){
 const {language}=useContext(LanguageContext);
 const visit=(node:ReactNode):ReactNode=>{
  if(typeof node==='string')return translate(node,language);
  if(!isValidElement(node))return node;
  const element=node as ReactElement<Record<string,unknown>>;
  if(element.type==='code'||element.props['data-no-translate'])return element;
  const props:Record<string,unknown>={};
  for(const key of ['aria-label','placeholder','title'])if(typeof element.props[key]==='string')props[key]=translate(element.props[key] as string,language);
  if(element.type==='option'&&element.props.value===undefined&&typeof element.props.children==='string')props.value=element.props.children;
  if(element.props.children!==undefined)props.children=Children.map(element.props.children as ReactNode,visit);
  return cloneElement(element,props);
 };
 return <>{Children.map(children,visit)}</>;
}
