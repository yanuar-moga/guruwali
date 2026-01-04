fetch("../template.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("template").innerHTML = html;
  });
