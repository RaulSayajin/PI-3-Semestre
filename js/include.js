// js/include.js
document.addEventListener("DOMContentLoaded", function () {
  const includeElements = document.querySelectorAll("[include-html]");

  includeElements.forEach(el => {
    const file = el.getAttribute("include-html");
    if (file) {
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
          return response.text();
        })
        .then(data => {
          el.innerHTML = data;
          el.removeAttribute("include-html");
        })
        .catch(err => {
          el.innerHTML = `<p style="color:red;">${err.message}</p>`;
        });
    }
  });
});
