async function enviarDadosParaOBackendSolicitar(event, nomeDogrupo) {
    if (event) event.preventDefault();

    // 1. PEGA OS DADOS DO USUÁRIO QUE JÁ ESTÃO GUARDADOS NO LOCALSTORAGE
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    
    if (!usuarioLogadoString) {
      alert("Usuário não está logado!");
      return;
    }
    
    // Converte a string do localStorage de volta para um objeto JavaScript
    const usuarioLogado = JSON.parse(usuarioLogadoString);
    console.log("Dados do usuário logado recuperados:", usuarioLogado);


    const description = document.querySelector('#description');
    const payment = document.querySelector('#payment');
    const min_age = document.querySelector('#min_age');

     // Busca o elemento selecionado dentro do grupo 'opcaoEnvio'
    const radioSelecionado = document.querySelector(`input[name="${nomeDogrupo}"]:checked`);

    const valorEnviado = radioSelecionado.value;
    console.log(valorEnviado)

    const dadosSolicitar = {
        id_user: usuarioLogado.id_user,
        description: description.value,
        payment: payment.value,
        min_age: min_age.value,
        attire: valorEnviado
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
