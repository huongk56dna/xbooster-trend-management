import {notificationTarget} from './notifications.mjs';
import {canViewTruck,safeTruck} from './logistics.mjs';
import {canViewCommercialOrder} from './commerce.mjs';
import {canSeeRecommendation} from './trend-permissions.mjs';
import {visibleSurveys} from './surveys.mjs';
import {canSeeSupply} from './supply.mjs';
export function filterForProfile(state,profile){
 const visible=visibleSurveys(state,profile);
 if(profile.owner)return state;
 state=structuredClone(state);state.notifications=(state.notifications||[]).filter(n=>profile.roles.some(role=>notificationTarget(state,n,{...profile,role})));if(state.commerce&&!profile.roles.some(r=>['Kế toán','Kế Toán Trưởng'].includes(r))){state.commerce={start:state.commerce.start,rate:8,method:'simple',paymentRequests:(state.commerce.paymentRequests||[]).filter(q=>q.createdBy===profile.id||profile.roles.includes('Sales Admin'))};}
 if(profile.roles.includes('Sales Admin')){let out=structuredClone(state);delete out.legacyArchive;out.surveys=visible;out.trendRecommendations=(out.trendRecommendations||[]).filter(r=>canSeeRecommendation(r,profile));out.files=[];out.visits=out.visits.filter(v=>v.salesId===profile.id);out.logs=out.logs.filter(l=>!l.action?.startsWith('survey')||visible.some(s=>s.id===l.reference));return out;}
 let out=structuredClone(state);delete out.legacyArchive;out.files=[];out.trucks=out.trucks.filter(t=>t.flow!=='logistics-v2'||profile.roles.some(role=>canViewTruck(state,t,{...profile,role})));out.orders=out.orders.filter(o=>o.workflow!=='commercial-v2'||profile.roles.some(role=>canViewCommercialOrder(o,{...profile,role})));out.surveys=visible;out.trendRecommendations=(out.trendRecommendations||[]).filter(r=>canSeeRecommendation(r,profile));
 out.supplyRequests=(out.supplyRequests||[]).filter(r=>profile.roles.some(role=>canSeeSupply(r,{id:profile.id,role})));
 const ids=new Set(out.supplyRequests.map(r=>r.id));
 out.notifications=(out.notifications||[]).filter(n=>profile.roles.includes(n.role)&&(n.kind!=='supply'||ids.has(n.reference)));
 out.visits=out.visits.filter(v=>v.salesId===profile.id);out.logs=out.logs.filter(l=>!l.action?.startsWith('survey')||visible.some(s=>s.id===l.reference));
 if(!profile.roles.some(r=>['Sales','Kế toán','Kế Toán Trưởng'].includes(r))){out.receipts=[];out.entries=[];out.periods=[];out.bankAccounts=[];out.policy={rate:0,basis:365};out.policyHistory=[];out.rate=0;out.clients=out.clients.map(c=>({...c,creditLimit:0,credit:0,debt:0}));out.logs=out.logs.filter(l=>l.action?.startsWith('supply')&&ids.has(l.reference));out.notifications=out.notifications.filter(n=>['supply','logistics'].includes(n.kind));if(profile.roles.some(r=>['Mua hàng','Kế hoạch sản xuất'].includes(r)))out.orders=out.orders.map(o=>({id:o.id,customer:o.customer,date:o.date,status:o.status,lines:o.lines.map(l=>({product:l.product,qty:l.qty})),createdBy:o.createdBy}));}
 if(profile.roles.every(r=>['Mua hàng','Kế hoạch sản xuất'].includes(r))){out={schema:out.schema,seq:out.seq,products:out.products.map(p=>({id:p.id,name:p.name,brand:p.brand,size:p.size,surface:p.surface,type:p.type,style:p.style,region:p.region,stock:p.stock,price:0})),clients:out.clients.map(c=>({id:c.id,name:c.name,address:c.address,contact:c.contact,region:c.region,type:c.type,creditLimit:0,debt:0})),orders:out.orders,supplyRequests:out.supplyRequests,notifications:out.notifications,logs:out.logs,policy:{rate:0,basis:365},rate:0,policyHistory:[],surveys:[],visits:[],trucks:[],receipts:[],entries:[],periods:[],tasks:[],bankAccounts:[],files:[]};}
 if(profile.roles.every(r=>['Trưởng phòng','Giám đốc vùng','CEO','CFO','R&D','Giám đốc Thương mại'].includes(r))){out.orders=out.orders.filter(o=>o.workflow==='commercial-v2'&&profile.roles.some(role=>canViewCommercialOrder(o,{...profile,role}))).map(o=>({id:o.id,customer:o.customer,customerId:o.customerId,region:o.region,lines:o.lines,date:o.date,status:o.status,workflow:o.workflow,createdBy:o.createdBy,doa:o.doa,contract:o.contract,creditTerm:o.creditTerm,history:o.history}));out.trucks=[];out.supplyRequests=[];out.logs=state.logs.filter(l=>l.action?.startsWith('survey')&&visible.some(s=>s.id===l.reference));out.notifications=state.notifications.filter(n=>profile.roles.some(role=>role==='Giám đốc Thương mại'&&notificationTarget(state,n,{...profile,role})));}
 if(profile.roles.every(r=>['Bảo vệ','Kho','Thủ kho','Xe nâng'].includes(r))){out.trucks=out.trucks.map(safeTruck);out.orders=out.orders.map(o=>({id:o.id,customer:o.customer,date:o.date,status:o.status,workflow:o.workflow,createdBy:o.createdBy,lines:o.lines.map(l=>({product:l.product,qty:l.qty,size:l.size}))}));out.products=out.products.map(p=>({...p,price:0}));}
 return out;
}

// Project the active work role even for an owner or a multi-role account.
export function filterForWorkspaceRole(state,profile,role){
 if(!profile.roles.includes(role))throw Error('Vai làm việc chưa được cấp');
 const out=filterForProfile(state,{...profile,owner:false,roles:[role]});
 const reserved=new Map();for(const o of state.orders)if(['Đã xác nhận','Đang lấy hàng'].includes(o.status))for(const l of o.lines)reserved.set(l.product,(reserved.get(l.product)||0)+Number(l.qty));out.products=out.products.map(p=>({...p,availableStock:p.stock-(reserved.get(p.id)||0)}));
 if(['Sales','Sales Admin'].includes(role))out.orders=out.orders.filter(o=>o.workflow==='commercial-v2'?canViewCommercialOrder(o,{...profile,owner:false,role}):role==='Sales Admin'||!o.createdBy||o.createdBy===profile.id);
 return out;
}
