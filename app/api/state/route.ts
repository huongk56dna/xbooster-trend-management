import {publicProfile} from '../../../lib/public-view.mjs';
import {readMember,member,load,json,error,actorFor,filterWorkspaceState} from '../../../lib/runtime';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const profile=await readMember(),role=new URL(req.url).searchParams.get('role')||profile.roles[0],actor=actorFor(profile,role),{state,version}=await load();return json({profile:publicProfile(profile),activeRole:actor.role,state:filterWorkspaceState(state,profile,actor.role),version})}catch(e){return error(e)}}
