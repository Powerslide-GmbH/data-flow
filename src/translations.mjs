import catalog from './locales.json' with {type:'json'};
export function translate(text,language){
 if(language==='en'||!text)return text;
 const trimmed=text.trim();const entry=catalog[trimmed]?.[language];
 if(entry)return text.replace(trimmed,entry);
 // Dynamic copy keeps its source identifiers and numbers while translating the surrounding labels.
 const patterns=[
  [/^Both fields have the same normalized label: “(.+)”\.$/,language==='de'?'Beide Felder haben dieselbe normalisierte Bezeichnung: „$1“.':'Ambos campos tienen la misma etiqueta normalizada: «$1».'],
  [/^Possible alias: “(.+)” \/ “(.+)”\.$/,language==='de'?'Mögliches Alias: „$1“ / „$2“.':'Posible alias: «$1» / «$2».'],
  [/^Different entity levels: (.+) \/ (.+)\. Confirm variant vs\. model aggregation\.$/,language==='de'?'Unterschiedliche Ebenen: $1 / $2. Aggregation von Varianten und Modellen prüfen.':'Niveles de entidad distintos: $1 / $2. Confirma la agrupación de variantes y modelos.'],
  [/^Price source: (.+)$/,language==='de'?'Preisquelle: $1':'Origen de precios: $1'],
  [/^From (.+)$/,language==='de'?'Aus $1':'De $1'],
  [/^Originates upstream in (.+)\.$/,language==='de'?'Stammt aus $1.':'Procede de $1.'],
  [/^Expand (.+)$/,language==='de'?'$1 aufklappen':'Expandir $1'],
  [/^Collapse (.+)$/,language==='de'?'$1 zuklappen':'Contraer $1'],
  [/^Explore (.+) in (.+)$/,language==='de'?'$1 in $2 erkunden':'Explorar $1 en $2'],
  [/^Open (.+)$/,language==='de'?'$1 öffnen':'Abrir $1'],
  [/^Find (source|destination) field$/,language==='de'?'Quell- oder Zielfeld suchen':'Buscar campo de origen o destino'],
  [/^(Source|Destination) (system|field)$/,language==='de'?'Quell-/Zielsystem oder Feld':'Sistema o campo de origen/destino'],
 ];
 for(const [pattern,replacement] of patterns)if(pattern.test(trimmed))return text.replace(trimmed,trimmed.replace(pattern,replacement));
 // JSX often emits separate number and label nodes; middle-dot summaries use the same catalog.
 const parts=text.split(/(\s*·\s*)/);if(parts.length>1)return parts.map(part=>part.includes('·')?part:translate(part,language)).join('');
 const count=trimmed.match(/^(\d[\d,.]*\s+)(.+)$/);if(count&&catalog[count[2]]?.[language])return text.replace(trimmed,count[1]+catalog[count[2]][language]);
 for(const prefix of ['Reviewed','Documentation snapshot','PROPOSED SOURCE','PROPOSED DESTINATION'])if(trimmed.startsWith(prefix+' '))return text.replace(prefix,catalog[prefix]?.[language]||prefix);
 return text;
}
