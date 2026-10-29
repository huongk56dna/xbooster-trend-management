export const SURVEY_CREATORS=['Sales','Sales Admin'];
export const SURVEY_MANAGERS=['Trưởng phòng','Giám đốc vùng','CEO','CFO','R&D'];
export const canEditSurvey=(s,p)=>!!s.salesId&&s.salesId===p.id&&!s.sample;
const inside=(path,root)=>!!path&&!!root&&(path===root||path.startsWith(root+'/'));
export function canViewSurvey(s,p){
 if(p.owner||p.roles?.some(r=>['CEO','CFO'].includes(r))||(!!p.id&&s.salesId===p.id))return true;
 const scope=s.scope,access=p.scope;if(!scope||!access)return false;
 if(p.roles?.some(r=>['Giám đốc vùng','R&D'].includes(r))&&(access.regions||[]).includes(scope.region))return true;
 return !!(p.roles?.includes('Trưởng phòng')&&inside(scope.orgPath,access.orgPath)&&(access.areas||[]).includes(scope.area));
}
// Shared read boundary for survey lists and every trend aggregation.
export function visibleSurveys(state,profile){
 if(!profile.owner&&profile.roles?.length&&profile.roles.every(r=>['Mua hàng','Kế hoạch sản xuất'].includes(r)))return [];
 return state.surveys.filter(s=>canViewSurvey(s,profile));
}
export function validateScope(input={}){
 const list=v=>[...new Set((Array.isArray(v)?v:[]).map(x=>String(x).trim()).filter(Boolean))];
 let scope={orgPath:String(input.orgPath||'').trim().replace(/^\/+|\/+$/g,''),managerEmail:String(input.managerEmail||'').trim().toLowerCase(),area:String(input.area||'').trim(),region:String(input.region||'').trim(),areas:list(input.areas),regions:list(input.regions)};
 if(Object.values(scope).some(v=>typeof v==='string'&&v.length>500)||scope.areas.length>100||scope.regions.length>100)throw Error('Phạm vi quản lý quá dài');
 if(scope.managerEmail&&!/^\S+@\S+\.\S+$/.test(scope.managerEmail))throw Error('Email cấp trên không hợp lệ');
 return scope;
}
export function applySurveyCommand(s,action,p,actor,now,h){
 const check=(ok,msg)=>{if(!ok)throw Error(msg)};
 check(SURVEY_CREATORS.includes(actor.role),'Cần vai Sales hoặc Sales Admin');
 let old=action==='surveyUpdate'?s.surveys.find(x=>x.id===p.id):null;
 if(action==='surveyUpdate'){check(old&&canEditSurvey(old,actor),'Chỉ người tạo được sửa khảo sát');if(p.mutationId&&old.lastMutationId===p.mutationId)return {id:old.id,duplicate:true};check((old.revision||1)===p.revision,'Khảo sát đã thay đổi. Mở bản mới để đối chiếu trước khi lưu.');}
 else if(p.clientDraftId){const existing=s.surveys.find(x=>x.salesId===actor.id&&x.clientDraftId===p.clientDraftId);if(existing)return {id:existing.id,duplicate:true};}
 const client=s.clients.find(c=>c.id===p.customerId||(!p.customerId&&c.name===p.customer));check(client,'Vui lòng chọn khách hàng');
 check(Array.isArray(p.photos)&&p.photos.length>=1&&p.photos.length<=3,'Cần 1–3 ảnh sản phẩm');
 check(new Set(p.photos.map(f=>f.id)).size===p.photos.length,'Ảnh bị trùng');
 check(p.photos.every(f=>s.files.some(x=>x.id===f.id&&x.owner===actor.id&&x.kind==='image')),'Ảnh không thuộc người gửi');
 const topics=['Mẫu mã / xu hướng','Giá bán','Chất lượng sản phẩm','Nhu cầu mua hàng','Sản phẩm đối thủ','Khác'];const recordedTopics=p.topics??old?.topics??[];check(Array.isArray(recordedTopics)&&recordedTopics.every(x=>topics.includes(x)),'Nội dung trao đổi không hợp lệ');
 const number=(value,label)=>{if(value===''||value==null)return null;check(typeof value!=='boolean'&&Number.isFinite(Number(value))&&Number(value)>=0&&Number(value)<=1e12,label+' phải là số không âm');return Number(value)};
 const str=(v,label)=>{check(v==null||typeof v==='string'&&v.length<=2000,label+' không hợp lệ');return (v||'').trim()};
 const gps=p.gps==null||p.gps===''?(old?.gps||null):validateSurveyGPS(p.gps);
 const value={gps,customerId:client.id,customer:client.name,customerAddress:client.address||'',region:client.region||'',productCode:str(p.productCode,'Mã sản phẩm'),productName:str(p.productName,'Tên sản phẩm'),brand:str(p.brand,'Thương hiệu'),size:str(p.size,'Kích thước'),effect:str(p.effect,'Hiệu ứng'),surface:str(p.surface,'Bề mặt'),type:str(p.type,'Nhóm gạch')||'Chưa xác định',ownership:['company','competitor'].includes(p.ownership)?p.ownership:'unknown',qty:number(p.qty,'Số lượng'),companyStock:number(p.companyStock,'Tồn gạch công ty'),competitorStock:number(p.competitorStock,'Tồn gạch đối thủ'),topics:[...new Set(recordedTopics)],note:str(p.note,'Ghi chú'),photos:p.photos.map(f=>{let file=s.files.find(x=>x.id===f.id);return {id:file.id,url:'/api/files/'+file.id,name:file.name||'Ảnh khảo sát',type:file.type,size:file.size}}),status:'Đã lưu'};
 value.product=value.productCode||value.productName||'Chưa xác định';
 if(old){const changes={};for(const k of Object.keys(value))if(JSON.stringify(old[k])!==JSON.stringify(value[k]))changes[k]={before:old[k]??null,after:value[k]};old.history||=[];old.history.push({at:now,by:actor.id,name:actor.name,changes});Object.assign(old,value,{revision:(old.revision||1)+1,updatedAt:now,updatedBy:actor.id,lastMutationId:p.mutationId||null});return {id:old.id};}
 const survey={...value,id:h.id(s,'KS'),clientDraftId:p.clientDraftId||null,lastMutationId:p.mutationId||null,scope:{orgPath:actor.scope?.orgPath||'',area:actor.scope?.area||'',region:actor.scope?.region||''},sales:actor.name,salesId:actor.id,team:actor.team,date:h.today,created:now,submitted:now,updatedAt:now,revision:1,history:[]};
 s.surveys.push(survey);return {id:survey.id};
}

export function validateSurveyGPS(g){
 if(!g||typeof g!=='object'||typeof g.latitude!=='number'||typeof g.longitude!=='number'||typeof g.accuracy!=='number'||!Number.isFinite(g.latitude)||!Number.isFinite(g.longitude)||!Number.isFinite(g.accuracy)||Math.abs(g.latitude)>90||Math.abs(g.longitude)>180||g.accuracy<0||g.accuracy>1e7||typeof g.time!=='string'||!Number.isFinite(Date.parse(g.time)))throw Error('Vị trí khảo sát không hợp lệ');
 return {latitude:g.latitude,longitude:g.longitude,accuracy:g.accuracy,time:new Date(g.time).toISOString()};
}
