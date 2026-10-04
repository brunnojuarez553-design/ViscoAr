import {createClient,isConfigured} from './supabase/server';
export class AccessError extends Error{constructor(message:string,public status:number){super(message);}}
export async function access(){
 if(!isConfigured())throw new AccessError('Configurá Supabase antes de usar la plataforma.',503);
 const db=await createClient();const {data:{user},error}=await db.auth.getUser();
 if(error||!user)throw new AccessError('Iniciá sesión para acceder.',401);
 const {data:license,error:licenseError}=await db.from('viscoar_licenses').select('active').eq('user_id',user.id).maybeSingle();
 if(licenseError)throw new AccessError('No se pudo comprobar la licencia. Revisá la configuración de la base.',503);
 if(!license?.active)throw new AccessError('Tu cuenta todavía no tiene una licencia activa.',403);
 return {db,user};
}
export function apiError(e:unknown){return Response.json({error:e instanceof AccessError?e.message:'No se pudo completar la operación. Revisá la conexión y la configuración de la base.'},{status:e instanceof AccessError?e.status:500,headers:{'Cache-Control':'no-store'}});}
