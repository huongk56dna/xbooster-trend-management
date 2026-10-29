import {trendRoleProfile} from '../../../../lib/trend-role.mjs';
import {readMember,member,load,db,json,error,originCheck,AuthError} from '../../../../lib/runtime';
import {buildDashboard} from '../../../../lib/trend-analytics.mjs';
import {canSeeRecommendation,canRespondRecommendation,trendPermissions} from '../../../../public/ui/trend-permissions.mjs';
import {recommendationCreate,recommendationRespond} from '../../../../lib/trend-recommendations.mjs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const p=trendRoleProfile(await readMember(),new URL(req.url).searchParams.get('role'));if(!trendPermissions(p).strategy)throw new AuthError('Không có quyền xem đề xuất chiến lược',403);const {state,version}=await load();return json({version,records:(state.trendRecommendations||[]).filter((r:any)=>canSeeRecommendation(r,p)).map((r:any)=>({...r,canRespond:canRespondRecommendation(r,p)}))})}catch(e){return error(e)}}
export async function POST(req:Request){try{originCheck(req);const account=await member(),body=await req.json() as any,p=trendRoleProfile(account,body.role);if(!trendPermissions(p).strategy)throw new AuthError('Không có quyền đề xuất chiến lược',403);const current=await load();
 if(body.action!=='respond'){const duplicate=(current.state.trendRecommendations||[]).find((r:any)=>r.createdBy===p.id&&r.clientId===body.clientId);if(duplicate)return json({version:current.version,record:duplicate,duplicate:true})}
 if(body.version!==current.version)return json({error:'Dữ liệu đã thay đổi. Tải lại trước khi gửi.'},409);
 let record;if(body.action==='respond'){const target=(current.state.trendRecommendations||[]).find((r:any)=>r.id===body.id);if(!target||!canRespondRecommendation(target,p))throw new AuthError('Chỉ R&D phụ trách vùng hoặc chủ hệ thống được phản hồi',403);record=recommendationRespond(current.state,p,body)}else{const d=buildDashboard(current.state,p,body.filters||{},current.version);record=recommendationCreate(current.state,p,body,d).record}
 const result=await db().prepare('UPDATE app_state SET json=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(current.state),'main',current.version).run();if(!result.meta.changes)return json({error:'Có cập nhật đồng thời. Tải lại và thử lại.',code:'conflict'},409);return json({version:current.version+1,record});
 }catch(e){return error(e)}}
