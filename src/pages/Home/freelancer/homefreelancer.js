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
    try {
        const respostaSolicitados = await fetch("http://localhost:8080/assignments");
        
        // Verifica se o servidor respondeu com status de sucesso (200-299)
        if (!respostaSolicitados.ok) {
            throw new Error(`Erro na requisição: ${respostaSolicitados.status}`);
        }

        const servicosSolicitados = await respostaSolicitados.json();
        console.log("Serviços solicitados carregados com sucesso:", servicosSolicitados);
        
        // Retorna os dados caso você precise usá-los em outra parte do código
        return servicosSolicitados;

    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
        // Aqui você pode colocar um aviso visual na tela para o usuário saber que falhou
    }
}

carregarServicosSolicitados();