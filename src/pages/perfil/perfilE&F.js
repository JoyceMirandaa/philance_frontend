document.addEventListener("DOMContentLoaded", () => {
    configurarEnderecoUsuario();
});

// 1. Recuperação e Validação do LocalStorage
const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);
const dadosFormulario = JSON.parse(dadosSalvosFormulario);

document.getElementById("sobre-empresa").textContent = dadosFormulario.description;
document.getElementById("avaliar").textContent = dadosFormulario.average_rating;
document.getElementById("service-count").textContent = dadosFormulario.services_count;
document.getElementById("username").textContent = dadosFormulario.username;

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
