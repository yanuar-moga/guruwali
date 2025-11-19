// ===============================
//  Aplikasi Guru Wali - SCRIPT JS
// ===============================

// --- Konfigurasi WhatsApp ---
const WA_NUMBER = '6285229399579';

// --- Data Siswa (NISN : Nama) ---
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
  '0139036863':"MUHAMMAD 'IZZA KURNIAWAN",
  '3127598392':'Muhammad Ziyya Ahlunnaza',
  '3133623151':'MUKHAMAD BAYU MAULID',
  '3130206215':'MUTIARA SILMI',
  '0136942798':'NAFISA IKLIMA AZZAHRA',
  '3138872764':"NASY'ATUL MAHYA",
  '0133675007':'NAUFAL HISAM PRATAMA',
  '3117519319':'NUR WANIFA'
};

// --- LocalStorage Keys ---
const ANN_KEY = 'gw_ann_announcements_v3';
const CURHAT_KEY = 'gw_ann_curhats_v3';
const NOTULEN_KEY = 'gw_ann_notulen_v3';
const PEMB_KEY = 'gw_ann_pembinaan_v3';
const MASALAH_KEY = 'gw_ann_masalah_v3';
const LOG_KEY = 'gw_ann_logs_v3';
const SESSION_KEY = 'gw_ann_session_v3';

// --- Helper Functions ---
function nowStr(){ return new Date().toLocaleString(); }
function save(key,obj){ localStorage.setItem(key, JSON.stringify(obj)); }
function load(key,def){ try{return JSON.parse(localStorage.getItem(key))||def}catch(e){return def;} }

// ===============================
//  LOGIN SYSTEM
// ===============================
document.addEventListener('DOMContentLoaded', ()=>{

  const loginForm = document.getElementById('loginForm');

  if(loginForm){
    // tombol show password
    const sp = document.getElementById('showPassword');
    if(sp){
      sp.addEventListener('change', ()=>{
        const passField = document.getElementById('password');
        passField.type = sp.checked ? 'text' : 'password';
      });
    }

    // PROSES LOGIN
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();

      // --- Login Guru / Admin ---
      if(u.toLowerCase()==='bayu' && p==='binapustaka'){
        save(SESSION_KEY,{role:'guru',user:'bayu',ts:nowStr()});
        window.location.href='guru.html';
        return;
      }

      // --- Login Siswa ---
      if(STUDENTS[u] && p === 'siswa'){
        save(SESSION_KEY,{
          role:'siswa',
