// Guru Wali Bayu - enhanced client logic
const WA_NUMBER = '6285229399579';
const STUDENTS = {
  '0122942217':'Fathan Gustomy',
  '0133910125':'Ibtisam Arifa',
  '0138379546':'Inayati Aena',
  '0116285864':'IQBAL WICAKSONO',
  '0122823698':'IRMA NOVIANA',
  '3137605563':'MELIYA EKA NUR AFRIANI',
  '3138786854':'MUHAMAD AFKARUL ISLAM',
  '0128406125':'Muhamad Faiq Imammillah',
  '0112958192':'MUHAMAD HABIBI',
  '0135310769':'MUHAMAD REHAN FARDAN',
  '0135704989':'Muhamad Syauqi Asyrofal Khabibi',
  '0111797577':'MUHAMAD ZULMI FAKHRI',
  "0139036863":"MUHAMMAD 'IZZA KURNIAWAN",
  '3127598392':'Muhammad Ziyya Ahlunnaza',
  '3133623151':'MUKHAMAD BAYU MAULID',
  '3130206215':'MUTIARA SILMI',
  '0136942798':'NAFISA IKLIMA AZZAHRA',
  '3138872764':"NASY'ATUL MAHYA",
  '0133675007':'NAUFAL HISAM PRATAMA',
  '3117519319':'NUR WANIFA'
};

// Storage keys
const ANN_KEY = 'gw_ann_v2_announcements';
const LOG_KEY = 'gw_ann_v2_logs';
const AGREEMENT_KEY = 'gw_ann_v2_agreement';
const NOTULEN_KEY = 'gw_ann_v2_notulen';
const SESSION_KEY = 'gw_ann_v2_session';

// --- Utilities ---
function nowStr(){return new Date().toLocaleString()}
function save(key,obj){localStorage.setItem(key, JSON.stringify(obj))}
function load(key,def){try{return JSON.parse(localStorage.getItem(key))||def}catch(e){return def}}

// --- Announcements ---
function renderAnnouncements(containerId='announcements'){
  const container = document.getElementById(containerId);
  const anns = load(ANN_KEY,[]);
  if(!container) return;
  if(anns.length===0){container.innerHTML = '<p class="muted">Belum ada pengumuman.</p>'; return;}
  container.innerHTML = anns.map(a=>`<div class="ann"><small class="smallmuted">${a.ts}</small><div>${a.text}</div></div>`).join('');
}

// --- Agreement ---
function renderAgreementForStudent(){
  const box = document.getElementById('agreementBox');
  const ag = load(AGREEMENT_KEY,{text:'Belum ada kesepakatan kelas.',locked:false});
  if(!box) return;
  box.innerHTML = `<div class="agreebox"><div>${ag.text.replace(/\n/g,'<br>')}</div><div class="smallmuted" style="margin-top:6px">Status: ${ag.locked?'<b>Dikunci oleh guru</b>':'Terbuka (siswa bisa usul)'}</div></div>`;
  const actions = document.getElementById('agreeActions');
  if(actions){
    actions.innerHTML = ag.locked?'<small class="muted">Kesepakatan sudah dikunci oleh guru.</small>':'<div><textarea id="agreeProposal" rows="2" placeholder="Usulkan perubahan... (akan dikirim ke guru)"></textarea><div class="row" style="margin-top:6px"><button id="sendAgree" class="btn primary">Kirim Usulan</button></div></div>';
    const btn = document.getElementById('sendAgree');
    if(btn) btn.addEventListener('click', ()=>{
      const p = document.getElementById('agreeProposal').value.trim();
      if(!p) return alert('Tulis dulu usulan Anda.');
      // push proposal as announcement to teacher logs
      const logs = load(LOG_KEY,[]);
      logs.unshift({type:'agreement-proposal',nisn:currentSession.nisn,name:currentSession.name,ts:nowStr(),text:p});
      save(LOG_KEY,logs);
      alert('Usulan terkirim ke guru dalam log aktivitas.');
      document.getElementById('agreeProposal').value='';
    });
  }
}

