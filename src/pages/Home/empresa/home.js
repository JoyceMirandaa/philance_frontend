// 1. Recuperação e Validação do LocalStorage
const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);
const dadosFormulario = JSON.parse(dadosSalvosFormulario);
console.log(dadosFormulario)
if (!dadosSalvosFormulario) {
    console.log("Nenhum usuário encontrado no LocalStorage.");
    window.location.href = '/index.html'; 
} else {
    try {
        const dadosFormulario = JSON.parse(dadosSalvosFormulario);
        
        // 1. Captura os elementos do HTML
        const elRating = document.getElementById("average_rating");
        const elUsername = document.getElementById("username");
        const elEmail = document.getElementById("email");

        // 2. Só atualiza se o elemento existir fisicamente na página atual
        if (elRating && dadosFormulario && dadosFormulario.average_rating) {
            elRating.textContent = dadosFormulario.average_rating;
        }

        if (elUsername && dadosFormulario && dadosFormulario.username) {
            elUsername.textContent = dadosFormulario.username;
        }

        if (elEmail && dadosFormulario && dadosFormulario.email) {
            elEmail.textContent = dadosFormulario.email;
        }

    } catch (erro) {
        console.error("Erro ao converter os dados do LocalStorage para JSON:", erro);
    }
}

async function carregarServicosFinalizados() {
    try {
        const id_user = dadosFormulario.id_user;
        const respostaFinalizados = await fetch(`http://localhost:8080/assignments-in-progress-c/${id_user}`);
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
                            <h4>${dadosFormulario.username} <span class="servico-avaliacao"><i class="fa-solid fa-star"></i>${dadosFormulario.average_rating}</span></h4>
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

                    <button class="btn btn-dark btn-finalizar" type="button" data-id="${dados.id}">Finalizar Serviço</button>
                    
                </article>            
            `;
            
        });


        const cardsArray = await Promise.all(htmlCardsPromises);
        
        const areaFinalizado = document.getElementById("areaFinalizar");
        areaFinalizado.innerHTML = cardsArray.join("");

        

        const botaosFinalizados = document.querySelectorAll(".btn-finalizar");

        botaosFinalizados.forEach(botao => {
            botao.addEventListener("click", () => {
                const idServico = botao.dataset.id;
                
                
                finalizarServico(idServico, botao);
            });
        });


    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
    }
}

async function finalizarServico(idServico, botao) {
  
    try {
        // Altere 'PUT' para 'POST' ou 'DELETE' caso o seu backend use outro método
        const resposta = await fetch(`http://localhost:8080/finish-assignment/${idServico}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(resposta)

        if (!resposta.ok) {
            throw new Error(`Erro no servidor: Status ${resposta.status}`);
        }

        localStorage.setItem("idServicoAtual", idServico);

        const card = botao.closest(".servico-card");
        card.remove();
        
        // Recarrega a listagem para sumir com o card finalizado
        carregarServicosFinalizados();

    } catch (error) { // Corrigido de 'erro' para 'error'
        console.error("Não foi possível finalizar o serviço:", error);
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

carregarServicosFinalizados();

