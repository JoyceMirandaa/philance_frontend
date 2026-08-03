const usuarioLogadoString = localStorage.getItem("dadosFormulario");

if (usuarioLogadoString) {
    const usuarioLogado = JSON.parse(usuarioLogadoString);
    const selectElement = document.getElementById("rua"); // Seu select

    if (usuarioLogado.rua && selectElement) {
        // Limpa opções anteriores
        selectElement.innerHTML = '<option value="">Selecione o endereço...</option>';

        // Cria a opção com a rua do usuário logado
        const option = document.createElement("option");
        option.value = usuarioLogado.rua;
        option.textContent = `Meu Endereço: ${usuarioLogado.rua}`;
        option.selected = true; // Deixa ela já selecionada
        
        selectElement.appendChild(option);
    }
}



async function enviarDadosParaOBackendSolicitar(event, nomeDogrupo, nomeTags) {
    if (event) event.preventDefault();

    // 1. PEGA OS DADOS DO USUÁRIO QUE JÁ ESTÃO GUARDADOS NO LOCALSTORAGE
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    
    if (!usuarioLogadoString) {
      alert("Usuário não está logado!");
      return;
    }
    


    const description = document.querySelector('#description').value;
    const payment = document.querySelector('#payment');
    const min_age = document.querySelector('#min_age');

     // Busca o elemento selecionado dentro do grupo 'opcaoEnvio'
    const radioSelecionado = document.querySelector(`input[name="${nomeDogrupo}"]:checked`);
    const radioTags = document.querySelector(`input[name="${nomeTags}"]:checked`);

    const valorEnviado = radioSelecionado.value;
    const tags = radioTags.value;

    console.log(valorEnviado, tags)

    const dadosSolicitar = {
        title: tags,
        id: usuarioLogado.id,
        id_address: usuarioLogado.id_address,
        description: description.value,
        payment: payment.value,
        min_age: min_age.value,
        attire: valorEnviado,
        tag: tags,

    };

    try {
        const respostalogin = await fetch('http://localhost:8080/request-assignment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosSolicitar)
        });

        if (respostalogin.ok) {
            alert('Sucesso! Salvo no MySQL.');
            document.getElementById("modal-container").close();

            console.log(dadosSolicitar);
                    
            const usuarioLogado = await respostalogin.json();
            localStorage.setItem("dadosSolicitar", JSON.stringify(usuarioLogado));

            window.location.href = "/src/pages/Home/empresa/home.html"; 
        } else {
            alert('Erro no servidor.');
            console.log(dadosSolicitar);
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }

}
