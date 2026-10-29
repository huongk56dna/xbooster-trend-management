import {customerRegion} from '../public/ui/customer-region.mjs';
export const CHART_SURVEY_BATCH='chart-five-surveys-2026-10-27';
// Explicitly requested illustration records; never change operational catalogs or balances.
export function appendChartSurveys(input,actor,now=new Date().toISOString()){
 if(!actor.owner)throw Error('Chỉ chủ hệ thống được bổ sung khảo sát minh họa');
 const state=structuredClone(input),existing=state.surveys.filter(s=>s.demonstrationBatch===CHART_SURVEY_BATCH);
 if(existing.length===5)return {state,added:0};
 if(existing.length)throw Error('Đợt khảo sát minh họa chưa đầy đủ; cần đối chiếu trước khi thêm');
 const products=state.products.filter(p=>p.id&&p.name).slice(0,5),clients=state.clients.filter(c=>c.id&&c.name);
 if(products.length<5||!clients.length)throw Error('Cần ít nhất 5 mã gạch và 1 khách hàng trong danh mục');
 const date=new Date(now).toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'}),regions=['Miền Bắc','Miền Trung','Miền Nam'];
 const company=[480,320,180,650,240],competitor=[160,280,420,210,360];
 for(let i=0;i<5;i++){
  const p=products[i],c=clients.find(c=>customerRegion(c)===regions[i%3])||clients[i%clients.length],region=customerRegion(c);
  state.seq=(state.seq||1000)+1;const id='KS-'+String(state.seq).padStart(6,'0');
  state.surveys.push({id,demonstration:true,demonstrationBatch:CHART_SURVEY_BATCH,source:'Khảo sát minh họa theo yêu cầu',customerId:c.id,customer:c.name,customerAddress:c.address||'',region,salesId:actor.id,sales:actor.name,team:actor.team||'',scope:{orgPath:actor.scope?.orgPath||'',area:actor.scope?.area||'',region},date,created:now,submitted:now,updatedAt:now,revision:1,history:[],status:'Đã lưu',product:p.id,productCode:p.id,productName:p.name,brand:p.brand||'Prime',size:p.size||'',effect:p.effect||p.style||'',surface:p.surface||'',type:p.type||'Gạch lát nền',ownership:'company',qty:null,companyStock:company[i],competitorStock:competitor[i],topics:['Mẫu mã / xu hướng'],note:'Khảo sát minh họa để trình diễn biểu đồ. Số tồn và mức quan tâm là số liệu giả định, không phản ánh kiểm kê hoặc nhu cầu thực tế.',photos:[],gps:null});
 }
 state.logs.unshift({id:'EV-'+CHART_SURVEY_BATCH,userId:actor.id,name:actor.name,role:'Chủ hệ thống',action:'surveyDemoBatch',reference:CHART_SURVEY_BATCH,time:now,text:'Thêm 5 khảo sát minh họa theo yêu cầu để hiển thị biểu đồ'});
 return {state,added:5};
}

export const CHART_INTEREST_BATCH='chart-interest-variety-2026-10-27';
export function appendChartInterest(input,actor,now=new Date().toISOString()){
 if(!actor.owner)throw Error('Chỉ chủ hệ thống được bổ sung khảo sát minh họa');
 const state=structuredClone(input),existing=state.surveys.filter(s=>s.demonstrationBatch===CHART_INTEREST_BATCH);if(existing.length===6)return {state,added:0};if(existing.length)throw Error('Đợt bổ sung chưa đầy đủ; cần đối chiếu trước khi thêm');
 const sources=state.surveys.filter(s=>s.demonstrationBatch===CHART_SURVEY_BATCH&&s.salesId===actor.id).slice(0,3);if(sources.length!==3)throw Error('Cần có đợt 5 khảo sát minh họa trước');
 const counts=[3,2,1],date=new Date(now).toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'});
 for(let i=0;i<3;i++)for(let j=0;j<counts[i];j++){
  const source=sources[i],c=state.clients.find(c=>c.id===source.customerId);if(!c)throw Error('Khách hàng không còn trong danh mục');
  state.seq=(state.seq||1000)+1;const id='KS-'+String(state.seq).padStart(6,'0');
  state.surveys.push({...structuredClone(source),id,demonstrationBatch:CHART_INTEREST_BATCH,customerId:c.id,customer:c.name,customerAddress:c.address||'',salesId:actor.id,sales:actor.name,date,created:now,submitted:now,updatedAt:now,revision:1,history:[],companyStock:source.companyStock,competitorStock:source.competitorStock,note:'Khảo sát minh họa bổ sung lượt quan tâm cho biểu đồ; không phản ánh nhu cầu mua thực tế. Số tồn giả định giữ như bản ghi minh họa gốc.'});
 }
 state.logs.unshift({id:'EV-'+CHART_INTEREST_BATCH,userId:actor.id,name:actor.name,role:'Chủ hệ thống',action:'surveyDemoBatch',reference:CHART_INTEREST_BATCH,time:now,text:'Thêm 6 khảo sát minh họa để tạo mức quan tâm 4 / 3 / 2 lượt'});return {state,added:6};
}

export const CHART_HISTORY_BATCH='chart-forecast-history-2026-10-27';
export function appendChartHistory(input,actor,now=new Date().toISOString()){
 if(!actor.owner)throw Error('Chỉ chủ hệ thống được bổ sung khảo sát minh họa');
 const state=structuredClone(input),existing=state.surveys.filter(s=>s.demonstrationBatch===CHART_HISTORY_BATCH);
 if(existing.length===99)return {state,added:0};if(existing.length)throw Error('Đợt lịch sử chưa đầy đủ; cần đối chiếu trước khi thêm');
 const sources=state.surveys.filter(s=>s.demonstrationBatch===CHART_SURVEY_BATCH&&s.salesId===actor.id).slice(0,3);if(sources.length!==3)throw Error('Cần có đợt 5 khảo sát minh họa trước');
 const base=new Date(now);let added=0;
 for(let i=0;i<3;i++)for(let month=0;month<6;month++)for(let j=0;j<month+2+i;j++){
  const source=sources[i],day=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()-6+month,3+j*3)),date=day.toISOString().slice(0,10);
  state.seq=(state.seq||1000)+1;const id='KS-'+String(state.seq).padStart(6,'0');
  state.surveys.push({...structuredClone(source),id,demonstration:true,demonstrationBatch:CHART_HISTORY_BATCH,forecastIllustration:true,date,created:date+'T03:00:00.000Z',submitted:date+'T03:00:00.000Z',updatedAt:date+'T03:00:00.000Z',revision:1,history:[],qty:null,companyStock:null,competitorStock:null,note:'Lịch sử khảo sát trình diễn để minh họa dự kiến 3/6 tháng; không phản ánh nhu cầu thực tế và không dùng cho AI hoặc sản xuất.'});added++;
 }
 state.logs.unshift({id:'EV-'+CHART_HISTORY_BATCH,userId:actor.id,name:actor.name,role:'Chủ hệ thống',action:'surveyDemoBatch',reference:CHART_HISTORY_BATCH,time:now,text:'Thêm 99 khảo sát trình diễn của 3 mã trong 6 tháng lịch sử'});return {state,added};
}
