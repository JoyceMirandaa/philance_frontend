console.log("Arquivo empresaLogin.js carregado isoladamente de sua pasta!");

export function inicializarEventosDoLogin() {
    const btnlogin = document.getElementById("btnlogin");
    if (btnlogin) {
        btnlogin.addEventListener("click", bancoLogin);
        console.log("Botão de login ativado via Módulo!");
    }
}

function bancoLogin(event) {
  if (event) event.preventDefault();

  const dadosFormulario = {
    password: document.getElementById('password').value,
    email: document.getElementById('email').value,
  }

  // Faz o POST para enviar os dados de login
  fetch('http://localhost:8080/login-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosFormulario)
  })
  .then(resposta => {
    if (resposta.ok) {
      alert('Login! Salvo com sucesso');
      
      const modal = document.getElementById("modal-container");
      if (modal) modal.close();

    // Executa a próxima função (GET) após o sucesso do POST
      loginBanco(); 

    } else {
      alert('Erro no servidor.');
    }
  })
  .catch(erro => console.error('Erro no POST:', erro));
}

function loginBanco() {
  // Faz o GET para buscar os dados do usuário autenticado
  fetch('http://localhost:8080/login-user')
    .then(resposta => resposta.json())
    .then(ListaDeServicos => {
      
      if (ListaDeServicos.length === 0) {
        alert('Nenhum dado de usuário encontrado.');
        return;
      }

      // Guarda os dados no localStorage para usar na próxima página
      localStorage.setItem('dadosUsuario', JSON.stringify(ListaDeServicos));

      // Redireciona o usuário para a página interna/home do sistema
      window.location.href = '/src/pages/Home/empresa/home.html'; // <--- mude para o nome do seu HTML!

    })
    .catch(erro => {
      console.error('Erro ao buscar dados: ', erro);
      alert('Não foi possível carregar os dados do banco.');
    });
}
