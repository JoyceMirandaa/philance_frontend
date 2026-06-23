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

        const tipoSelecionado = event.currentTarget.dataset.tipo;
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

async function passwordHash(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex
}


async function enviarDadosParaOBackend(event) {
    if (event) event.preventDefault();

    const cpfInput = document.getElementById("cpf");
    const cnpjInput = document.getElementById("cnpj");
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('password');
    const phoneinput = document.getElementById('phone');
    const nascimentouInput = document.getElementById('date');

    if (!usernameInput || !emailInput || !senhaInput) {
        console.error("Campos obrigatórios (username, email ou password) não foram encontrados no HTML.");
        return;
    }

    // Leitura segura do documento (CPF ou CNPJ)
    let documentoValue = "";
    if (tipoUsuarioAtual === 'F' && cpfInput) {
        documentoValue = cpfInput.value;
    } else if (tipoUsuarioAtual === 'E' && cnpjInput) {
        documentoValue = cnpjInput.value;
    }

    
    // Gera o hash da senha de forma assíncrona e segura
    const senhaDigitada = senhaInput.value;
    const passwordHashed = await passwordHash(senhaDigitada);
    
    const dadosFormulario = {
        username: usernameInput?.value || "",
        email: emailInput?.value || "",
        phone: phoneinput?.value || "",
        birthday: nascimentouInput?.value || "",
        type: tipoUsuarioAtual,
        password: passwordHashed,
        document: documentoValue
    };



     try {
        const respostalogin = await fetch('http://localhost:8080/register-user', {
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
