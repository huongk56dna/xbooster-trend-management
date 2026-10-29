import {trendRoleProfile} from '../../../../lib/trend-role.mjs';
import {trendPermissions} from '../../../../public/ui/trend-permissions.mjs';
import {readMember,member,load,json,error,AuthError} from '../../../../lib/runtime';
import {buildDashboard} from '../../../../lib/trend-analytics.mjs';
import {marketPresentation} from '../../../../lib/market-presentation.mjs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const account=await readMember(),{state,version}=await load(),query=Object.fromEntries(new URL(req.url).searchParams),profile=trendRoleProfile(account,query.role);const permissions=trendPermissions(profile);if(query.tab==='inventory'&&!permissions.inventory||query.tab==='strategy'&&!permissions.strategy)throw new AuthError('Tab nằm ngoài quyền truy cập',403);if(query.mode==='demo'){
 if(!account.owner)throw new AuthError('Chỉ chủ hệ thống được xem dữ liệu trình diễn',403);
 const demo=marketPresentation(),dashboard=buildDashboard(demo.state,profile,query,version,{presentation:true,presentationAuthorized:!!account.owner}),ids=new Set([...dashboard.groups.flatMap((g:any)=>g.surveyIds),...dashboard.forecasts.flatMap((f:any)=>f.items.flatMap((g:any)=>g.surveyIds))]);
 return json({...dashboard,presentationSummary:demo.summary,demoRecords:demo.state.surveys.filter((s:any)=>ids.has(s.id))});
 }return json(buildDashboard(state,profile,query,version))}catch(e){return error(e)}}
