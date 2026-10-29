import {modelTrendLines} from './model-trend-lines.mjs';
import {monthlyMarketTrend} from './market-line.mjs';
import {customerRegion} from '../public/ui/customer-region.mjs';
import {trendPermissions,distributionChannel} from '../public/ui/trend-permissions.mjs';
const norm=v=>String(v||'').trim().toLocaleLowerCase('vi');
const unique=a=>new Set(a.filter(Boolean)).size;
export function workspaceData(state,profile,current,all,groups,totals,forecasts,filters,identify){
 const permissions=trendPermissions(profile),models=new Map();
 for(const type of groups)for(const pattern of type.children)for(const product of pattern.children){const key=product.id;let item=models.get(key);if(!item){item={...product,surveyIds:[],interestSurveys:0,customers:0,pattern:pattern.name};models.set(key,item)}item.surveyIds.push(...product.surveyIds);}
 const interested=s=>(s.topics||[]).some(t=>['Mẫu mã / xu hướng','Nhu cầu mua hàng'].includes(t)),byId=new Map(current.map(s=>[s.id,s]));
 for(const g of models.values()){const ss=[...new Set(g.surveyIds)].map(id=>byId.get(id)).filter(Boolean),ii=ss.filter(interested);g.surveyIds=ss.map(s=>s.id);g.interestSurveys=ii.length;g.customers=unique(ii.map(s=>s.customerId||norm(s.customer)));g.thumbnail=ss.flatMap(s=>s.photos||[]).map(p=>p.url).find(url=>/^\/api\/files\/[a-f0-9-]+$/.test(url||'')||/^\/samples\/tile-[a-z]+\.svg$/.test(url||''))||null;}
 const topModels=[...models.values()].filter(g=>g.interestSurveys>0).sort((a,b)=>b.interestSurveys-a.interestSurveys||b.customers-a.customers||a.name.localeCompare(b.name,'vi')).slice(0,10);
 const distribution=new Map();
 for(const s of current.filter(interested)){
  const effect=norm(s.effect),surface=norm(s.surface);
  const label=/gỗ|wood|oak/.test(effect)?'Gạch vân gỗ':/đá|marble|stone|travertine|onyx|slate|limestone/.test(effect)?'Gạch vân đá':/terrazzo|họa tiết|trang trí|bông/.test(effect)?'Gạch trang trí':/bóng|polished/.test(surface)?'Gạch men bóng':'Dòng khác / chưa phân loại';
  distribution.set(label,(distribution.get(label)||0)+1);
 }
 const interestDistribution=[...distribution].map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'vi'));
 const averageInterest=models.size?Math.round(totals.interestSurveys/models.size*10)/10:null;
 const represented=unique(all.map(s=>s.customerId||norm(s.customer))),currentCustomers=unique(current.map(s=>s.customerId||norm(s.customer)));
 let inventory=[];
 if(permissions.inventory){const map=new Map();for(const row of totals.stock.rows){const key=row.customerId||norm(row.customer),c=state.clients.find(c=>c.id===row.customerId)||{},s=byId.get(row.surveyId);if(!map.has(key))map.set(key,{id:key,customer:row.customer,address:c.address||s?.customerAddress||'',region:s?.region||customerRegion(c)||'',channel:distributionChannel(c),rows:[]});map.get(key).rows.push(row)}inventory=[...map.values()].map(c=>{const sum=key=>c.rows.some(r=>r[key]!=null)?c.rows.reduce((n,r)=>n+(r[key]??0),0):null,company=sum('companyStock'),competitor=sum('competitorStock'),complete=c.rows.every(r=>r.companyStock!=null&&r.competitorStock!=null),brands=new Map();for(const r of c.rows){if(r.competitorStock==null)continue;const brand=r.ownership==='competitor'&&r.brand?r.brand:'Chưa xác định thương hiệu';brands.set(brand,(brands.get(brand)||0)+r.competitorStock)}return {...c,company,competitor,share:complete&&company+competitor>0?company/(company+competitor)*100:null,latestDate:c.rows.map(r=>r.date).sort().at(-1),brands:[...brands].map(([brand,stock])=>({brand,stock})).sort((a,b)=>b.stock-a.stock)}}).sort((a,b)=>(b.company??0)+(b.competitor??0)-(a.company??0)-(a.competitor??0));}
 if(permissions.strategy)for(const f of forecasts)for(const g of f.items)g.trajectory=trajectory(all.filter(s=>!s.demonstration),g,filters.toDate);
 if(permissions.strategy)for(const f of forecasts)f.attributes=forecastAttributes(f.items);
 const scope=profile.owner?'Quản trị hệ thống · Toàn quốc':profile.roles?.some(r=>['CEO','CFO'].includes(r))?'Ban giám đốc · Toàn quốc':profile.roles?.includes('R&D')?'R&D · '+(profile.scope?.regions||[]).join(', '):profile.roles?.includes('Giám đốc vùng')?'Giám đốc vùng · '+(profile.scope?.regions||[]).join(', '):profile.roles?.includes('Trưởng phòng')?'Trưởng phòng · '+(profile.scope?.areas||[]).join(', '):'Nhân viên kinh doanh · Khảo sát do bạn thực hiện';
 return {permissions,modelTrends:modelTrendLines(topModels,all,filters,identify),overviewTrend:{...monthlyMarketTrend(all,filters.toDate),illustrationAvailable:all.some(s=>s.demonstration)},scopeLabel:scope,topModels,inventory,inventoryRegions:regionalInventory(inventory),interestDistribution,kpis:{surveys:current.length,averageInterest,modelCount:models.size,leadingModel:topModels[0]?.name||null,interestRate:current.length?Math.round(totals.interestSurveys/current.length*100):null,coverage:{visited:currentCustomers,known:represented,rate:represented?Math.round(currentCustomers/represented*100):null}}};
}
function trajectory(all,g,asOf){const interested=s=>(s.topics||[]).some(t=>['Mẫu mã / xu hướng','Nhu cầu mua hàng'].includes(t)),match=s=>'pattern-'+encodeURIComponent(JSON.stringify([norm(s.type)||'chưa xác định',norm(s.effect)||'chưa xác định',norm(s.size).replace(/\s*[x×*]\s*/g,' × ').replace(/\s*(cm|mm)\s*$/,' $1').replace(/^(\d+(?:[.,]\d+)? × \d+(?:[.,]\d+)?)$/,'$1 cm')||'chưa xác định',norm(s.surface)||'chưa xác định']))===g.id,base=new Date(asOf+'T00:00:00Z'),history=[];
 for(let i=12;i>=1;i--){const month=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()-i,1)).toISOString().slice(0,7),ss=all.filter(s=>String(s.date).slice(0,7)===month),values=ss.filter(s=>match(s)&&interested(s));history.push({month,customers:unique(values.map(s=>s.customerId||norm(s.customer))),observed:ss.length>0})}
 const valid=history.map((p,x)=>({...p,x})).filter(p=>p.observed),n=valid.length,active=valid.filter(p=>p.customers>0).length,currentMonth=asOf.slice(0,7),current=unique(all.filter(s=>String(s.date).slice(0,7)===currentMonth&&String(s.date).slice(0,10)<=asOf&&match(s)&&interested(s)).map(s=>s.customerId||norm(s.customer))),potential=Math.max(1,unique(all.map(s=>s.customerId||norm(s.customer))));
 if(n<6||active<3)return {history,current:{month:currentMonth,customers:current,partial:true},future:[],sufficient:false,method:'Cần ít nhất 6 tháng có khảo sát và 3 tháng có quan tâm để ước lượng.'};
 const xm=valid.reduce((a,p)=>a+p.x,0)/n,ym=valid.reduce((a,p)=>a+p.customers,0)/n,sxx=valid.reduce((a,p)=>a+(p.x-xm)**2,0),slope=valid.reduce((a,p)=>a+(p.x-xm)*(p.customers-ym),0)/sxx,intercept=ym-slope*xm,error=valid.reduce((a,p)=>a+(p.customers-(intercept+slope*p.x))**2,0)/(n-2),t=({6:2.776,7:2.571,8:2.447,9:2.365,10:2.306,11:2.262,12:2.228}[n]||2.776),cap=v=>Math.round(Math.min(potential,Math.max(0,v))*10)/10;
 const future=[3,6,12].map(h=>{const x=12+h,value=intercept+slope*x,range=t*Math.sqrt(error*(1+1/n+(x-xm)**2/sxx));return {horizon:h,month:new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()+h,1)).toISOString().slice(0,7),customers:cap(value),lower:cap(value-range),upper:cap(value+range)}});
 return {history,current:{month:currentMonth,customers:current,partial:true},future,sufficient:true,method:'Hồi quy tuyến tính trên các tháng có khảo sát; dải ước lượng 95% theo sai số mô hình, không phải độ tin cậy của AI.'};
}

