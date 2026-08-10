const botaoFiltro = document.getElementById('botao-filtro');
const menuSuspenso = document.getElementById('menu-suspenso');

botaoFiltro.addEventListener('click', function(event) {
    event.stopPropagation(); 
    
    
    menuSuspenso.classList.toggle('escondido');
});

document.querySelectorAll('.tags-buttons input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', function() {
        if (this.wasChecked) {
            this.checked = false;
            this.wasChecked = false;
        } else {
            // Remove o estado antigo dos outros do mesmo grupo
            document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => r.wasChecked = false);
            this.wasChecked = true;
        }
    });
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

          card.setAttribute('data-id', servico.id);
          
          card.innerHTML = `
            <div >
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

let idAssignmentAtivo = null;

function exibirDetalhesDoServico(servico, container) {
    if (!container) return;

    idAssignmentAtivo = servico.id;

    const inicio = new Date(servico.startHour).toLocaleString('pt-BR');
    const fim = new Date(servico.finishHour).toLocaleString('pt-BR');

    container.innerHTML = `
        <section class="detalhes-container">
            <article class="card-principal">
                <p class="detalhe-empresa"><strong>Empresa/Contratante:</strong> ${servico.company}</p>
                <h2>${servico.title}</h2>
                <button class="btn btn-aceitar" data-id="${servico.id}">Aceitar</button>
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

document.addEventListener('click', async function(event) {
   
    const botaoAceitar = event.target.closest('.btn-aceitar');
    
    
    if (!botaoAceitar) return;

   
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    const usuarioLogado = JSON.parse(usuarioLogadoString);

    
     if (!idAssignmentAtivo) {
        alert('Erro: Nenhum serviço ativo selecionado.');
        return;
    }

    // Monta o JSON perfeitamente com um ID único e sem fazer novos fetches de listagem
    const dadosAceitar = {
        id_user: usuarioLogado?.id || "",
        id_assignment: idAssignmentAtivo,
    };

    try {
        const respostaAceitar = await fetch('http://localhost:8080/accept-assignment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAceitar)
        });

        if (respostaAceitar.ok) {
            alert('Sucesso! Serviço aceito.');
            console.log(dadosAceitar);
                    
            const respostaDados = await respostaAceitar.json();
            localStorage.setItem("dadosAceitar", JSON.stringify(respostaDados));
            
                // 1. Procura o card na tela que tem o data-id igual ao ID do serviço aceito
            const cardParaRemover = document.querySelector(`.card-servicos[data-id="${idAssignmentAtivo}"]`);
            
            // 2. Se o card for encontrado, remove ele do HTML
            if (cardParaRemover) {
                cardParaRemover.remove();
            }

            // 3. Limpa a coluna da direita (detalhes), já que o serviço sumiu
            const colunaDetalhes = document.querySelector('.green');
            if (colunaDetalhes) {
                colunaDetalhes.innerHTML = '';
            }


        } else {
            alert('Erro no servidor.');
            console.log('Dados rejeitados:', dadosAceitar);
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
});

// Inicialização segura fora da função assíncrona
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buscarServicos);
} else {
    buscarServicos();
}

