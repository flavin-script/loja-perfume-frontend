function usuarioEstaLogado() {
  return sessionStorage.getItem("userLoggedIn") === "true";
}

function handleAdicionarAoCarrinho(imagem, titulo, descricao, preco) {
  if (!usuarioEstaLogado()) {
    alert("Você precisa estar logado para adicionar ao carrinho.");
    window.location.href = "login.html";
    return;
  }

  const produto = { imagem, titulo, descricao, preco };
  adicionarAoCarrinho(produto);
}

function handleComprarAgora(imagem, titulo, descricao, preco) {
  if (!usuarioEstaLogado()) {
    alert("Você precisa estar logado para finalizar a compra.");
    window.location.href = "login.html";
    return;
  }

  comprarAgora(imagem, titulo, descricao, preco);
}

// Oculta os botões "Entrar" e "Cadastrar" se o usuário estiver logado
window.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('login-link');
  const cadastroLink = document.getElementById('cadastro-link');
  const estaLogado = sessionStorage.getItem('userLoggedIn') === "true";

  if (estaLogado) {
    if (loginLink) loginLink.style.display = "none";
    if (cadastroLink) cadastroLink.style.display = "none";
  }
});

function mostrarPopup(imagem, titulo, descricao, preco) {
  fecharPopup();

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.onclick = fecharPopup;
  document.body.appendChild(overlay);

  const popup = document.createElement('div');
  popup.className = 'popup';

  popup.innerHTML = `
    <img src="${imagem}" alt="${titulo}">
    <h4>${titulo}</h4>
    <p class="descricao">${descricao}<br><br>
      Uma fragrância sofisticada que desperta os sentidos com notas envolventes. Ideal para quem deseja marcar presença com elegância. Sua composição luxuosa exala confiança e exclusividade.
    </p>
    <p class="estoque">Disponível em estoque</p>
    <div class="avaliacao">
      <span>★ ★ ★ ★ ☆</span>
      <span style="font-size:13px; color:#555;">(421 avaliações)</span>
    </div>
    <div class="comentarios">
      <h5>Comentários:</h5>
      <p><strong>Camila:</strong> Amei demais esse perfume, dura o dia todo!</p>
      <p><strong>João:</strong> Aroma marcante e sofisticado, muito elogiado.</p>
      <p><strong>Larissa:</strong> Já comprei duas vezes, é o meu favorito!</p>
    </div>
    <button class="comprar-btn" onclick="handleComprarAgora('${imagem}', '${titulo}', \`${descricao}\`, '${preco}')">Comprar agora por ${preco}</button>
    <button id="adicionarAoCarrinhoBtn" class="btn-carrinho" onclick="handleAdicionarAoCarrinho('${imagem}', '${titulo}', \`${descricao}\`, '${preco}')">Adicionar ao Carrinho</button>
    <button class="fechar-btn" onclick="fecharPopup()">Fechar</button>
  `;
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';
}

function fecharPopup() {
  const popup = document.querySelector('.popup');
  const overlay = document.querySelector('.overlay');
  if (popup) popup.remove();
  if (overlay) overlay.remove();
  document.body.style.overflow = 'auto';
}

function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  const contador = document.getElementById("contador-carrinho");
  if (contador) {
    contador.textContent = carrinho.length;
  }

  alert("Produto adicionado ao carrinho!");
}

function comprarAgora(imagem, titulo, descricao, preco) {
  const produtoSelecionado = {
    imagem: imagem,
    titulo: titulo,
    descricao: descricao,
    preco: preco,
    quantidade: 1
  };
  localStorage.setItem("produtoSelecionado", JSON.stringify(produtoSelecionado));
  window.location.href = "carrinho.html";
}

// Requisição ao carregar o site
fetch('https://loja-perfume-backend.onrender.com/registro-visita')
  .then(response => response.json())
  .then(data => console.log('Visita registrada:', data))
  .catch(error => console.error('Erro ao registrar visita:', error));
