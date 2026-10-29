import {piecesQuantity} from './tile-units.mjs';
import {customerRegion} from './customer-region.mjs';
export {customerRegion,regionFromAddress} from './customer-region.mjs';
// New commercial workflow; legacy documents stay intact. Amounts are integer VND.
export const COMMERCE_ROLES=['Sales','Sales Admin','Giám đốc vùng','Giám đốc Thương mại','Kế toán','Kế Toán Trưởng'];
const check=(ok,msg)=>{if(!ok)throw Error(msg)},sum=(a,f)=>a.reduce((n,x)=>n+f(x),0);
const date=d=>{check(/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d,'Ngày không hợp lệ');return Date.parse(d+'T00:00:00Z')};
export const addDays=(d,n)=>new Date(date(d)+n*86400000).toISOString().slice(0,10);
const text=(v,label)=>{check(typeof v==='string'&&v.trim()&&v.length<=1000,label+' không hợp lệ');return v.trim()};
const money=v=>{const n=Number(v);check(Number.isSafeInteger(n)&&n>0&&n<=1e12,'Số tiền VNĐ phải là số nguyên dương, tối đa 1.000 tỷ');return n};
const finance=a=>['Kế toán','Kế Toán Trưởng'].includes(a.role);
export const canViewCommercialOrder=(o,a)=>['Kế toán','Kế Toán Trưởng','Giám đốc Thương mại','Sales Admin'].includes(a.role)||a.role==='Sales'&&o.createdBy===a.id||a.role==='Giám đốc vùng'&&a.scope?.regions?.includes(o.region);
export const COMMERCIAL_ACTIONS={commercialDefaults:['Kế Toán Trưởng'],customerCreditDefaults:['Kế Toán Trưởng'],logisticsDemoPrepare:['Kế Toán Trưởng'],commerceActivate:['Kế Toán Trưởng'],commercialBank:['Kế Toán Trưởng'],commercialCustomer:['Kế toán','Kế Toán Trưởng'],orderCreateV2:['Sales','Sales Admin'],orderReviseV2:['Sales','Sales Admin'],orderDecisionV2:['Giám đốc Thương mại'],orderArchive:['Sales Admin'],orderRestore:['Sales Admin'],advanceAgreementCreate:['Sales','Sales Admin'],advanceAgreementLink:['Sales','Sales Admin'],paymentRequest:['Sales','Sales Admin'],invoiceIssueV2:['Kế toán'],debtCloseV2:['Kế toán'],commerceInterestPost:['Kế Toán Trưởng']};
export function customerPrice(c,p){const value=c.productPrices?.[p.id]??p.price;return money(value)}
export function commercialCredit(s,o,h){const c=s.clients.find(c=>c.name===o.customer),base=h.credit(s,o),pending=sum(s.orders.filter(x=>x.id!==o.id&&x.customer===o.customer&&x.workflow==='commercial-v2'&&['Chờ Trưởng vùng duyệt','Chờ Giám đốc Thương mại duyệt','Chờ xác nhận'].includes(x.status)),h.orderValue);return {...base,limit:Math.max(0,base.limit-Math.max(0,pending-base.funds)),funds:Math.max(0,base.funds-pending),overdue:(s.commerce?.debts||[]).some(d=>d.customer===c.name&&!d.closedAt&&d.dueDate&&d.dueDate<h.today),ok:base.funds+base.limit>=base.required+pending};}
export function applyCommercial(s,action,p,a,now,h){
 const today=h.today,identify=prefix=>h.id(s,prefix),o=s.orders.find(o=>o.id===p.id||o.id===p.orderId),customer=name=>{const c=s.clients.find(c=>c.name===name);check(c,'Chọn khách hàng hợp lệ');return c},notify=(role,reference,t)=>s.notifications.push({id:identify('TB'),role,reference,text:t,time:now});
 check(COMMERCIAL_ACTIONS[action]?.includes(a.role),'Không có quyền thực hiện thao tác');
 if(action==='orderArchive'||action==='orderRestore'){
  check(o,'Không tìm thấy đơn hàng');check(!o.delivery&&!o.invoiceId&&!s.entries.some(e=>e.orderId===o.id)&&!s.trucks.some(t=>t.order===o.id),'Đơn đã có chứng từ hoặc lịch sử giao nhận, không thể lưu trữ');
  if(action==='orderArchive'){
   if(o.archivedAt)return {id:o.id,duplicate:true};
   check(['Chờ khách xác nhận','Chờ xác nhận','Chờ Giám đốc Thương mại duyệt','Yêu cầu sửa','Từ chối'].includes(o.status),'Chỉ lưu trữ đơn chưa vận hành');
   o.archivedStatus=o.status;o.status='Đã lưu trữ';o.archivedAt=now;o.archivedBy=a.id;
  }else{check(o.archivedAt&&o.status==='Đã lưu trữ','Đơn chưa được lưu trữ');o.status=o.archivedStatus;delete o.archivedStatus;delete o.archivedAt;delete o.archivedBy;}
  (o.history||=[]).push({action,name:a.name,role:a.role,time:now});return {id:o.id};
 }
 if(action==='commercialBank'){const account=s.bankAccounts.find(x=>x.id===p.id&&x.active);check(account,'Tài khoản không tồn tại');check(/^970\d{3}$/.test(p.bin||''),'Nhập BIN NAPAS 6 chữ số');account.bin=p.bin;account.updatedBy=a.id;account.updatedAt=now;return {id:account.id};}
 if(action==='commerceActivate'){
  check(!s.commerce,'Sổ lãi hai chiều đã được khởi tạo');check(!s.orders.some(o=>o.status==='Hoàn tất'&&!o.invoiceId),'Cần lập hóa đơn/đối trừ cho các đơn đã giao trước khi chuyển sổ');check(p.confirm===true,'Xác nhận mốc bắt đầu sổ mới');
  s.commerce={start:today,rate:8,basis:365,method:'simple',approvedBy:a.id,approvedAt:now,openings:s.clients.map(c=>({customer:c.name,balance:h.principal(s,c.name)-Number(c.debt||0),debt:Number(c.debt||0)})),events:[],debts:s.clients.filter(c=>c.debt>0).map(c=>({id:identify('DN'),customer:c.name,principal:c.debt,date:today,dueDate:c.openingDebtDueDate||null,opening:true,payments:[]})),postings:[],paymentRequests:[]};return {};
 }
 if(action==='logisticsDemoPrepare'){
  const batch='gate-in-poc-v1';const existing=s.orders.filter(o=>o.testBatch===batch);if(existing.length)return {created:0,ids:existing.map(o=>o.id)};
  const clients=s.clients.filter(c=>c.contract&&Number.isInteger(c.creditTerm)).slice(0,3);check(clients.length===3,'Cần ít nhất 3 khách hàng có điều kiện thanh toán');
  const ids=[];for(let i=0;i<3;i++){const c=clients[i],product=s.products.find(x=>x.price>0&&h.available(s,x.id)>=10);check(product,'Chưa đủ tồn để chuẩn bị đơn dùng thử');const qty=2+i,value=Math.round(qty*customerPrice(c,product));check(value<=c.creditLimit-Number(c.debt||0),'Khách dùng thử chưa đủ hạn mức');const id=identify('SO'),amount=Math.round(value*.3);s.orders.push({id,testBatch:batch,testData:true,customer:c.name,customerId:c.id,region:customerRegion(c),contract:c.contract,creditTerm:c.creditTerm,date:today,lines:[{product:product.id,size:product.size||'',qty,price:customerPrice(c,product)}],product:product.id,qty,workflow:'commercial-v2',status:'Đã xác nhận',createdBy:a.id,submittedAt:now,receivedAt:now,doa:{stage:2,history:[{decision:'Chuẩn bị tình huống POC đã duyệt',by:a.id,name:a.name,at:now}]},financeClear:{by:a.id,time:now,note:'Dùng thử theo hạn mức tín dụng, chưa xác nhận nhận tiền'},advanceAgreement:{id:identify('TT'),amount,orderTotal:value,currency:'VND',expectedDate:today,createdAt:now,createdBy:a.id,status:'Khách đã xác nhận thỏa thuận',customerConfirmedAt:now,testData:true,note:'Tình huống POC khách đồng ý trả trước; chưa ghi nhận thu tiền'},history:[{action:'logisticsDemoPrepare',time:now,name:a.name,role:a.role,note:'Dữ liệu dùng thử: khách đã xác nhận thỏa thuận trả trước, chờ xe vào'}]});ids.push(id)}return {created:ids.length,ids};
 }
 if(action==='customerCreditDefaults'){
  let updated=0;for(const c of s.clients){if(c.creditLimit===500000000)continue;(c.creditLimitHistory||=[]).push({before:c.creditLimit??0,after:500000000,at:now,by:a.id,name:a.name});c.creditLimit=500000000;c.updatedAt=now;c.updatedBy=a.id;updated++}return {updated,total:s.clients.length,creditLimit:500000000};
 }
 if(action==='commercialDefaults'){
  const term=Number(p.creditTerm);check(p.creditTerm!==''&&p.creditTerm!=null&&Number.isInteger(term)&&term>=0&&term<=365,'Chọn kỳ hạn mặc định từ 0 đến 365 ngày');check(p.confirm===true,'Cần xác nhận bổ sung cấu hình');let updated=0;
  for(const c of s.clients){let changed=false;if(!c.contract?.trim()){c.contract='XB-NB-'+c.id;c.contractSource='internal-reference';changed=true}if(!Number.isInteger(c.creditTerm)){c.creditTerm=term;changed=true}if(changed){c.defaultTermsAt=now;c.defaultTermsBy=a.id;updated++}}
  return {updated,creditTerm:term};
 }
 if(action==='commercialCustomer'){
  const c=customer(p.customer),term=Number(p.creditTerm);check(Number.isInteger(term)&&term>=0&&term<=365,'Kỳ hạn từ 0 đến 365 ngày');c.creditTerm=term;c.contract=text(p.contract,'Số hợp đồng');
  if(p.openingDebtDueDate){date(p.openingDebtDueDate);c.openingDebtDueDate=p.openingDebtDueDate;const d=s.commerce?.debts.find(d=>d.customer===c.name&&d.opening);if(d){check(!(s.commerce.postings||[]).length,'Không sửa hạn nợ đầu kỳ sau khi đã ghi lãi');d.dueDate=p.openingDebtDueDate;}}
  check(p.productPrices==null||typeof p.productPrices==='object'&&!Array.isArray(p.productPrices)&&Object.keys(p.productPrices).length<=1000,'Bảng giá không hợp lệ');c.productPrices||={};for(const [code,value] of Object.entries(p.productPrices||{})){check(s.products.some(x=>x.id===code),'Mã trong bảng giá không hợp lệ');c.productPrices[code]=money(value)}return {};
 }
 if(action==='orderCreateV2'||action==='orderReviseV2'){
  const c=customer(p.customer),region=customerRegion(c);check(region,'Địa chỉ khách hàng chưa xác định được vùng');check(Number.isInteger(c.creditTerm)&&c.contract,'Kế toán cần bổ sung hợp đồng và kỳ hạn thanh toán của khách hàng');date(p.date);check(p.date>=today,'Ngày giao đã qua');check(Array.isArray(p.lines)&&p.lines.length&&p.lines.length<=100,'Đơn cần 1–100 sản phẩm');
  if(o){check(action==='orderReviseV2'&&o.createdBy===a.id&&o.status==='Yêu cầu sửa','Chỉ người tạo được sửa đơn bị yêu cầu sửa');check(o.workflow==='commercial-v2','Không sửa chứng từ cũ bằng luồng mới')}
  else check(action==='orderCreateV2','Không tìm thấy đơn cần sửa');
  const seen=new Set(),lines=p.lines.map(l=>{check(!seen.has(l.product),'Trùng mã gạch');seen.add(l.product);const product=s.products.find(x=>x.id===l.product);check(product,'Mã gạch không thuộc danh mục');const converted=l.qtyUnit==='pieces'?piecesQuantity(product.size,l.pieces??l.qty):null,qty=converted?converted.qty:Number(l.qty);check(Number.isFinite(qty)&&qty>0&&qty<=1e10&&(converted||Math.abs(qty*100-Math.round(qty*100))<1e-6),'Số lượng phải dương, tối đa 2 số lẻ');check(h.available(s,product.id,o?.id)>=qty,'Không đủ tồn khả dụng: '+product.id);return {product:product.id,size:product.size||'',qty,...(converted?{qtyUnit:'pieces',pieces:converted.pieces,pieceArea:converted.area,piecesPerBox:converted.perBox}:{}),price:customerPrice(c,product)}});
  const order={...(o||{}),id:o?.id||identify('SO'),customer:c.name,customerId:c.id,region,contract:c.contract,creditTerm:c.creditTerm,date:p.date,lines,product:lines[0].product,qty:lines[0].qty,workflow:'commercial-v2',status:'Chờ Giám đốc Thương mại duyệt',createdBy:o?.createdBy||a.id,submittedAt:o?.submittedAt||now,receivedAt:now,history:o?.history||[],doa:{stage:1,history:[...(o?.doa?.history||[]),{decision:'Gửi duyệt',by:a.id,name:a.name,at:now}]},exceptionReason:p.exceptionReason||''};
  check(Number.isSafeInteger(h.orderValue(order)),'Giá trị đơn vượt phạm vi');const credit=commercialCredit(s,order,h);check(!credit.overdue,'Khách có khoản nợ quá hạn, cần Kế toán xử lý');
  if(o)Object.assign(o,order);else s.orders.push(order);notify('Giám đốc Thương mại',order.id,'Đơn '+order.id+' chờ Giám đốc Thương mại duyệt');return {id:order.id};
 }
 if(action==='orderDecisionV2'){
  check(o?.workflow==='commercial-v2','Không tìm thấy đơn thương mại');check(canViewCommercialOrder(o,a),'Đơn ngoài phạm vi vùng được giao');const stage=o.doa.stage;check(stage===1&&o.status==='Chờ Giám đốc Thương mại duyệt'&&a.role==='Giám đốc Thương mại','Sai cấp hoặc bước phê duyệt');check(['approve','reject','revise'].includes(p.decision),'Kết quả không hợp lệ');const note=text(p.note,'Ý kiến phê duyệt');
  if(p.decision==='approve'){check(o.date>=today,'Ngày giao đã qua; yêu cầu Sales sửa và gửi lại');for(const l of o.lines)check(h.available(s,l.product,o.id)>=l.qty,'Tồn đã thay đổi: '+l.product);const c=commercialCredit(s,o,h);check(c.ok&&!c.overdue,'Tín dụng đã thay đổi hoặc có nợ quá hạn');o.doa.stage++;o.status=o.doa.stage===2?'Chờ xác nhận':'Chờ Giám đốc Thương mại duyệt';notify(o.doa.stage===2?'Sales Admin':'Giám đốc Thương mại',o.id,'Đơn '+o.id+' '+o.status)}else{o.status=p.decision==='reject'?'Từ chối':'Yêu cầu sửa';notify('Sales',o.id,'Đơn '+o.id+' '+o.status)}
  o.doa.history.push({decision:p.decision,role:a.role,by:a.id,name:a.name,at:now,note});return {id:o.id};
 }
 if(action==='advanceAgreementLink'){
  check(o?.advanceAgreement&&o.doa?.stage===2&&['Chờ xác nhận','Đã xác nhận','Đang lấy hàng'].includes(o.status),'Thỏa thuận chưa sẵn sàng');check(a.role==='Sales Admin'||o.createdBy===a.id,'Chỉ Sales phụ trách hoặc Sales Admin được tạo liên kết');const agreement=o.advanceAgreement;if(!agreement.confirmationToken||Date.parse(agreement.linkExpiresAt||0)<=Date.parse(now)){agreement.confirmationToken=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');agreement.linkExpiresAt=new Date(Date.parse(now)+7*86400000).toISOString()}return {id:agreement.id,orderId:o.id};
 }
 if(action==='advanceAgreementCreate'){
  check(o?.workflow==='commercial-v2'&&o.doa?.stage===2&&['Chờ xác nhận','Đã xác nhận','Đang lấy hàng'].includes(o.status),'Đơn chưa được Giám đốc Thương mại duyệt');
  check(a.role==='Sales Admin'||o.createdBy===a.id,'Chỉ Sales phụ trách hoặc Sales Admin tạo thỏa thuận');
  const amount=money(p.amount),total=h.orderValue(o);check(amount<=total,'Số tiền trả trước không được vượt giá trị đơn');
  const expectedDate=p.expectedDate||null;if(expectedDate){date(expectedDate);check(expectedDate>=today,'Ngày trả trước dự kiến không được trong quá khứ')}
  const note=p.note?text(p.note,'Nội dung thỏa thuận'):'';const previous=o.advanceAgreement;
  if(previous&&previous.amount===amount&&previous.expectedDate===expectedDate&&previous.note===note)return {id:previous.id,orderId:o.id,duplicate:true};
  if(previous)(o.advanceAgreementHistory||=[]).push({...previous,supersededAt:now});
  o.advanceAgreement={id:identify('TT'),purpose:'advance-agreement',orderId:o.id,customer:o.customer,amount,orderTotal:total,currency:'VND',expectedDate,note,status:'Chờ khách xác nhận thỏa thuận',createdBy:a.id,createdName:a.name,createdAt:now};
  return {id:o.advanceAgreement.id,orderId:o.id};
 }
 if(action==='paymentRequest'){
  check(s.commerce,'Khởi tạo sổ hai chiều trước khi tạo yêu cầu thanh toán');check(o?.doa?.stage===2&&['Chờ xác nhận','Đã xác nhận','Đang lấy hàng'].includes(o.status),'Đơn chưa được Giám đốc Thương mại duyệt');check(a.role==='Sales Admin'||o.createdBy===a.id,'Chỉ Sales phụ trách hoặc Sales Admin tạo QR');
  const account=s.bankAccounts.find(x=>x.id===p.accountId&&x.active);check(account&&/^970\d{3}$/.test(account.bin||'')&&/^\d{6,30}$/.test(account.number),'Tài khoản nhận phải có BIN NAPAS 6 số và số tài khoản hợp lệ');
  const existing=s.commerce.paymentRequests.find(x=>x.orderId===o.id&&!x.receiptId);if(existing)return {id:existing.id,duplicate:true};const amount=h.orderValue(o),id=identify('QR'),reference=('XB '+o.contract+' '+o.id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'D').replace(/[^A-Za-z0-9 -]/g,'').slice(0,80);s.commerce.paymentRequests.push({id,orderId:o.id,customer:o.customer,amount,accountId:account.id,bankSnapshot:{bank:account.bank,bin:account.bin,number:account.number,holder:account.holder},reference,status:'Chờ khách chuyển khoản',createdBy:a.id,createdAt:now});return {id};
 }
 check(s.commerce,'Chưa khởi tạo sổ hai chiều');const ledger=s.commerce;
 if(action==='invoiceIssueV2'){
  check(o?.status==='Hoàn tất'&&o.delivery&&!o.invoiceId,'Chỉ lập hóa đơn một lần cho đơn đã giao đủ chứng từ');check(o.pickupDate>=ledger.start,'Chứng từ trước mốc sổ mới cần xử lý ở sổ cũ');const invoice=text(p.invoice,'Số hóa đơn');check(!s.entries.some(e=>e.invoice===invoice),'Trùng số hóa đơn');check(p.confirm===true,'Xác nhận khớp phiếu giao');h.openDate(s,o.pickupDate,o.customer);
  const c=customer(o.customer);const term=o.workflow==='commercial-v2'?o.creditTerm:c.creditTerm;check(Number.isInteger(term),'Khách thiếu kỳ hạn thanh toán');const amount=h.orderValue(o),lots=s.receipts.filter(r=>r.customer===o.customer&&r.status==='Đã xác minh'&&r.date<=o.pickupDate&&r.amount>r.used).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));let remaining=amount,allocations=[];
  for(const r of lots){const used=Math.min(remaining,r.amount-r.used);if(!used)break;r.used+=used;remaining-=used;allocations.push({receipt:r.id,amount:used})}
  const id=identify('HD'),dueDate=addDays(o.pickupDate,term);s.entries.push({id,invoice,orderId:o.id,customer:o.customer,date:o.pickupDate,type:'Đối trừ',amount,interest:0,allocations,deliveryId:o.delivery.id,workflow:'commercial-v2',issuedAt:now,issuedBy:a.id});o.invoiceId=id;ledger.events.push({id,customer:o.customer,date:o.pickupDate,debit:amount,credit:0,reference:invoice,at:now,note:'Hóa đơn '+o.id});if(remaining){ledger.debts.push({id:identify('DN'),invoiceId:id,customer:o.customer,date:o.pickupDate,dueDate,principal:remaining,payments:[]});c.debt=Number(c.debt||0)+remaining}return {id};
 }
 if(action==='debtCloseV2'){
  const d=ledger.debts.find(x=>x.id===p.id);check(d&&!d.closedAt,'Khoản nợ đã đóng hoặc không tồn tại');check(d.dueDate,'Bổ sung hạn thanh toán cho dư nợ đầu kỳ');const calc=commerceCalculation(s,today,d.customer),interest=calc.debtInterest[d.id]||0,total=d.principal+interest;const lots=s.receipts.filter(r=>r.customer===d.customer&&r.status==='Đã xác minh'&&r.date<=today&&r.amount>r.used).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));check(sum(lots,r=>r.amount-r.used)>=total,'Cần đủ khoản thu đã xác minh để thanh toán cả gốc và lãi: '+total);h.openDate(s,today,d.customer);let remaining=total,allocations=[];for(const r of lots){let used=Math.min(remaining,r.amount-r.used);if(!used)break;r.used+=used;remaining-=used;allocations.push({receipt:r.id,amount:used})}d.closedAt=now;d.closedBy=a.id;d.payments.push({date:today,principal:d.principal,interest,allocations});const c=customer(d.customer);c.debt=Math.max(0,Number(c.debt||0)-d.principal);if(interest)ledger.events.push({id:identify('LAINO'),customer:d.customer,date:today,debit:interest,credit:0,interestPaid:interest,reference:d.id,at:now,note:'Lãi quá hạn đã thu; không nhập gốc'});return {id:d.id,interest};
 }
 if(action==='commerceInterestPost'){
  date(p.through);check(p.through<today&&p.through>=ledger.start,'Chỉ ghi lãi đến hết ngày đã qua, từ mốc sổ mới');const last=ledger.postings.map(x=>x.through).sort().at(-1),from=last?addDays(last,1):ledger.start;check(p.through>=from,'Khoảng lãi đã được ghi');const rows=s.clients.map(c=>{const calc=commerceCalculation(s,p.through,c.name),ss=calc.daily.filter(d=>d.date>=from);return {customer:c.name,payable:Math.round(sum(ss,d=>d.creditInterest)),receivable:Math.round(sum(ss,d=>d.debitInterest))}});ledger.postings.push({id:identify('LAI'),from,through:p.through,rows,by:a.id,at:now,rate:8,method:'simple'});return {};
 }
 throw Error('Thao tác không hợp lệ');
}
export function commerceReceiptVerified(s,r,now){if(!s.commerce)return;check(r.date>=s.commerce.start,'Khoản thu trước mốc sổ mới cần đối soát ở sổ cũ');check(!s.commerce.events.some(x=>x.receiptId===r.id),'Khoản thu đã ghi sổ');s.commerce.events.push({id:r.id,receiptId:r.id,customer:r.customer,date:r.date,debit:0,credit:r.amount,reference:r.ref,note:'Khoản thu được Kế toán xác minh',at:now});const qr=s.commerce.paymentRequests.find(x=>x.id===r.paymentRequestId);if(qr){check(!qr.receiptId,'Yêu cầu QR đã có khoản thu xác minh');check(qr.customer===r.customer&&qr.amount===r.amount&&qr.accountId===r.accountId,'Khoản thu không khớp yêu cầu QR');qr.receiptId=r.id;qr.status='Đã xác minh ngân hàng';qr.verifiedAt=now}}
export function commerceCalculation(s,through,customer){
 const l=s.commerce;check(l,'Chưa khởi tạo sổ hai chiều');date(through);check(date(through)-date(l.start)<=3660*86400000,'Khoảng tính tối đa 10 năm');const opening=l.openings.find(x=>x.customer===customer)||{balance:0},events=l.events.filter(x=>x.customer===customer&&x.date<=through).sort((a,b)=>a.date.localeCompare(b.date)||String(a.at||'').localeCompare(String(b.at||''))||a.id.localeCompare(b.id)),debts=l.debts.filter(d=>d.customer===customer),daily=[],debtInterest={};let balance=opening.balance;
 for(let d=l.start;d<=through;d=addDays(d,1)){
  balance+=sum(events.filter(e=>e.date===d),e=>e.credit-e.debit);let remaining=Math.max(0,-balance),debitInterest=0;for(const debt of [...debts].sort((a,b)=>(a.dueDate||'9999').localeCompare(b.dueDate||'9999')||a.id.localeCompare(b.id))){if(debt.date>d||!debt.dueDate||debt.dueDate>=d)continue;const paid=sum((debt.payments||[]).filter(p=>p.date<=d),p=>p.principal),base=Math.min(remaining,Math.max(0,debt.principal-paid));remaining-=base;const interest=base*.08/365;debitInterest+=interest;debtInterest[debt.id]=(debtInterest[debt.id]||0)+interest;}daily.push({date:d,balance,creditInterest:Math.max(0,balance)*.08/365,debitInterest});
 }
 return {events,daily,balance,creditInterest:Math.round(sum(daily,x=>x.creditInterest)),debitInterest:Math.round(sum(daily,x=>x.debitInterest)),debtInterest:Object.fromEntries(Object.entries(debtInterest).map(([k,v])=>[k,Math.round(v)])),missingDue:debts.filter(d=>!d.dueDate&&!d.closedAt).length};
}
export function vietQRPayload(account,amount,reference){
 check(/^970\d{3}$/.test(account.bin||'')&&/^\d{6,30}$/.test(account.number||''),'Thông tin tài khoản VietQR không hợp lệ');money(amount);check(/^[A-Za-z0-9 -]{1,80}$/.test(reference),'Nội dung VietQR không hợp lệ');const tlv=(id,v)=>{v=String(v);check(v.length<=99,'Thông tin QR quá dài');return id+String(v.length).padStart(2,'0')+v};const beneficiary=tlv('00',account.bin)+tlv('01',account.number),merchant=tlv('00','A000000727')+tlv('01',beneficiary)+tlv('02','QRIBFTTA');const data=tlv('00','01')+tlv('01','12')+tlv('38',merchant)+tlv('53','704')+tlv('54',amount)+tlv('58','VN')+tlv('62',tlv('08',reference))+'6304';let crc=0xffff;for(const ch of data){crc^=ch.charCodeAt(0)<<8;for(let i=0;i<8;i++)crc=(crc&0x8000)?((crc<<1)^0x1021)&0xffff:(crc<<1)&0xffff;}return data+crc.toString(16).toUpperCase().padStart(4,'0');
}
