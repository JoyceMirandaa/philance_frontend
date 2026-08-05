const botaoPerfil = document.getElementById('botao-perfil');
    const menuSuspenso = document.getElementById('menu-suspenso');

   
    botaoPerfil.addEventListener('click', function(event) {
        event.stopPropagation(); 
        
       
        menuSuspenso.classList.toggle('escondido');
});


async function buscarServicos() {
  try {
    const resposta = await fetch('http://localhost:8080/all-assignments');
    const dadosPaginados = await resposta.json();
    
    const localAlvo = document.getElementById('card-servico');

    const colunaDetalhes = document.querySelector('.green'); 
    
    if (!localAlvo) {
        console.error("Contêiner #card-servicos não foi encontrado no HTML.");
        return;
    }

    localAlvo.innerHTML = '';

    const listaDeServicos = dadosPaginados.content;

    if (listaDeServicos && Array.isArray(listaDeServicos)) {
        listaDeServicos.forEach(servico => {
          const card = document.createElement('div');
          card.className = 'card-servicos';
          
          card.innerHTML = `
            <div>
                <p>${servico.company}</p>
                <span>R$ ${servico.payment}</span>
                <h3>${servico.title}</h3>
            </div>
          `;

          card.addEventListener('click', () => {
              exibirDetalhesDoServico(servico, colunaDetalhes);
          });

          localAlvo.appendChild(card);
        });
    } else {
        localAlvo.innerHTML = '<p>Nenhum serviço encontrado.</p>';
    }

  } catch (erro) {
    console.error('Erro ao injetar serviços no local:', erro);
  }
}

function exibirDetalhesDoServico(servico, container) {
    if (!container) return;

    const inicio = new Date(servico.startHour).toLocaleString('pt-BR');
    const fim = new Date(servico.finishHour).toLocaleString('pt-BR');

    container.innerHTML = `
        <section class="detalhes-container">
            <article class="card-principal">
                <p class="detalhe-empresa"><strong>Empresa/Contratante:</strong> ${servico.company}</p>
                <h2>${servico.title}</h2>
                <button class="btn-aceitar" id="btn-aceitar">Aceitar Serviço</button>
            </article>

            <article class="detalhes-info-grid">
                <p><strong>Preço:</strong> R$ ${servico.payment}</p>
                <p><strong>Cidade:</strong> ${servico.address}</p>
                <p><strong>Idade Mínima:</strong> ${servico.min_age} anos</p>
                <p><strong>Traje:</strong> ${servico.attire}</p>
                <p><strong>Início:</strong> ${inicio}</p>
                <p><strong>Término:</strong> ${fim}</p>
            </article>


            <article class="detalhes-descricao">
                <p class="detalhe-descricao"><strong>Descrição completa:</strong> ${servico.description}</p>
            </article>
            
        </section>
    `;
}



// Inicialização segura fora da função assíncrona
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buscarServicos);
} else {
    buscarServicos();
}
