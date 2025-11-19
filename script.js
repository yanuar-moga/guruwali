<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login - Aplikasi Guru Wali</title>
<link rel="stylesheet" href="style.css">

<style>
  body {
    font-family: "Poppins", sans-serif;
    background: linear-gradient(180deg,#e8f3ff,#ffffff);
    height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0;
  }

  .login-card {
    background:#fff;
    border-radius:18px;
    padding:18px 20px;
    width:90%;
    max-width:240px;
    box-shadow:0 3px 8px rgba(0,0,0,.1);
    border-top:4px solid #ffd84c;
    text-align:center;
  }

  .login-card img {
    width:55px;
    height:55px;
    border-radius:50%;
    margin-bottom:8px;
  }

  h2 {
    font-size:1rem;
    color:#003f7f;
    margin:10px 0 18px;
  }

  input[type=text],
  input[type=password] {
    width:100%;
    padding:7px 8px;
    margin-bottom:10px;
    border:1px solid #ccc;
    border-radius:6px;
    font-size:13px;
    box-sizing:border-box;
  }

  .show-pass {
    display:flex;
    align-items:center;
    justify-content:flex-start;
    font-size:13px;
    color:#333;
    margin-bottom:12px;
  }
  .show-pass input {
    margin-right:6px;
    transform:scale(1.05);
    accent-color:#4da3ff;
  }

  button {
    width:100%;
    padding:8px;
    border:none;
    border-radius:6px;
    background:linear-gradient(90deg,#4da3ff,#007bff);
    color:#fff;
    font-weight:600;
    font-size:13.5px;
    cursor:pointer;
    transition:.25s;
  }
  button:hover {
    transform:scale(1.03);
  }

  .footer {
    font-size:10.5px;
    color:#777;
    margin-top:12px;
  }
</style>
</head>

<body>
  <div class="login-card">
    <img src="assets/logo.png" alt="Logo Sekolah">
    <h2>Aplikasi Guru Wali</h2>

    <form id="loginForm">
      <input type="text" id="username" placeholder="NISN" required>
      <input type="password" id="password" placeholder="Password" required>

      <div class="show-pass">
        <input type="checkbox" id="showPassword">
        <label for="showPassword">Tampilkan Password</label>
      </div>

      <button type="submit">Masuk</button>
    </form>

    <div class="footer">© 2025 MB All rights reserved</div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  <script src="script.js"></script>

  <script>
    document.getElementById("showPassword").onclick = () => {
      const p = document.getElementById("password");
      p.type = p.type === "password" ? "text" : "password";
    };
  </script>
</body>
</html>
