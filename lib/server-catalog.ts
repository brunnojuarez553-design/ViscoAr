import type {SupabaseClient} from '@supabase/supabase-js';
import {seed,type Vehicle} from './catalog';
export async function catalogFor(db:SupabaseClient,owner:string):Promise<Vehicle[]>{
 const {data,error}=await db.from('viscoar_records').select('id,data').eq('owner',owner).eq('kind','vehicle');if(error)throw error;
 const map=new Map(seed.map(v=>[v.id,v]));for(const r of data||[]){if(r.data.deleted)map.delete(r.id);else map.set(r.id,r.data as Vehicle);}return [...map.values()].sort((a,b)=>a.brand.localeCompare(b.brand));
}
export async function putRecord(db:SupabaseClient,owner:string,id:string,kind:string,data:unknown){const {error}=await db.from('viscoar_records').upsert({owner,id,kind,data},{onConflict:'owner,id,kind'});if(error)throw error;}
