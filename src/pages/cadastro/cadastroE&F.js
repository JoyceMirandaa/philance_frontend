console.log("Arquivo empresaCadastro.js carregado isoladamente de sua pasta!");

document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById("username");
    const nascimentoInput = document.getElementById("date-nascimento");
    const criacaoInput = document.getElementById("date-criacao");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const cpfInput = document.getElementById("cpf");
    const cnpjInput = document.getElementById("cnpj");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    inicializarEventosDoCadastro();

    if(nomeInput){
    verificarNome();
    }
    if(nascimentoInput){
    nascimentoInput.max = new Date().toISOString().split("T")[0];
    verificarIdade();
    }
    if(criacaoInput){
    criacaoInput.max = new Date().toISOString().split("T")[0];
    verificarDataEmpresa();
    }
    if(emailInput){
        emailInput.addEventListener('blur', verificarEmail);
        }

    if(phoneInput){
        phoneInput.addEventListener("input", formatarPhone);
        phoneInput.addEventListener("blur", verificarPhone);
    }

    if(cpfInput){
        verificarCPF();
    }
    
    if(cnpjInput){
        verificarCNPJ();        
    }

    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener("input", verificarPassword);
        confirmPasswordInput.addEventListener("input", verificarPassword);
    }
    
    
});

function inicializarEventosDoCadastro() {
    const btnCadastrar = document.getElementById("btnCadastro");
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
    const secaoFreelancer = document.getElementById('campo-data-freelancer-cadastro');
    const secaoEmpresa = document.getElementById('campo-data-empresa-cadastro');
    const secaoFreelancercpf = document.getElementById('campo-cpf-freelancer-cadastro');
    const secaoEmpresacnpj = document.getElementById('campo-cnpj-empresa-cadastro');

    const secaoFreelancerSobre = document.getElementById('campo-sobre-freelancer-cadastro');
    const secaoEmpresaSobre = document.getElementById('campo-sobre-empresa-cadastro');

    const btnAvancarStep2 = document.querySelector('#step2 .btn-dark');

    const botoesSwitch = document.querySelectorAll('.switch-btn');
    botoesSwitch.forEach(b => b.classList.remove('ativo'));
    
    botaoClicado.classList.add('ativo');

    const tipoSelecionado = botaoClicado.dataset.tipo;
    tipoUsuarioAtual = tipoSelecionado;

    // Alterna a exibição com segurança
    if (tipoSelecionado === 'F') {
        secaoFreelancer?.classList.remove('escondido');
        secaoEmpresa?.classList.add('escondido');
        secaoFreelancercpf?.classList.remove('escondido');
        secaoEmpresacnpj?.classList.add('escondido');
        secaoFreelancerSobre?.classList.remove('escondido');
        secaoEmpresaSobre?.classList.add('escondido')

        if (btnAvancarStep2) {
            btnAvancarStep2.innerHTML = 'Avançar <i class="fa-solid icon-arrowR"></i>';
        }
        
    } else if (tipoSelecionado === 'E') {
        secaoEmpresa?.classList.remove('escondido');
        secaoFreelancer?.classList.add('escondido');
        secaoEmpresacnpj?.classList.remove('escondido');
        secaoFreelancercpf?.classList.add('escondido');
        secaoEmpresaSobre?.classList.remove('escondido');
        secaoFreelancerSobre?.classList.add('escondido')

        if (btnAvancarStep2) {
            btnAvancarStep2.innerHTML = 'Cadastrar <i class="fa-solid fa-paper-plane icon-paper"></i></i>';
        }
    }
});

const cepInput = document.getElementById('cep');

cepInput.addEventListener('input', async (event) => {
       
    const cep = event.target.value.replace(/\D/g, "");

    if (cep.length === 8) {
        try {
            const url = "https://viacep.com.br/ws/" + cep + "/json/";
            const resposta = await fetch(url);
            const dados = await resposta.json();

            if (dados.erro) {
                alert("CEP não encontrado!");
                limparFormulario();
            } else {
                preencherFormulario(dados);
            }
        } catch (erro) {
            console.error("Erro ao buscar o CEP:", erro);
            alert("Erro de conexão ao buscar o CEP.");
            console.log(cep)
        }
    }
});

function preencherFormulario(dados) {
    document.getElementById('rua').value = dados.logradouro;
    document.getElementById('bairro').value = dados.bairro;
    document.getElementById('cidade').value = dados.localidade;
    document.getElementById('uf').value = dados.uf;
}

