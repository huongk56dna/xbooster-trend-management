import {db} from './runtime';
import {validateScope,canViewSurvey} from '../public/ui/surveys.mjs';
export async function ensureScopes(){await db().prepare('CREATE TABLE IF NOT EXISTS member_scopes(email TEXT PRIMARY KEY, json TEXT NOT NULL)').run()}
export async function memberScope(email:string){await ensureScopes();const row=await db().prepare('SELECT json FROM member_scopes WHERE email = ?').bind(email.toLowerCase()).first<any>();return validateScope(row?JSON.parse(row.json):{})}
export {canViewSurvey};
