document.addEventListener("DOMContentLoaded", () => {
    configurarEnderecoUsuario();
});

const usuarioLogadoString = localStorage.getItem("dadosFormulario");
const usuarioLogado = JSON.parse(usuarioLogadoString);
document.getElementById("username").textContent = usuarioLogado.username;


async function configurarEnderecoUsuario() {
    const dadosEndereco = usuarioLogado.address;
    console.log("aqui", dadosEndereco)

    try {
        const respostaEndereco = await fetch('http://localhost:8080/info-address', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: dadosEndereco
        });

         const dadosDoServidor = await respostaEndereco.json(); 

        if (respostaEndereco.ok) {

            document.getElementById("cidade").textContent = dadosDoServidor.city;

            console.log(dadosDoServidor);
            localStorage.setItem("dadosEndereco", JSON.stringify(dadosDoServidor));
        
            
        } else {
            console.log(dadosDoServidor);
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
}


async function enviarDadosParaOBackendEditar(event) {
    if (event) event.preventDefault();

     // 1. PEGA OS DADOS DO USUÁRIO QUE JÁ ESTÃO GUARDADOS NO LOCALSTORAGE
    const usuarioLogadoString = localStorage.getItem("dadosEndereco");
    
    if (!usuarioLogadoString) {
      alert("Usuário não está logado!");
      return;
    }
    
    // Converte a string do localStorage de volta para um objeto JavaScript
    const usuarioLogadoPerfil = JSON.parse(usuarioLogadoString);
    console.log("Dados do usuário logado recuperados:", usuarioLogadoPerfil);


    const cepInput = document.getElementById("cep").textContent;
    const ruaInput = document.getElementById("rua");
    const numeroInput = document.getElementById('numero');
    const complementInput = document.getElementById('complemento');
    const bairroInput = document.getElementById('bairro');
    const cidadeinput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    
    const dadosFormulario = {
        zip_code: cepInput.value,
        street: ruaInput.value,
        number: numeroInput.value,
        complement: complementInput.value,
        neighborhood: bairroInput.value,
        city: cidadeinput.value,
        state: estadoInput.value,
        id_user: usuarioLogadoPerfil.id
    };



    try {
        const respostalogin = await fetch('http://localhost:8080/add-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        });

    } catch (erro) {
        console.error('Erro:', erro);
    }

}