// Weighted characteristic signals describe the selected candidates, not future sales probabilities.
export function forecastAttributes(items){
 const total=items.reduce((n,g)=>n+Math.max(0,g.score),0);
 const text=g=>norm([g.name,g.effect,g.surface].join(' '));
 const axes=[
  ['large','Khổ lớn ≥ 60 × 120',g=>{const size=norm(g.size).match(/(\d+(?:[.,]\d+)?)\s*[x×*]\s*(\d+(?:[.,]\d+)?)/);if(!size)return false;const factor=/mm/.test(norm(g.size))?.1:1;return Number(size[1].replace(',','.'))*Number(size[2].replace(',','.'))*factor*factor>=7200}],
  ['matt','Bề mặt mờ / nhám',g=>/matt|mờ|nhám|anti.?slip/.test(norm(g.surface))],
  ['neutral','Tông trung tính',g=>/xám|trắng|đen|kem|\bbe\b|beige|grey|gray|white|black|ivory|sand|graphite/.test(text(g))],
  ['stone','Vân đá tự nhiên',g=>/vân đá|marble|stone|travertine|onyx|slate|limestone/.test(norm(g.effect))]
 ];
 return axes.map(([id,label,match])=>({id,label,value:total?Math.round(items.filter(match).reduce((n,g)=>n+Math.max(0,g.score),0)/total*100):null}));
}

export function regionalInventory(inventory){return ['Miền Bắc','Miền Trung','Miền Nam'].map(region=>{const stores=inventory.filter(c=>c.region===region),total=key=>stores.some(c=>c[key]!=null)?stores.reduce((n,c)=>n+(c[key]??0),0):null;return {region,company:total('company'),competitor:total('competitor'),stores:stores.length}})}
