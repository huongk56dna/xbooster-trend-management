import {canonicalRole,canonicalRoles} from '../public/ui/domain.mjs';
// Owner administration is distinct from the active business role.
export function trendRoleProfile(profile,requested){
 const role=canonicalRole(requested||profile.roles?.[0]||'');
 if(!canonicalRoles(profile.roles||[]).includes(role)){
  const e=new Error('Vai làm việc này chưa được cấp cho tài khoản');e.status=403;throw e;
 }
 return {...profile,owner:!!profile.readOnly,roles:[role]};
}
