import {getChatGPTUser} from '../../chatgpt-auth';
import {isAdvanceBridge} from '../../../lib/advance-bridge';
import {load,db,json,error,originCheck,AuthError} from '../../../lib/runtime';
import {recordAdvanceAgreementResponse} from '../../../public/ui/advance-agreements.mjs';
export const dynamic='force-dynamic';
export async function POST(req:Request){try{
 originCheck(req);if(!isAdvanceBridge(req)&&!await getChatGPTUser())throw new AuthError('Cần đăng nhập để mở trang xác nhận riêng tư',401);
 const body=await req.json() as any;
 for(let attempt=0;attempt<3;attempt++){
  const current=await load(),now=new Date().toISOString();
  const result=recordAdvanceAgreementResponse(current.state,body.token,body.action,now);
  const response=()=>json({status:result.agreement.status,openedAt:result.agreement.openedAt,confirmedAt:result.agreement.customerConfirmedAt||null});
  if(!result.changed)return response();
  const requestId=crypto.randomUUID(),action=body.action==='confirm'?'advanceAgreementConfirmed':'advanceAgreementOpened';
  const updates=await db().batch([
   db().prepare('UPDATE app_state SET json=?,version=version+1,last_command=? WHERE id=? AND version=?').bind(JSON.stringify(current.state),requestId,'main',current.version),
   db().prepare('INSERT INTO audit_events(id,request_id,actor,time,action,result) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM app_state WHERE id=? AND last_command=?)').bind(crypto.randomUUID(),requestId,'qr-recipient',now,action,JSON.stringify({orderId:result.order.id,agreementId:result.agreement.id}),'main',requestId)
  ]);
  if(updates[0].meta.changes)return response();
 }
 return json({error:'Thông tin vừa thay đổi. Vui lòng thử lại.'},409);
}catch(e){return error(e)}}
