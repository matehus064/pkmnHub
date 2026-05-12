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


