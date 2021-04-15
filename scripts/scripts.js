buscarMensagens();

function buscarMensagens() {
    const mensagens = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    mensagens.then(renderizarMensagens);
}

function renderizarMensagens(mensagens) {
    const arrayMensagens = mensagens.data;
    console.log(arrayMensagens);
    const elementoMensagens = document.querySelector(".mensagens");

    for (let i = 0; i < arrayMensagens.length; i++) {
        if (arrayMensagens[i].type === "status") {
            elementoMensagens.innerHTML += `
            <li class="mensagem entra-sai">
                <div class="hora">(${arrayMensagens[i].time})</div>
                <div class="texto"><strong>${arrayMensagens[i].from}</strong> ${arrayMensagens[i].text}</div>
            </li>
        `;
        }

        if (arrayMensagens[i].type === "message") {
            elementoMensagens.innerHTML += `
            <li class="mensagem">
                <div class="hora">(${arrayMensagens[i].time})</div>
                <div class="texto"><strong>${arrayMensagens[i].from}</strong> para <strong>Todos:</strong> ${arrayMensagens[i].text}</div>
            </li>
        `;
        }

        if (arrayMensagens[i].type === "private_message") {
            elementoMensagens.innerHTML += `
            <li class="mensagem reservada">
                <div class="hora">(${arrayMensagens[i].time})</div>
                <div class="texto"><strong>${arrayMensagens[i].from}</strong> reservadamente para <strong>${arrayMensagens[i].to}:</strong> ${arrayMensagens[i].text}</div>
            </li>
        `;
        }
    }
    rolarPaginaBaixo();
}

//setInterval(buscarMensagens, 3000);

function rolarPaginaBaixo() {
    const elementoRolagem = document.querySelector(".mensagens li:last-child");
    elementoRolagem.scrollIntoView();
}

function entrarNaSala() {
    const nome = document.querySelector(".tela-entrada input").value;
    const objetoNome = {name: nome};
    const requisicaoEntrada = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", objetoNome);

    requisicaoEntrada.then(loginAceito);
    requisicaoEntrada.catch(loginErro);
}

function loginAceito() {
    const elementoTelaEntrada = document.querySelector(".tela-entrada");
    elementoTelaEntrada.classList.add("escondido");
}

function loginErro() {
    alert("Esse nome de usuário já existe!");
}

//setInterval(entrarNaSala, 5000);