function limparFormulario() {
    document.getElementById('rua').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidade').value = "";
    document.getElementById('uf').value = "";
}

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
    const nascimentoInput = document.getElementById('date-nascimento');
    const criacaoInput = document.getElementById('date-criacao')
    const sobreVoce = document.getElementById('sobre');
    const sobreEmpresa = document.getElementById('sobre')
    

    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const complementoInput = document.getElementById('complemento');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');

    // Gera o hash da senha de forma assíncrona
    const senhaDigitada = senhaInput.value;
    const passwordHashed = await passwordHash(senhaDigitada);

    // 1. Obtenção segura e sanitização da String
    let documentoValue = "";
    let dateValue = "";
    let descricaoValue = "";

    if (tipoUsuarioAtual === 'F' && cpfInput && nascimentoInput) {
        documentoValue = String(cpfInput.value).trim().replace(/\D/g,"");
        dateValue = String(nascimentoInput.value).trim();
        descricaoValue = String(sobreVoce.value).trim();
    } else if (tipoUsuarioAtual === 'E' && cnpjInput && criacaoInput) {
        documentoValue = String(cnpjInput.value).trim().replace(/\D/g,"");
        dateValue = String(criacaoInput.value).trim();
        descricaoValue = String(sobreEmpresa.value).trim();
    }

    if (descricaoValue == null){
        descricaoValue = "Sem descrição.";
    }

    // 2. Montagem do objeto JSON que vai para o backend
    const dadosFormulario = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput?.value || "",
        birthday: dateValue,
        type: tipoUsuarioAtual,
        description: descricaoValue,
        password: passwordHashed,
        document: documentoValue,  // Enviado como String
        zip_code: cepInput.value.replace(/\D/g,""),
        street: ruaInput.value,
        number: numeroInput.value,
        complement: complementoInput.value,
        neighborhood: bairroInput.value,
        city: cidadeInput.value,
        state: ufInput.value
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

window.nextStep = function(stepNumber) {

    if(stepNumber === 2){

        let valido = true;

        const nome = document.getElementById("username");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const senha = document.getElementById("password");
        const confirmar = document.getElementById("confirm-password");


        // Limpa mensagem anterior
        const mensagemAntiga = document.getElementById("mensagem-avancar");

        if(mensagemAntiga){
            mensagemAntiga.remove();
        }


        // Nome
        if(nome.value.trim() === ""){

            document.getElementById("mensagem-nome").textContent =
            "Digite seu nome completo.";

            nome.setAttribute("data-valido","false");
            valido = false;

        }else{

            document.getElementById("mensagem-nome").textContent = "";
            nome.setAttribute("data-valido","true");

        }


        // Data freelancer / empresa
        if(tipoUsuarioAtual === "F"){

            const nascimento = document.getElementById("date-nascimento");

            if(nascimento.getAttribute("data-valido") !== "true"){
                valido = false;
            }

        }else{

            const criacao = document.getElementById("date-criacao");

            if(criacao.getAttribute("data-valido") !== "true"){
                valido = false;
            }

        }


        // Email
        verificarEmail();

        if(email.getAttribute("data-valido") !== "true"){
            valido = false;
        }


        // Telefone
        verificarPhone();

        if(phone.getAttribute("data-valido") !== "true"){
            valido = false;
        }


        // CPF
        if(tipoUsuarioAtual === "F"){

            const cpf = document.getElementById("cpf");

            if(cpf.getAttribute("data-valido") !== "true"){
                valido = false;
            }

        }


        // CNPJ
        if(tipoUsuarioAtual === "E"){

            const cnpj = document.getElementById("cnpj");

            if(cnpj.getAttribute("data-valido") !== "true"){
                valido = false;
            }

        }


        // Senha
        verificarPassword();

        if(
            senha.getAttribute("data-valido") !== "true" ||
            confirmar.getAttribute("data-valido") !== "true"
        ){

            valido = false;

        }


        // Mensagem acima do botão
        if(!valido){

            const mensagem = document.createElement("div");

            mensagem.id = "mensagem-avancar";
            mensagem.textContent =
            "Preencha todos os campos corretamente antes de avançar.";


            const botoes = document.querySelector("#step1 .buttons");

            botoes.parentNode.insertBefore(
                mensagem,
                botoes
            );


            return;

        }

    }

    // CASO SEJA EMPRESA: Se tentar ir para o passo 3, finaliza o cadastro aqui
    if (tipoUsuarioAtual === 'E' && stepNumber === 3) {
        enviarDadosParaOBackend();
        return; // Para a execução e não muda de step
    }

    // Continua para próxima etapa
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    const targetStep = document.getElementById("step" + stepNumber);

    if(targetStep){
        targetStep.classList.add("active");

    }

};

