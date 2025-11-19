// =========================
// script.js - Guru Wali
// =========================

// STUDENTS: NISN -> NAMA (internal)
const STUDENTS = {
  '3127835285': 'AHMAD AL IRSAD',
  '0125706212': 'ATINA AZZAH HAYATI',
  '0134806462': 'AULIA IZZATUNNISA',
  '3128107507': 'CAMELIA AZAHRA KHUMAIRA',
  '0122942217': 'FATHAN GUSTOMY',
  '0133910125': 'IBTISAM ARIFA',
  '0138379546': 'INAYATI AENA',
  '0116285864': 'IQBAL WICAKSONO',
  '0122823698': 'IRMA NOVIANA',
  '3137605563': 'MELIYA EKA NUR AFRIANI',
  '0112958192': 'MUHAMAD HABIBI',
  '0135310769': 'MUHAMAD REHAN FARDAN',
  '3138786854': 'MUHAMMAD AFKARUL ISLAM',
  '0128406125': 'MUHAMMAD FAIQ IMAMMILLAH',
  '3131601974': 'MUHAMMAD IZZA KURNIAWAN',
  '0135704989': 'MUHAMMAD SYAUQI ASYROFAL KHABIBI',
  '3127598392': 'MUHAMMAD ZIYYA AHLUNNAZA',
  '0111797577': 'MUHAMMAD ZULMI FAHKRI',
  '3133623151': 'MUKHAMAD BAYU MAULID',
  '3130206215': 'MUTIARA SILMI',
  '0136942798': 'NAFISA IKLIMA AZZAHRA',
  '3138872764': 'NASYATUL MAHYA',
  '0133675007': 'NAUFAL HISAM PRATAMA',
  '3117519319': 'NUR WANIFA',
  '0126327817': 'PUTRI AFHIKA RAMADHANI',
  '3128203315': 'RISQIA KHILMI RAMADHANI',
  '0136418034': 'SIFA NUR AFIANI',
  '0131258360': 'SYARIFAH NUR AINI',
  '3128579214': 'TSABHITA TSAMARA ZAFIRA',
  '3125348580': 'ZAHROTUL UYUN',
  '0126193041': 'ZAKIA WULAN RAMADHANI',
  '3137034568': 'ZIDNI AL CHUSNA'
};

// Storage key for session
const SESSION_KEY = 'gw_ann_session_v3';

// helper
function nowStr(){ return new Date().toLocaleString(); }
function save(key, obj){ localStorage.setItem(key, JSON.stringify(obj)); }
function load(key){ try{return JSON.parse(localStorage.getItem(key));}catch(e){return null;} }

// login form handling (on index.html)
document.addEventListener('DOMContentLoaded', ()=> {
  const loginForm = document.getElementById('loginForm');
  if(!loginForm) return;

  loginForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    // guru login
    if(u.toLowerCase() === 'bayu' && p === 'binapustaka'){
      save(SESSION_KEY, { role:'guru', user:'bayu', ts: nowStr() });
      window.location.href = 'guru.html';
      return;
    }

    // siswa login
    if(STUDENTS[u] && p === 'siswa'){
      save(SESSION_KEY, { role:'siswa', nisn: u, name: STUDENTS[u], ts: nowStr() });
      window.location.href = 'siswa.html';
      return;
    }

    alert('Login gagal — periksa username/NISN dan password.');
  });
});
