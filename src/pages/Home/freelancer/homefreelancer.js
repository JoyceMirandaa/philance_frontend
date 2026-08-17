document.addEventListener("DOMContentLoaded", function() {
    console.log("A página carregou! Iniciando as funções...");
    
    carregarServicosSolicitados();
    carregarServicosAceitos();
    carregarAvaliacao()
    
});


// 1. Recuperação e Validação do LocalStorage
const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);
const dadosFormulario = JSON.parse(dadosSalvosFormulario);

if (!dadosSalvosFormulario) {
    console.log("Nenhum usuário encontrado no LocalStorage.");
    window.location.href = '/index.html'; 
} else {
    try {
        
        // Verifica se a propriedade existe antes de renderizar para evitar "undefined" na tela
        if (dadosFormulario && dadosFormulario.average_rating) {
          document.getElementById("average_rating").textContent = dadosFormulario.average_rating;
        }

        if (dadosFormulario && dadosFormulario.username){
          document.getElementById("username").textContent = dadosFormulario.username;
        }

         if (dadosFormulario && dadosFormulario.email){
          document.getElementById("email").textContent = dadosFormulario.email;
        }



    } catch (erro) {
        console.error("Erro ao converter os dados do LocalStorage para JSON:", erro);
    }
}




async function carregarServicosSolicitados() {
    try {
        const respostaSolicitados = await fetch("http://localhost:8080/all-assignments");

        const servicosSolicitados = await respostaSolicitados.json();
        console.log("Serviços solicitados carregados com sucesso:", servicosSolicitados);

    
        if (servicosSolicitados.content && servicosSolicitados.content.length > 0) {
            document.getElementById("title").textContent = servicosSolicitados.content[0].title;
        } else {
            document.getElementById("title").textContent = "Nenhum serviço disponível";
        }

     
        


        return servicosSolicitados;;

    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
    }
}



const ctx = document.getElementById('meuGrafico').getContext('2d');

