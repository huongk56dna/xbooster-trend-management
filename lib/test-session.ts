import {headers} from 'next/headers';
import {env} from 'cloudflare:workers';
import {TEST_COOKIE,validTestSession} from './test-auth.mjs';
export async function testSession(){const h=await headers(),cookie=h.get('cookie')||'',value=cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(TEST_COOKIE+'='))?.slice(TEST_COOKIE.length+1);return validTestSession(value,(env as any).TEST_SESSION_SECRET);}
