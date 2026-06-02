console.log("Arquivo empresaLogin.js carregado isoladamente de sua pasta!");

export function inicializarEventosDoCadastro() {
    const btnlogin = document.getElementById("btnlogin");
    if (btnlogin) {
        btnlogin.addEventListener("click", enviarDadosParaOBackend);
        console.log("Botão de cadastro ativado via Módulo!");
    }
}

function buscarServicosDoBanco() {
    fetch('http://localhost:8080/login-user')
        .then(resposta => resposta.json())
        .then(ListaDeServicos => {
            const container = document.getElementById('lista-servicos');
            container.innerHTML = '';

            if (ListaDeServicos.length === 0) {
                container.innerHTML = '<p> Nenhum Login encontrado </p>';
                return;
            }

            ListaDeServicos.forEach(servico => {
                const cartaoHtml = `
                    <div>
                        <h4> Vaga: ${servico.titulo}</h4>
                    </div>
                `;
                container.innerHTML += cartaoHtml;
            });
    })
    .catch(erro => {
        console.error('Erro ao buscar dados: ', erro)
        alert('Não foi possível carregar os serviços do banco.');
    })
}