// Verifica se o usuário está logado
function usuarioEstaLogado() {
  return sessionStorage.getItem("userLoggedIn") === "true";
}

// Oculta os botões "Entrar" e "Cadastrar" se o usuário estiver logado
window.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('login-link');
  const cadastroLink = document.getElementById('cadastro-link');
  const estaLogado = usuarioEstaLogado();

  if (estaLogado) {
    if (loginLink) loginLink.style.display = "none";
    if (cadastroLink) cadastroLink.style.display = "none";
  }

  carregarProdutos();
  verificarLogin();
});

// Configuração do Supabase
const supabaseUrl = 'https://iccsymcldmrjybyukqbv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljY3N5bWNsZG1yanlieXVrcWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTQwNTAsImV4cCI6MjA1OTY3MDA1MH0.yzmH4-GQQgLG1wJAGRwvo19AV-qwIwCy56Q0M78l7u0';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Carrega os produtos do Supabase
async function carregarProdutos() {
  const { data: produtos, error } = await supabase.from('produtos').select('*');
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return;
  }

  const grid = document.querySelector('.produtos-grid');
  grid.innerHTML = '';

  produtos.forEach((produto) => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.onclick = () => {
      mostrarPopup(produto.imagem, produto.titulo, produto.descricao, `R$ ${produto.preco}`);
    };

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.titulo}">
      <p><strong>${produto.titulo}</strong></p>
      <p class="preco">R$ ${produto.preco}</p>
      <span class="ver-mais">Ver mais</span>
    `;
    grid.appendChild(card);
  });
}

// Exibe o popup de produto
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

// Adiciona produto ao carrinho
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

// Fluxo de "Comprar agora"
function comprarAgora(imagem, titulo, descricao, preco) {
  const produtoSelecionado = {
    imagem,
    titulo,
    descricao,
    preco,
    quantidade: 1
  };
  localStorage.setItem("produtoSelecionado", JSON.stringify(produtoSelecionado));
  window.location.href = "carrinho.html";
}

// Verifica se usuário está logado ao tentar comprar
function handleComprarAgora(imagem, titulo, descricao, preco) {
  if (!usuarioEstaLogado()) {
    alert("Você precisa estar logado para finalizar a compra.");
    window.location.href = "login.html";
    return;
  }
  comprarAgora(imagem, titulo, descricao, preco);
}

// Verifica se usuário está logado ao adicionar ao carrinho
function handleAdicionarAoCarrinho(imagem, titulo, descricao, preco) {
  if (!usuarioEstaLogado()) {
    alert("Você precisa estar logado para adicionar ao carrinho.");
    window.location.href = "login.html";
    return;
  }
  const produto = { imagem, titulo, descricao, preco };
  adicionarAoCarrinho(produto);
}

// Registra visita ao backend
fetch('https://loja-perfume-backend.onrender.com/registro-visita')
  .then(response => response.json())
  .then(data => console.log('Visita registrada:', data))
  .catch(error => console.error('Erro ao registrar visita:', error));

// Submissão de novo produto
document.getElementById('form-produto')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const produto = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    preco: parseFloat(document.getElementById('preco').value),
    imagem: "https://i.imgur.com/xiN3xPy.jpg",
  };

  fetch(`${supabaseUrl}/rest/v1/produtos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify(produto),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Produto adicionado', data);
      alert('Produto adicionado com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto!');
    });
});
