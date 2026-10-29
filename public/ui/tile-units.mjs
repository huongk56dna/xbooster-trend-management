// Dimensions are centimetres; persisted order qty remains m² for stock and accounting.
export function tileUnits(size){
 const s=String(size||'').toLowerCase().trim().replace(/cm|\s/g,'').replace(/[×*]/g,'x');let dims=s.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/);
 if(!dims){const compact={'6060':[60,60],'8080':[80,80],'60120':[60,120],'3060':[30,60],'2030':[20,30],'20120':[20,120]};if(compact[s])dims=['',...compact[s]]}
 if(!dims)return null;const width=Number(dims[1]),height=Number(dims[2]);if(!(width>0&&height>0&&width<=500&&height<=500))return null;
 const area=Math.round(width*height/10000*1e6)/1e6,key=[width,height].sort((a,b)=>a-b).join('x'),perBox={'60x60':6,'80x80':4,'60x120':2}[key]||null;return {area,perBox};
}
export function piecesQuantity(size,pieces){const unit=tileUnits(size),n=Number(pieces);if(!unit)throw Error('Kích thước chưa hợp lệ để quy đổi sang m²');if(!Number.isSafeInteger(n)||n<=0||n>1e9)throw Error('Số lượng viên phải là số nguyên dương, tối đa 1 tỷ viên');return {...unit,pieces:n,qty:Math.round(n*unit.area*1e6)/1e6,fullBoxes:unit.perBox?Math.floor(n/unit.perBox):null,loosePieces:unit.perBox?n%unit.perBox:null}}
