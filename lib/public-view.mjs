// Public access is a read boundary, never a member or write identity.
export function publicViewer(roles){return {id:'public-viewer',name:'Khách xem công khai',email:'',team:'',roles:[...roles],owner:true,readOnly:true,scope:{regions:['Miền Bắc','Miền Trung','Miền Nam'],areas:[],orgPath:'',region:'',area:''}}}
const privateKeys=new Set(['confirmationToken','clientDraftId','lastMutationId','gps','managerEmail','token','apiKey','object_key','legacyArchive']);
export function publicReadData(value){
 if(Array.isArray(value))return value.map(publicReadData);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!privateKeys.has(k)&&k!=='files').map(([k,v])=>[k,publicReadData(v)]));
 return value;
}
export function publicProfile(profile){return profile.readOnly?{...profile,owner:false}:profile}
