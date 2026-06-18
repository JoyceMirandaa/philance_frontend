//Dados Serviços
const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
console.log(dadosSalvosFormulario)

if (!dadosSalvosFormulario){
  console.log("Nenhum usuario encontrado");
  // Como o index.html está na raiz do seu Live Server, basta usar '/' ou '/index.html'
  console.log(dadosSalvosFormulario)
} else {
   const dadosFormulario= JSON.parse(dadosSalvosFormulario);
   document.getElementById("average_rating").textContent = dadosFormulario.average_rating;
} 

const respostaSolicitados = await fetch("http://localhost:8080/assignments");

const servicosSolicitados = await respostaSolicitados.json();

console.log(servicosSolicitados)
