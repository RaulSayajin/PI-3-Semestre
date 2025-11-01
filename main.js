window.addEventListener("load", () => {
  // Detecta se a página foi recarregada
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    window.location.href = "index.html";
  }
});
