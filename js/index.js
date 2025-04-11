// Função que verifica se o usuário está logado
function usuarioEstaLogado() {
  return localStorage.getItem("userLoggedIn") === "true";
}

// NOVAS FUNÇÕES PARA BLOQUEAR USUÁRIO DESLOGADO:
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
const loginLink = document.getElementById('login-link');
const cadastroLink = document.getElementById('cadastro-link');
const userLoggedIn = sessionStorage.getItem('userLoggedIn');
if (userLoggedIn) {
  loginLink.style.display = 'none';
  cadastroLink.style.display = 'none';
}

// Mostra o popup com detalhes do produto
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

// Fecha o popup
function fecharPopup() {
  const popup = document.querySelector('.popup');
  const overlay = document.querySelector('.overlay');
  if (popup) popup.remove();
  if (overlay) overlay.remove();
  document.body.style.overflow = 'auto';
}

// Ao carregar a página, oculta os botões caso esteja logado
window.addEventListener('DOMContentLoaded', () => {
  const estaLogado = localStorage.getItem("usuarioLogado") === "true";
  if (estaLogado) {
    const entrar = document.getElementById("btn-entrar");
    const cadastrar = document.getElementById("btn-cadastrar");
    if (entrar) entrar.style.display = "none";
    if (cadastrar) cadastrar.style.display = "none";
  }
});

// Adiciona o produto ao carrinho
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

// Botão "Comprar agora"
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