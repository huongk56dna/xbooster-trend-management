export function advanceAgreementRows(orders){
 return orders.filter(o=>o.advanceAgreement&&!o.archivedAt&&o.status!=='Đã lưu trữ').map(o=>{
  const a=o.advanceAgreement;
  return {id:a.id,orderId:o.id,customer:o.customer,customerId:o.customerId,amount:a.amount,expectedDate:a.expectedDate||null,createdAt:a.createdAt,createdName:a.createdName||'',openedAt:a.openedAt||null,confirmedAt:a.customerConfirmedAt||null,status:a.customerConfirmedAt?'Khách đã xác nhận thỏa thuận':a.openedAt?'Khách đã mở QR':'Chờ khách xác nhận thỏa thuận',testData:!!(a.testData||o.testData)};
 }).sort((a,b)=>String(b.confirmedAt||b.openedAt||b.createdAt).localeCompare(String(a.confirmedAt||a.openedAt||a.createdAt)));
}

export function findAdvanceAgreement(state,token,now){
 if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))throw Error('Mã QR không hợp lệ');
 const order=state.orders.find(o=>o.advanceAgreement?.confirmationToken===token&&!o.archivedAt&&o.status!=='Đã lưu trữ');
 if(!order||!['Chờ xác nhận','Đã xác nhận','Đang lấy hàng'].includes(order.status))throw Error('Thỏa thuận không còn hiệu lực');
 const agreement=order.advanceAgreement;
 if(!agreement.linkExpiresAt||Date.parse(agreement.linkExpiresAt)<=Date.parse(now))throw Error('Mã QR đã hết hạn. Vui lòng liên hệ Sales để nhận mã mới.');
 return {order,agreement};
}

export function recordAdvanceAgreementResponse(state,token,action,now){
 if(!['open','confirm'].includes(action))throw Error('Thao tác không hợp lệ');
 const {order,agreement}=findAdvanceAgreement(state,token,now);
 if(action==='open'&&(agreement.openedAt||agreement.customerConfirmedAt)||action==='confirm'&&agreement.customerConfirmedAt)return {changed:false,order,agreement};
 agreement.openedAt||=now;
 if(action==='confirm'){agreement.customerConfirmedAt=now;agreement.status='Khách đã xác nhận thỏa thuận';}
 else agreement.status='Khách đã mở QR';
 const text=action==='confirm'?'Khách đã xác nhận thỏa thuận trả trước':'QR thỏa thuận trả trước đã được mở';
 state.seq++;state.notifications.push({id:'TB-'+String(state.seq).padStart(6,'0'),kind:'advance-agreement',role:'Kế toán',reference:order.id,agreementId:agreement.id,time:now,text:(order.testData?'Dữ liệu dùng thử · ':'')+text+' · '+order.customer+' · '+order.id});
 (order.history||=[]).push({action:action==='confirm'?'advanceAgreementConfirmed':'advanceAgreementOpened',time:now,name:'Người nhận mã QR',agreementId:agreement.id});
 return {changed:true,order,agreement};
}