const meuGrafico = new Chart(ctx, {
    type: 'bar', // Tipo do gráfico: 'bar', 'line', 'pie', etc.
    data: {
        labels: ['Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Relatório de Serviços',
            data: [13, 19, 3, 5],
            backgroundColor: 'rgba(69, 235, 54, 0.5)',
            borderColor: 'rgb(54, 235, 54)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


const botao = document.getElementById('btn-sortear');
const banner = document.getElementById('banner');
const areaServico = document.querySelector('.area-servico'); 

// Correção 1: Evita que o código quebre caso o botão não exista nessa página específica
if (botao && banner && areaServico) {
    botao.addEventListener('click', async () => {
      if (banner.classList.contains('expandido')) {
        banner.classList.remove('expandido');
        return;
      }

      try {
        const resposta = await fetch("http://localhost:8080/random-assignment"); 
        if (!resposta.ok) throw new Error("Erro na resposta do servidor");
        // SOLUÇÃO: Verifica se o back-end enviou conteúdo antes de rodar o .json()
        const textoResposta = await resposta.text();
        console.log("Antes if")
        if (!textoResposta || textoResposta.trim() === "") {
            console.log("dentro if")
            throw new Error("Nenhum serviço disponível para sorteio no banco de dados.");
        }

     
        const dados = JSON.parse(textoResposta); 
        console.log("Dados recebidos no sorteio:", dados);


       
        const dataInicio = new Date(dados.startHour);
        const dataFim = new Date(dados.finishHour);

       
        if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
            throw new Error("O formato de data enviado pelo back-end é inválido para o JavaScript.");
        }

    
        const diaMes = dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
       
        const horaInicio = dataInicio.getHours();
        const horaFim = dataFim.getHours();

     
        const duracaoHoras = Math.round((dataFim - dataInicio) / (1000 * 60 * 60));

        areaServico.innerHTML = `
            <article class="painel-detalhe-vaga">
                <!-- Coluna 1: Perfil do Ofertante e Cargo -->
                <div class="detalhe-secao-perfil detalhe-divisoria">
                    <div class="detalhe-foto-contratante"></div>
                    <div class="detalhe-bloco-empresa">
                        <h4>${dados.companyName || 'Empresa'} <span class="detalhe-nota-avaliacao"><i class="fa-solid fa-star"></i> 4.5</span></h4>
                        <span class="detalhe-cidade-estado">Curitiba, PR</span>
                    </div>
                    <span class="detalhe-badge-data">
                        <span class="detalhe-ponto-indicador"></span> ${diaMes}
                    </span>
                    <h3 class="detalhe-nome-cargo">${dados.title || 'Serviço'}</h3>
                    <div class="detalhe-bloco-preco">
                        <span class="detalhe-valor-monetario">R$ ${dados.payment || '0,00'}</span>
                    </div>
                </div>

                <!-- Coluna 2: Dados Técnicos / Grade -->
                <div class="detalhe-secao-dados detalhe-divisoria">
                    <h4 class="detalhe-titulo-coluna">Informações</h4>
                    <div class="detalhe-grade-tecnica">
                        <div class="detalhe-bloco-info">
                            <span class="detalhe-texto-rotulo">Horário</span>
                            <span class="detalhe-texto-valor">${horaInicio}h - ${horaFim}h</span>
                        </div>
                        <div class="detalhe-bloco-info">
                            <span class="detalhe-texto-rotulo">Duração</span>
                            <span class="detalhe-texto-valor">${duracaoHoras}h</span>
                        </div>
                        <div class="detalhe-bloco-info">
                            <span class="detalhe-texto-rotulo">Idade mínima</span>
                            <span class="detalhe-texto-valor">${dados.min_age || 'Não informada'}</span>
                        </div>
                        <div class="detalhe-bloco-info">
                            <span class="detalhe-texto-rotulo">Vestimenta</span>
                            <span class="detalhe-texto-valor">${dados.attire || 'Livre'}</span>
                        </div>
                    </div>
                </div>

                <!-- Coluna 3: Texto Descritivo -->
                <div class="detalhe-secao-texto">
                    <h4 class="detalhe-titulo-coluna">Descrição</h4>
                    <p class="detalhe-paragrafo-corpo">${dados.description || 'Sem descrição.'}</p>
                </div>
            </article>
        `;

        banner.classList.add('expandido');

      } catch (erro) {
        console.error("Falha no sorteio:", erro.message);
        
        areaServico.innerHTML = `<p style="color: #ff4d4d; margin: 0;">Erro ao carregar o serviço. Tente novamente!</p>`;
        banner.classList.add('expandido');
      }
    });
}

async function carregarServicosAceitos() {
    try {
        const id_user = dadosFormulario.id_user;
        const respostaFinalizados = await fetch(`http://localhost:8080/assingments-in-progress-f/${id_user}`);
        const servicosSolicitados = await respostaFinalizados.json();

        const lista = Array.isArray(servicosSolicitados) ? servicosSolicitados : [servicosSolicitados];

        // >>> FILTRO POR STATUS <<<
        // Só monta card de quem NÃO está avaliado (ou seja, ainda "finished"/em andamento).
        const listaVisivel = lista.filter(dados => dados && dados.status !== "EVALUATED");

        const htmlCardsPromises = listaVisivel.map(async (dados) => {

            // Pega o ID do endereço de dentro do serviço atual
            const idEndereco = String(dados.address);
            let dadosDoServidor = { street: "Endereço não encontrado" };

            try {
                const respostaEndereco = await fetch('http://localhost:8080/info-address', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: idEndereco
                });

                if (respostaEndereco.ok) {
                    dadosDoServidor = await respostaEndereco.json();
                } else {
                    console.error(`Erro ao buscar endereço ID ${idEndereco}: Status ${respostaEndereco.status}`);
                }

            } catch (err) {
                console.error("Falha na requisição de endereço:", err);
            }

            const dataInicio = new Date(dados.startHour);
            const dataFim = new Date(dados.finishHour);
            const horaInicio = dataInicio.getHours();
            const horaFim = dataFim.getHours();
            const duracaoHoras = Math.round((dataFim - dataInicio) / (1000 * 60 * 60)) || 0;

            return `
                <article class="servico-card" id="servico-lista-${dados.id}">
                    <div class="servico-coluna linha-vertical">
                        <div class="servico-avatar"></div>
                        <div class="servico-empresa">
                            <h4>${dados.companyName} <span class="servico-avaliacao"><i class="fa-solid fa-star"></i>${dadosFormulario.average_rating}</span></h4>
                            <span class="servico-local">${dadosDoServidor.city}, ${dadosDoServidor.state}</span>
                        </div>
                        <span class="servico-contagem">
                            <span class="dot"></span> ${duracaoHoras}h ativa(s)
                        </span>
                        <h3 class="servico-funcao">${dados.title}</h3>
                        <div class="servico-preco">
                            <span class="servico-valor-hora">R$ ${dados.payment}</span>
                        </div>
                    </div>

                    <div class="servico-coluna linha-vertical">
                        <h4 class="servico-coluna-titulo">Informações</h4>
                        <div class="info-grade">
                            <div class="info-item">
                                <span class="info-label">Horário</span>
                                <span class="info-valor">${horaInicio}h - ${horaFim}h</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Duração</span>
                                <span class="info-valor">${duracaoHoras} horas</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Idade mínima</span>
                                <span class="info-valor">${dados.min_age}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Endereço</span>
                                <span class="info-valor">${dadosDoServidor.street}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vestimenta</span>
                                <span class="info-valor">${dados.attire}</span>
                            </div>
                        </div>
                    </div>

                    <div class="servico-coluna">
                        <h4 class="servico-coluna-titulo">Descrição</h4>
                        <p class="description">${dados.description}</p>
                    </div>

                    <div class="aviso-card" style="color: red; font-weight: bold; margin: 10px 0; display: none;"></div>

                </article>
            `;
        });

        const cardsArray = await Promise.all(htmlCardsPromises);

        const areaFinalizado = document.getElementById("servico-lista");
        areaFinalizado.innerHTML = cardsArray.join("");

    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
    }
}

async function carregarAvaliacao() {
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    if (!usuarioLogadoString) return;

    const usuarioLogado = JSON.parse(usuarioLogadoString);
    const idUsuario = usuarioLogado.id_user;

    try {
        const resposta = await fetch(`http://localhost:8080/assingments-finished/${idUsuario}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) throw new Error("Erro ao buscar finalizados");

        const servicosFinalizados = await resposta.json();
        console.log("CONTEÚDO DO BACKEND:", servicosFinalizados);

        if (servicosFinalizados && servicosFinalizados.length > 0) {

            const listaFiltrada = servicosFinalizados.filter(servico => {
                if (servico.status === "EVALUATED") return false;
                const idTexto = servico.id.toString();
                return !servicosJaAvaliadosNestaSessao.includes(idTexto);
            });

            console.log("Lista após aplicar filtro (status + sessão):", listaFiltrada);

            if (listaFiltrada.length === 0) {
                console.log("Nenhum serviço novo pendente de avaliação.");
                return;
            }

            const primeiroServico = listaFiltrada[0];

            fecharModalDinamico();

            const htmlModal = `
                <div id="modal-avaliacao-dinamico">
                    <div class="modal-conteudo-interno">
                        <h2>Avalie o Serviço</h2>
                        <p>Você finalizou o serviço: <strong>${primeiroServico.title}</strong></p>

                        <div class="rating-group">
                            <input type="radio" id="star5" name="nota" value="5"><label for="star5"></label>
                            <input type="radio" id="star4" name="nota" value="4"><label for="star4"></label>
                            <input type="radio" id="star3" name="nota" value="3"><label for="star3"></label>
                            <input type="radio" id="star2" name="nota" value="2"><label for="star2"></label>
                            <input type="radio" id="star1" name="nota" value="1"><label for="star1"></label>
                        </div>

                        <textarea placeholder="Deixe seu feedback aqui..." id="texto-avaliacao"></textarea>

                        <div class="modal-botoes-acoes">
                            <button class="btn-cancelar" onclick="fecharModalDinamico()">Cancelar</button>
                            <button class="btn-enviar" onclick="enviarAvaliacao('${primeiroServico.id}', '${primeiroServico.company}')">Enviar</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', htmlModal);
        }
    } catch (erro) {
        console.error('Erro ao carregar avaliações:', erro);
    }
}