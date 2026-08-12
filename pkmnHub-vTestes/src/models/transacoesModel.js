var database = require("../database/config")

function buscarCartaNaColecao(usuario, nomePokemon, numeroSet) {
    var instrucaoSql = `
        SELECT c.fk_usuario, c.fk_carta, c.quantidade, c.preco_compra, bc.preco_ligaPkmn, c.data_adicao FROM colecao c INNER JOIN base_cards bc ON c.fk_carta = bc.id WHERE c.fk_usuario = ? AND bc.nome_pokemon = ? AND bc.numero_set = ?;
    `;
    return database.executar(instrucaoSql, [usuario, nomePokemon, numeroSet]);
}

function atualizarQuantidade(usuario, carta, quantidade) {
    var instrucaoSql = `
        UPDATE colecao SET quantidade = quantidade - ? WHERE fk_usuario = ? AND fk_carta = ?;
    `;
    return database.executar(instrucaoSql, [quantidade, usuario, carta]);
}

function removerDaColecao(usuario, carta) {
    var instrucaoSql = `
        DELETE FROM colecao WHERE fk_usuario = ? AND fk_carta = ?;
    `;
    return database.executar(instrucaoSql, [usuario, carta]);
}

function registrarTransacao(usuario, carta, tipoMovimentacao, valorVenda, precoLigaPkmn) {
    var instrucaoSql = `
        INSERT INTO transacoes (fk_usuario, fk_carta, tipo_movimentacao, valor_transacao, preco_ligaPkmn) VALUES (?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [usuario, carta, tipoMovimentacao, valorVenda, precoLigaPkmn]);
}

function buscarTotalGasto(usuario) {
    var instrucaoSql = `
        SELECT SUM(valor_transacao) AS total_investido FROM transacoes WHERE fk_usuario = ? AND tipo_movimentacao = 'compra';
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarTotalRetorno(usuario) {
    var instrucaoSql = `
        SELECT SUM(valor_transacao) AS total_retorno FROM transacoes WHERE fk_usuario = ? AND tipo_movimentacao = 'venda';
    `;
    return database.executar(instrucaoSql, [usuario]);
}

function buscarEvolucaoColecao(usuario, intervalo) {
    // intervalo não pode ser prepared statement pois é parte da sintaxe SQL (INTERVAL 7 DAY)
    var instrucaoSql = `
        SELECT c.data_adicao, SUM(bc.preco_ligaPkmn * c.quantidade) AS valor_total FROM colecao c INNER JOIN base_cards bc ON c.fk_carta = bc.id WHERE c.fk_usuario = ? AND c.data_adicao >= DATE_SUB(NOW(), INTERVAL ${intervalo}) GROUP BY c.data_adicao ORDER BY c.data_adicao;
    `;
    return database.executar(instrucaoSql, [usuario]);
}

module.exports = {
    buscarCartaNaColecao,
    atualizarQuantidade,
    removerDaColecao,
    registrarTransacao,
    buscarTotalGasto,
    buscarTotalRetorno,
    buscarEvolucaoColecao
};