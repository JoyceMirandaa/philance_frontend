
console.log("Arquivo empresaCadastro.js carregado!");

function enviarDadosParaOBackend(event) {

    event.preventDefault();
    // 1. Pega os valores que foram digitados na tela do HTML
    const dadosFormulario = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        document: document.getElementById('document').value,
    };

    // 2. Faz o envio exato para o Spring Boot rodando no seu IntelliJ
    fetch('http://localhost:8080/register-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosFormulario) // Transforma os dados em JSON
    })
    .then(resposta => {
        if (resposta.ok) {
            alert('Sucesso! O Spring Boot salvou no MySQL.');
            // Limpa os campos da tela
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('email').value = '';
            document.getElementById('document').value = '';
        } else {
            alert('Erro ao enviar dados para o servidor.');
        }
    })
    .catch(erro => {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar ao Spring Boot. O IntelliJ está rodando?');
    });

    console.log("Função enviarDadosParaOBackend() finalizada.")
}

document.getElementById("btnCadastrar").addEventListener("click", enviarDadosParaOBackend);