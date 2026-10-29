// Isolated, deterministic demonstration data. Never written to app_state.
import {initialState} from '../public/ui/domain.mjs';
export const PRESENTATION_BATCH='tile-market-overview-v1';
const specs=[
 ['Gạch lát nền','Vân đá marble trắng','60 × 120 cm','Men bóng','marble','Porcelain Calacatta',1.8],
 ['Gạch lát nền','Vân xi măng xám','60 × 60 cm','Men mờ','stone','Porcelain Cement',-.45],
 ['Gạch lát nền','Vân gỗ sồi','20 × 120 cm','Men mờ','wood','Oak Wood',.7],
 ['Gạch ốp tường','Vân đá travertine kem','30 × 60 cm','Men mờ','beige','Travertine Ivory',1.1],
 ['Gạch ốp tường','Vân đá onyx','40 × 80 cm','Men bóng','marble','Onyx Pearl',.35],
 ['Gạch sân vườn','Vân đá tự nhiên','60 × 60 cm','Bề mặt nhám','stone','Outdoor Stone',1.25],
 ['Gạch sân vườn','Vân đá slate','30 × 60 cm','Bề mặt nhám','black','Slate Graphite',.4],
 ['Gạch trang trí','Họa tiết terrazzo','20 × 20 cm','Men mờ','terrazzo','Terrazzo Decor',.8],
 ['Gạch trang trí','Họa tiết hình học','20 × 20 cm','Men mờ','beige','Geometry Decor',-.35],
 ['Gạch khổ lớn','Vân đá marble xám','80 × 160 cm','Men bóng','marble','Marble Grand',2.2],
 ['Gạch khổ lớn','Vân đá limestone be','100 × 100 cm','Men mờ','beige','Limestone Sand',1.6],
 ['Gạch lát nền','Vân đá đen tia trắng','80 × 80 cm','Men bóng','black','Nero Stone',-.3]
];
export function marketPresentation(asOf=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'})){
 const state=initialState(),regions=['Miền Bắc','Miền Trung','Miền Nam'],cities=[['Hà Nội','Hải Phòng','Bắc Ninh','Quảng Ninh'],['Đà Nẵng','Huế','Khánh Hòa','Quảng Nam'],['TP.HCM','Đồng Nai','Cần Thơ','Bình Dương']],names=['An Phú','Minh Thành','Hoàng Gia','Tân Phát','Hưng Thịnh','Đông Phương','Gia Hưng','Đại Phúc','Nam Việt','Thiên Phúc','Vạn Thành','Bình Minh'];
 state.clients=Array.from({length:72},(_,i)=>({id:'TD-KH-'+String(i+1).padStart(3,'0'),name:['Đại lý ','Showroom ','Trung tâm VLXD '][i%3]+names[Math.floor(i/3)%12]+' '+String(Math.floor(i/36)+1),address:cities[i%3][Math.floor(i/3)%4],region:regions[i%3],channel:Math.floor(i/3)%3===0?'distributor':'retailer',creditLimit:0,debt:0,sample:true,presentationOnly:true}));
 state.products=specs.map((p,i)=>({id:'TD-SP-'+String(i+1).padStart(3,'0'),name:p[5],brand:'Thương hiệu công ty',type:p[0],effect:p[1],size:p[2],surface:p[3],style:p[4],stock:240+((i*743)%3700),price:0,sample:true,presentationOnly:true}));
 let seed=72853;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),anchor=new Date(asOf+'T00:00:00Z'),sales=['Nguyễn Minh Anh','Trần Hoàng Nam','Lê Thu Hà','Phạm Quốc Bảo','Đỗ Bảo Ngọc','Vũ Hải Long'];let seq=0;
 for(let month=23;month>=0;month--){const start=new Date(Date.UTC(anchor.getUTCFullYear(),anchor.getUTCMonth()-month,1)),last=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate(),limit=month===0?anchor.getUTCDate():last;
  for(let j=0;j<specs.length;j++){const spec=specs[j],count=Math.max(4,Math.round((7+(23-month)*spec[6]+(j%4)*2)*(month===0?.9:1)));for(let k=0;k<count;k++){
   const client=state.clients[Math.floor(random()*state.clients.length)],own=random()<.65?'company':random()<.9?'competitor':'unknown',brand=own==='company'?'Thương hiệu công ty':own==='competitor'?['Thương hiệu A','Thương hiệu B','Thương hiệu C'][Math.floor(random()*3)]:'Chưa xác định',code=own==='company'?state.products[j].id:own==='competitor'?'TD-DT-'+brand.at(-1)+'-'+String(j+1).padStart(3,'0'):'',d=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth(),1+Math.floor(random()*limit))).toISOString().slice(0,10),time=d+'T'+String(8+(seq%10)).padStart(2,'0')+':'+String(seq%60).padStart(2,'0')+':00+07:00',salesIndex=(regions.indexOf(client.region)*2+seq%2),interest=random()<.81,qty=interest&&random()>.13?Math.round((80+random()*1400)/10)*10:null,photo={url:'/samples/tile-'+spec[4]+'.svg',name:'Bề mặt gạch trình diễn',sample:true,type:'image/svg+xml'};
   state.surveys.push({id:'TD-KS-'+String(++seq).padStart(6,'0'),customerId:client.id,customer:client.name,customerAddress:client.address,region:client.region,scope:{orgPath:'Kinh doanh/'+client.region,area:client.address,region:client.region},date:d,created:time,submitted:time,updatedAt:time,status:'Đã lưu',revision:1,salesId:'TD-SALES-'+salesIndex,sales:sales[salesIndex],team:'Kinh doanh '+client.region,productCode:code,product:code||spec[5],productName:spec[5],brand,ownership:own,type:spec[0],effect:spec[1],size:spec[2],surface:spec[3],style:spec[4],topics:interest?['Mẫu mã / xu hướng',...(random()<.6?['Nhu cầu mua hàng']:[])]:['Giá bán','Chất lượng sản phẩm'],qty,companyStock:random()<.1?null:Math.round(random()*600/10)*10,competitorStock:random()<.13?null:Math.round(random()*450/10)*10,note:['Đại lý ưu tiên vân nhẹ, dễ phối màu và ít đường ron.','Quan tâm khả năng giao đồng lô, đồng tông màu cho công trình.','Khách so sánh quy cách, bề mặt men và thời gian giao hàng.','Đề nghị bổ sung tấm mẫu để duyệt thiết kế tại công trình.'][seq%4],photos:[photo],sample:true,presentationOnly:true,sampleBatch:PRESENTATION_BATCH,source:'Dữ liệu trình diễn độc lập'});
  }}
 }
 return {state,summary:{surveys:state.surveys.length,customers:state.clients.length,companyProducts:state.products.length,types:new Set(specs.map(s=>s[0])).size,regions:3,months:24,asOf}};
}
