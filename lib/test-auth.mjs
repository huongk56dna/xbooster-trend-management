export const TEST_COOKIE='xb_test_session';
export const TEST_USER='cmc-test';
export const TEST_ROLES=['Sales','Sales Admin','Giám đốc Thương mại','Bảo vệ','Kho','Thủ kho','Xe nâng','Kế toán'];
const enc=new TextEncoder();
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
const unhex=s=>Uint8Array.from(s.match(/../g)||[],h=>parseInt(h,16));
const base64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
export async function passwordHash(password,salt=crypto.getRandomValues(new Uint8Array(16))){const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);return hex(salt)+':'+hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},key,256));}
export async function verifyPassword(password,stored){if(typeof stored!=='string'||!/^([a-f0-9]{32}):([a-f0-9]{64})$/.test(stored)||typeof password!=='string'||password.length>200)return false;const calculated=await passwordHash(password,unhex(stored.split(':')[0]));let mismatch=0;for(let i=0;i<stored.length;i++)mismatch|=stored.charCodeAt(i)^calculated.charCodeAt(i);return mismatch===0;}
async function signingKey(secret,usage){if(typeof secret!=='string'||secret.length<32)throw Error('Test login is not configured');return crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,[usage]);}
export async function createTestSession(secret,now=Date.now()){const payload=base64(enc.encode(JSON.stringify({sub:TEST_USER,exp:now+8*60*60*1000,nonce:crypto.randomUUID()})));const sig=await crypto.subtle.sign('HMAC',await signingKey(secret,'sign'),enc.encode(payload));return payload+'.'+base64(sig);}
export async function validTestSession(token,secret,now=Date.now()){try{if(typeof token!=='string'||token.length>1000)return false;const [payload,signature,...extra]=token.split('.');if(!payload||!signature||extra.length)return false;const ok=await crypto.subtle.verify('HMAC',await signingKey(secret,'verify'),decode(signature),enc.encode(payload));if(!ok)return false;const value=JSON.parse(new TextDecoder().decode(decode(payload)));return value.sub===TEST_USER&&typeof value.exp==='number'&&value.exp>now&&value.exp<=now+8*60*60*1000;}catch{return false;}}
export function sessionCookie(value){return TEST_COOKIE+'='+value+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800';}
export function testAccount(){return {id:'cmc-test',email:'cmc-test@x-booster.test',name:'CMC Test',team:'POC',roles:[...TEST_ROLES],owner:false,testAccount:true,scope:{orgPath:'POC',managerEmail:'',area:'POC',region:'Miền Nam',areas:['POC'],regions:['Miền Bắc','Miền Trung','Miền Nam']}};}

export function sameSiteOrigin(request){const origin=request.headers.get('Origin');return origin==='https://x-booster-operations.fairypixie14.chatgpt.site'||origin===new URL(request.url).origin;}
