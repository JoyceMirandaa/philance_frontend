console.log("Arquivo empresaCadastro.js carregado isoladamente de sua pasta!");

// Adicione a palavra 'export' na frente da função
export function inicializarEventosDoCadastro() {
    const btnCadastrar = document.getElementById("btnCadastrar");
    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", enviarDadosParaOBackend);
        console.log("Botão de cadastro ativado via Módulo!");
    }
}

let tipoUsuarioAtual = 'F';

const botoesSwitch = document.querySelectorAll('.switch-btn');
const secaoFreelancer = document.getElementById('campos-freelancer');
const secaoEmpresa = document.getElementById('campos-empresa');

// 1. Controla a troca visual e atualiza a variável do tipo
botoesSwitch.forEach(botao => {
    botao.addEventListener('click', (event) => {
        botoesSwitch.forEach(b => b.classList.remove('ativo'));
        event.target.classList.add('ativo');

        const tipoSelecionado = event.target.getAttribute('data-tipo');
        tipoUsuarioAtual = tipoSelecionado; // Atualiza se é 'F' ou 'E'

        // Alterna a exibição dos campos na tela
        if (tipoSelecionado === 'F') {
            secaoFreelancer.classList.remove('escondido');
            secaoEmpresa.classList.add('escondido');
        } else if (tipoSelecionado === 'E') {
            secaoEmpresa.classList.remove('escondido');
            secaoFreelancer.classList.add('escondido');
        }
    });
});

function enviarDadosParaOBackend(event) {
    if (event) event.preventDefault();
    
    const dadosFormulario = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        document: document.getElementById('document').value,
        type: tipoUsuarioAtual
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
            window.location.href = '/src/pages/Home/empresa/home.html';
            alert('Sucesso', type)
        } else {
            alert('Erro no servidor.');
        }
    })
    .catch(erro => console.error('Erro:', erro));
}
