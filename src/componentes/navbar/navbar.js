function carregarNavbarHome(){
    const html = `
        <nav class="navbar nav-home">
            <div class="logo"><img src="/assets/imagens/PhilanceHome.png"> </div>
            <ul class "nav-links">
                <button class="button-login" onclick="window.location.href='/src/pages/login/loginE&F.html'">Entrar</button>
                <button class= "btn btn-dark" onclick="window.location.href='/src/pages/cadastro/cadastroE&F.html'">Cadastre-se</button>
            </ul>
        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;
    
}
function carregarNavbarHomeEmpresa(){
    const html = `
        <nav class="navbar nav-home-empresa">
            <div class="logo">
                <img src="/assets/imagens/PhilanceEmpresa.png"> 
            </div>

            <div class="menu-central">
                <button class="button-home" onclick="window.location.href='/src/pages/Home/empresa/home.html'">
                <img src="/assets/imagens/IconeHome.png" class="icon-nav">
                Home</button>
                <button class="button-solicitar-servico" onclick="window.location.href='/src/pages/solicitarServico/solicitarServico.html'">
                <img src="/assets/imagens/IconeSolicitarServico.png" class="icon-servico">
                Solicitar Serviço</button>
            </div>
            <div class="perfil-container">
                <!-- 1. O botão que o usuário vai clicar -->
                <button id="botao-perfil" class="foto-perfil-btn">
                    <img src="/assets/imagens/building.png" alt="Perfil">
                </button>

                <!-- 2. O menu que vai aparecer e sumir (Substitua pelo conteúdo do seu container-perfil) -->
                <div id="menu-suspenso" class="dropdown-menu escondido">
                    <h3 id="username" class="username"></h3>
                    <span class="email" id="email">seu@email.com</span>
                    
                    <hr> <!-- Linha divisória opcional -->
                    
                    <a href="/src/pages/perfil/perfilE&F.html">Meu perfil</a>
                    <a href="#">Favoritos</a>
                    <a href="#">Bloqueados</a>
                    <a href="/src/index.html" class="sair">Sair</a>
                </div>
            </div>
        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;

    const botaoPerfil = document.getElementById('botao-perfil');
    const menuSuspenso = document.getElementById('menu-suspenso');

   
    botaoPerfil.addEventListener('click', function(event) {
        event.stopPropagation(); 
        
       
        menuSuspenso.classList.toggle('escondido');
    });


    document.addEventListener('click', function() {
        menuSuspenso.classList.add('escondido');
    });

        // 1. Recuperação e Validação do LocalStorage
    const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
    console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);

    if (!dadosSalvosFormulario) {
        console.log("Nenhum usuário encontrado no LocalStorage.");
    } else {
    try {
        const dadosFormulario = JSON.parse(dadosSalvosFormulario);
        
        if (dadosFormulario && dadosFormulario.username){
          document.getElementById("username").textContent = dadosFormulario.username;
        }

         if (dadosFormulario && dadosFormulario.email){
          document.getElementById("email").textContent = dadosFormulario.email;
        }

        } catch (erro) {
            console.error("Erro ao converter os dados do LocalStorage para JSON:", erro);
        }
    }

}

function carregarNavbarHomeFreelancer(){
    const html = `
        <nav class="navbar nav-home-empresa">
            <div class="logo">
                <img src="/assets/imagens/PhilanceFreelancer.png"> 
            </div>

            <div class="menu-central">
                <button class="button-home" onclick="window.location.href='/src/pages/Home/freelancer/homefreelancer.html'">
                <img src="/assets/imagens/IconeHome.png" class="icon-nav">
                Home</button>
                <button class="button-solicitar-servico" onclick="window.location.href='/src/pages/buscarServico/buscarServico.html'">
                <img src="/assets/imagens/IconBuscarServico.png" class="icon-servico">
                Buscar Serviços</button>
            </div>
            <div class="perfil-container">
                <!-- 1. O botão que o usuário vai clicar -->
                <button id="botao-perfil" class="foto-perfil-btn">
                    <img src="/assets/imagens/building.png" alt="Perfil">
                </button>

                <!-- 2. O menu que vai aparecer e sumir (Substitua pelo conteúdo do seu container-perfil) -->
                <div id="menu-suspenso" class="dropdown-menu escondido">
                    <h3 id="username" class="username"></h3>
                    <span class="email" id="email">seu@email.com</span>
                    
                    <hr> <!-- Linha divisória opcional -->
                    
                    <a href="/src/pages/perfil/perfilE&F.html">Meu perfil</a>
                    <a href="#">Favoritos</a>
                    <a href="#">Bloqueados</a>
                    <a href="/src/index.html" class="sair">Sair</a>
                </div>
            </div>
        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;

    const botaoPerfil = document.getElementById('botao-perfil');
    const menuSuspenso = document.getElementById('menu-suspenso');

   
    botaoPerfil.addEventListener('click', function(event) {
        event.stopPropagation(); 
        
       
        menuSuspenso.classList.toggle('escondido');
    });


    document.addEventListener('click', function() {
        menuSuspenso.classList.add('escondido');
    });

        // 1. Recuperação e Validação do LocalStorage
    const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
    console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);

    if (!dadosSalvosFormulario) {
        console.log("Nenhum usuário encontrado no LocalStorage.");
    } else {
    try {
        const dadosFormulario = JSON.parse(dadosSalvosFormulario);
        
        if (dadosFormulario && dadosFormulario.username){
          document.getElementById("username").textContent = dadosFormulario.username;
        }

         if (dadosFormulario && dadosFormulario.email){
          document.getElementById("email").textContent = dadosFormulario.email;
        }

        } catch (erro) {
            console.error("Erro ao converter os dados do LocalStorage para JSON:", erro);
        }
    }

}

