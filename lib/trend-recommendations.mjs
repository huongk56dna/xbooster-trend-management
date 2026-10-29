import {canSeeRecommendation,canRespondRecommendation,trendPermissions} from '../public/ui/trend-permissions.mjs';
export function recommendationCreate(state,profile,body,dashboard,now=new Date().toISOString(),id=crypto.randomUUID()){
 if(!trendPermissions(profile).strategy)throw Error('Không có quyền gửi đề xuất R&D');
 if(body.mode==='demo'||dashboard.mode==='demo')throw Error('Chỉ gửi đề xuất từ khảo sát thực tế');
 const region=dashboard.filters.region;if(!['Miền Bắc','Miền Trung','Miền Nam'].includes(region))throw Error('Chọn một vùng cụ thể trước khi gửi R&D');
 if(![3,6,12].includes(body.horizon))throw Error('Chọn mốc 3, 6 hoặc 12 tháng');
 if(typeof body.clientId!=='string'||!body.clientId||body.clientId.length>100)throw Error('Thiếu mã chống gửi trùng');
 const existing=(state.trendRecommendations||[]).find(r=>r.createdBy===profile.id&&r.clientId===body.clientId);if(existing)return {record:existing,duplicate:true};
 const f=dashboard.forecasts.find(f=>f.horizon===body.horizon);if(!f?.items.length)throw Error('Chưa có mẫu gạch để đề xuất');
 const note=String(body.note||'').trim();if(!note||note.length>3000)throw Error('Nhập nội dung đề xuất tối đa 3.000 ký tự');
 const record={id:'RD-'+id,clientId:body.clientId,createdBy:profile.id,createdName:profile.name,createdAt:now,scope:structuredClone(profile.scope||{}),region,horizon:body.horizon,filters:dashboard.filters,stateVersion:dashboard.version,note,status:'Chờ R&D tiếp nhận',revision:1,early:f.early,items:f.items.slice(0,3).map(g=>({id:g.id,name:g.name,type:g.type,score:g.score,customers:g.customers,buyers:g.buyers,companyStock:g.stock.company,competitorStock:g.stock.competitor,codes:g.children.map(p=>({code:p.code,brand:p.brand,ownership:p.ownership}))})),history:[{at:now,by:profile.id,name:profile.name,action:'Gửi đề xuất'}]};
 state.trendRecommendations||=[];state.trendRecommendations.unshift(record);return {record,duplicate:false};
}
export function recommendationRespond(state,profile,body,now=new Date().toISOString()){
 const r=(state.trendRecommendations||[]).find(r=>r.id===body.id);if(!r||!canSeeRecommendation(r,profile)||!canRespondRecommendation(r,profile))throw Error('Không có quyền xử lý đề xuất này');
 if(r.status==='Đã phản hồi')throw Error('Đề xuất đã hoàn tất, chỉ được xem');if(body.revision!==r.revision)throw Error('Đề xuất đã thay đổi. Tải lại trước khi cập nhật');
 if(!['Đã tiếp nhận','Đang đánh giá','Đã phản hồi'].includes(body.status))throw Error('Trạng thái phản hồi không hợp lệ');
 const current=['Chờ R&D tiếp nhận','Đã tiếp nhận','Đang đánh giá','Đã phản hồi'].indexOf(r.status),target=['Chờ R&D tiếp nhận','Đã tiếp nhận','Đang đánh giá','Đã phản hồi'].indexOf(body.status);if(target<current)throw Error('Không chuyển ngược bước xử lý');
 const note=String(body.note||'').trim();if(!note||note.length>3000)throw Error('Nhập ghi chú R&D tối đa 3.000 ký tự');r.status=body.status;r.revision++;r.updatedAt=now;r.history.push({at:now,by:profile.id,name:profile.name,action:body.status,note});return r;
}
