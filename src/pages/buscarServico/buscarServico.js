// Criamos a div pai na memória
const novoCard = document.createElement('div');

// 1. Aplicamos a classe CSS na div PAI (que você já estilizou no seu CSS)
novoCard.className = 'card-servicos'; 
novoCard.dataset.id = servico.id;

// 2. Aplicamos as classes nas tags FILHAS dentro do innerHTML
novoCard.innerHTML = `
    <span class="tag-hoje">HOJE</span>
    <p class="empresa-nome">${servico.empresa}</p>
    <h2 class="vaga-titulo">${servico.titulo}</h2>
    
    <div class="card-rodape">
        <span class="vaga-valor">${servico.valor}</span>
        <button class="btn-detalhes">Ver detalhes</button>
    </div>
`;