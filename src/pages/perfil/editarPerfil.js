async function enviarDadosParaOBackend(event) {
    if (event) event.preventDefault();

    const cpfInput = document.getElementById("cpf");
    const cnpjInput = document.getElementById("cnpj");
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('password');
    const phoneinput = document.getElementById('phone');
    const nascimentouInput = document.getElementById('date');

    if (!usernameInput || !emailInput || !senhaInput) {
        console.error("Campos obrigatórios (username, email ou password) não foram encontrados no HTML.");
        return;
    }

    // Leitura segura do documento (CPF ou CNPJ)
    let documentoValue = "";
    if (tipoUsuarioAtual === 'F' && cpfInput) {
        documentoValue = cpfInput.value;
    } else if (tipoUsuarioAtual === 'E' && cnpjInput) {
        documentoValue = cnpjInput.value;
    }

    
    // Gera o hash da senha de forma assíncrona e segura
    const senhaDigitada = senhaInput.value;
    const passwordHashed = await passwordHash(senhaDigitada);
    
    const dadosFormulario = {
        username: usernameInput?.value || "",
        email: emailInput?.value || "",
        phone: phoneinput?.value || "",
        birthday: nascimentouInput?.value || "",
        type: tipoUsuarioAtual,
        password: passwordHashed,
        document: documentoValue
    };



     try {
        const respostalogin = await fetch('http://localhost:8080/register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        });

        if (respostalogin.ok) {
            alert('Sucesso! Salvo no MySQL.');
            document.getElementById("modal-container").close();

            console.log(dadosFormulario);
                    
            const usuarioLogado = await respostalogin.json();
            localStorage.setItem("dadosFormulario", JSON.stringify(usuarioLogado));

            window.location.href = "/src/pages/Home/empresa/home.html"; 
        } else {
            alert('Erro no servidor.');
            console.log(dadosFormulario);
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }

}