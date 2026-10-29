import {env} from 'cloudflare:workers';
export function isAdvanceBridge(req:Request){
 const expected=String((env as any).ADVANCE_CONFIRM_BRIDGE_SECRET||''),provided=req.headers.get('X-Advance-Bridge')||'';
 if(!expected||!provided)return false;
 let diff=expected.length^provided.length;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^(provided.charCodeAt(i)||0);return diff===0;
}
