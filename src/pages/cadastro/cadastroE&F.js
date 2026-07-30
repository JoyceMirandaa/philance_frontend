console.log("Arquivo empresaCadastro.js carregado isoladamente de sua pasta!");

document.addEventListener("DOMContentLoaded", () => {
    inicializarEventosDoCadastro();
});

function inicializarEventosDoCadastro() {
    const btnCadastrar = document.getElementById("btnCadastrar");
    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", enviarDadosParaOBackend);
        console.log("Botão de cadastro ativado via Módulo!");
    }
}

let tipoUsuarioAtual = 'F';

// Ouvinte global no documento (Delegação de Eventos)
document.addEventListener('click', (event) => {
    const botaoClicado = event.target.closest('.switch-btn');
    if (!botaoClicado) return;

    // Busca os elementos dinamicamente para evitar erro caso não existam no carregamento
    const secaoFreelancer = document.getElementById('campos-freelancer-cadastro');
    const secaoEmpresa = document.getElementById('campos-empresa-cadastro');

    const botoesSwitch = document.querySelectorAll('.switch-btn');
    botoesSwitch.forEach(b => b.classList.remove('ativo'));
    
    botaoClicado.classList.add('ativo');

    const tipoSelecionado = botaoClicado.dataset.tipo;
    tipoUsuarioAtual = tipoSelecionado;

    // Alterna a exibição com segurança
    if (tipoSelecionado === 'F') {
        secaoFreelancer?.classList.remove('escondido');
        secaoEmpresa?.classList.add('escondido');
    } else if (tipoSelecionado === 'E') {
        secaoEmpresa?.classList.remove('escondido');
        secaoFreelancer?.classList.add('escondido');
    }
});

async function passwordHash(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

async function enviarDadosParaOBackend(event) {
    if (event) event.preventDefault();

    /* Dados pessoais */
    const cpfInput = document.getElementById("cpf");
    const cnpjInput = document.getElementById("cnpj");
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const nascimentoInput = document.getElementById('date');

    if (!usernameInput?.value || !emailInput?.value || !senhaInput?.value) {
        alert("Preencha todos os campos obrigatórios (Usuário, E-mail e Senha).");
        return;
    }

    // Gera o hash da senha de forma assíncrona
    const senhaDigitada = senhaInput.value;
    const passwordHashed = await passwordHash(senhaDigitada);

    // 1. Obtenção segura e sanitização da String
    let documentoValue = "";

    if (tipoUsuarioAtual === 'F' && cpfInput) {
        documentoValue = String(cpfInput.value).trim();
    } else if (tipoUsuarioAtual === 'E' && cnpjInput) {
        documentoValue = String(cnpjInput.value).trim();
    }

    // 2. Montagem do objeto JSON que vai para o backend
    const dadosFormulario = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput?.value || "",
        birthday: nascimentoInput?.value || "",
        type: tipoUsuarioAtual,
        password: passwordHashed,
        document: documentoValue  // Enviado como String
    };

    try {
        const resposta = await fetch('http://localhost:8080/register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        });

        const conteudoResposta = await resposta.json().catch(() => null);

        if (resposta.ok) {
            const usuarioLogado = conteudoResposta;

            if (usuarioLogado && tipoUsuarioAtual !== usuarioLogado.type) {
                const perfilCorreto = usuarioLogado.type === 'E' ? 'Empresa' : 'Freelancer';
                alert(`Atenção: Esta conta está registrada como perfil de ${perfilCorreto}. Selecione o tipo correto na tela.`);
                return; 
            }

            alert('Cadastro realizado com sucesso!');
            
            // Salva os dados no navegador
            localStorage.setItem("dadosFormulario", JSON.stringify(usuarioLogado));

            // Redirecionamento direto de página
            if (tipoUsuarioAtual === 'E') {
                window.location.href = "/src/pages/Home/empresa/home.html"; 
            } else if (tipoUsuarioAtual === 'F') {
                window.location.href = "/src/pages/Home/freelancer/homefreelancer.html"; 
            }
        } else {
            const mensagemErro = conteudoResposta?.message || 'Falha ao processar a requisição no servidor.';
            alert(`Erro (${resposta.status}): ${mensagemErro}`);
            console.error('Detalhes do envio:', dadosFormulario);
        }
    } catch (erro) {
        alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
        console.error('Erro na requisição:', erro);
    }
}