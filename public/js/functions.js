
//======================================================================================
//======================================================================================


// ----- ALGORITIMO SÓ PRA FORMATAR OS VALORES EM BRL: -----
function formatarBrl(valor) {
    if (valor == null) return "R$ 0,00";

    let v = Number(valor).toFixed(2);
    let posicaoPonto = v.indexOf('.');

    // Se a parte inteira tiver mais de 3 dígitos (ex: 1000.00 tem 4 dígitos antes do ponto)
    if (posicaoPonto > 3) {
        let parte1 = v.substring(0, posicaoPonto - 3); // Pega tudo antes do milhar
        let parte2 = v.substring(posicaoPonto - 3, posicaoPonto); // Pega os 3 últimos dígitos dos reais
        let centavos = v.substring(posicaoPonto + 1);

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

    document.querySelectorAll('input[name="n_tipo"]').forEach(function (r) { r.checked = false; });
    document.querySelectorAll('input[name="n_raridade"]').forEach(function (r) { r.checked = false; });
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
        setTimeout(function () { ipt_set.focus(); }, 50);

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
    document.querySelectorAll('input[name="n_raridade"]').forEach(function (r) { r.checked = false; });
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

    console.log("Carta encontrada:", carta);
    return carta;
}

//======================================================================================
//======================================================================================

function gerarLinkLigaPokemon(carta) {
    const numeroFormatado = String(carta.number).padStart(3, '0');
    const cardText = `${carta.name} (${numeroFormatado}/${carta.numSet})`;
    const cardEncoded = encodeURIComponent(cardText).replace(/'/g, '%27');
    return `https://www.ligapokemon.com.br/?view=cards/card&card=${cardEncoded}&ed=${carta.ptcgoCode}&num=${carta.number}`;
}

//======================================================================================
//======================================================================================

// -----BLOCO DE EXPORTAR COMPRA E VENDA -----
function abrirModalImport() {
    document.getElementById('modalImport').style.display = 'flex';
}

function fecharModalImport() {
    document.getElementById('modalImport').style.display = 'none';
    document.getElementById('txtImport').value = '';
    document.getElementById('div_validacao_import').innerHTML = '';
}

function executarImport(modo) {
    const dadoBruto = document.getElementById('txtImport').value.trim();
    const intervaloMs = Number(document.getElementById('ipt_intervalo').value);
    const intervaloPreCadastro = Number(document.getElementById('ipt_intervaloPreCadastro').value);
    const feedback = document.getElementById('div_validacao_import');

    if (!dadoBruto) {
        feedback.innerHTML = "<span style='color:#EE3D2D'>Cole os dados antes de executar.</span>";
        return;
    }

    fecharModalImport();
    exportarCartas(dadoBruto, modo, intervaloMs, intervaloPreCadastro);
}

function exportarCartas(dadoBruto, modo = 'compra', intervaloMs, intervaloPreCadastro) {
    // Configuração por modo
    const config = {
        compra: {
            campoValor: 'ipt_valorCompra',
            chaveValor: 'valorCompra',
            cadastrar: () => cadastrarCarta(),
            selecionarTipoRaridade: true,
            intervaloMsPadrao: 5000,
            intervaloPadrao: 2000
        },
        venda: {
            campoValor: 'ipt_valorVenda',
            chaveValor: 'valorVenda',
            cadastrar: () => cadastrarCartaVenda(),
            selecionarTipoRaridade: false,
            intervaloMsPadrao: 3000,
            intervaloPadrao: 500
        }
    };

    const cfg = config[modo];
    intervaloMs = intervaloMs || cfg.intervaloMsPadrao;
    intervaloPreCadastro = intervaloPreCadastro || cfg.intervaloPadrao;

    // ── Helpers ──────────────────────────────────────
    function normalizar(str) {
        return str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9 ]/g, "")
            .trim();
    }

    function nomesBatem(a, b) {
        a = normalizar(a); b = normalizar(b);
        return a === b || a.includes(b) || b.includes(a);
    }

    function parseValor(v) {
        if (!v) return 0;
        const s = v.replace(/\s/g, '');
        return s === '-' || s === '' ? 0 : parseFloat(s.replace(',', '.'));
    }

    function extrairValor(str, offset = 0) {
        const sub = str.slice(offset);
        const match = sub.match(/R?\$?\s*([\d]+(?:[.,]\d+)?|-)/);
        if (!match) return null;
        return { valor: parseValor(match[1]), end: offset + match.index + match[0].length };
    }

    // ── Parser ───────────────────────────────────────
    function parsearCartas(dado) {
        const linhas = dado.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const cartas = [];
        let i = 0;

        while (i < linhas.length) {
            const linha = linhas[i];
            const match = linha.match(/^(.+?)\s*\(([^)]+)\)/);
            if (!match) { i++; continue; }

            const nome = match[1].trim();
            const numero = match[2].trim();
            const isPromo = numero.includes('∞');

            let linhaDados = linha;
            if (!linha.match(/R?\$?\s*[\d]+(?:[.,]\d+)?/)) {
                i++;
                linhaDados = linhas[i] || '';
            }

            const offsetInicio = linhaDados.indexOf(')') + 1;
            const v1 = extrairValor(linhaDados, offsetInicio);
            if (!v1) { i++; continue; }

            const v2 = extrairValor(linhaDados, v1.end);
            if (!v2) { i++; continue; }

            cartas.push({ nome, numero, menorLiga: v1.valor, [cfg.chaveValor]: v2.valor, isPromo });
            i++;
        }

        return cartas;
    }

    // ── Validação ────────────────────────────────────
    function preValidar(carta) {
        if (carta.isPromo) {
            console.warn(`⚠️ PROMO ignorada: ${carta.nome} (${carta.numero})`);
            return null;
        }

        const numCarta = Number(carta.numero.substring(0, 3));
        const numSet = Number(carta.numero.substring(4, 7));
        const encontradas = [];

        for (let setId in bancoDados) {
            bancoDados[setId].forEach(c => {
                if (Number(c.number) === numCarta && Number(c.numSet) === numSet) {
                    encontradas.push(c);
                }
            });
        }

        if (encontradas.length === 0) {
            console.error(`❌ Não encontrada: ${carta.nome} (${carta.numero})`);
            return null;
        }

        if (encontradas.length === 1) {
            console.log(`✅ ${encontradas[0].name} | ${encontradas[0].ptcgoCode} | ${encontradas[0].rarity}`);
            return encontradas[0];
        }

        const porNome = encontradas.filter(c => nomesBatem(carta.nome, c.name));
        if (porNome.length >= 1) {
            if (porNome.length > 1) console.warn(`⚠️ Múltiplos para "${carta.nome}", usando o primeiro.`);
            console.log(`✅ ${porNome[0].name} | ${porNome[0].ptcgoCode} | ${porNome[0].rarity}`);
            return porNome[0];
        }

        console.error(`❌ Não foi possível desempatar: "${carta.nome}" (${carta.numero})`, encontradas);
        return null;
    }

    // ── Cadastro ─────────────────────────────────────
    function preencherECadastrar(carta, cartaDb, idx, total, callback) {
        if (cfg.selecionarTipoRaridade) {
            document.querySelectorAll('input[name="n_raridade"]').forEach(r => r.checked = false);
            document.querySelectorAll('input[name="n_tipo"]').forEach(r => r.checked = false);
            document.querySelector(`input[name="n_tipo"][value="${cartaDb.type}"]`)?.setAttribute('checked', true);
            document.querySelector(`input[name="n_raridade"][value="${cartaDb.rarity}"]`)?.setAttribute('checked', true);
        }

        document.getElementById('ipt_set').value = cartaDb.ptcgoCode;
        document.getElementById('ipt_numero').value = carta.numero;
        document.getElementById('ipt_precoLiga').value = carta.menorLiga;
        document.getElementById(cfg.campoValor).value = carta[cfg.chaveValor];

        if (typeof validandoImagem === 'function') validandoImagem(carta.numero, cartaDb.ptcgoCode);

        // Reafirma após validandoImagem
        document.getElementById(cfg.campoValor).value = carta[cfg.chaveValor];

        console.log(`[${idx}/${total}] ${cartaDb.name} (${carta.numero}) | ${cartaDb.ptcgoCode} | Liga: R$${carta.menorLiga} | ${cfg.chaveValor}: R$${carta[cfg.chaveValor]}`);

        setTimeout(() => { cfg.cadastrar(); callback(); }, intervaloPreCadastro);
    }

    // ── Execução ─────────────────────────────────────
    const cartas = parsearCartas(dadoBruto);
    const cartasValidadas = cartas
        .map(carta => ({ carta, cartaDb: preValidar(carta) }))
        .filter(({ cartaDb }) => cartaDb !== null);

    console.log(`🃏 ${cartasValidadas.length}/${cartas.length} cartas validadas:`);
    console.table(cartasValidadas.map(({ carta, cartaDb }) => ({
        numero: carta.numero,
        nome: cartaDb.name,
        set: cartaDb.ptcgoCode,
        rarity: cartaDb.rarity,
        menorLiga: carta.menorLiga,
        [cfg.chaveValor]: carta[cfg.chaveValor]
    })));

    let index = 0;
    function inserirProxima() {
        if (index >= cartasValidadas.length) {
            console.log('✅ Todas as cartas foram inseridas!');
            mensagemTemporizada(div_validacao, "<span style='color:#2ecc71'>✅ Lote importado com sucesso!</span>");
            return;
        }
        const { carta, cartaDb } = cartasValidadas[index++];
        preencherECadastrar(carta, cartaDb, index, cartasValidadas.length, () => {
            setTimeout(inserirProxima, intervaloMs);
        });
    }

    inserirProxima();
}

//======================================================================================
//======================================================================================

