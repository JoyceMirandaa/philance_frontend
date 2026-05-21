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
                <button class="button-cadastro"><a class="titulo-cadastro" href="/src/pages/cadastro/freelancer/freelancerCadastro.html">Cadastrar</a></button>
                <button class="button-login"><a class="titulo-login" href="/scr/pages/cadastro/freelancer/freelancerCadastro.html">Entrar</a></button>
            </ul>

        </nav>
    `;
    const container = document.getElementById('space-navbar');
    if (container) container.innerHTML = html;
}