function renderAgreementEditor(){
  const box = document.getElementById('agreementEditBox');
  const ag = load(AGREEMENT_KEY,{text:'Belum ada kesepakatan kelas.',locked:false});
  if(!box) return;
  box.innerHTML = `<textarea id="agreementText" rows="4">${ag.text}</textarea>`;
  document.getElementById('lockAgreement').addEventListener('click', ()=>{
    const text = document.getElementById('agreementText').value.trim();
    save(AGREEMENT_KEY,{text,locked:true});
    alert('Kesepakatan dikunci.');
    renderAgreementEditor(); renderAgreementForStudent(); renderLogs();
  });
  document.getElementById('unlockAgreement').addEventListener('click', ()=>{
    const text = document.getElementById('agreementText').value.trim();
    save(AGREEMENT_KEY,{text,locked:false});
    alert('Kesepakatan dibuka.');
    renderAgreementEditor(); renderAgreementForStudent(); renderLogs();
  });
}

// --- Notulen ---
function renderNotulenForStudent(){
  const box = document.getElementById('notulenBox');
  const n = load(NOTULEN_KEY,{text:'Belum ada notulen.'});
  if(!box) return;
  box.innerHTML = `<div>${n.text.replace(/\n/g,'<br>')}</div><div class='smallmuted' style='margin-top:6px'>Terakhir diubah: ${n.ts||'-'}</div>`;
}

function setupNotulenEditor(){
  const btn = document.getElementById('saveNotulen');
  const clear = document.getElementById('clearNotulen');
  if(btn) btn.addEventListener('click', ()=>{
    const text = document.getElementById('notulenText').value.trim();
    save(NOTULEN_KEY,{text,ts:nowStr()});
    alert('Notulen tersimpan.'); renderNotulenForStudent(); renderLogs();
  });
  if(clear) clear.addEventListener('click', ()=>{ if(confirm('Hapus notulen?')){ save(NOTULEN_KEY,{text:'Belum ada notulen.'}); alert('Notulen dihapus.'); renderNotulenForStudent(); renderLogs(); } });
}

// --- Logs ---
function renderLogs(){
  const el = document.getElementById('logs');
  const logs = load(LOG_KEY,[]);
  if(!el) return;
  if(logs.length===0){ el.innerHTML = '<p class="muted">Belum ada aktivitas.</p>'; return; }
  el.innerHTML = logs.map(l=>`<div style="margin-bottom:6px"><b>${l.type}</b> — <small class='smallmuted'>${l.ts}</small><div>${l.nisn?l.nisn+' / '+(l.name||'') : ''}</div><div style='font-size:13px'>${l.text||''}</div></div>`).join('');
}

function downloadLogsCSV(){
  const logs = load(LOG_KEY,[]);
  if(logs.length===0) return alert('Tidak ada log.');
  const header = ['type','ts','nisn','name','text','duration_seconds'];
  const rows = logs.map(l=>[l.type, l.ts, l.nisn||'', l.name||'', (l.text||'').replace(/\n/g,' '), l.duration_seconds||'']);
  const csv = [header.join(',')].concat(rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(','))).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'logs_guru_wali_bayu.csv'; a.click();
  URL.revokeObjectURL(url);
}

// --- Session & activity tracking ---
let currentSession = null;
const INACTIVITY_LIMIT = 10*60*1000; // 10 minutes
let inactivityTimer = null;

function startSession(nisn,name){
  const start = Date.now();
  currentSession = {nisn,name,start,ts:nowStr()};
  save(SESSION_KEY,currentSession);
  // add log: login
  const logs = load(LOG_KEY,[]);
  logs.unshift({type:'login',ts:nowStr(),nisn,name,text:'login'});
  save(LOG_KEY,logs);
  renderLogs();
  resetInactivity();
}

function endSession(reason='logout'){
  if(!currentSession) return;
  const end = Date.now();
  const duration = Math.round((end - currentSession.start)/1000);
  const logs = load(LOG_KEY,[]);
  logs.unshift({type:reason,ts:nowStr(),nisn:currentSession.nisn,name:currentSession.name,text:reason,duration_seconds:duration});
  save(LOG_KEY,logs);
  localStorage.removeItem(SESSION_KEY);
  currentSession = null;
  renderLogs();
  clearTimeout(inactivityTimer);
  inactivityTimer = null;
}

