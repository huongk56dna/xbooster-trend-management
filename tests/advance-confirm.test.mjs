import test from 'node:test';import assert from 'node:assert/strict';
import {initialState,execute} from '../public/ui/domain.mjs';
import {advanceAgreementRows,findAdvanceAgreement,recordAdvanceAgreementResponse} from '../public/ui/advance-agreements.mjs';
import {visibleNotifications} from '../public/ui/notifications.mjs';
const token='a'.repeat(64),now='2026-10-28T00:00:00Z';
function fixture(){const s=initialState();s.orders=[{id:'SO',customer:'Khách hàng',status:'Đã xác nhận',workflow:'commercial-v2',createdBy:'sales',doa:{stage:2,history:[]},history:[],lines:[{product:'P',qty:10,price:100}],advanceAgreement:{id:'AG',amount:300,confirmationToken:token,linkExpiresAt:'2026-11-01T00:00:00Z',createdAt:now,status:'Chờ khách xác nhận thỏa thuận'}}];return s}
test('opening and confirming QR notify only accounting, preserve operational cash and stock, and are idempotent',()=>{
 const s=fixture(),before=structuredClone({receipts:s.receipts,entries:s.entries,products:s.products,clients:s.clients});
 assert.equal(recordAdvanceAgreementResponse(s,token,'open',now).changed,true);
 assert.equal(recordAdvanceAgreementResponse(s,token,'open',now).changed,false);
 assert.equal(s.orders[0].advanceAgreement.customerConfirmedAt,undefined);
 assert.equal(advanceAgreementRows(s.orders)[0].status,'Khách đã mở QR');
 assert.equal(recordAdvanceAgreementResponse(s,token,'confirm',now).changed,true);
 assert.equal(recordAdvanceAgreementResponse(s,token,'confirm',now).changed,false);
 assert.equal(recordAdvanceAgreementResponse(s,token,'open',now).changed,false);
 assert.equal(s.notifications.length,2);assert.equal(s.orders[0].status,'Đã xác nhận');
 assert.deepEqual({receipts:s.receipts,entries:s.entries,products:s.products,clients:s.clients},before);
 const actor={id:'accountant',role:'Kế toán'};assert.equal(visibleNotifications(s,actor).length,2);assert.equal(visibleNotifications(s,actor)[0].target.page,'finance');assert.equal(visibleNotifications(s,{id:'sales',role:'Sales'}).length,0);
 assert.equal(advanceAgreementRows(s.orders)[0].confirmedAt,now);
});
test('invalid, expired, archived and superseded QR cannot mutate state',()=>{for(const change of [s=>s.orders[0].archivedAt=now,s=>s.orders[0].advanceAgreement.linkExpiresAt=now,s=>s.orders[0].advanceAgreement.confirmationToken='b'.repeat(64),s=>s.orders[0].status='Hoàn tất']){const s=fixture();change(s);const before=structuredClone(s);assert.throws(()=>recordAdvanceAgreementResponse(s,token,'confirm',now));assert.deepEqual(s,before)}assert.throws(()=>findAdvanceAgreement(fixture(),'AG',now));assert.throws(()=>recordAdvanceAgreementResponse(fixture(),token,'received-money',now));});
test('only responsible Sales or Sales Admin can issue QR; repeated issue retains link and expiry',()=>{const s=fixture();delete s.orders[0].advanceAgreement.confirmationToken;const actor={id:'sales',name:'Sales',role:'Sales'};const r=execute(s,'advanceAgreementLink',{orderId:'SO'},actor,now);const a=r.state.orders[0].advanceAgreement;assert.match(a.confirmationToken,/^[a-f0-9]{64}$/);assert.equal(execute(r.state,'advanceAgreementLink',{orderId:'SO'},actor,now).state.orders[0].advanceAgreement.confirmationToken,a.confirmationToken);assert.throws(()=>execute(s,'advanceAgreementLink',{orderId:'SO'},{...actor,id:'other'},now));assert.throws(()=>execute(s,'advanceAgreementLink',{orderId:'SO'},{...actor,role:'Kế toán'},now));});
