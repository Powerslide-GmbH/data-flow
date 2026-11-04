import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {translate} from '../src/translations.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../data/map.json',import.meta.url),'utf8'));
const catalog=JSON.parse(fs.readFileSync(new URL('../src/locales.json',import.meta.url),'utf8'));
test('translations preserve whitespace, numbers and unknown source identifiers',()=>{
 assert.equal(translate('  Fields without a catalog entry  ','es'),'  Fields without a catalog entry  ');
 assert.equal(translate(' routes ','es'),' rutas ');
 assert.equal(translate('23 routes','de'),'23 Verbindungen');
 assert.equal(translate('23 routes · 8 systems','es'),'23 rutas · 8 sistemas');
 assert.equal(translate('Price source: Master price list','de'),'Preisquelle: Master price list');
 assert.equal(translate('  Map  ','en'),'  Map  ');
 assert.equal(translate('Both fields have the same normalized label: “EURWSP”.','es'),'Ambos campos tienen la misma etiqueta normalizada: «EURWSP».');
});
test('documented system, stage and flow descriptions have German and Spanish translations',()=>{
 const strings=[...data.systems.flatMap(s=>[s.role,s.description,...(s.channels||[]).map(c=>c.status)]),...data.groups.map(g=>g.name),data.creation.note,...data.creation.stages.flatMap(s=>[s.title,s.description]),data.ownership.prices.note,...data.flows.flatMap(f=>[f.name,f.schedule,f.activation,...f.rules,...f.mappings.map(m=>m.rule)])];
 for(const value of strings)for(const lang of ['de','es'])assert.ok(catalog[value]?.[lang]?.trim(),'Missing '+lang+': '+value);
});
test('every system has HTTPS quick links and each storefront has its own admin',()=>{
 const admins=new Set();
 for(const system of data.systems){assert.ok(system.links?.length,system.id);for(const link of system.links){assert.ok(link.label);assert.equal(new URL(link.url).protocol,'https:');assert.equal(new URL(link.url).username,'');assert.equal(new URL(link.url).password,'');}}
 for(const id of ['b2b','b2c','disroyal','venerate']){const links=data.systems.find(s=>s.id===id).links;assert.ok(links.some(l=>l.label==='Storefront'));const admin=links.find(l=>l.label==='Shopify admin');assert.equal(new URL(admin.url).hostname,'admin.shopify.com');admins.add(admin.url);}
 assert.equal(admins.size,4);assert.equal(data.systems.find(s=>s.id==='master').links.length,2);
});
