let objetoNome;
let nome;

function entrarNaSala() {
    nome = document.querySelector(".tela-entrada input").value;
    objetoNome = {name: nome};
    let requisicaoEntrada;
    let elementoLogin;
    let elementoCarregando;

    if (nome !== "") {
        requisicaoEntrada = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", objetoNome);
        requisicaoEntrada.then(loginAceito);
        requisicaoEntrada.catch(loginErro);

        elementoLogin = document.querySelector(".login");
        elementoCarregando = document.querySelector(".carregando");
        elementoLogin.classList.add("escondido");
        elementoCarregando.classList.remove("escondido");
    }
}

function loginAceito() {
    const elementoTelaEntrada = document.querySelector(".tela-entrada");
    elementoTelaEntrada.classList.add("escondido");

    setInterval(buscarMensagens, 3000);
    setInterval(manterConexao, 5000);
    setInterval(buscarParticipantes, 10000);

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
        //tratar para ficar com o check verde mesmo se atualizar
    }
}

let contatoSelecionado = "Todos";

function selecionarContato(contato) {
    const contatoSelecionadoAntes = document.querySelector(".tela-contatos .selecionado");
    contatoSelecionadoAntes.classList.remove("selecionado");
    const elementoCheckVerdeSelecionadoAntes = contatoSelecionadoAntes.querySelector("img");
    elementoCheckVerdeSelecionadoAntes.classList.add("escondido");

    const elementoCheckVerde = contato.querySelector("img");
    contatoSelecionado = contato.querySelector("span").innerHTML;
    console.log(contatoSelecionado);
    elementoCheckVerde.classList.remove("escondido");
    contato.classList.add("selecionado");

    trocarAlvoMensagem();
}

let visibilidadeSelecionada = "Público";

function selecionarVisibilidade(visibilidade) {
    const visibilidadeSelecionadaAntes = document.querySelector(".visibilidade .selecionado");
    visibilidadeSelecionadaAntes.classList.remove("selecionado");
    const elementoCheckVerdeSelecionadoAntes = visibilidadeSelecionadaAntes.querySelector("img");
    elementoCheckVerdeSelecionadoAntes.classList.add("escondido");
    
    visibilidadeSelecionada = visibilidade.querySelector("span").innerHTML;
    console.log(visibilidadeSelecionada);
    const elementoCheckVerde = visibilidade.querySelector("img");
    elementoCheckVerde.classList.remove("escondido");
    visibilidade.classList.add("selecionado");
    
    trocarAlvoMensagem();
}

function trocarAlvoMensagem() {
    const elementoAlvoMensagem = document.querySelector(".alvo-mensagem");

    if (visibilidadeSelecionada === "Público") {
        elementoAlvoMensagem.innerHTML = `Enviando para ${contatoSelecionado} (publicamente)`;

    } else {
        elementoAlvoMensagem.innerHTML = `Enviando para ${contatoSelecionado} (reservadamente)`;
    }
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
                <div class="texto"><strong>${arrayMensagens[i].from}</strong> para <strong>${arrayMensagens[i].to}:</strong> ${arrayMensagens[i].text}</div>
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
    let textoMensagem = document.querySelector(".caixa-texto input").value;
    let objetoMensagem;
    let promessaMensagem;

    if (visibilidadeSelecionada === "Público") {
        objetoMensagem = {from: nome, to: contatoSelecionado, text: textoMensagem, type: "message"};
    } else {
        objetoMensagem = {from: nome, to: contatoSelecionado, text: textoMensagem, type: "private_message"};
    }
    
    if (textoMensagem !== "") {
        promessaMensagem = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", objetoMensagem);
        promessaMensagem.then(buscarMensagens);
        promessaMensagem.catch(desconectado);
    }
}

function desconectado() {
    alert("Você foi desconectado, por favor, faça o login novamente.");
    window.location.reload();
}

function abrirContatos() {
    const elementoTelaContatos = document.querySelector(".tela-contatos");
    elementoTelaContatos.classList.toggle("escondido");
}