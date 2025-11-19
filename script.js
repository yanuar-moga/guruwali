// =========================
// script.js - Guru Wali
// =========================

// STUDENTS: NISN -> NAMA (internal)
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
  '0139036863':'MUHAMMAD IZZA KURNIAWAN',
  '3127598392':'Muhammad Ziyya Ahlunnaza',
  '3133623151':'MUKHAMAD BAYU MAULID',
  '3130206215':'MUTIARA SILMI',
  '0136942798':'NAFISA IKLIMA AZZAHRA',
  '3138872764':'NASYATUL MAHYA',
  '0133675007':'NAUFAL HISAM PRATAMA',
  '3117519319':'NUR WANIFA'
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

    // guru
    if(u.toLowerCase() === 'bayu' && p === 'binapustaka'){
      save(SESSION_KEY, { role:'guru', user:'bayu', ts: nowStr() });
      window.location.href = 'guru.html';
      return;
    }

    // siswa (internal list)
    if(STUDENTS[u] && p === 'siswa'){
      save(SESSION_KEY, { role:'siswa', nisn: u, name: STUDENTS[u], ts: nowStr() });
      // redirect to siswa page (we will use session to load detailed data)
      window.location.href = `siswa.html`;
      return;
    }

    alert('Login gagal — periksa username/NISN dan password.');
  });
});
