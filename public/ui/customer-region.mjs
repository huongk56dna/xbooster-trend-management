const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
// Includes former province names used in existing customer addresses.
const provinces={
 'Miền Bắc':'Hà Nội|Hà Giang|Cao Bằng|Bắc Kạn|Tuyên Quang|Lào Cai|Điện Biên|Lai Châu|Sơn La|Yên Bái|Hòa Bình|Thái Nguyên|Lạng Sơn|Quảng Ninh|Bắc Giang|Phú Thọ|Vĩnh Phúc|Bắc Ninh|Hải Dương|Hải Phòng|Hưng Yên|Thái Bình|Hà Nam|Nam Định|Ninh Bình',
 'Miền Trung':'Thanh Hóa|Nghệ An|Hà Tĩnh|Quảng Bình|Quảng Trị|Thừa Thiên Huế|Huế|Đà Nẵng|Quảng Nam|Quảng Ngãi|Bình Định|Phú Yên|Khánh Hòa|Ninh Thuận|Bình Thuận|Kon Tum|Gia Lai|Đắk Lắk|Đắk Nông|Lâm Đồng',
 'Miền Nam':'Hồ Chí Minh|HCM|TPHCM|Sài Gòn|Thủ Đức|Bình Phước|Tây Ninh|Bình Dương|Đồng Nai|Bà Rịa Vũng Tàu|Vũng Tàu|Long An|Tiền Giang|Bến Tre|Trà Vinh|Vĩnh Long|Đồng Tháp|An Giang|Kiên Giang|Cần Thơ|Hậu Giang|Sóc Trăng|Bạc Liêu|Cà Mau'
};
export function regionFromAddress(address){const parts=String(address||'').split(/[,;\n/]/).map(norm).reverse();for(const part of parts){let found='',length=0;for(const [region,names] of Object.entries(provinces))for(const name of names.split('|')){const alias=norm(name),matches=part===alias||['tp','thanh pho','tinh'].some(prefix=>part===prefix+' '+alias||part.endsWith(' '+prefix+' '+alias));if(matches&&alias.length>length){found=region;length=alias.length}}if(found)return found}return ''}
export function customerRegion(c){return regionFromAddress(c?.address)||(['Miền Bắc','Miền Trung','Miền Nam'].includes(c?.region)?c.region:'')}
