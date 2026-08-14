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

botao.addEventListener('click', async () => {
  if (banner.classList.contains('expandido')) {
    banner.classList.remove('expandido');
    return;
  }

  try {
    const resposta = await fetch("http://localhost:8080/random-assignment"); 
    const dados = await resposta.json(); 
    console.log(dados)

     // 1. Trata as datas do back-end
    const dataInicio = new Date(dados.startHour);
    const dataFim = new Date(dados.finishHour);

    // 2. Formata o dia e mês para o badge (ex: "03/09")
    const diaMes = dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    // 3. Pega apenas as horas de início e fim (ex: "14h" e "20h")
    const horaInicio = dataInicio.getHours();
    const horaFim = dataFim.getHours();

    // 4. Calcula a duração total em horas
    const duracaoHoras = Math.round((dataFim - dataInicio) / (1000 * 60 * 60));

   
    areaServico.innerHTML = `
        <article class="painel-detalhe-vaga">
            <!-- Coluna 1: Perfil do Ofertante e Cargo -->
            <div class="detalhe-secao-perfil detalhe-divisoria">
                <div class="detalhe-foto-contratante"></div>
                <div class="detalhe-bloco-empresa">
                    <h4>${dados.companyName} <span class="detalhe-nota-avaliacao"><i class="fa-solid fa-star"></i> 4.5</span></h4>
                    <span class="detalhe-cidade-estado">Curitiba, PR</span>
                </div>
                <span class="detalhe-badge-data">
                    <span class="detalhe-ponto-indicador"></span> ${diaMes}
                </span>
                <h3 class="detalhe-nome-cargo">${dados.title}</h3>
                <div class="detalhe-bloco-preco">
                    <span class="detalhe-valor-monetario">R$ ${dados.payment}</span>
                </div>
            </div>

            <!-- Coluna 2: Dados Técnicos / Grade -->
            <div class="detalhe-secao-dados detalhe-divisoria">
                <h4 class="detalhe-titulo-coluna">Informações</h4>
                <div class="detalhe-grade-tecnica">
                    <div class="detalhe-bloco-info">
                        <span class="detalhe-texto-rotulo">Horário</span>
                        <span class="detalhe-texto-valor">${horaInicio} - ${horaFim}</span>
                    </div>
                    <div class="detalhe-bloco-info">
                        <span class="detalhe-texto-rotulo">Duração</span>
                        <span class="detalhe-texto-valor">${duracaoHoras}</span>
                    </div>
                    <div class="detalhe-bloco-info">
                        <span class="detalhe-texto-rotulo">Idade mínima</span>
                        <span class="detalhe-texto-valor">${dados.min_age}</span>
                    </div>
                    <div class="detalhe-bloco-info">
                        <span class="detalhe-texto-rotulo">Vestimenta</span>
                        <span class="detalhe-texto-valor">${dados.attire}</span>
                    </div>
                </div>
            </div>

            <!-- Coluna 3: Texto Descritivo -->
            <div class="detalhe-secao-texto">
                <h4 class="detalhe-titulo-coluna">Descrição</h4>
                <p class="detalhe-paragrafo-corpo">${dados.description}</p>
            </div>
        </article>
    `;

    banner.classList.add('expandido');
    console.log(dados)

  } catch (erro) {
    console.error(erro);
    areaServico.innerHTML = `<p style="color: #ff4d4d; margin: 0;">Erro ao carregar o serviço. Tente novamente!</p>`;
    banner.classList.add('expandido');
  }
});


async function carregarServicosAceitos() {
    try {
        const id_user = dadosFormulario.id_user;
        const respostaFinalizados = await fetch(`http://localhost:8080/assingments-in-progress-f/${id_user}`);
        const servicosSolicitados = await respostaFinalizados.json();

        const lista = Array.isArray(servicosSolicitados) ? servicosSolicitados : [servicosSolicitados];

        const htmlCardsPromises = lista.map(async (dados) => {

            
            // Pega o ID do endereço de dentro do serviço atual
            const idEndereco = String(dados.address); 
            let dadosDoServidor = { street: "Endereço não encontrado" };

            try {
                // OPÇÃO A: Se o backend recebe o ID no corpo (Body) como texto puro
                const respostaEndereco = await fetch('http://localhost:8080/info-address', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: idEndereco
                })

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

            console.log(dados.id)

            return `
                <article class="servico-card">
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

        localStorage.setItem("idAtual", JSON.stringify(servicosFinalizados));

         if (servicosFinalizados && servicosFinalizados.length > 0) {
            const primeiroServico = servicosFinalizados[0];

            document.body.innerHTML += `
                <div id="modal-avaliacao-dinamico" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                    <!-- Estilos CSS das estrelas injetados dinamicamente -->
                    <style>
                        .rating-group { display: flex; direction: row-reverse; justify-content: flex-end; margin: 15px 0; }
                        .rating-group input { display: none; }
                        .rating-group label { cursor: pointer; font-size: 30px; color: #ccc; transition: color 0.2s; }
                        .rating-group label:before { content: '★'; }
                        .rating-group input:checked ~ label,
                        .rating-group label:hover,
                        .rating-group label:hover ~ label { color: #ffca08; }
                    </style>

                    <div>
                        <h2>Avalie o Serviço</h2>
                        <p>Você finalizou o serviço: <strong>${primeiroServico.title}</strong></p>
                        
                        <!-- Grupo de Estrelas (do 5 para o 1 por conta do CSS reverse) -->
                        <div class="rating-group">
                            <input type="radio" id="star5" name="nota" value="5"><label for="star5"></label>
                            <input type="radio" id="star4" name="nota" value="4"><label for="star4"></label>
                            <input type="radio" id="star3" name="nota" value="3"><label for="star3"></label>
                            <input type="radio" id="star2" name="nota" value="2"><label for="star2"></label>
                            <input type="radio" id="star1" name="nota" value="1"><label for="star1"></label>
                        </div>

                        <textarea placeholder="Deixe seu feedback aqui..." id="texto-avaliacao"></textarea>
                        
                        <div>
                            <button onclick="fecharModalDinamico()">Cancelar</button>
                            <button onclick="enviarAvaliacao('${primeiroServico.id}')">Enviar</button>
                        </div>
                    </div>
                </div>
            `;
        }

        
    } catch (erro) {
        console.error('Erro:', erro);
        
    }

     
}

function fecharModalDinamico() {
    const modal = document.getElementById("modal-avaliacao-dinamico");
    if (modal) modal.remove();
}

async function enviarAvaliacao(idServico) {
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    const usuarioLogado = JSON.parse(usuarioLogadoString);
   
    const estrelaSelecionada = document.querySelector('input[name="nota"]:checked');
    const texto = document.getElementById("texto-avaliacao").value;
    const notaNumero = parseInt(estrelaSelecionada.value); 

    const company = localStorage.getItem("idAtual");
    const dadosCompany =  JSON.parse(company)
    console.log(company)

    const dadosAvaliar = {
        review: notaNumero,
        comments: texto,
        id_assignment: idServico,
        id_author: usuarioLogado.id_user,
        id_target: dadosCompany.company
    }

    console.log(dadosAvaliar)

    try{
        const avaliar = await fetch(`http://localhost:8080/ratings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAvaliar)
        });

    }catch{
        console.error('Erro:', erro);
    }
    
}

