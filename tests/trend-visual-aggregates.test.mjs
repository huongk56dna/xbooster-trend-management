import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState} from '../public/ui/domain.mjs';
import {buildDashboard} from '../lib/trend-analytics.mjs';
import {forecastAttributes} from '../lib/trend-workspace.mjs';
const filters={fromDate:'2026-10-01',toDate:'2026-10-27'};
const survey=(id,extra={})=>({id,date:'2026-10-20',status:'Đã lưu',salesId:'me',customerId:'C1',customer:'A',productCode:id,productName:id,brand:'Tiles',type:'Gạch lát nền',effect:'Vân đá marble',size:'60x120',surface:'Mờ',ownership:'company',topics:['Mẫu mã / xu hướng'],scope:{region:'Miền Bắc'},region:'Miền Bắc',...extra});
test('donut counts each interested survey once and average includes models without interest',()=>{const s=initialState();s.surveys=[survey('marble'),survey('wood',{effect:'Vân gỗ',surface:'Bóng'}),survey('decor',{effect:'Họa tiết terrazzo'}),survey('gloss',{effect:'',surface:'Bóng'}),survey('unknown',{effect:'',surface:''}),survey('price',{topics:['Giá bán']}),survey('foreign',{salesId:'other'}),survey('sample',{sample:true})];const d=buildDashboard(s,{id:'me',roles:['Sales']},filters);assert.equal(d.interestDistribution.reduce((n,g)=>n+g.count,0),5);assert.equal(d.interestDistribution.length,5);assert.equal(d.kpis.modelCount,6);assert.equal(d.kpis.averageInterest,.8);assert.deepEqual(d.forecasts,[])});
test('empty data yields no donut slices and null averages',()=>{const d=buildDashboard(initialState(),{id:'nobody',roles:['Sales']},filters);assert.deepEqual(d.interestDistribution,[]);assert.equal(d.kpis.averageInterest,null);assert.equal(d.kpis.modelCount,0)});
test('radar is weighted, bounded, handles missing data and normalizes millimeter sizes',()=>{const rows=[{name:'Marble trắng',effect:'Vân đá marble',surface:'Mờ',size:'600 × 1200 mm',score:75},{name:'Gỗ',effect:'Vân gỗ',surface:'Bóng',size:'20 × 120 cm',score:25}];const axes=forecastAttributes(rows);assert.deepEqual(axes.map(a=>a.value),[75,75,75,75]);assert.ok(axes.every(a=>a.value>=0&&a.value<=100));assert.ok(forecastAttributes([]).every(a=>a.value===null));assert.ok(forecastAttributes([{score:100}]).every(a=>a.value===0));assert.deepEqual(forecastAttributes([{...rows[0],score:0}]).map(a=>a.value),[null,null,null,null])});
test('strategic signals honor region scope',()=>{const s=initialState();s.surveys=[survey('north',{effect:'Vân đá marble trắng'}),survey('south',{scope:{region:'Miền Nam'},region:'Miền Nam',surface:'Bóng',effect:'Vân gỗ',size:'20x120'})];const d=buildDashboard(s,{id:'manager',roles:['Giám đốc vùng'],scope:{regions:['Miền Bắc']}},filters);assert.ok(d.forecasts.every(f=>f.attributes.length===4));assert.ok(d.forecasts.every(f=>f.attributes.every(a=>a.value===100)));assert.equal(d.interestDistribution.length,1)});

test('regional stock separates three regions, includes zero and preserves missing observations',async()=>{
 const {regionalInventory}=await import('../lib/trend-workspace.mjs');
 const result=regionalInventory([{region:'Miền Bắc',company:0,competitor:null},{region:'Miền Bắc',company:20,competitor:10},{region:'Miền Trung',company:null,competitor:0},{region:'',company:999,competitor:999}]);
 assert.deepEqual(result,[{region:'Miền Bắc',company:20,competitor:10,stores:2},{region:'Miền Trung',company:null,competitor:0,stores:1},{region:'Miền Nam',company:null,competitor:null,stores:0}]);
});
