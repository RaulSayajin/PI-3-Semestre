// ====== MENU LATERAL ======
var menuItem = document.querySelectorAll('.item-menu');

function selectlink() {
  menuItem.forEach((item) => item.classList.remove('ativo'));
  this.classList.add('ativo');
}

menuItem.forEach((item) => item.addEventListener('click', selectlink));

// ====== MANTER O MENU ATIVO NA TROCA DE PÁGINA ======
const currentPath = window.location.pathname;
const currentPage = currentPath === '/' ? 'index.html' : currentPath.split('/').pop();

menuItem.forEach((item) => {
  const link = item.querySelector('a');
  const href = link.getAttribute('href');

  // ignora links vazios ou âncoras
  if (!href || href === '#') return;

  // normaliza os caminhos
  const linkPage = href.split('/').pop();

  // adiciona classe ativo somente se a página atual for a mesma
  if (linkPage === currentPage) {
    item.classList.add('ativo');
  } else {
    item.classList.remove('ativo');
  }
});


// expandir menu
var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');

btnExp.addEventListener('click', function() {
  menuSide.classList.toggle('expandir');
});

const carouselElement = document.getElementById("carousel");
const containerElement = document.querySelector(".carousel-container");

const SCROLL_SPEED = 1.8;   // velocidade de rolagem
const EDGE_SIZE = 150;      // área de ativação nas bordas
let scrollDirection = 0;    // -1 = esquerda | 1 = direita | 0 = parado
let isReturning = false;    // controla se está voltando pro início

// Função de animação suave
function animateScroll() {
  const maxScrollLeft = carouselElement.scrollWidth - carouselElement.clientWidth;

  // Só faz rolagem normal se NÃO estiver voltando pro início
  if (!isReturning) {
    if (scrollDirection === 1) {
      // Vai pra direita até o final
      if (carouselElement.scrollLeft < maxScrollLeft) {
        carouselElement.scrollLeft += SCROLL_SPEED;
      }
    } else if (scrollDirection === -1) {
      // Vai pra esquerda até o início
      if (carouselElement.scrollLeft > 0) {
        carouselElement.scrollLeft -= SCROLL_SPEED;
      }
    }
  }

  // Continua o loop de animação
  requestAnimationFrame(animateScroll);
}

// Inicia o loop contínuo
requestAnimationFrame(animateScroll);

// Detecta movimento do mouse dentro do container
containerElement.addEventListener("mousemove", (e) => {
  if (isReturning) return; // se estiver voltando, ignora
  const containerRect = containerElement.getBoundingClientRect();
  const mouseX = e.clientX - containerRect.left;

  if (mouseX < EDGE_SIZE) {
    scrollDirection = -1;
  } else if (mouseX > containerRect.width - EDGE_SIZE) {
    scrollDirection = 1;
  } else {
    scrollDirection = 0;
  }
});

// Quando o mouse sair do container → volta para o início
containerElement.addEventListener("mouseleave", () => {
  scrollDirection = 0;
  isReturning = true;

  // Define rolagem suave de volta ao começo
  carouselElement.style.scrollBehavior = "smooth";
  carouselElement.scrollLeft = 0;

  // Espera a rolagem acabar (tempo depende do tamanho do carrossel)
  setTimeout(() => {
    carouselElement.style.scrollBehavior = "auto";
    isReturning = false;
  }, 1000); // 1 segundo é um tempo bom — pode ajustar se quiser
});

