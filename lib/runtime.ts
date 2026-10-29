import {testSession} from './test-session';
import {testAccount,sameSiteOrigin} from './test-auth.mjs';

import {memberScope} from './survey-access';
import {filterForProfile,filterForWorkspaceRole} from '../public/ui/state-access.mjs';
import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { initialState, normalize, ROLES, canonicalRole, canonicalRoles } from '../public/ui/domain.mjs';
export function db(){if(!env.DB)throw Error('Cơ sở dữ liệu chưa sẵn sàng');return env.DB}
export function bucket(){if(!env.BUCKET)throw Error('Kho tệp chưa sẵn sàng');return env.BUCKET}
export function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function error(e:unknown){return json({error:e instanceof Error?e.message:'Không thực hiện được thao tác'},e instanceof AuthError?e.status:400)}
export class AuthError extends Error {status:number;constructor(message:string,status:number){super(message);this.status=status}}
export async function member(){if(await testSession())return testAccount();let user=await getChatGPTUser();if(!user)throw new AuthError('Cần đăng nhập X-Booster',401);let row=await db().prepare('SELECT * FROM members WHERE id = ?').bind(user.userId).first<any>();if(!row){let invited=await db().prepare('SELECT * FROM members WHERE email = ?').bind(user.email.toLowerCase()).first<any>();if(invited){await db().prepare('UPDATE members SET id = ? WHERE id = ?').bind(user.userId,invited.id).run();row={...invited,id:user.userId}}else if(env.BOOTSTRAP_OWNER_EMAIL&&user.email.toLowerCase()===env.BOOTSTRAP_OWNER_EMAIL.toLowerCase()){await db().prepare('INSERT OR IGNORE INTO members(id,email,name,team,roles,owner) VALUES(?,?,?,?,?,1)').bind(user.userId,user.email.toLowerCase(),user.displayName,'Quản trị',JSON.stringify(ROLES)).run();row=await db().prepare('SELECT * FROM members WHERE id = ?').bind(user.userId).first<any>()}else throw new AuthError('Tài khoản chưa được phân công vai trong X-Booster',403)}return {...row,scope:await memberScope(row.email),roles:row.owner?ROLES:canonicalRoles(JSON.parse(row.roles))}}
export async function load(){await db().prepare('INSERT OR IGNORE INTO app_state(id,json,version) VALUES(?,?,0)').bind('main',JSON.stringify(initialState())).run();let row=await db().prepare('SELECT * FROM app_state WHERE id = ?').bind('main').first<any>();return {state:normalize(JSON.parse(row.json)),version:row.version}}
export function originCheck(request:Request){let origin=request.headers.get('Origin');if(origin&&!sameSiteOrigin(request))throw new AuthError('Nguồn yêu cầu không hợp lệ',403)}
export function actorFor(profile:any,role:string){role=canonicalRole(role);if(!canonicalRoles(profile.roles).includes(role))throw new AuthError('Vai này chưa được cấp cho tài khoản',403);return {id:profile.id,name:profile.name,team:profile.team,scope:profile.scope,role}}
export function filterState(state:any,profile:any){return filterForProfile(state,profile)}

export function filterWorkspaceState(state:any,profile:any,role:string){return filterForWorkspaceRole(state,profile,role)}

export async function readMember(){return member()}
