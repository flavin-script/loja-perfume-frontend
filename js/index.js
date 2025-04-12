// Configuração do Supabase
const supabaseUrl = 'https://iccsymcldmrjybyukqbv.supabase.co'; // Substitua pela sua URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljY3N5bWNsZG1yanlieXVrcWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTQwNTAsImV4cCI6MjA1OTY3MDA1MH0.yzmH4-GQQgLG1wJAGRwvo19AV-qwIwCy56Q0M78l7u0'; // Substitua pela sua chave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Função para carregar os produtos dinamicamente do Supabase
async function carregarProdutos() {
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*');

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return;
  }

  const grid = document.querySelector('.produtos-grid');
  grid.innerHTML = ''; // Limpa os produtos fixos

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

// Chama a função ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
});

// Funções de Carrinho e Compra já existentes
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

// Função de Popup
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

// Função para adicionar um novo produto
document.getElementById('form-produto').addEventListener('submit', function(event) {
  event.preventDefault();  // Previne o envio padrão do formulário

  // Pegando os dados do formulário
  const produto = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    preco: parseFloat(document.getElementById('preco').value),
    imagem: document.getElementById('imagem').value,
  };

  // Enviando os dados para o Supabase
const url = 'https://iccsymcldmrjybyukqbv.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljY3N5bWNsZG1yanlieXVrcWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTQwNTAsImV4cCI6MjA1OTY3MDA1MH0.yzmH4-GQQgLG1wJAGRwvo19AV-qwIwCy56Q0M78l7u0';

const headers = {
  'Content-Type': 'application/json',
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`
};

  fetch(url, {
    method: 'POST',
    headers: headers,
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
