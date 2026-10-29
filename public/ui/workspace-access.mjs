import {orderingMenu} from './ordering-permissions.mjs';
export const SURVEY_VIEW_ROLES=['Sales','Sales Admin','Trưởng phòng','Giám đốc vùng','CEO','CFO','R&D'];
export const FINANCE_VIEW_ROLES=['Sales','Sales Admin','Kế toán','Kế Toán Trưởng'];
export const ACCOUNTING_ROLES=['Kế toán','Kế Toán Trưởng'];
export function canOpenPage(page,role){
 if(page==='home')return true;
 if(page==='surveys'||page==='trends')return SURVEY_VIEW_ROLES.includes(role);
 if(page==='finance'||page==='receipts')return FINANCE_VIEW_ROLES.includes(role);
 if(['ledger','offset','closing'].includes(page))return ACCOUNTING_ROLES.includes(role);
 if(['orders','approvals','stations','kpi'].includes(page))return orderingMenu(role).some(x=>x[0]===page);
 if(page==='inventory')return ['Sales','Sales Admin','Kho','Thủ kho','Mua hàng','Kế hoạch sản xuất'].includes(role);
 if(page==='products'||page==='customers')return !['Bảo vệ','Xe nâng'].includes(role);
 if(page==='sources')return ['Sales Admin','Kế toán','Kế Toán Trưởng'].includes(role);
 return false;
}
export const paymentMenu=role=>[['finance','payment','Tổng hợp'],['receipts','download','Khoản thu'],['ledger','grid','Sổ khách hàng'],['offset','check','Đối trừ hóa đơn'],['closing','clock','Đối soát tháng']].filter(([id])=>canOpenPage(id,role));

export function displayAvailable(state,code,except){const p=state.products.find(p=>p.id===code);if(!p)throw Error('Mã sản phẩm không tồn tại');if(Number.isFinite(p.availableStock)){const own=state.orders.find(o=>o.id===except&&['Đã xác nhận','Đang lấy hàng'].includes(o.status));return p.availableStock+(own?own.lines.filter(l=>l.product===code).reduce((n,l)=>n+Number(l.qty),0):0)}return p.stock-state.orders.filter(o=>o.id!==except&&['Đã xác nhận','Đang lấy hàng'].includes(o.status)).reduce((n,o)=>n+o.lines.filter(l=>l.product===code).reduce((a,l)=>a+Number(l.qty),0),0)}
