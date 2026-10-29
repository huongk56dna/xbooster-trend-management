(function () {
  const root = document.documentElement;
  const svg = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const paths = {
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>', back:'<path d="M20 12H4m7-7-7 7 7 7"/>',
    settings:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    plus:'<path d="M12 4v16M4 12h16"/>', download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    refresh:'<path d="M20 7V3l-3 3a8 8 0 1 0 3 10M20 3h-5"/>',
    view:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    book:'<path d="M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Zm0 0v16"/>',
    check:'<path d="m5 12 4 4L19 6"/>', edit:'<path d="m16 3 5 5-12 12-6 1 1-6L16 3Z"/>'
  };
  function button(id,label,kind){const b=document.createElement('button');b.id=id;b.type='button';b.className='mobile-control';b.setAttribute('aria-label',label);b.title=label;b.innerHTML=svg(paths[kind]);return b;}
  const header=document.querySelector('header'),sidebar=document.getElementById('sidebar');
  const menu=button('mobile-menu','Mở menu','menu'),settings=button('mobile-settings','Vai làm việc và ngôn ngữ','settings'),close=button('mobile-menu-close','Đóng menu','close');
  menu.setAttribute('aria-controls','sidebar');menu.setAttribute('aria-expanded','false');
  settings.setAttribute('aria-controls','mobile-account-panel');settings.setAttribute('aria-expanded','false');
  header.prepend(menu);header.append(settings);header.querySelector('.header-right').id='mobile-account-panel';
  const backdrop=document.createElement('button');backdrop.id='mobile-nav-backdrop';backdrop.type='button';backdrop.setAttribute('aria-label','Đóng menu');backdrop.tabIndex=-1;document.body.append(backdrop);
  let returnFocus=null;
  function setMenu(open){document.body.classList.toggle('mobile-nav-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Đóng menu':'Mở menu');sidebar.inert=root.classList.contains('compact-ui')&&!open;if(open){returnFocus=document.activeElement;document.body.classList.remove('mobile-settings-open');settings.setAttribute('aria-expanded','false');close.focus();}else if(returnFocus){menu.focus();returnFocus=null;}}
  menu.onclick=()=>setMenu(!document.body.classList.contains('mobile-nav-open'));close.onclick=backdrop.onclick=()=>setMenu(false);
  settings.onclick=()=>{setMenu(false);const open=document.body.classList.toggle('mobile-settings-open');settings.setAttribute('aria-expanded',String(open));if(open)header.querySelector('select')?.focus();};
  sidebar.addEventListener('click',e=>{if(e.target.closest('button')!==close&&e.target.closest('button'))setMenu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);document.body.classList.remove('mobile-settings-open');settings.setAttribute('aria-expanded','false');settings.focus();}if(e.key==='Tab'&&document.body.classList.contains('mobile-nav-open')){const nodes=[...sidebar.querySelectorAll('button:not([hidden]),a[href],select')].filter(n=>n.getClientRects().length&&!n.disabled);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  document.addEventListener('click',e=>{if(!header.contains(e.target)){document.body.classList.remove('mobile-settings-open');settings.setAttribute('aria-expanded','false')}});
  function decorate(){
    if(close.parentNode!==sidebar)sidebar.prepend(close);
    sidebar.inert=root.classList.contains('compact-ui')&&!document.body.classList.contains('mobile-nav-open');
    document.querySelectorAll('#app table,#modalbody table').forEach(table=>{
      table.classList.add('mobile-card-table');const labels=[...table.querySelectorAll('thead th')].map(h=>h.textContent.trim());
      table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{if(cell.dataset.label!==labels[i])cell.dataset.label=labels[i]||'';cell.classList.toggle('mobile-cell-action',!labels[i]||!!cell.querySelector('input,select,textarea'));}));
    });
    document.querySelectorAll('#app .titlebar button,#app .market-heading button,#app .ops-heading button,#app .market-filter-actions button,#app .supply-filter-actions button,#app .ops-catalog-filters button,#app .filters button,#app .supply-toolbar button,#app .tablewrap td button,#app .supply-inbox button').forEach(b=>{
      if(b.dataset.mobileIcon)return;const label=b.textContent.trim();let kind;
      if(/^←|quay lại|trở về/i.test(label))kind='back';else if(/tìm kiếm|search/i.test(label))kind='search';else if(/xóa bộ lọc|clear filter/i.test(label))kind='close';else if(/xuất|export|tải bản sao/i.test(label))kind='download';else if(/tải lại|refresh/i.test(label))kind='refresh';else if(/sổ khách|mở sổ/i.test(label))kind='book';else if(/chi tiết|xem phiếu|xem \/|xem\/|kiểm tra/i.test(label))kind='view';else if(/^\+|tạo khảo sát|tạo đơn|khai báo/i.test(label))kind='plus';else if(/^cập nhật$/i.test(label))kind='edit';
      if(!kind)return;b.dataset.mobileIcon=kind;b.setAttribute('aria-label',b.getAttribute('aria-label')||label);b.title=label;const span=document.createElement('span');span.className='mobile-button-label';while(b.firstChild)span.append(b.firstChild);b.append(span);const icon=document.createElement('span');icon.className='mobile-button-icon';icon.innerHTML=svg(paths[kind]);b.prepend(icon);b.classList.add('mobile-icon-action');
    });
  }
  let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{observer.disconnect();decorate();observer.observe(document.body,{childList:true,subtree:true});scheduled=false;});};
  const observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('xb-device-change',()=>{if(!root.classList.contains('compact-ui'))setMenu(false);schedule()});
  window.addEventListener('hashchange',()=>setMenu(false));decorate();
})();
