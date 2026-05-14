// ----- INFORMAÇÕES DO USER: -----
let username = sessionStorage.getItem("USERNAME");
document.getElementById("username").innerHTML = username;
let numeroImagem = sessionStorage.getItem("PROFILE_PIC");
header.innerHTML += '<img src="../assets/imgs/profilePics/' + numeroImagem + '.webp" class="user-avatar">';

// ----- ALGORITIMO SÓ PRA FORMATAR OS VALORES EM BRL: -----
function formatarBrl(valor) {
    if (valor == null) return "R$ 0,00";

    let v = Number(valor).toFixed(2);

    if (v.length >= 7) {
        let parte1 = v.substring(0, 1);
        let parte2 = v.substring(1, v.indexOf('.'));
        let centavos = v.substring(v.indexOf('.') + 1);

        v = parte1 + "." + parte2 + "," + centavos;
    } else {
        v = v.replace(".", ",");
    }
    return "R$ " + v;
}

// ----- ALGORITIMO SÓ PRA FORMATAR OS TEXTO PARA VALIDAÇÃO: -----
function formatarTexto(texto) {
    if (!texto) return "";
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ----- FUNÇÃO PRA HABILITAR E DESABILITAR A LEGENDA: -----
function toggleLegenda(idGrafico) {
    const isVisible = idGrafico.options.plugins.legend.display;

    idGrafico.options.plugins.legend.display = !isVisible;
    idGrafico.update({
        duration: 200,
        easing: 'easeOutQuad'
    });
}

// ----- TRANSIÇÃO PRA APARECER A IMAGEM: -----
    function trocarImagem(src) {
        imagem.style.opacity = 0;
        setTimeout(() => {
            imagem.src = src;
            imagem.style.opacity = 1;
        }, 200);
    }

// ----- AUTOMATIZAÇÃO DO CADASTRO  : -----
function validandoImagem(numeroIpt, setIpt) {
    let numCarta = Number(numeroIpt.substring(0, 3));
    let numSetTotal = numeroIpt.substring(4, 7);
    let raridadeCarta = document.querySelector('input[name="n_raridade"]:checked')?.value;
    let isPromo = raridadeCarta === "Promo";

    // ----- HELPERS: -----
    let matchSet = (input, set) => [set.nomePt, set.nomeEn, set.sigla].some(
        nome => formatarTexto(input) === formatarTexto(nome)
    );

    let setErro = (msg) => {
        ipt_set.style.border = "1px solid #F9CF30";
        div_validacao.innerHTML = `<span style='color: #EE3D2D'>${msg}</span>`;
    };

    // ----- VALIDAÇÃO INICIAL: -----
    if (isNaN(numCarta) || numCarta === 0) return null;

    // ----- BLOCO PROMO: -----
    if (isPromo) {
        if (!setIpt) return setErro("Insira a expansão!");

        let setEncontrado = sets.find(s => matchSet(setIpt, s));

        if (setEncontrado) {
            ipt_set.style.border = "none";
            div_validacao.innerHTML = "";
            expansaoFinal = setEncontrado.nomeEn;
            ipt_set.value = setEncontrado.nomeEn;
            imagem.src = `https://images.scrydex.com/pokemon/${setEncontrado.apiId}-${numCarta}/large`;
        } else {
            setErro("Expansão não encontrada!");
        }
        return;
    }

    // ----- BUSCA NORMAL: -----
    let cartasEncontradas = Object.entries(bancoDados).reduce((acc, [setId, cartas]) => {
        let carta = cartas.find(c =>
            Number(c.number) === numCarta &&
            Number(c.numSet) === Number(numSetTotal)
        );
        if (carta) acc.push({ ...carta, setId });
        return acc;
    }, []);

    // ----- VALIDAÇÕES: -----
    if (!cartasEncontradas.length && numeroIpt.length === 7) {
        div_validacao.innerHTML = "<span style='color: #EE3D2D'>Número de set inválido!</span>";
        return false;
    }

    if (cartasEncontradas.length > 1 && numeroIpt.length === 7) {
        setErro("Múltiplos sets encontrados, insira a expansão!");

        if (setIpt) {
            let cartaFiltrada = cartasEncontradas.find(carta => {
                let set = sets.find(s => s.apiId === carta.setId);
                return set && matchSet(setIpt, set);
            });
            if (cartaFiltrada) cartasEncontradas = [cartaFiltrada];
        }
    }

    // ----- PREENCHE OS CAMPOS: -----
    if (cartasEncontradas.length !== 1) return null;

    let carta = cartasEncontradas[0];

    ipt_set.style.border = "none";
    ipt_nome.value = carta.name;
    expansaoFinal = carta.setNameEn;
    ipt_set.value = carta.setNameEn;
    trocarImagem(`https://images.scrydex.com/pokemon/${carta.setId}-${numCarta}/large`);

    let radioTipo = document.querySelector(`input[name="n_tipo"][value="${carta.type}"]`);
    if (radioTipo) radioTipo.checked = true;

    if (numeroIpt.length >= 3 && !raridadeCarta) {
        let radioRaridade = document.querySelector(`input[name="n_raridade"][value="${carta.rarity}"]`);
        if (radioRaridade) radioRaridade.checked = true;
    }

    console.log("✅ Carta encontrada:", carta);
    return carta;
}


// LÓGICA DA BANDEJA (SIDEBAR)
document.addEventListener('DOMContentLoaded', function () {
    let cadastroMenu = document.getElementById('cadastroMenu');
    let linkCadastro = cadastroMenu.querySelector('.nav-link');

    linkCadastro.addEventListener('click', function (e) {
        e.preventDefault();
        cadastroMenu.classList.toggle('open');
    });
});