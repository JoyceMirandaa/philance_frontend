// 1. Recuperação e Validação do LocalStorage
const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);

if (!dadosSalvosFormulario) {
    console.log("Nenhum usuário encontrado no LocalStorage.");
    window.location.href = '/index.html'; 
} else {
    try {
        const dadosFormulario = JSON.parse(dadosSalvosFormulario);
        
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
    //Ai só troca a rota e adciona o que falta para o card do serviço aceitados quando o Antonio mudar o back =)
    try {
        const respostaSolicitados = await fetch("http://localhost:8080/all-assignments");
        

       const servicosSolicitados = await respostaSolicitados.json();
       console.log("Serviços solicitados carregados com sucesso:", servicosSolicitados);

        // CORREÇÃO: Acessa o primeiro item da lista dentro de content
        if (servicosSolicitados.content && servicosSolicitados.content.length > 0) {
            document.getElementById("title").textContent = servicosSolicitados.content[0].title;
        } else {
            document.getElementById("title").textContent = "Nenhum serviço disponível";
        }

        return servicosSolicitados;;

    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
        // Aqui você pode colocar um aviso visual na tela para o usuário saber que falhou
    }
}

carregarServicosSolicitados();

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
                    <h4> <span class="detalhe-nota-avaliacao"><i class="fa-solid fa-star"></i> 4.5</span></h4>
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
    console.log(dados)
    areaServico.innerHTML = `<p style="color: #ff4d4d; margin: 0;">Erro ao carregar o serviço. Tente novamente!</p>`;
    banner.classList.add('expandido');
  }
});