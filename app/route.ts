import markup from '../public/ui/index.html?raw';

import {testSession} from '../lib/test-session';
export const dynamic='force-dynamic';
export async function GET(){if(!await testSession())return new Response(null,{status:303,headers:{Location:'/login','Cache-Control':'no-store'}});return new Response(markup,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}})}