function resetInactivity(){
  if(inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(()=>{
    endSession('auto-logout (inactivity)');
    alert('Anda otomatis logout karena tidak aktif.'); window.location.href='index.html';
  }, INACTIVITY_LIMIT);
}

// capture activity
['click','mousemove','keydown','touchstart'].forEach(ev=>document.addEventListener(ev, ()=>{ if(load(SESSION_KEY,null)) resetInactivity(); }));

// --- Page initializations ---
document.addEventListener('DOMContentLoaded', ()=>{
  // index page
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    document.getElementById('demoBtn').addEventListener('click', ()=>{
      document.getElementById('username').value = Object.keys(STUDENTS)[0];
      document.getElementById('password').value = 'siswa';
    });
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();
      if(u.toLowerCase()==='bayu' && p==='binapustaka'){ window.location.href='guru.html'; return; }
      if(STUDENTS[u] && p==='siswa'){
        // start session and go to siswa page
        startSession(u, STUDENTS[u]);
        window.location.href = `siswa.html?nisn=${encodeURIComponent(u)}`;
        return;
      }
      alert('Login gagal — periksa username/NISN dan password.');
    });
  }

  // siswa page
  if(document.getElementById('greeting')){
    const params = new URLSearchParams(location.search);
    const nisn = params.get('nisn') || (load(SESSION_KEY,null)&&load(SESSION_KEY,null).nisn);
    const name = STUDENTS[nisn] || 'Siswa';
    document.getElementById('greeting').textContent = `Hai, ${name}!`;
    document.getElementById('nisnDisplay').textContent = `NISN: ${nisn||'-'}`;
    // set curhat link
    const waText = `Halo Pak Bayu, saya ${encodeURIComponent(name)} (NISN: ${nisn}) ingin curhat tentang...`;
    document.getElementById('curhatBtn').href = `https://wa.me/${WA_NUMBER}?text=${waText}`;
    // announce & agreement & notulen
    renderAnnouncements();
    renderAgreementForStudent();
    renderNotulenForStudent();
    // logout button behavior
    document.getElementById('logoutBtn').addEventListener('click', ()=>{ endSession('logout'); window.location.href='index.html'; });
    // when student opens curhat, log event
    document.getElementById('curhatBtn').addEventListener('click', ()=>{
      const logs = load(LOG_KEY,[]);
      logs.unshift({type:'curhat',ts:nowStr(),nisn, name, text:'open_whatsapp'});
      save(LOG_KEY,logs);
      renderLogs();
    });
  }

  // guru page
  if(document.getElementById('announceForm')){
    // render students table
    const listEl = document.getElementById('studentsList');
    listEl.innerHTML = Object.entries(STUDENTS).map(([nisn,name])=>`<div style='display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #f0f5fb'><div>${name}</div><div class='smallmuted'>${nisn}</div></div>`).join('');
    // announcements
    document.getElementById('announceForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const text = document.getElementById('announceText').value.trim();
      if(!text) return;
      const anns = load(ANN_KEY,[]);
      anns.unshift({text,ts:nowStr()});
      save(ANN_KEY,anns);
      alert('Pengumuman tersimpan.');
      document.getElementById('announceText').value='';
      renderAnnouncements('announcements');
    });
    document.getElementById('clearAnn').addEventListener('click', ()=>{ if(confirm('Hapus semua pengumuman?')){ save(ANN_KEY,[]); renderAnnouncements('announcements'); alert('Semua pengumuman dihapus.'); } });
    // agreement editor
    renderAgreementEditor();
    renderAgreementForStudent();
    // notulen
    setupNotulenEditor();
    renderNotulenForStudent();
    // logs
    renderLogs();
    document.getElementById('downloadLogs').addEventListener('click', downloadLogsCSV);
    document.getElementById('clearLogs').addEventListener('click', ()=>{ if(confirm('Hapus semua log?')){ save(LOG_KEY,[]); renderLogs(); alert('Log dihapus.'); } });
  }
});
