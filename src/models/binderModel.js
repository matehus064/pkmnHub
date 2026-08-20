var database = require("../database/config")

function criarBinder(usuario, nomeBinder, tipoBinder, ordem) {
    var instrucaoSql = `
        INSERT INTO binder (fk_usuario, nome, tipo, ordem) VALUES ('${usuario}', '${nomeBinder}', '${tipoBinder}', ${ordem});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Upsert: cria a linha do slot se ainda não existir, ou atualiza se já existir.
// O truque "id = LAST_INSERT_ID(id)" garante que insertId sempre volta com o id
// certo da linha, tenha ela sido inserida agora ou já existisse antes.
function atualizarSlot(idBinder, numeroSlot, urlImagem, obtida) {
    if (obtida === undefined || obtida === null) obtida = 1;
    var instrucaoSql = `
        INSERT INTO binder_slots (fk_binder, slot, url_imagem, obtida)
        VALUES (${idBinder}, ${numeroSlot}, '${urlImagem}', ${obtida})
        ON DUPLICATE KEY UPDATE
            url_imagem = VALUES(url_imagem),
            obtida = VALUES(obtida),
            id = LAST_INSERT_ID(id);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Remove a linha por completo (não é mais um UPDATE pra null) — devolve o
// espaço de verdade pro banco em vez de manter uma linha vazia pra sempre.
function limparSlot(idBinder, numeroSlot) {
    var instrucaoSql = `
        DELETE FROM binder_slots WHERE fk_binder = ${idBinder} AND slot = ${numeroSlot};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarBinders(usuario) {
    var instrucaoSql = `
        SELECT id, fk_usuario, nome, tipo, ordem FROM binder WHERE fk_usuario = '${usuario}' ORDER BY ordem ASC, id ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarBindersPorUsername(username) {
    var instrucaoSql = `
        SELECT b.id, b.nome, b.tipo 
        FROM binder b
        JOIN usuario u ON u.id = b.fk_usuario
        WHERE u.username = '${username}'
        ORDER BY b.ordem ASC, b.id ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarSlots(idBinder) {
    var instrucaoSql = `
        SELECT 
            b.nome, b.tipo,
            bs.id, bs.slot, bs.url_imagem, bs.obtida
        FROM binder b
        LEFT JOIN binder_slots bs ON bs.fk_binder = b.id
        WHERE b.id = '${idBinder}';
    `;
    return database.executar(instrucaoSql);
}

function deletarBinder(idBinder) {
    var instrucaoSql = `DELETE FROM binder WHERE id = ${idBinder};`;
    return database.executar(instrucaoSql);
}

// Também passa a ser endereçado por número de slot em vez de id — só é
// chamado sobre slots que já têm carta, mas manter tudo no mesmo padrão
// evita ter dois "modelos mentais" diferentes no mesmo arquivo.
function alternarPosseCarta(idBinder, numeroSlot, estadoAtual) {
    var novoEstado = estadoAtual == 1 ? 0 : 1;
    var instrucaoSql = `
        UPDATE binder_slots SET obtida = ${novoEstado}
        WHERE fk_binder = ${idBinder} AND slot = ${numeroSlot};
    `;
    return database.executar(instrucaoSql);
}

// Retorna os números de slot ocupados além de um limite — usado para
// bloquear a troca de tipo quando o novo tamanho não comporta as cartas atuais
function buscarPrimeiroSlotForaDoLimite(idBinder, limite) {
    var instrucaoSql = `
        SELECT MIN(slot) AS primeiroSlot FROM binder_slots WHERE fk_binder = ${idBinder} AND slot > ${limite};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarBinder(idBinder, nome, tipo) {
    var instrucaoSql = `
        UPDATE binder SET nome = '${nome}', tipo = '${tipo}' WHERE id = ${idBinder};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarProximaOrdem(usuario) {
    var instrucaoSql = `
        SELECT COALESCE(MAX(ordem), -1) + 1 AS proximaOrdem FROM binder WHERE fk_usuario = '${usuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Recebe os ids na ordem final desejada e reescreve o campo "ordem" de
// todos numa única query, usando CASE em vez de um UPDATE por item
function reordenarBinders(usuario, idsOrdenados) {
    if (!idsOrdenados.length) return Promise.resolve();

    var casos = idsOrdenados.map(function (id, index) {
        return `WHEN ${id} THEN ${index}`;
    }).join(' ');
    var listaIds = idsOrdenados.join(',');

    var instrucaoSql = `
        UPDATE binder SET ordem = CASE id ${casos} END
        WHERE fk_usuario = '${usuario}' AND id IN (${listaIds});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function inserirSlotsEmLote(idBinder, slots) {
    if (!slots.length) return Promise.resolve();

    var valores = slots.map(function (slot) {
        var obtida = slot.obtida ? 1 : 0;
        var urlEscapada = slot.urlImagem.replace(/'/g, "\\'");
        return `(${idBinder}, ${slot.slot}, '${urlEscapada}', ${obtida})`;
    }).join(',');

    var instrucaoSql = `
        INSERT INTO binder_slots (fk_binder, slot, url_imagem, obtida)
        VALUES ${valores}
        ON DUPLICATE KEY UPDATE
            url_imagem = VALUES(url_imagem),
            obtida = VALUES(obtida);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    criarBinder,
    buscarBinders,
    buscarSlots,
    atualizarSlot,
    limparSlot,
    deletarBinder,
    alternarPosseCarta,
    buscarBindersPorUsername,
    buscarPrimeiroSlotForaDoLimite,
    atualizarBinder,
    buscarProximaOrdem,
    reordenarBinders,
    inserirSlotsEmLote
};