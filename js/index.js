// Criação do cliente Supabase (deixe sempre isso antes de tudo)
const supabase = supabase.createClient('https://qtqohsyasvzzqnbfhnun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0cW9oc3lhc3Z6enFuYmZobnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwMDk4MDAsImV4cCI6MjAyNTU4NTgwMH0.3BlX0WWR_NtoOtZCVhFb6c0cJe4vFEflmGnDHQIQvhs');

// Função para verificar se o usuário está logado
async function verificarLogin() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    window.location.href = 'login.html'; // Redireciona se não estiver logado
  } else {
    const userEmail = data.session.user.email;
    document.getElementById('user-name').textContent = userEmail;
  }
}

// Função para listar produtos do Supabase
async function listarProdutos() {
  const { data, error } = await supabase.from('produtos').select('*');
  const lista = document.getElementById('lista-produtos');

  if (error) {
    console.error('Erro ao listar produtos:', error.message);
    lista.innerHTML = '<p>Erro ao carregar produtos.</p>';
    return;
  }

  if (!data || data.length === 0) {
    lista.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  lista.innerHTML = '';
  data.forEach(produto => {
    const item = document.createElement('div');
    item.classList.add('produto');
    item.innerHTML = `
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
    `;
    lista.appendChild(item);
  });
}

// Quando a página carregar, verificar login e listar os produtos
document.addEventListener('DOMContentLoaded', async () => {
  await verificarLogin();
  await listarProdutos();
});

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
