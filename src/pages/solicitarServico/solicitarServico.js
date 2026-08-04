// Executa as funções de inicialização assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    configurarEnderecoUsuario();
    carregarTagsDoBackend();
});


function configurarEnderecoUsuario() {
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    if (usuarioLogadoString) {
        const usuarioLogado = JSON.parse(usuarioLogadoString);
        const selectElement = document.getElementById("rua");

        if (selectElement && usuarioLogado.address) {
            selectElement.innerHTML = '<option value="">Selecione o endereço...</option>';
            const option = document.createElement("option");
            option.value = usuarioLogado.address.id; 
            option.textContent = `${usuarioLogado.address.street}, ${usuarioLogado.address.number}`;
            option.selected = true; 
            selectElement.appendChild(option);
        }
    }
}

async function carregarTagsDoBackend() {
    const selectTags = document.getElementById('tags');
    if (!selectTags) return;

    try {
        const resposta = await fetch('http://localhost:8080/list-tags'); 
        
        if (!resposta.ok) throw new Error('Erro ao buscar tags do servidor');

        const listaDeTags = await resposta.json(); // Espera receber uma Array do backend

        // Limpa o "Carregando..." e define a opção padrão
        selectTags.innerHTML = '<option value="">Selecione uma tag...</option>';

        // Preenche o select com as tags vindas do banco
        listaDeTags.forEach(tag => {
            const option = document.createElement("option");
            
            option.value = tag.id;    
            option.textContent = tag.name_tag; 
            
            selectTags.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar tags:', erro);
        selectTags.innerHTML = '<option value="">Erro ao carregar tags</option>';
    }
}

async function enviarDadosParaOBackendSolicitar(event, nomeDogrupo, nomeTags) {
    if (event) event.preventDefault();

    const dadosLocalStorage = localStorage.getItem("dadosFormulario");
    
    if (!dadosLocalStorage) {
      alert("Usuário não está logado!");
      return;
    }

    // CORREÇÃO 1: Converter a string do localStorage em objeto para poder acessar .id e .address
    const usuarioLogado = JSON.parse(dadosLocalStorage);

    const campoDescription = document.getElementById('description');
    const campoPayment = document.getElementById('payment');
    const campoMinAge = document.getElementById('min_age');
    const campoTags = document.getElementById('tags');
    const campoTermino = document.getElementById('termino');
    const campoInicio = document.getElementById('inicio');


    const idTagSelecionada = campoTags ? campoTags.value : "";

    const nomeTagSelecionada = campoTags && campoTags.selectedIndex >= 0 ? campoTags.options[campoTags.selectedIndex].text : "";

    if (!idTagSelecionada) {
        alert("Por favor, selecione uma tag válida.");
        return;
    }

    const radioSelecionado = document.querySelector(`input[name="${nomeDogrupo}"]:checked`);
    const valorEnviado = radioSelecionado ? radioSelecionado.value : "";

    if (!campoDescription || !campoPayment || !campoMinAge) {
        console.error("Erro: Um ou mais campos não foram encontrados no HTML. Verifique os IDs!");
    }

    // CORREÇÃO 3: Uso das variáveis do objeto correto 'usuarioLogado' e checagem de segurança nas propriedades
    const dadosSolicitar = {
        id_company: usuarioLogado?.id || "",
        id_address: usuarioLogado?.address?.id || "", 
        title: nomeTagSelecionada, // Envia a tag selecionada
        description: campoDescription ? campoDescription.value : "", 
        payment: campoPayment ? campoPayment.value : "",
        min_age: campoMinAge ? campoMinAge.value : "",
        attire: valorEnviado,
        id_tag: idTagSelecionada,
        start_hour: campoInicio ? campoInicio.value : "",
        finish_hour: campoTermino ? campoTermino.value : ""
    };

    try {
        const respostalogin = await fetch('http://localhost:8080/request-assignment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosSolicitar)
        });

        if (respostalogin.ok) {
            alert('Sucesso! Salvo no MySQL.');
            
            const modal = document.getElementById("modal-container");
            if (modal && typeof modal.close === "function") modal.close();

            console.log(dadosSolicitar);
                    
            const respostaDados = await respostalogin.json();
            localStorage.setItem("dadosSolicitar", JSON.stringify(respostaDados));

            window.location.href = "/src/pages/Home/empresa/home.html"; 
        } else {
            alert('Erro no servidor.');
            console.log(dadosSolicitar);
        }
    } catch (erro) {
        console.error('Erro:', erro);
        console.log(dadosSolicitar);
    }
}

