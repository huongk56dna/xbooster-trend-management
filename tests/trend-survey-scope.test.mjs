import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState} from '../public/ui/domain.mjs';
import {filterForProfile} from '../public/ui/state-access.mjs';
import {buildDashboard} from '../lib/trend-analytics.mjs';
const filters={fromDate:'2026-10-01',toDate:'2026-10-27'};
function fixture(){const s=initialState();s.clients=[];s.surveys=[['own','me','Sales/Bắc/HN','Hà Nội','Miền Bắc'],['team','other','Sales/Bắc/HN/Đội 1','Hà Nội','Miền Bắc'],['area','third','Sales/Bắc/HP','Hải Phòng','Miền Bắc'],['south','fourth','Sales/Nam','TP.HCM','Miền Nam'],['legacy','fifth',null,null,null]].map(([id,salesId,orgPath,area,region],i)=>({id,salesId,customerId:id,customer:id,date:'2026-10-20',status:'Đã lưu',productCode:id,productName:id,brand:'Tiles',ownership:'company',type:'Gạch lát nền',size:'60x60',surface:'Mờ',effect:'Vân đá',topics:['Nhu cầu mua hàng'],companyStock:i+1,competitorStock:i+10,scope:orgPath?{orgPath,area,region}:null,region}));return s}
for(const profile of [
 {id:'me',roles:['Sales']},{id:'me',roles:['Sales Admin']},
 {id:'me',roles:['Trưởng phòng'],scope:{orgPath:'Sales/Bắc/HN',areas:['Hà Nội']}},
 {id:'me',roles:['Giám đốc vùng'],scope:{regions:['Miền Bắc']}},
 {id:'me',roles:['R&D'],scope:{regions:['Miền Bắc']}},
 {id:'me',roles:['CEO']},{id:'me',roles:['CFO']},
 {id:'me',roles:['Sales'],owner:true},
 {id:'me',roles:['Mua hàng']},{id:'me',roles:['Kế hoạch sản xuất']},
 {id:'nobody',roles:['Sales']}
])test('dashboard uses survey-list scope: '+JSON.stringify(profile),()=>{
 const state=fixture(),visible=filterForProfile(state,profile).surveys,ids=new Set(visible.map(s=>s.id)),d=buildDashboard(state,profile,filters);
 assert.equal(d.totals.surveys,visible.length);
 assert.deepEqual(new Set(d.groups.flatMap(g=>g.surveyIds)),ids);
 assert.deepEqual(new Set(d.totals.stock.rows.map(r=>r.surveyId)),ids);
 assert.ok(d.topModels.every(g=>g.surveyIds.every(id=>ids.has(id))));
 assert.ok(d.inventory.every(c=>c.rows.every(r=>ids.has(r.surveyId))));
 assert.ok(d.forecasts.every(f=>f.items.every(g=>g.surveyIds.every(id=>ids.has(id)))));
 if(!profile.owner&&!profile.roles.some(r=>['CEO','CFO'].includes(r)))assert.equal(buildDashboard(state,profile,{...filters,region:'Miền Nam'}).totals.surveys,0);
});
