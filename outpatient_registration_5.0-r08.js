(function(){
'use strict';
const KEY='VCT_OUTPATIENT_REG_V1';
const AUDIT='VCT_OUTPATIENT_AUDIT_V1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(a){localStorage.setItem(KEY,JSON.stringify(a.slice(0,2000)))}
function audit(action,data){let a=[];try{a=JSON.parse(localStorage.getItem(AUDIT)||'[]')}catch(e){};a.unshift({id:'OA'+Date.now(),time:new Date().toISOString(),action,data});localStorage.setItem(AUDIT,JSON.stringify(a.slice(0,5000)))}
function now(){const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
function nextNo(){const d=new Date();const p=d.getFullYear().toString()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');let n=Number(localStorage.getItem('VCT_REG_SEQ_'+p)||0)+1;localStorage.setItem('VCT_REG_SEQ_'+p,n);return 'M'+p+'-'+String(n).padStart(4,'0')}
function ensureNav(){
 const nav=$('nav'); if(!nav||$('vctOutpatientNav'))return;
 const b=document.createElement('button');b.id='vctOutpatientNav';b.dataset.v='outpatient';b.textContent='🏥 门诊登记/叫号';nav.insertBefore(b,nav.children[1]||null);
 const sec=document.createElement('section');sec.id='outpatient';sec.className='view';sec.innerHTML=`
 <div class="card"><h2>🏥 门诊登记 / 分诊 / 叫号工作台</h2><p class="muted">前台负责登记、建档、预约、分诊与队列；医生进入病例后完成亲自诊疗记录。登记信息与正式病历分层保存，避免把前台操作误当作医疗文书。</p></div>
 <div class="grid">
  <div class="card"><h3>① 快速登记</h3>
   <div class="two"><label>就诊时间<input id="opTime" type="datetime-local" value="${now()}"></label><label>就诊类型<select id="opType"><option>初诊</option><option>复诊</option><option>急诊</option><option>转诊</option><option>体检</option><option>疫苗</option><option>驱虫</option><option>美容/护理</option></select></label></div>
   <div class="two"><label>病历号<input id="opMrn" placeholder="留空自动生成"></label><label>来源<select id="opSource"><option>到店</option><option>电话</option><option>微信/小程序</option><option>线上预约</option><option>转诊</option><option>其他</option></select></label></div>
   <div class="two"><label>宠物姓名<input id="opPet"></label><label>主人姓名<input id="opOwner"></label></div>
   <div class="two"><label>手机号<input id="opPhone" inputmode="tel"></label><label>物种<select id="opSpecies"><option>犬</option><option>猫</option><option>兔/啮齿类</option><option>鸟类</option><option>爬宠/龟鳖</option><option>其他</option></select></label></div>
   <div class="two"><label>品种<input id="opBreed"></label><label>性别<select id="opSex"><option>雄</option><option>雌</option><option>雄性绝育</option><option>雌性绝育</option><option>未知</option></select></label></div>
   <div class="two"><label>年龄<input id="opAge" placeholder="如 8岁"></label><label>体重 kg<input id="opWeight" type="number" step=".01"></label></div>
   <div class="two"><label>毛色<input id="opCoat"></label><label>预约时间<input id="opAppt" type="datetime-local"></label></div>
   <label>主诉/来诊目的<textarea id="opChief" style="min-height:82px"></textarea></label>
   <div class="two"><label>接诊医生<select id="opVet"><option value="">待分诊</option><option>主诊兽医</option><option>值班兽医</option><option>其他执业兽医</option></select></label><label>优先级<select id="opPriority"><option>普通</option><option>优先</option><option>急诊</option><option>危急</option></select></label></div>
   <div class="checklist"><label><input type="checkbox" id="opNewOwner"> 新客户</label><label><input type="checkbox" id="opConsent"> 已完成基础隐私/就诊告知</label></div>
   <button class="primary" id="opRegister">登记并进入候诊队列</button> <button class="secondary" id="opReset">清空</button>
   <div id="opMsg"></div>
  </div>
  <div class="card"><h3>② 今日候诊队列</h3>
   <div class="toolbar"><input id="opSearch" placeholder="宠物/主人/手机号/病历号"><select id="opFilter"><option value="全部">全部</option><option>候诊</option><option>已叫号</option><option>接诊中</option><option>已完成</option><option>已取消</option></select><button class="secondary" id="opRefresh">刷新</button></div>
   <div id="opQueue"></div>
  </div>
 </div>
 <div class="card"><h3>③ 登记记录 / 合规留痕</h3><div id="opDetail" class="muted">点击队列中的记录查看完整登记信息。</div></div>`;
 document.querySelector('main').insertBefore(sec,document.querySelector('main').firstElementChild);
 b.onclick=()=>{document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));sec.classList.add('active');nav.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()};
}
function form(){return {id:'REG'+Date.now(),mrn:($('opMrn').value||'').trim()||nextNo(),time:$('opTime').value||now(),type:$('opType').value,source:$('opSource').value,pet:$('opPet').value.trim(),owner:$('opOwner').value.trim(),phone:$('opPhone').value.trim(),species:$('opSpecies').value,breed:$('opBreed').value.trim(),sex:$('opSex').value,age:$('opAge').value.trim(),weight:$('opWeight').value,coat:$('opCoat').value.trim(),appointment:$('opAppt').value,chief:$('opChief').value.trim(),vet:$('opVet').value,priority:$('opPriority').value,newOwner:$('opNewOwner').checked,basicConsent:$('opConsent').checked,status:'候诊',createdAt:new Date().toISOString(),operator:'前台/当前登录账号待接入'}}
function reset(){['opMrn','opPet','opOwner','opPhone','opBreed','opAge','opWeight','opCoat','opAppt','opChief'].forEach(id=>{if($(id))$(id).value=''});$('opTime').value=now();$('opVet').value='';$('opPriority').value='普通';$('opNewOwner').checked=false;$('opConsent').checked=false}
function render(){const arr=load();const q=($('opSearch')?.value||'').trim().toLowerCase();const f=$('opFilter')?.value||'全部';const today=new Date().toISOString().slice(0,10);let rows=arr.filter(x=>String(x.time).slice(0,10)===today);if(f!=='全部')rows=rows.filter(x=>x.status===f);if(q)rows=rows.filter(x=>[x.pet,x.owner,x.phone,x.mrn,x.chief].join('|').toLowerCase().includes(q));rows.sort((a,b)=>{const rank={危急:0,急诊:1,优先:2,普通:3};return (rank[a.priority]??9)-(rank[b.priority]??9)||String(a.time).localeCompare(String(b.time))});const out=$('opQueue');if(!out)return;if(!rows.length){out.innerHTML='<div class="muted">今日暂无匹配登记。</div>';return}out.innerHTML='<table><thead><tr><th>序号</th><th>宠物/主人</th><th>类型</th><th>优先级</th><th>医生</th><th>状态</th><th>操作</th></tr></thead><tbody>'+rows.map((x,i)=>`<tr><td>${i+1}</td><td><b>${esc(x.pet||'未填')}</b><br><span class="muted">${esc(x.owner||'')} · ${esc(x.mrn)}</span></td><td>${esc(x.type)}<br><span class="muted">${esc(x.time).replace('T',' ')}</span></td><td>${esc(x.priority)}</td><td>${esc(x.vet||'待分诊')}</td><td><span class="pill">${esc(x.status)}</span></td><td><button class="secondary" data-act="detail" data-id="${x.id}">详情</button> <button class="secondary" data-act="call" data-id="${x.id}">叫号</button> <button class="primary" data-act="start" data-id="${x.id}">进入接诊</button></td></tr>`).join('')+'</tbody></table>'}
function detail(x){$('opDetail').innerHTML=`<div class="info"><b>${esc(x.pet||'未填')} · ${esc(x.mrn)}</b><br>主人：${esc(x.owner)}　电话：${esc(x.phone)}<br>物种：${esc(x.species)}　品种：${esc(x.breed)}　性别：${esc(x.sex)}　年龄：${esc(x.age)}　体重：${esc(x.weight)} kg　毛色：${esc(x.coat)}<br>就诊：${esc(x.type)} / ${esc(x.source)} / ${esc(x.time).replace('T',' ')}<br>主诉：${esc(x.chief)||'未填写'}<br>医生：${esc(x.vet||'待分诊')}　优先级：${esc(x.priority)}　状态：${esc(x.status)}<br>登记人：${esc(x.operator)}　登记时间：${esc(x.createdAt)}<br>基础告知：${x.basicConsent?'已勾选':'未勾选'}<br><small>说明：登记记录用于就诊流程管理；正式诊断、处方和医疗意见应由依法执业的兽医在病例中完成。</small></div>`}
function update(id,status){const a=load(),x=a.find(z=>z.id===id);if(!x)return;if(status==='接诊中'){x.status=status;openCase(x)}else{x.status=status;save(a);audit('QUEUE_STATUS',{id,status,mrn:x.mrn});render();detail(x)}}
function openCase(x){
 const ids={caseId:x.mrn,caseSpecies:x.species,caseBreed:x.breed,caseAge:x.age,caseSex:x.sex,caseWeight:x.weight,casePetName:x.pet,caseOwner:x.owner,casePhone:x.phone,caseChief:x.chief};Object.entries(ids).forEach(([id,v])=>{if($(id))$(id).value=v||''});
 if($('caseArchivePanel')){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$('case').classList.add('active');document.querySelectorAll('#nav button').forEach(v=>v.classList.toggle('active',v.dataset.v==='case'));}
 const a=load(),y=a.find(z=>z.id===x.id);if(y)y.status='接诊中';save(a);audit('START_ENCOUNTER',{id:x.id,mrn:x.mrn});render();
}
function bind(){
 $('opRegister').onclick=()=>{const x=form();if(!x.pet||!x.owner){$('opMsg').innerHTML='<div class="bad">至少填写宠物姓名和主人姓名后再登记。</div>';return}if(x.type==='急诊'||x.priority==='急诊'||x.priority==='危急')x.priority=x.priority==='普通'?'急诊':x.priority;const a=load();a.unshift(x);save(a);audit('REGISTER',{id:x.id,mrn:x.mrn,type:x.type,priority:x.priority,operator:x.operator});$('opMsg').innerHTML=`<div class="good">登记成功：<b>${esc(x.mrn)}</b>，已进入“候诊”队列。</div>`;detail(x);render()};
 $('opReset').onclick=reset;$('opRefresh').onclick=render;$('opSearch').oninput=render;$('opFilter').onchange=render;
 $('opQueue').onclick=e=>{const b=e.target.closest('button');if(!b)return;const x=load().find(z=>z.id===b.dataset.id);if(!x)return;if(b.dataset.act==='detail')detail(x);if(b.dataset.act==='call'){update(x.id,'已叫号')}if(b.dataset.act==='start'){update(x.id,'接诊中')}};
}
function init(){ensureNav();bind();render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.VCTOutpatient={load,save,audit,render};
})();
