var database = require("../database/config")

function buscarCartaNaColecao(usuario, nomePokemon, numeroSet) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", usuario, nomePokemon, numeroSet)
    var instrucaoSql = `
    SELECT fk_usuario, fk_carta, quantidade, preco_compra, preco_ligaPkmn, data_adicao FROM colecao c INNER JOIN base_cards bc ON c.fk_carta = bc.id WHERE fk_usuario = '${usuario}' AND bc.nome_pokemon = '${nomePokemon}' AND bc.numero_set = '${numeroSet}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarQuantidade(usuario, carta, quantidade) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", usuario, carta, quantidade)
    var instrucaoSql = `
    UPDATE colecao SET quantidade = quantidade - '${quantidade}' WHERE fk_usuario = '${usuario}' AND fk_carta = '${carta}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function removerDaColecao (usuario, carta) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", usuario, carta)
    var instrucaoSql = `
    DELETE FROM colecao WHERE fk_usuario = '${usuario}' AND fk_carta = '${carta}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function registrarTransacao(usuario, carta, tipoMovimentacao, valorVenda, precoLigaPkmn) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario, carta, valorVenda, precoLigaPkmn);
    var instrucaoSql = `
        INSERT INTO transacoes (fk_usuario, fk_carta, tipo_movimentacao, valor_transacao, preco_ligaPkmn) VALUES ('${usuario}', '${carta}', '${tipoMovimentacao}', '${valorVenda}', '${precoLigaPkmn}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// ----- IMPLEMENTAÇÕES KPS: -----
function buscarTotalGasto (usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
        SELECT SUM(valor_transacao) AS total_investido FROM transacoes WHERE fk_usuario = '${usuario}' AND tipo_movimentacao = 'compra';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTotalRetorno (usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
        SELECT SUM(valor_transacao) AS total_retorno FROM transacoes WHERE fk_usuario = '${usuario}' AND tipo_movimentacao = 'venda';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarCartaNaColecao,
    atualizarQuantidade,
    removerDaColecao,
    registrarTransacao,
    buscarTotalGasto,
    buscarTotalRetorno
};