function verificarNome(){

    const nomeInput = document.getElementById("username");
    const mensagem = document.getElementById("mensagem-nome");

    if(!nomeInput || !mensagem) return;

    nomeInput.addEventListener("blur", () => {

        const nome = nomeInput.value.trim();

        if(nome === ""){

            mensagem.textContent = "Digite seu nome completo.";
            nomeInput.setAttribute("data-valido","false");

        }else{

            mensagem.textContent = "";
            nomeInput.setAttribute("data-valido","true");

        }

    });
}
function verificarIdade(){
    const nascimentoInput = document.getElementById("date-nascimento");
    const mensagem = document.getElementById("mensagem-birthday");

    if(!nascimentoInput || !mensagem) return;

    nascimentoInput.addEventListener("change", () => {

        const valor = nascimentoInput.value;

        if(!valor){
            mensagem.textContent = "";
            nascimentoInput.removeAttribute("data-valido");
            return;
        }

        const dataNascimento = new Date(valor);
        const hoje = new Date();

        // Impede datas inválidas
        if(isNaN(dataNascimento.getTime())){
            mensagem.textContent = "Data inválida.";
            nascimentoInput.setAttribute("data-valido","false");
            return;
        }

        // Remove horas para comparar somente datas
        dataNascimento.setHours(0,0,0,0);
        hoje.setHours(0,0,0,0);

        // Não permite hoje nem datas futuras
        if(dataNascimento >= hoje){

            mensagem.textContent = "Insira uma data válida.";
            nascimentoInput.setAttribute("data-valido","false");
            return;
        }


        let idade = hoje.getFullYear() - dataNascimento.getFullYear();

        const mes = hoje.getMonth() - dataNascimento.getMonth();

        if(mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())){
            idade--;
        }


        if(idade < 16){

            mensagem.textContent = "Você precisa ter no mínimo 16 anos.";
            nascimentoInput.setAttribute("data-valido","false");

        }else{

            mensagem.textContent = "";
            nascimentoInput.setAttribute("data-valido","true");

        }

    });
}
function verificarDataEmpresa(){

    const criacaoInput = document.getElementById("date-criacao");
    const mensagem = document.getElementById("mensagem-criacao");

    if(!criacaoInput || !mensagem) return;

    criacaoInput.addEventListener("change", () => {

        const dataCriacao = new Date(criacaoInput.value + "T00:00:00");
        const hoje = new Date();

        hoje.setHours(0,0,0,0);

        if(dataCriacao >= hoje){

            mensagem.textContent = "Insira uma data válida.";
            criacaoInput.setAttribute("data-valido","false");
            return;

        } else {

            mensagem.textContent = "";
            criacaoInput.setAttribute("data-valido","true");

        }

    });
}
function verificarEmail(){
    const emailInput = document.getElementById("email");
    const mensagem = document.getElementById("mensagem-email");

    if(!emailInput) return;

    if(emailInput.value.trim() === ""){
        emailInput.removeAttribute("data-valido");
        document.getElementById("mensagem-email").textContent = "";
        return;
    }

    const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (padrao.test(emailInput.value)) {
        mensagem.textContent = "";
        emailInput.setAttribute("data-valido", "true");
        return true;
    } else {
        
        mensagem.textContent = "Email Inválido";
        return false;
    }
    
}
function formatarPhone() {
    const phoneInput = document.getElementById("phone");
    const mensagem = document.getElementById("mensagem-phone");
    if (!phoneInput) return;

    let phone = phoneInput.value.replace(/\D/g, "");

    phone = phone.substring(0, 11);
    if (phone.length === 0) {
        mensagem.textContent = "";
        phoneInput.value = "";
        return;
    }
    if (phone.length <= 2) {
        phone = phone.replace(/^(\d{0,2})/, "($1");
    } 
    else if (phone.length <= 7) {
        phone = phone.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } 
    else {
        phone = phone.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    phoneInput.value = phone;
}

function verificarPhone(){
    const phoneInput = document.getElementById("phone");
    const mensagem = document.getElementById("mensagem-phone");


    const phone = phoneInput.value.replace(/\D/g, "");
    if (phone.length === 0) {
        mensagem.textContent = "";
        phoneInput.value = "";
        return;
    }
    if(phone.length !== 11){
        mensagem.textContent = "Número de celular inválido.";
        phoneInput.removeAttribute("data-valido");
        return false;
    }

    if(phone.charAt(2) !== "9"){
        mensagem.textContent = "Número de celular inválido.";
        phoneInput.removeAttribute("data-valido");
        return false;
    }

        mensagem.textContent = "";
        phoneInput.setAttribute("data-valido", "true");

        return true;
    
    if(phoneInput === 0){
        mensagem.textContent = "";
    }
}


function verificarCPF() {
    const mensagem = document.getElementById("mensagem-cpf");
    const cpfInput = document.getElementById('cpf');
    if (!cpfInput) return;

    
    cpfInput.addEventListener('input', (event) => {
        let valor = event.target.value.replace(/\D/g, "");
        if (valor.length <= 11) {
            cpfInput.maxLength = 14; 
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            event.target.value = valor;
        }
    const cpf = valor.replace(/\D/g, "");

    if (cpf.length === 11) {
            if (/^(\d)\1{10}$/.test(cpf)) {
                marcarCpfInvalido(cpfInput);
                return;
            }

            let s = 0, r;
            for (let i = 1; i <= 9; i++) {
                s += parseInt(cpf[i - 1]) * (11 - i);
            }
            r = (s * 10) % 11;
            if (r === 10 || r === 11) r = 0;
            if (r !== parseInt(cpf[9])) {
                marcarCpfInvalido(cpfInput);
                return;
            }

            s = 0;
            for (let i = 1; i <= 10; i++) {
                s += parseInt(cpf[i - 1]) * (12 - i);
            }
            r = (s * 10) % 11;
            if (r === 10 || r === 11) r = 0;
            if (r !== parseInt(cpf[10])) {
                marcarCpfInvalido(cpfInput);
                return;
            }

            marcarCpfValido(cpfInput);
        } else {
            cpfInput.removeAttribute('data-valido');
        }
        if(cpf.length < 0 && cpf.length < 11){
            
            cpfInput.setAttribute("data-valido", "false");
            mensagem.textContent = "CPF incompleto.";
            return;
        }

        if(cpf.length === 0){
        cpfInput.removeAttribute("data-valido");
        document.getElementById("mensagem-cpf").textContent = "";
        return;
         }

        if(cpf.length !== 11){
            
            cpfInput.removeAttribute("data-valido");
            mensagem.textContent = "CPF incompleto.";
            return;
    }
        
    });
}

function marcarCpfValido(input) {
    input.setAttribute("data-valido", "true");

    const mensagem = document.getElementById("mensagem-cpf");

    mensagem.textContent = "";
    
}

function marcarCpfInvalido(input) {
    input.setAttribute("data-valido", "false");

    const mensagem = document.getElementById("mensagem-cpf");
    mensagem.textContent = "CPF Inválido.";
}

function verificarCNPJ(){

    const cnpjInput = document.getElementById("cnpj");
    const mensagem = document.getElementById("mensagem-cnpj");

    if(!cnpjInput || !mensagem) return;


    cnpjInput.addEventListener("input", (event)=>{

        let cnpj = event.target.value.replace(/\D/g,"");


        if(cnpj.length > 14){
            cnpj = cnpj.substring(0,14);
        }


        let valor = cnpj;

        valor = valor.replace(/^(\d{2})(\d)/,"$1.$2");
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
        valor = valor.replace(/\.(\d{3})(\d)/,".$1/$2");
        valor = valor.replace(/(\d{4})(\d)/,"$1-$2");

        event.target.value = valor;


        if(cnpj.length === 0){
            mensagem.textContent = "";
            return;
        }


        if(cnpj.length < 14){
            mensagem.textContent = "CNPJ incompleto.";
            return;
        }


        if(validarCNPJ(cnpj)){
            mensagem.textContent = "";
            cnpjInput.setAttribute("data-valido","true");

        }else{
            mensagem.textContent = "CNPJ Inválido.";
            cnpjInput.setAttribute("data-valido","false");
        }

    });

}
function validarCNPJ(cnpj){

    if(cnpj.length !== 14) return false;

    if(/^(\d)\1+$/.test(cnpj)) return false;


    let tamanho = 12;
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);


    let soma = 0;
    let pos = tamanho - 7;

    for(let i = tamanho; i >= 1; i--){
        soma += numeros.charAt(tamanho-i) * pos--;
        if(pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if(resultado != digitos.charAt(0)){
        return false;
    }


    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);

    soma = 0;
    pos = tamanho - 7;

    for(let i = tamanho; i >= 1; i--){
        soma += numeros.charAt(tamanho-i) * pos--;
        if(pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;


    return resultado == digitos.charAt(1);
}
function verificarPassword() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const mensagemSenha = document.getElementById("mensagem-password");
    const mensagemConfirm = document.getElementById("mensagem-confirm-password");

    const senha = passwordInput.value;
    const confirmar = confirmPasswordInput.value;

    // Verifica tamanho da senha
    if (senha.length < 6 && senha.length > 0) {
        mensagemSenha.textContent = "Sua senha deve conter no mínimo 6 dígitos.";
        passwordInput.setAttribute("data-valido", "false");
        return;
    } else {
        mensagemSenha.textContent = "";
        passwordInput.setAttribute("data-valido", "true");
    }

    // Verifica confirmação
    if (confirmar !== "" && senha !== confirmar) {
        mensagemConfirm.textContent = "A confirmação de senha não confere.";
        confirmPasswordInput.setAttribute("data-valido", "false");
        return;
    } else {
        mensagemConfirm.textContent = "";
        confirmPasswordInput.setAttribute("data-valido", "true");
    }
}