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

async function carregarServicosFinalizados() {
    try {
        const id_user = dadosFormulario.id
        const respostaFinalizados = await fetch(`http://localhost:8080/assingments-in-progress-c/${id_user}`);
        const servicosSolicitados = await respostaFinalizados.json();
        console.log(servicosSolicitados)

        const lista = Array.isArray(servicosSolicitados) ? servicosSolicitados : [servicosSolicitados];
        console.log(lista)

        //DATAS, DURAÇÃO E HORA
        const dataInicio = new Date(lista.startHour);
        const dataFim = new Date(lista.finishHour);

        // 2. Formata o dia e mês para o badge (ex: "03/09")
        const diaMes = dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
        // 3. Pega apenas as horas de início e fim (ex: "14h" e "20h")
        const horaInicio = dataInicio.getHours();
        const horaFim = dataFim.getHours();

        // 4. Calcula a duração total em horas
        const duracaoHoras = Math.round((dataFim - dataInicio) / (1000 * 60 * 60));
    
        const areaFinalizado = document.getElementById("areaFinalizar");

        const htmlCards = lista.map(dados => {
            return `
                <article class="servico-card">
                    <div class="servico-coluna linha-vertical">
                        <div class="servico-avatar"></div>
                        <div class="servico-empresa">
                            <h4>${dadosFormulario.username} <span class="servico-avaliacao"><i class="fa-solid fa-star"></i>${dadosFormulario.average_rating}</span></h4>
                            <span class="servico-local">Curitiba, PR</span>
                        </div>
                        <span class="servico-contagem">
                            <span class="dot"></span> ${duracaoHoras}
                        </span>
                        <h3 class="servico-funcao">${dados.title}</h3>
                        <div class="servico-preco">
                            <span class="servico-valor-hora">R$18/h</span>
                            <span class="servico-valor-total">R$108 total (6h)</span>
                        </div>
                    </div>

                    <div class="servico-coluna linha-vertical">
                        <h4 class="servico-coluna-titulo">Informações</h4>
                        <div class="info-grade">
                            <div class="info-item">
                                <span class="info-label">Horário</span>
                                <span class="info-valor">14h - 20h</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Duração</span>
                                <span class="info-valor">6 horas</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Idade mínima</span>
                                <span class="info-valor">Sem restrição</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Endereço</span>
                                <span class="info-valor">Praça Gen. Osório, 125</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vestimenta</span>
                                <span class="info-valor">Sem restrição</span>
                            </div>
                        </div>
                    </div>

                    <div class="servico-coluna">
                        <h4 class="servico-coluna-titulo">Descrição</h4>
                        <p>${dados.description}</p>
                    </div>

                    <button class="btn btn-dark" type="submit" id="btn-finalizar">Finalizar Serviço</button>
            </article>            
        `;
        }).join(""); 
        
        areaFinalizado.innerHTML = htmlCards;

    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
        // Aqui você pode colocar um aviso visual na tela para o usuário saber que falhou
    }
}
carregarServicosFinalizados();