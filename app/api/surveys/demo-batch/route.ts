import {appendChartSurveys,appendChartInterest,appendChartHistory} from '../../../../lib/chart-demo-surveys.mjs';
import {member,load,db,json,error,originCheck,AuthError} from '../../../../lib/runtime';
export async function POST(request:Request){try{
 originCheck(request);const account=await member();if(!account.owner)throw new AuthError('Chỉ chủ hệ thống được bổ sung khảo sát minh họa',403);
 const body=await request.json() as any;if(body.kind!=null&&!['interest','history'].includes(body.kind))throw Error('Đợt dữ liệu không hợp lệ');const current=await load(),{state,added}=(body.kind==='history'?appendChartHistory:body.kind==='interest'?appendChartInterest:appendChartSurveys)(current.state,account);
 if(added){const result=await db().prepare('UPDATE app_state SET json = ?, version = version + 1 WHERE id = ? AND version = ?').bind(JSON.stringify(state),'main',current.version).run();if(!result.meta.changes)return json({error:'Dữ liệu vừa thay đổi. Vui lòng thử lại.'},409)}
 return json({added});
}catch(e){return error(e)}}
