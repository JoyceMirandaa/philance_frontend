
//Dados Serviços
const dadosSalvosLogin = localStorage.getItem("dadosLogin");
console.log(dadosSalvosLogin)

if (!dadosSalvosLogin){
  console.log("Nenhum usuario encontrado");
  // Como o index.html está na raiz do seu Live Server, basta usar '/' ou '/index.html'
  console.log(dadosSalvosLogin)
} else {
   const dadosLogin= JSON.parse(dadosSalvosLogin);
   document.getElementById("average_rating").textContent = dadosLogin.average_rating;
} 
