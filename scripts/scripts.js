let objetoNome;
let nome;

function entrarNaSala() {
    nome = document.querySelector(".tela-entrada input").value;
    objetoNome = {name: nome};
    const requisicaoEntrada = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", objetoNome);

    requisicaoEntrada.then(loginAceito);
    requisicaoEntrada.catch(loginErro);

    const elementoLogin = document.querySelector(".login");
    const elementoCarregando = document.querySelector(".carregando");
    elementoLogin.classList.add("escondido");
    elementoCarregando.classList.remove("escondido");
}

function loginAceito() {
    const elementoTelaEntrada = document.querySelector(".tela-entrada");
    elementoTelaEntrada.classList.add("escondido");

    setInterval(buscarMensagens, 3000);
    setInterval(manterConexao, 5000);

    buscarParticipantes();
    buscarMensagens();
}

function loginErro() {
    alert("Esse nome de usuário já existe!");
    //tratar o reload da tela quando isso acontecer. ela ta ficand ona tela de loading.
}

function manterConexao() {
    const conexaoAtiva = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", objetoNome);
}

function buscarParticipantes() {
    const participantes = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    participantes.then(renderizarParticipantes);
}

function renderizarParticipantes(participantes) {
    const arrayParticipantes = participantes.data;
    const elementoListaContatos = document.querySelector(".lista-contatos");
    elementoListaContatos.innerHTML = `
        <li onclick="selecionarContato(this)" class="contato selecionado">
            <ion-icon name="people"></ion-icon>
            <span>Todos</span>
            <img src="medias/checkverde.png" alt="ícone de checkmark verde">
        </li>
    `;

    for (let i = 0; i < arrayParticipantes.length; i++) {
        elementoListaContatos.innerHTML += `
            <li onclick="selecionarContato(this)" class="contato">
                <ion-icon name="person-circle"></ion-icon>
                <span>${arrayParticipantes[i].name}</span>
                <img class="escondido" src="medias/checkverde.png" alt="ícone de checkmark verde">
            </li>
        `;
        //depois tirar aqui o meu nome da lista de contatos
    }
}

function selecionarContato(contato) {
    const contatoSelecionadoAntes = document.querySelector(".tela-contatos .selecionado");
    contatoSelecionadoAntes.classList.remove("selecionado");
    const elementoCheckVerdeSelecionadoAntes = contatoSelecionadoAntes.querySelector("img");
    elementoCheckVerdeSelecionadoAntes.classList.add("escondido");

    const elementoCheckVerde = contato.querySelector("img");
    const contatoSelecionado = contato.querySelector("span").innerHTML;
    elementoCheckVerde.classList.remove("escondido");
    contato.classList.add("selecionado");
}

function buscarMensagens() {
    const mensagens = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    mensagens.then(renderizarMensagens);
}

function renderizarMensagens(mensagens) {
    const arrayMensagens = mensagens.data;
    const elementoMensagens = document.querySelector(".mensagens");
    elementoMensagens.innerHTML = "";

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

        if (arrayMensagens[i].type === "private_message" && arrayMensagens[i].to === nome) {
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

function rolarPaginaBaixo() {
    const elementoRolagem = document.querySelector(".mensagens li:last-child");
    elementoRolagem.scrollIntoView();
}

function enviarMensagem() {
    const textoMensagem = document.querySelector(".caixa-texto input").value;
    const objetoMensagem = {from: nome, to: "Todos", text: textoMensagem, type: "message"};
    const promessaMensagem = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", objetoMensagem);
    promessaMensagem.then(buscarMensagens);
    promessaMensagem.catch(desconectado);
}

function desconectado() {
    alert("Você foi desconectado, por favor, faça o login novamente.");
    window.location.reload();
}

function abrirContatos() {
    const elementoTelaContatos = document.querySelector(".tela-contatos");
    elementoTelaContatos.classList.toggle("escondido");
}