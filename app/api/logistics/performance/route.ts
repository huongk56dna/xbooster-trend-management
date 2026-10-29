import {readMember,member,load,json,error,actorFor,AuthError} from '../../../../lib/runtime';
import {ORDERING_READ_ROLES} from '../../../../public/ui/ordering-permissions.mjs';
import {canViewTruck} from '../../../../public/ui/logistics.mjs';
import {logisticsPerformance} from '../../../../public/ui/logistics-performance.mjs';
export async function GET(req:Request){try{const p=await readMember(),a=actorFor(p,new URL(req.url).searchParams.get('role')||'');if(!ORDERING_READ_ROLES.includes(a.role))throw new AuthError('Không có quyền xem hiệu suất giao nhận',403);const {state,version}=await load();return json({version,...logisticsPerformance(state.trucks.filter((t:any)=>canViewTruck(state,t,a)))})}catch(e){return error(e)}}
