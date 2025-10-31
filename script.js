// Guru Wali Bayu - final app script (login, announcements, curhat, notulen, pembinaan, masalah, logs)
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

// storage keys
const ANN_KEY = 'gw_ann_announcements_v3';
const CURHAT_KEY = 'gw_ann_curhats_v3';
const NOTULEN_KEY = 'gw_ann_notulen_v3';
const PEMB_KEY = 'gw_ann_pembinaan_v3';
const MASALAH_KEY = 'gw_ann_masalah_v3';
const LOG_KEY = 'gw_ann_logs_v3';
const SESSION_KEY = 'gw_ann_session_v3';

function nowStr(){return new Date().toLocaleString()}
function save(key,obj){localStorage.setItem(key, JSON.stringify(obj))}
function load(key,def){try{return JSON.parse(localStorage.getItem(key))||def}catch(e){return def}}

// --- Login ---
document.addEventListener('DOMContentLoaded', ()=>{
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    const sp = document.getElementById('showPassword');
    if(sp){ sp.addEventListener('change', ()=>{ document.getElementById('password').type = sp.checked ? 'text' : 'password'; }) }

    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();
      if(u.toLowerCase()==='bayu' && p==='binapustaka'){
        localStorage.setItem(SESSION_KEY, JSON.stringify({role:'guru',user:'bayu',ts:nowStr()}));
        window.location.href='guru.html';
        return;
      }
      if(STUDENTS[u] && p==='siswa'){
        localStorage.setItem(SESSION_KEY, JSON.stringify({role:'siswa',nisn:u,name:STUDENTS[u],ts:nowStr()}));
        window.location.href = `siswa.html?nisn=${encodeURIComponent(u)}`;
        return;
      }
      alert('Login gagal — periksa username/NISN dan password.');
    });
  }

  // student page
  if(document.getElementById('pengumumanArea')){
    renderStudentAnnouncements();
    const sendBtn = document.getElementById('sendCurhat');
    const resetBtn = document.getElementById('resetCurhat');
    if(sendBtn){
      sendBtn.addEventListener('click', ()=>{
        const text = document.getElementById('curhatText').value.trim();
        if(!text) return alert('Tuliskan pesan sebelum mengirim.');
        const curhats = load(CURHAT_KEY,[]);
        const session = load(SESSION_KEY,null);
        const entry = {nisn: session?session.nisn:'unknown', name: session?session.name:'Tamu', text, ts: nowStr()};
        curhats.unshift(entry);
        save(CURHAT_KEY, curhats);
        const logs = load(LOG_KEY,[]);
        logs.unshift({type:'curhat_sent', ts: nowStr(), nisn: entry.nisn, name: entry.name, text: text});
        save(LOG_KEY, logs);
        const waText = encodeURIComponent(`Halo Pak Bayu, saya ${entry.name} (NISN: ${entry.nisn}) ingin curhat: ${text}`);
        window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank');
        alert('Pesan tersimpan dan membuka WhatsApp.');
        document.getElementById('curhatText').value = '';
      });
    }
    if(resetBtn){
      resetBtn.addEventListener('click', ()=>{ if(confirm('Bersihkan kolom curhat?')) document.getElementById('curhatText').value=''; });
    }
  }

  if(document.getElementById('viewArea')){
    window.renderAdminView = function(view){
      const area = document.getElementById('viewArea');
      if(view === 'pengumuman'){
        area.innerHTML = `
          <div class="card"><h3>✉️ Pengumuman</h3>
            <form id="announceForm">
              <textarea id="announceText" class="input" placeholder="Tulis pengumuman..."></textarea>
              <div class="row"><button class="btn" type="submit">Simpan & Umumkan</button><button id="clearAnn" class="btn ghost" type="button">Hapus Semua</button></div>
            </form>
            <div id="annList" style="margin-top:12px"></div>
          </div>`;
        document.getElementById('announceForm').addEventListener('submit', (e)=>{
          e.preventDefault();
          const text = document.getElementById('announceText').value.trim();
          if(!text) return alert('Tulis pengumuman dulu.');
          const anns = load(ANN_KEY,[]);
          anns.unshift({text, ts: nowStr()});
          save(ANN_KEY, anns);
          const logs = load(LOG_KEY,[]);
          logs.unshift({type:'announce', ts: nowStr(), user:'bayu', text});
          save(LOG_KEY, logs);
          document.getElementById('announceText').value='';
          renderAdminAnnouncements();
          alert('Pengumuman tersimpan.');
        });
        document.getElementById('clearAnn').addEventListener('click', ()=>{
          if(confirm('Hapus semua pengumuman?')){ save(ANN_KEY,[]); renderAdminAnnouncements(); alert('Semua pengumuman dihapus.'); }
        });
        renderAdminAnnouncements();
      } else if(view === 'curhat'){
        area.innerHTML = `<div class="card"><h3>💬 Curhat Siswa</h3><div id="curhatList"></div></div>`;
        renderAdminCurhats();
      } else if(view === 'notulen'){
        area.innerHTML = `<div class="card"><h3>📝 Notulen Pembinaan</h3><textarea id="notulenText" class="input" rows="6"></textarea><div class="row" style="margin-top:8px"><button id="saveNotulen" class="btn">Simpan Notulen</button><button id="clearNotulen" class="btn ghost">Hapus</button></div><div id="notulenPreview" style="margin-top:12px"></div></div>`;
        document.getElementById('saveNotulen').addEventListener('click', ()=>{ const text = document.getElementById('notulenText').value.trim(); save(NOTULEN_KEY,{text,ts:nowStr()}); alert('Notulen disimpan.'); renderAdminNotulen(); });
        document.getElementById('clearNotulen').addEventListener('click', ()=>{ if(confirm('Hapus notulen?')){ save(NOTULEN_KEY,{text:'',ts:''}); renderAdminNotulen(); alert('Notulen dihapus.'); } });
        renderAdminNotulen();
      } else if(view === 'pembinaan'){
        area.innerHTML = `<div class="card"><h3>🏫 Pembinaan</h3><textarea id="pembText" class="input" rows="4" placeholder="Catatan pembinaan..."></textarea><div class="row" style="margin-top:8px"><button id="savePemb" class="btn">Simpan Pembinaan</button></div><div id="pembList" style="margin-top:12px"></div></div>`;
        document.getElementById('savePemb').addEventListener('click', ()=>{ const text = document.getElementById('pembText').value.trim(); if(!text) return; const arr = load(PEMB_KEY,[]); arr.unshift({text,ts:nowStr()}); save(PEMB_KEY,arr); alert('Pembinaan tersimpan.'); renderAdminPemb(); });
        renderAdminPemb();
      } else if(view === 'masalah'){
        area.innerHTML = `<div class="card"><h3>⚠️ Masalah Siswa</h3><textarea id="masalahText" class="input" rows="4" placeholder="Catatan masalah siswa..."></textarea><div class="row" style="margin-top:8px"><button id="saveMasalah" class="btn">Simpan Masalah</button></div><div id="masalahList" style="margin-top:12px"></div></div>`;
        document.getElementById('saveMasalah').addEventListener('click', ()=>{ const text = document.getElementById('masalahText').value.trim(); if(!text) return; const arr = load(MASALAH_KEY,[]); arr.unshift({text,ts:nowStr()}); save(MASALAH_KEY,arr); alert('Masalah siswa tersimpan.'); renderAdminMasalah(); });
        renderAdminMasalah();
      } else if(view === 'logs'){
        area.innerHTML = `<div class="card"><h3>📜 Log Aktivitas</h3><div id="logList"></div><div class="row" style="margin-top:12px"><button id="downloadLogs" class="btn">Download CSV</button><button id="clearLogs" class="btn ghost">Hapus Log</button></div></div>`;
        renderAdminLogs();
        document.getElementById('downloadLogs').addEventListener('click', ()=>{ downloadLogsCSV(); });
        document.getElementById('clearLogs').addEventListener('click', ()=>{ if(confirm('Hapus semua log?')){ save(LOG_KEY,[]); renderAdminLogs(); alert('Log dihapus.'); } });
      }
    };

    window.renderAdminAnnouncements = function(){
      const list = load(ANN_KEY,[]);
      const el = document.getElementById('annList');
      if(!el) return;
      if(list.length===0){ el.innerHTML = '<p class="smallmuted">Belum ada pengumuman.</p>'; return; }
      el.innerHTML = list.map(a=>`<div class="ann"><small class="smallmuted">${a.ts}</small><div>${a.text}</div></div>`).join('');
    };

    window.renderAdminCurhats = function(){
      const arr = load(CURHAT_KEY,[]);
      const el = document.getElementById('curhatList');
      if(!el) return;
      if(arr.length===0){ el.innerHTML = '<p class="smallmuted">Belum ada pesan curhat.</p>'; return; }
      el.innerHTML = `<table class="table"><thead><tr><th>Waktu</th><th>Nama (NISN)</th><th>Pesan</th></tr></thead><tbody>`+arr.map(c=>`<tr><td class="smallmuted">${c.ts}</td><td>${c.name}<br><small class="smallmuted">${c.nisn}</small></td><td>${c.text}</td></tr>`).join('')+`</tbody></table>`;
    };

    window.renderAdminNotulen = function(){
      const n = load(NOTULEN_KEY,{text:'',ts:''});
      const preview = document.getElementById('notulenPreview');
      if(preview) preview.innerHTML = n.text?`<div class="card"><small class="smallmuted">Terakhir: ${n.ts}</small><div style="margin-top:8px">${n.text.replace(/\n/g,'<br>')}</div></div>`:'<p class="smallmuted">Belum ada notulen.</p>';
    };

    window.renderAdminPemb = function(){
      const arr = load(PEMB_KEY,[]);
      const el = document.getElementById('pembList');
      if(!el) return;
      el.innerHTML = arr.length?arr.map(p=>`<div class="ann"><small class="smallmuted">${p.ts}</small><div>${p.text}</div></div>`).join(''):'<p class="smallmuted">Belum ada catatan pembinaan.</p>';
    };

    window.renderAdminMasalah = function(){
      const arr = load(MASALAH_KEY,[]);
      const el = document.getElementById('masalahList');
      if(!el) return;
      el.innerHTML = arr.length?arr.map(p=>`<div class="ann"><small class="smallmuted">${p.ts}</small><div>${p.text}</div></div>`).join(''):'<p class="smallmuted">Belum ada catatan masalah siswa.</p>';
    };

    window.renderAdminLogs = function(){
      const arr = load(LOG_KEY,[]);
      const el = document.getElementById('logList');
      if(!el) return;
      if(arr.length===0){ el.innerHTML = '<p class="smallmuted">Belum ada log.</p>'; return; }
      el.innerHTML = arr.map(l=>`<div style="margin-bottom:8px"><b>${l.type}</b> — <small class="smallmuted">${l.ts}</small><div>${l.nisn?l.nisn+' / '+l.name:''}</div><div>${l.text||''}</div></div>`).join('');
    };

    window.renderAdminAnnouncements();
    window.renderAdminCurhats();
    window.renderAdminNotulen();
    window.renderAdminPemb();
    window.renderAdminMasalah();
    window.renderAdminLogs();
  }
});

function renderStudentAnnouncements(){
  const area = document.getElementById('pengumumanArea');
  const anns = load(ANN_KEY,[]);
  if(!area) return;
  if(anns.length===0){ area.textContent = 'Belum ada pengumuman.'; return; }
  area.innerHTML = anns.map(a=>`<div class="ann"><small class="smallmuted">${a.ts}</small><div>${a.text}</div></div>`).join('');
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
