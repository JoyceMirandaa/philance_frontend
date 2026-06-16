function carregarNavbarUsuario() {
    const html = `

        <nav class="navbar nav-usuario">
          <div class="logo"><a href="/src/index.html">Portal Usuário</a></div>
          <ul class="nav-links">
            <li><a href="/src/index.html">Home</a></li>
            <li><a href="/src/pages/usuario/perfil.html">Meu Perfil</a></li>
            <li><a href="/src/pages/usuario/vagas.html">Buscar Vagas</a></li>
          </ul>
        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;
}

function carregarNavbarEmpresa() {
    const html = `
        <nav class="navbar nav-empresa">
          <div class="logo"><a href="/src/index.html">Portal Empresa</a></div>
          <ul class="nav-links">
            <li><a href="/src/index.html">Home</a></li>
            <li><a href="/src/pages/empresa/dashboard.html">Painel</a></li>
            <li><a href="/src/pages/empresa/criar-vaga.html">Publicar Vaga</a></li>
          </ul>
        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;
}

function carregarNavbarHome(){
    const html = `
        <nav class="navbar nav-home">
            <div class="logo"><img src="/assets/imagens/PhilanceHome.png"> </div>
            <ul class "nav-links">
                <button class="button-login" onclick="abrirModal('/src/pages/login/loginE&F.html')">Entrar</button>
                <button class="button-cadastro" onclick="abrirModal('/src/pages/cadastro/cadastroE&F.html')">Cadastre-se</button>
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
                <button class="button-home">
                <img src="/assets/imagens/IconeHome.png" class="icon-nav">
                Home</button>
                <button class="button-solicitar-servico">
                <img src="/assets/imagens/IconeSolicitarServico.png" class="icon-nav">
                Solicitar Serviço</button>
            </div>
            <div class="perfil">
                <a>
                    <img src="../../../../assets/imagens/logoVerdeClaro.png"" alt="Perfil da Empresa" class="profile-photo" onclick="window.location.href='/src/index.html'">
                </a>
            </div>   
        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;
    
}