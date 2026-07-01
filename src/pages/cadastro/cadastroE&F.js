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
const secaoFreelancer = document.getElementById('campos-freelancer');
const secaoEmpresa = document.getElementById('campos-empresa');

// Ouvinte global no documento (Delegação de Eventos)
document.addEventListener('click', (event) => {
    // Verifica se o clique foi em um botão switch
    const botaoClicado = event.target.closest('.switch-btn');
    
    // Se não foi em um switch button, ignora o clique
    if (!botaoClicado) return;

    // Busca TODOS os botões switch que estão na tela AGORA
    const botoesSwitch = document.querySelectorAll('.switch-btn');
    
    // Remove a classe ativo de todos
    botoesSwitch.forEach(b => b.classList.remove('ativo'));
    
    // Adiciona no que foi clicado
    botaoClicado.classList.add('ativo');

    const tipoSelecionado = botaoClicado.dataset.tipo;
    tipoUsuarioAtual = tipoSelecionado; // Sua variável global

    // Alterna a exibição dos campos
    if (tipoSelecionado === 'F') {
        secaoFreelancer.classList.remove('escondido');
        secaoEmpresa.classList.add('escondido');
    } else if (tipoSelecionado === 'E') {
        secaoEmpresa.classList.remove('escondido');
        secaoFreelancer.classList.add('escondido');
    }
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
            const usuarioLogado = await respostalogin.json();
        
            if (tipoUsuarioAtual !== usuarioLogado.type) {
                const perfilCorreto = usuarioLogado.type === 'E' ? 'Empresa' : 'Freelancer';
                alert(`Atenção: Esta conta está registrada como perfil de ${perfilCorreto}. Selecione o botão correto na tela.`);
                return; 
            }

            alert('Login realizado com sucesso!');
            
            const modal = document.getElementById("modal-container");
            if (modal && typeof modal.close === 'function') {
                modal.close();
            }
                    
            localStorage.setItem("dadosFormulario", JSON.stringify(usuarioLogado));

            console.log('Botão selecionado na tela:', tipoUsuarioAtual);
            console.log('Dados do banco de dados:', usuarioLogado);


            if (tipoUsuarioAtual === 'E') {
                window.location.href = "/src/pages/Home/empresa/home.html"; 
            } else if (tipoUsuarioAtual === 'F') {
                window.location.href = "/src/pages/Home/freelancer/homefreelancer.html"; 
            }
        } else {
            alert('Erro no servidor.');
            console.log(dadosFormulario);
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }

}
