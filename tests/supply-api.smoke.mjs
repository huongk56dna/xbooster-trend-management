// Local-only HTTP smoke: the production URL is deliberately not configurable.
import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
const signin=await fetch(base+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=signin.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');
assert.ok(cookie,'Start the Sites local dev server with mock sign-in');
const headers={'Cookie':cookie,'Content-Type':'application/json','Origin':base};
async function current(){let r=await fetch(base+'/api/state',{headers});assert.equal(r.status,200);return r.json()}
async function post(body,extra={}){let response=await fetch(base+'/api/command',{method:'POST',headers:{...headers,...extra},body:JSON.stringify(body)});let text=await response.text();return {status:response.status,body:response.headers.get('content-type')?.includes('application/json')?JSON.parse(text):{error:text}}}
const make=(action,payload,version,role='Sales Admin')=>({action,payload,version,role,requestId:crypto.randomUUID()});
let initial=await current();assert.ok(initial.profile.owner);assert.ok(initial.profile.roles.includes('Mua hàng'));assert.ok(initial.profile.roles.includes('Kế hoạch sản xuất'));
let day=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'}),tomorrow=new Date(Date.parse(day+'T00:00:00Z')+864e5).toISOString().slice(0,10);
let created=await post(make('orderCreate',{customer:initial.state.clients[0].name,date:tomorrow,lines:initial.state.products.slice(0,2).map(p=>({product:p.id,qty:p.stock+1000}))},initial.version));assert.equal(created.status,200);
let baseline=(await current()).state,payload={source:{type:'order',orderId:created.body.result.id},requiredDate:tomorrow,note:'Local HTTP smoke: no reservation or purchase'},a=make('supplyCreate',payload,created.body.version),b=make('supplyCreate',payload,created.body.version);
let pair=await Promise.all([post(a),post(b)]);assert.deepEqual(pair.map(r=>r.status).sort(),[200,409]);let winner=pair[0].status===200?a:b,success=pair.find(r=>r.status===200),id=success.body.result.id;
let replay=await post(winner);assert.equal(replay.status,200);assert.equal(replay.body.duplicate,true);assert.equal(replay.body.result.id,id);
let duplicate=await post(make('supplyCreate',payload,replay.body.version));assert.equal(duplicate.status,200);assert.equal(duplicate.body.result.existing,true);assert.equal(duplicate.body.result.id,id);
let version=duplicate.body.version;
let wrongRole=await post(make('supplyWarehouse',{id,lines:[],note:'No permission'},version,'Mua hàng'));assert.equal(wrongRole.status,400);
let wrongStage=await post(make('supplyAssess',{id,note:'Wrong stage',needsPurchase:false},version,'Kế hoạch sản xuất'));assert.equal(wrongStage.status,400);
let crossOrigin=await post(make('supplyCancel',{id,reason:'Not allowed'},version),{Origin:'https://untrusted.invalid'});assert.equal(crossOrigin.status,403);
let unsigned=await fetch(base+'/api/state');assert.equal(unsigned.status,401);
let final=await current();assert.equal(final.state.supplyRequests.filter(r=>r.source.orderId===created.body.result.id).length,1);for(let k of ['orders','products','clients','receipts','entries','periods','trucks','bankAccounts'])assert.deepEqual(final.state[k],baseline[k],k+' changed by supply workflow');
console.log(JSON.stringify({concurrentStatuses:pair.map(r=>r.status),idempotentReplay:true,businessDuplicateLinked:true,wrongRoleRejected:true,wrongStageRejected:true,crossOriginRejected:true,authenticationRequired:true,financialAndStockUnchanged:true}));
