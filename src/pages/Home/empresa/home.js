document.addEventListener('DOMContentLoaded', () => {
  // 1. Pega a string do localStorage
  const dadosSalvos = localStorage.getItem('dadosUsuario');

  if (!dadosSalvos) {
    alert('Acesso não autorizado! Faça o login.');
    window.location.href = 'index.html';
    return;
  }

  // 2. Converte de volta para Objeto JavaScript
  const usuarioLogado = JSON.parse(dadosSalvos);

  // 3. Manipula dados simples/fixos do usuário na tela
  document.getElementById('nome-usuario').textContent = usuarioLogado.nome;
  document.getElementById('email-usuario').textContent = usuarioLogado.email;

  // 4. Manipula a lista de serviços que está DENTRO do usuário
  // Substitua 'servicosAceitos' pelo nome exato que o seu back-end deu para essa lista
  const listaDeServicos = usuarioLogado.servicosAceitos || [];
  
  const container = document.getElementById('container-servicos');
  container.innerHTML = ''; // Limpa o container

  if (listaDeServicos.length === 0) {
    container.innerHTML = '<p>Você ainda não aceitou nenhum serviço.</p>';
    return;
  }

  // 5. Roda a lista interna de serviços e cria os cartões na tela
  listaDeServicos.forEach(servico => {
    container.innerHTML += `
      <div class="cartao-servico">
        <h3>${servico.titulo}</h3>
        <p>Status: <strong>${servico.status}</strong></p>
        <button onclick="verDetalhesDoServico(${servico.id})">Ver Detalhes</button>
      </div>
    `;
  });
});

// Exemplo de função para interagir com o cartão gerado
function verDetalhesDoServico(idServico) {
  alert('Abrindo detalhes do serviço com ID: ' + idServico);
}
