const norm=v=>String(v||'').trim().toLocaleLowerCase('vi');
const key=s=>s.customerId||norm(s.customer),unique=ss=>new Set(ss.map(key).filter(Boolean)).size;
const date=s=>/^\d{4}-\d{2}-\d{2}$/.test(s.date||'')?s.date:new Date(s.date).toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'});
const interested=s=>(s.topics||[]).some(t=>['Mẫu mã / xu hướng','Nhu cầu mua hàng'].includes(t));
// Input has already passed the shared survey permission and product filters.
export function monthlyMarketTrend(records,asOf,match=()=>true){
 const base=new Date(asOf+'T00:00:00Z'),all=records.filter(s=>!s.demonstration&&date(s)<=asOf),history=[];
 for(let i=12;i>=1;i--){const month=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()-i,1)).toISOString().slice(0,7),ss=all.filter(s=>date(s).slice(0,7)===month);history.push({month,customers:unique(ss.filter(s=>match(s)&&interested(s))),observed:ss.length>0})}
 const valid=history.map((p,x)=>({...p,x})).filter(p=>p.observed),n=valid.length,active=valid.filter(p=>p.customers>0).length,month=asOf.slice(0,7),currentRows=all.filter(s=>date(s).slice(0,7)===month),current={month,customers:unique(currentRows.filter(s=>match(s)&&interested(s))),observed:currentRows.length>0,partial:true},potential=Math.max(1,unique(all));
 if(n<6||active<3)return {asOf,history,current,future:[],sufficient:false,method:'Cần ít nhất 6 tháng có khảo sát và 3 tháng có khách quan tâm để ước lượng. Dữ liệu minh họa không dùng để dự báo.'};
 const xm=valid.reduce((a,p)=>a+p.x,0)/n,ym=valid.reduce((a,p)=>a+p.customers,0)/n,sxx=valid.reduce((a,p)=>a+(p.x-xm)**2,0),slope=valid.reduce((a,p)=>a+(p.x-xm)*(p.customers-ym),0)/sxx,intercept=ym-slope*xm,error=valid.reduce((a,p)=>a+(p.customers-(intercept+slope*p.x))**2,0)/(n-2),t=({6:2.776,7:2.571,8:2.447,9:2.365,10:2.306,11:2.262,12:2.228}[n]||2.776),cap=v=>Math.round(Math.min(potential,Math.max(0,v))*10)/10;
 const future=[3,6,12].map(h=>{const x=12+h,value=intercept+slope*x,range=t*Math.sqrt(error*(1+1/n+(x-xm)**2/sxx));return {horizon:h,month:new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()+h,1)).toISOString().slice(0,7),customers:cap(value),lower:cap(value-range),upper:cap(value+range)}});
 return {asOf,history,current,future,sufficient:true,method:'Ước lượng theo lịch sử khách quan tâm; dải 95% phản ánh sai số mô hình. Không phải đơn hàng hay sản lượng cam kết.'};
}
