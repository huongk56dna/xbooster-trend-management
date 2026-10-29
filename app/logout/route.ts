import {sameSiteOrigin,TEST_COOKIE} from '../../lib/test-auth.mjs';
export async function POST(req:Request){if(!sameSiteOrigin(req))return new Response('Forbidden',{status:403});return new Response(null,{status:303,headers:{Location:'/login','Set-Cookie':TEST_COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0','Cache-Control':'no-store'}});}
