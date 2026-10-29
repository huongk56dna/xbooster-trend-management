import {execute,available,customerPrice,commercialCredit,credit,orderValue,piecesQuantity} from '../public/ui/domain.mjs';
export function checkOrder(state,payload,actor,now=new Date().toISOString()){
 const client=state.clients.find(c=>c.name===payload.customer),lines=Array.isArray(payload.lines)?payload.lines.slice(0,100):[];
 const rows=lines.map(l=>{const p=state.products.find(p=>p.id===l.product);let price=null;try{if(client&&p)price=customerPrice(client,p)}catch{}return {product:l.product,available:p?available(state,p.id,payload.id):null,price}});
 let account=null;try{if(client&&lines.length)account=commercialCredit(state,{id:payload.id,customer:client.name,lines:lines.map((l,i)=>({...l,qty:l.qtyUnit==='pieces'?piecesQuantity(state.products.find(p=>p.id===l.product)?.size,l.pieces??l.qty).qty:Number(l.qty),price:rows[i].price||0}))},{credit,orderValue,today:now.slice(0,10)})}catch{}
 try{const r=execute(state,payload.id?'orderReviseV2':'orderCreateV2',payload,actor,now),o=r.state.orders.find(o=>o.id===r.result.id);return {valid:true,message:'Đủ điều kiện gửi duyệt',total:o.lines.reduce((n,l)=>n+Math.round(l.qty*l.price),0),lines:rows,credit:account}}
 catch(e){return {valid:false,message:e.message,lines:rows,credit:account}}
}
