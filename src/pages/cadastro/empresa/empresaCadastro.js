console.log("Arquivo empresaCadastro.js carregado isoladamente de sua pasta!");

// Adicione a palavra 'export' na frente da função
export function inicializarEventosDoCadastro() {
    const btnCadastrar = document.getElementById("btnCadastrar");
    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", enviarDadosParaOBackend);
        console.log("Botão de cadastro ativado via Módulo!");
    }
}

function enviarDadosParaOBackend(event) {
    if (event) event.preventDefault();
    
    const dadosFormulario = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        document: document.getElementById('document').value,
    };

    fetch('http://localhost:8080/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFormulario)
    })
    .then(resposta => {
        if (resposta.ok) {
            alert('Sucesso! Salvo no MySQL.');
            document.getElementById("modal-container").close();
        } else {
            alert('Erro no servidor.');
        }
    })
    .catch(erro => console.error('Erro:', erro));
}
