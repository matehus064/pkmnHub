// ----- INFORMAÇÕES DO USER: -----
let username = sessionStorage.getItem("USERNAME");
document.getElementById("username").innerHTML = username;
let numeroImagem = sessionStorage.getItem("PROFILE_PIC");
header.innerHTML += '<img src="../assets/imgs/profilePics/' + numeroImagem + '.webp" class="user-avatar">';

//======================================================================================
//======================================================================================


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

//======================================================================================
//======================================================================================

// ----- ALGORITIMO SÓ PRA FORMATAR OS TEXTO PARA VALIDAÇÃO: -----
function formatarTexto(texto) {
    if (!texto) return "";
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

//======================================================================================
//======================================================================================

// ----- FUNÇÃO PRA HABILITAR E DESABILITAR A LEGENDA: -----
function toggleLegenda(idGrafico) {
    const isVisible = idGrafico.options.plugins.legend.display;

    idGrafico.options.plugins.legend.display = !isVisible;
    idGrafico.update({
        duration: 200,
        easing: 'easeOutQuad'
    });
}

//======================================================================================
//======================================================================================


// ----- TRANSIÇÃO PRA APARECER A IMAGEM: -----
    function trocarImagem(src) {
        imagem.style.opacity = 0;
        setTimeout(() => {
            imagem.src = src;
            imagem.style.opacity = 1;
        }, 200);
    }


    //======================================================================================
//======================================================================================


// ----- TRANSIÇÃO PRA APARECER A IMAGEM: -----
    function mensagemTemporizada(div, mensagem) {
        div.innerHTML = mensagem;
        setTimeout(() => {
            div.innerHTML = "";
        }, 5000);
    }


//======================================================================================
//======================================================================================

    function limparFormulario(campos) {
    for (var i = 0; i < campos.length; i++) {
        preencherSeExistir(campos[i].id, campos[i].valor);
    }

    var img = document.getElementById('imagem');
    if (img) img.style.opacity = '0';

    document.querySelectorAll('input[name="n_tipo"]').forEach(function(r) { r.checked = false; });
    document.querySelectorAll('input[name="n_raridade"]').forEach(function(r) { r.checked = false; });
}

//======================================================================================
//======================================================================================

// ----- AUTOMATIZAÇÃO DO CADASTRO  : -----
function preencherSeExistir(id, valor) {
    var elemento = document.getElementById(id);
    if (elemento) elemento.value = valor;
}

function validandoImagem(numeroIpt, setIpt) {
    let numCarta = Number(numeroIpt.substring(0, 3));
    let numSetTotal = numeroIpt.substring(4, 7);
    let raridadeCarta = document.querySelector('input[name="n_raridade"]:checked')?.value;
    let isPromo = raridadeCarta === "Promo";

    if (isNaN(numCarta) || numCarta === 0) return null;

    // ----- BLOCO PROMO: -----
    if (isPromo) {
        if (!setIpt) {
            ipt_set.style.border = "1px solid #F9CF30";
            mensagemTemporizada(div_validacao, "<span style='color: #EE3D2D'>Insira a expansão!</span>");
            return;
        }

        let setEncontrado = null;
        for (let i = 0; i < sets.length; i++) {
            if (formatarTexto(setIpt) === formatarTexto(sets[i].nomePt) ||
                formatarTexto(setIpt) === formatarTexto(sets[i].nomeEn) ||
                formatarTexto(setIpt) === formatarTexto(sets[i].sigla)) {
                setEncontrado = sets[i];
                break;
            }
        }

        if (setEncontrado) {
            ipt_set.style.border = "none";
            div_validacao.innerHTML = "";
            expansaoFinal = setEncontrado.nomeEn;
            preencherSeExistir("ipt_set", setEncontrado.nomeEn);
            trocarImagem("https://images.scrydex.com/pokemon/" + setEncontrado.apiId + "-" + numCarta + "/large");
            preencherSeExistir("ipt_url_imagem", "https://images.scrydex.com/pokemon/" + setEncontrado.apiId + "-" + numCarta + "/small");

            // ----- BUSCA A CARTA NO BANCO PARA PREENCHER O NOME: -----
            let cartasDoSet = bancoDados[setEncontrado.apiId];
            if (cartasDoSet) {
                let cartaPromo = cartasDoSet.find(c => Number(c.number) === numCarta);
                if (cartaPromo) {
                    preencherSeExistir("ipt_nome", cartaPromo.name);
                    console.log("✅ Carta promo encontrada:", cartaPromo);
                }
            }
        } else {
            ipt_set.style.border = "1px solid #F9CF30";
            mensagemTemporizada(div_validacao, "<span style='color: #EE3D2D'>Expansão não encontrada!</span>");
        }
        return;
    }

    // ----- BUSCA NORMAL: -----
    let cartasEncontradas = [];

    for (let setId in bancoDados) {
        let cartas = bancoDados[setId];
        for (let j = 0; j < cartas.length; j++) {
            if (Number(cartas[j].number) === numCarta && Number(cartas[j].numSet) === Number(numSetTotal)) {
                cartasEncontradas.push(cartas[j]);
                break;
            }
        }
    }

    // ----- VALIDAÇÕES: -----
    if (cartasEncontradas.length === 0 && numeroIpt.length === 7) {
        mensagemTemporizada(div_validacao, "<span style='color: #EE3D2D'>Número de set inválido!</span>");
        return false;
    }

    if (cartasEncontradas.length > 1 && numeroIpt.length === 7) {
        ipt_set.style.border = "1px solid #F9CF30";
        mensagemTemporizada(div_validacao, "<span style='color: #EE3D2D'>Múltiplos sets encontrados, insira a expansão!</span>");
        setTimeout(function() { ipt_set.focus(); }, 50);

        if (setIpt) {
            for (let i = 0; i < cartasEncontradas.length; i++) {
                let set = null;
                for (let j = 0; j < sets.length; j++) {
                    if (sets[j].apiId === cartasEncontradas[i].setId) {
                        set = sets[j];
                        break;
                    }
                }
                if (set && (
                    formatarTexto(setIpt) === formatarTexto(set.nomePt) ||
                    formatarTexto(setIpt) === formatarTexto(set.nomeEn) ||
                    formatarTexto(setIpt) === formatarTexto(set.sigla)
                )) {
                    cartasEncontradas = [cartasEncontradas[i]];
                    break;
                }
            }
        }
    }

    // ----- PREENCHE OS CAMPOS: -----
    if (cartasEncontradas.length !== 1) return null;

    let carta = cartasEncontradas[0];

    ipt_set.style.border = "none";
    expansaoFinal = carta.setNameEn;
    preencherSeExistir("ipt_set", carta.setNameEn);
    preencherSeExistir("ipt_nome", carta.name);
    preencherSeExistir("ipt_url_imagem", "https://images.scrydex.com/pokemon/" + carta.setId + "-" + numCarta + "/small");
    trocarImagem("https://images.scrydex.com/pokemon/" + carta.setId + "-" + numCarta + "/large");

    let radioTipo = document.querySelector('input[name="n_tipo"][value="' + carta.type + '"]');
    if (radioTipo) radioTipo.checked = true;

    // ----- RESETA E SETA A RARIDADE: -----
    document.querySelectorAll('input[name="n_raridade"]').forEach(function(r) { r.checked = false; });
    preencherSeExistir("ipt_raridade_fallback", "");

    if (numeroIpt.length >= 3) {
        let radioRaridade = document.querySelector('input[name="n_raridade"][value="' + carta.rarity + '"]');
        if (radioRaridade) {
            radioRaridade.checked = true;
        } else {
            preencherSeExistir("ipt_raridade_fallback", carta.rarity);
        }
    }

    if (document.getElementById("ipt_precoLiga")) ipt_precoLiga.focus();

    console.log("✅ Carta encontrada:", carta);
    return carta;
}

//======================================================================================
//======================================================================================

// LÓGICA DA BANDEJA (SIDEBAR)
document.addEventListener('DOMContentLoaded', function () {
    let cadastroMenu = document.getElementById('cadastroMenu');
    let linkCadastro = cadastroMenu.querySelector('.nav-link');

    linkCadastro.addEventListener('click', function (e) {
        e.preventDefault();
        cadastroMenu.classList.toggle('open');
    });
});