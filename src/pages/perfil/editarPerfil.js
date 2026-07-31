async function enviarDadosParaOBackendEditar(event) {
    if (event) event.preventDefault();

     // 1. PEGA OS DADOS DO USUÁRIO QUE JÁ ESTÃO GUARDADOS NO LOCALSTORAGE
    const usuarioLogadoString = localStorage.getItem("dadosFormulario");
    
    if (!usuarioLogadoString) {
      alert("Usuário não está logado!");
      return;
    }
    
    // Converte a string do localStorage de volta para um objeto JavaScript
    const usuarioLogadoPerfil = JSON.parse(usuarioLogadoString);
    console.log("Dados do usuário logado recuperados:", usuarioLogadoPerfil);

    const cepInput = document.getElementById("cep");
    const ruaInput = document.getElementById("rua");
    const numeroInput = document.getElementById('numero');
    const complementInput = document.getElementById('complemento');
    const bairroInput = document.getElementById('bairro');
    const cidadeinput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    
    const dadosFormulario = {
        zip_code: cepInput.value,
        street: ruaInput.value,
        number: numeroInput.value,
        complement: complementInput.value,
        neighborhood: bairroInput.value,
        city: cidadeinput.value,
        state: estadoInput.value,
        id_user: usuarioLogadoPerfil.id
    };



     try {
        const respostalogin = await fetch('http://localhost:8080/add-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        });

        if (respostalogin.ok) {
            alert('Sucesso! Salvo no MySQL.');
            document.getElementById("modal-container").close();

            console.log(dadosFormulario);
                    
            const usuarioLogado = await respostalogin.json();
            localStorage.setItem("dadosFormulario", JSON.stringify(usuarioLogado));

            window.location.href = "/src/pages/Home/empresa/home.html"; 
        } else {
            alert('Erro no servidor.');
            console.log(dadosFormulario);
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }

}
