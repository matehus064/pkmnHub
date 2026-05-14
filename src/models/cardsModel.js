var database = require("../database/config")

function existeCarta(nomePokemon, numeroSet) {
    var instrucaoSql = `
        SELECT id, nome_pokemon, numero_set FROM base_cards WHERE nome_pokemon = ? AND numero_set = ?;
    `;
    return database.executar(instrucaoSql, [nomePokemon, numeroSet]);
}

function cadastrar(nomePokemon, tipoPokemon, nomeSet, raridadePokemon, numeroSet, urlCarta) {
    var instrucaoSql = `
        INSERT INTO base_cards (nome_pokemon, tipo, set_nome, raridade, numero_set, url_imagem) VALUES (?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [nomePokemon, tipoPokemon, nomeSet, raridadePokemon, numeroSet, urlCarta]);
}

function adicionarNaColecao(usuario, carta, quantidade, precoCompra, precoLigaPkmn) {
    var instrucaoSql = `
        INSERT INTO colecao (fk_usuario, fk_carta, quantidade, preco_compra, preco_ligaPkmn) VALUES (?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [usuario, carta, quantidade, precoCompra, precoLigaPkmn]);
}

function buscarValorTotalColecao(usuario) {
    var instrucaoSql = `
        SELECT SUM(c.preco_ligaPkmn * c.quantidade) AS valor_total_colecao FROM colecao c JOIN usuario u ON u.id = c.fk_usuario WHERE c.fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarValorTotalCompra(usuario) {
    var instrucaoSql = `
        SELECT SUM(c.preco_compra * c.quantidade) AS valor_total_compra FROM colecao c JOIN usuario u ON u.id = c.fk_usuario WHERE c.fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarTotalCartas(usuario) {
    var instrucaoSql = `
        SELECT SUM(quantidade) AS total_cartas_fisicas FROM colecao WHERE fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarCartaMaisCara(usuario) {
    var instrucaoSql = `
        SELECT b.nome_pokemon, b.set_nome, b.url_imagem, c.preco_ligaPkmn FROM colecao AS c JOIN base_cards AS b ON c.fk_carta = b.id WHERE c.fk_usuario = ? ORDER BY c.preco_ligaPkmn DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function salvarSnapshot(usuario, valorTotal) {
    var instrucaoSql = `
        INSERT INTO snapshots_colecao (fk_usuario, valor_total) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [usuario, valorTotal]);
}

function buscarSnapshots(usuario, intervalo) {
    // intervalo não pode ser prepared statement pois é parte da sintaxe SQL (INTERVAL 7 DAY)
    var instrucaoSql = `
        SELECT data_snapshot, valor_total FROM snapshots_colecao WHERE fk_usuario = ? AND data_snapshot >= DATE_SUB(NOW(), INTERVAL ${intervalo}) AND id IN (SELECT MAX(id) FROM snapshots_colecao WHERE fk_usuario = ? GROUP BY data_snapshot) ORDER BY data_snapshot ASC;
    `;
    return database.executar(instrucaoSql, [usuario, usuario]);
}

function buscarColecao(usuario) {
    var instrucaoSql = `
        SELECT b.url_imagem, b.nome_pokemon, b.set_nome, b.numero_set, c.quantidade, c.preco_compra, c.preco_ligaPkmn FROM base_cards b INNER JOIN colecao c ON c.fk_carta = b.id INNER JOIN usuario u ON c.fk_usuario = u.id WHERE u.id = ? ORDER BY b.set_nome ASC, b.numero_set ASC;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarValorPorSet(usuario) {
    var instrucaoSql = `
        SELECT bc.set_nome, SUM(c.preco_ligaPkmn * c.quantidade) AS total_valor FROM base_cards AS bc INNER JOIN colecao AS c ON c.fk_carta = bc.id WHERE c.fk_usuario = ? GROUP BY bc.set_nome;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

module.exports = {
    existeCarta,
    cadastrar,
    adicionarNaColecao,
    buscarValorTotalColecao,
    buscarValorTotalCompra,
    buscarTotalCartas,
    buscarCartaMaisCara,
    salvarSnapshot,
    buscarSnapshots,
    buscarColecao,
    buscarValorPorSet
};