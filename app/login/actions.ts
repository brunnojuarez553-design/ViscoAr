'use server';
import {redirect} from 'next/navigation';
import {createClient,isConfigured} from '../../lib/supabase/server';
export async function login(form:FormData){if(!isConfigured())redirect('/setup');const email=String(form.get('email')||'').trim(),password=String(form.get('password')||'');if(!email||!password)redirect('/login?error=invalid');const db=await createClient();const {error}=await db.auth.signInWithPassword({email,password});if(error)redirect('/login?error=invalid');redirect('/');}
export async function logout(){if(isConfigured()){const db=await createClient();await db.auth.signOut();}redirect('/login');}
