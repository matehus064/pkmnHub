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


// LÓGICA DA BANDEJA (SIDEBAR)
document.addEventListener('DOMContentLoaded', function () {
    const cadastroMenu = document.getElementById('cadastroMenu');
    const linkCadastro = cadastroMenu.querySelector('.nav-link');

    linkCadastro.addEventListener('click', function (e) {
        e.preventDefault();
        cadastroMenu.classList.toggle('open');
    });
});


    function validandoImagem(inputNumero, inputExpansao) {
        let numeroIpt = ipt_numero.value;
        let setIpt = ipt_set.value;
        let makerSet = "";

        let numCarta = Number(numeroIpt.substring(0, 3));
        let numSetTotal = numeroIpt.substring(4, 7);

        // ----- VALIDAÇÃO DIFERENTE PRA PROMO: -----
        let raridadeCarta = document.querySelector('input[name="n_raridade"]:checked')?.value;

        // ----- BUSCA OS SETS QUE BATEM COM O NÚMERO: -----
        let setsEncontrados = [];

        for (let i = 0; i < sets.length; i++) {
            if (numSetTotal == sets[i].total) {
                setsEncontrados.push(sets[i]);
            }
        }

        // ----- CASO SEJA NECESSÁRIO O INPUT ELE APARECE E CASO SEJA INVÁLIDO RETORNA A FUNÇÃO: ----- 
        if (setsEncontrados.length == 0 && numeroIpt.length == 7) {
            ipt_set.style.display = "none";
            label_set.style.display = "none";
            ipt_set.value = '';
            div_validacao.innerHTML = "<span style='color: #EE3D2D'>Número de set inválido!</span>";
            console.log("INVÁLIDO!!!!!");
            return false;
        } else if (setsEncontrados.length > 1 && numeroIpt.length == 7) {
            ipt_set.style.display = "block";
            label_set.style.display = "block";
            div_validacao.innerHTML = "<span style='color: #EE3D2D'>Múltiplos sets encontrados, insira a expansão!</span>";
        } else {
            ipt_set.style.display = "none";
            label_set.style.display = "none";
            div_validacao.innerHTML = "";
            ipt_set.value = '';
        }

        if (setsEncontrados.length == 1) {
            makerSet = setsEncontrados[0].apiId;
            expansaoFinal = setsEncontrados[0].nomePt;

        } else if (setsEncontrados.length > 1) {
            for (let set of setsEncontrados) {
                if (formatarTexto(setIpt) == formatarTexto(set.nomePt) ||
                    formatarTexto(setIpt) == formatarTexto(set.nomeEn) ||
                    formatarTexto(setIpt) == formatarTexto(set.sigla)) {

                    makerSet = set.apiId;
                    expansaoFinal = set.nomePt;
                    break;
                }
            }
        }

        if (makerSet != "" && !isNaN(numCarta)) {
            imagem.src = `https://images.scrydex.com/pokemon/${makerSet}-${numCarta}/large`;
        }
    }

