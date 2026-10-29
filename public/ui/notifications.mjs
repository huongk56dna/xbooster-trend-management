import {canViewCommercialOrder} from './commerce.mjs';
import {canViewTruck} from './logistics.mjs';
import {canSeeSupply} from './supply.mjs';
export function notificationTarget(state,n,actor){
 if(n.role!==actor.role)return null;
 const supply=(state.supplyRequests||[]).find(x=>x.id===n.reference);if(supply)return canSeeSupply(supply,actor)?{kind:'supply',id:supply.id,page:'inventory'}:null;
 const truck=(state.trucks||[]).find(t=>t.id===n.truckId);if(truck)return canViewTruck(state,truck,actor)?{kind:'truck',id:truck.id,page:'stations'}:null;
 const o=state.orders.find(o=>o.id===n.reference);if(o&&n.kind==='advance-agreement')return canViewCommercialOrder(o,actor)?{kind:'agreement',id:o.id,page:'finance'}:null;if(o)return canViewCommercialOrder(o,actor)?{kind:'order',id:o.id,page:actor.role==='Giám đốc Thương mại'?'approvals':'orders'}:null;
 return null;
}
export function visibleNotifications(state,actor){return (state.notifications||[]).map(n=>({...n,target:notificationTarget(state,n,actor)})).filter(n=>n.target).sort((a,b)=>String(b.time).localeCompare(String(a.time))||b.id.localeCompare(a.id));}
