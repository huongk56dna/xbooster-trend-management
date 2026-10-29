// Read-only visitors can navigate and filter, but cannot open mutation actions.
function publicViewRefresh(){
 if(!serverProfile?.readOnly)return;
 document.body.classList.add('xb-public-readonly');
 const header=document.querySelector('header');
 if(header&&!document.getElementById('public-view-banner')){const banner=document.createElement('div');banner.id='public-view-banner';banner.innerHTML='<span>Chế độ xem công khai · Chỉ xem</span><a href="/signin-with-chatgpt?return_to=%2F">Đăng nhập để làm việc</a>';header.after(banner)}
 const mutations=/^(Tạo|Thêm|Sửa|Cập nhật|Lưu|Gửi|Duyệt|Phê duyệt|Từ chối|Hủy|Huỷ|Xóa|Xoá|Khai báo|Xác minh|Xác nhận|Đối trừ|Chốt|Lập|Áp dụng|Bổ sung|Nhập CSV|Yêu cầu|Đề xuất|Trao đổi khách|Đánh dấu|Bật thông báo|Phân tích AI|Nhận xét AI|Tạo nhận xét)/i;
 document.querySelectorAll('button').forEach(b=>{const name=b.textContent.trim().replace(/^[+✓◉↑↓\s]+/,'');if(mutations.test(name)&&!/^X[oó]a bộ lọc$/i.test(name)){b.hidden=true;b.dataset.publicBlocked='1'}});
 document.querySelectorAll('#sidebar button[onclick*="sources"],#nb-host').forEach(n=>n.hidden=true);
}
document.addEventListener('click',e=>{if(serverProfile?.readOnly&&e.target.closest('[data-public-blocked]')){e.preventDefault();e.stopImmediatePropagation()}},true);
const publicViewRender=renderContent;renderContent=function(){publicViewRender();publicViewRefresh()};
const publicViewModal=modal;modal=function(...args){publicViewModal(...args);publicViewRefresh()};
const publicViewCommand=command;command=async function(...args){if(serverProfile?.readOnly)throw Error('Chế độ chỉ xem. Vui lòng đăng nhập tài khoản được cấp quyền để chỉnh sửa.');return publicViewCommand(...args)};
publicViewRefresh();
