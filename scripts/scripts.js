
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
        if (arrayMensagens[i].text.indexOf('entra') || arrayMensagens[i].text.indexOf('sai')) {
            elementoMensagens.innerHTML += `
            <li class="mensagem entra-sai">
                <div class="hora">(${arrayMensagens[i].time})</div>
                <div class="texto"><strong>${arrayMensagens[i].from}</strong> ${arrayMensagens[i].text}</div>
            </li>
        `;
        }
    }
}