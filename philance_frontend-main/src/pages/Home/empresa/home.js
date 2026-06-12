const dadosSalvos = localStorage.getItem("dadosUsuario");

if (!dadosSalvos){
  window.location.href = "index.html"
}

const usuario = JSON.parse(dadosSalvos)