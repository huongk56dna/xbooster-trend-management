import {readMember,member,load,json,error,actorFor,AuthError} from '../../../../lib/runtime';
import {orderingPresentation} from '../../../../lib/ordering-presentation.mjs';
import {ORDERING_READ_ROLES} from '../../../../public/ui/ordering-permissions.mjs';
export async function GET(req:Request){try{const p=await readMember(),a=actorFor(p,new URL(req.url).searchParams.get('role')||'');if(!p.owner||!ORDERING_READ_ROLES.includes(a.role))throw new AuthError('Không có quyền xem bộ trình diễn E-Ordering',403);const {state,version}=await load();return json({version,...orderingPresentation(state,p,a)})}catch(e){return error(e)}}
