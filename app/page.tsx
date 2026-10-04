import Workspace from './workspace';
import {redirect} from 'next/navigation';
import {access,AccessError} from '../lib/auth';
export const dynamic='force-dynamic';
export default async function Page(){try{await access();}catch(e){if(e instanceof AccessError){if(e.status===401)redirect('/login');if(e.status===403)redirect('/activation');redirect('/setup');}throw e;}return <Workspace/>;}
