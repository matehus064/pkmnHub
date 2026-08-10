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

function adicionarNaColecao(usuario, carta, quantidade, precoCompra) {
    var instrucaoSql = `
        INSERT INTO colecao (fk_usuario, fk_carta, quantidade, preco_compra) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [usuario, carta, quantidade, precoCompra]);
}

function buscarValorTotalColecao(usuario) {
    var instrucaoSql = `
        SELECT SUM(b.preco_ligaPkmn * c.quantidade) AS valor_total_colecao FROM colecao c JOIN base_cards b ON b.id = c.fk_carta JOIN usuario u ON u.id = c.fk_usuario WHERE c.fk_usuario = ?;
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
        SELECT b.nome_pokemon, b.set_nome, b.url_imagem, b.preco_ligaPkmn FROM colecao AS c JOIN base_cards AS b ON c.fk_carta = b.id WHERE c.fk_usuario = ? ORDER BY b.preco_ligaPkmn DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function salvarSnapshot(usuario, valorTotal) {
    var instrucaoSql = `
        INSERT INTO snapshots_colecao (fk_usuario, valor_total) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [usuario, valorTotal]);
}

function buscarSnapshotHoje(usuario) {
    var instrucaoSql = `
        SELECT id FROM snapshots_colecao WHERE fk_usuario = ? AND DATE(data_snapshot) = CURDATE();
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function atualizarSnapshot(id, valorTotal) {
    var instrucaoSql = `
        UPDATE snapshots_colecao SET valor_total = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [valorTotal, id]);
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
SELECT 
    b.id AS fk_carta,
    b.url_imagem, 
    b.nome_pokemon, 
    b.set_nome, 
    b.numero_set,
    b.raridade,
    c.quantidade, 
    c.preco_compra, 
    b.preco_ligaPkmn,
    c.data_adicao
FROM base_cards b 
INNER JOIN colecao c ON c.fk_carta = b.id 
INNER JOIN usuario u ON c.fk_usuario = u.id 
WHERE u.id = ?
ORDER BY c.data_adicao DESC;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarValorPorSet(usuario) {
    var instrucaoSql = `
        SELECT bc.set_nome, SUM(bc.preco_ligaPkmn * c.quantidade) AS total_valor FROM base_cards AS bc INNER JOIN colecao AS c ON c.fk_carta = bc.id WHERE c.fk_usuario = ? GROUP BY bc.set_nome;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function verificarCartaNaColecaoPorId(usuario, carta) {
    var instrucaoSql = `
        SELECT quantidade FROM colecao WHERE fk_usuario = ? AND fk_carta = ?;
    `;
    return database.executar(instrucaoSql, [usuario, carta]);
}

function somarQuantidadeCompra(usuario, carta, quantidade, precoCompra) {
    var instrucaoSql = `
        UPDATE colecao 
        SET quantidade = quantidade + ?, 
            preco_compra = ?
        WHERE fk_usuario = ? AND fk_carta = ?;
    `;
    return database.executar(instrucaoSql, [quantidade, precoCompra, usuario, carta]);
}

function buscarColecaoSet(usuario, setId) {
    var instrucaoSql = `
        SELECT numero_carta, tem_normal, tem_reverse FROM colecao_sets
        WHERE fk_usuario = ? AND set_id = ?;
    `;
    return database.executar(instrucaoSql, [usuario, setId]);
}

function salvarColecaoSet(usuario, setId, numeroCarta, temNormal, temReverse) {
    var instrucaoSql = `
        INSERT INTO colecao_sets (fk_usuario, set_id, numero_carta, tem_normal, tem_reverse)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE tem_normal = VALUES(tem_normal), tem_reverse = VALUES(tem_reverse);
    `;
    return database.executar(instrucaoSql, [usuario, setId, numeroCarta, temNormal, temReverse]);
}

function deletarColecaoSet(usuario, setId, numeroCarta) {
    var instrucaoSql = `
        DELETE FROM colecao_sets
        WHERE fk_usuario = ? AND set_id = ? AND numero_carta = ?;
    `;
    return database.executar(instrucaoSql, [usuario, setId, numeroCarta]);
}

function atualizarItemColecao(usuario, carta, quantidade, precoCompra) {
    var instrucaoSql = `
        UPDATE colecao SET quantidade = ?, preco_compra = ? WHERE fk_usuario = ? AND fk_carta = ?;
    `;
    return database.executar(instrucaoSql, [quantidade, precoCompra, usuario, carta]);
}

module.exports = {
    existeCarta,
    cadastrar,
    adicionarNaColecao,
    verificarCartaNaColecaoPorId,
    somarQuantidadeCompra,
    buscarValorTotalColecao,
    buscarValorTotalCompra,
    buscarTotalCartas,
    buscarCartaMaisCara,
    salvarSnapshot,
    buscarSnapshotHoje,
    atualizarSnapshot,
    buscarSnapshots,
    buscarColecao,
    buscarValorPorSet,
    buscarColecaoSet,
    salvarColecaoSet,
    deletarColecaoSet,
    atualizarItemColecao
};