var database = require("../database/config")

function existeCarta(nomePokemon, numeroSet) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", nomePokemon, numeroSet)
    var instrucaoSql = `
        SELECT id, nome_pokemon, numero_set FROM base_cards WHERE nome_pokemon = '${nomePokemon}' AND numero_set = '${numeroSet}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nomePokemon, tipoPokemon, nomeSet, raridadePokemon, numeroSet, urlCarta) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomePokemon, tipoPokemon, nomeSet, raridadePokemon, numeroSet, urlCarta);
    var instrucaoSql = `
        INSERT INTO base_cards (nome_pokemon, tipo, set_nome, raridade, numero_set, url_imagem) VALUES ('${nomePokemon}', '${tipoPokemon}', '${nomeSet}', '${raridadePokemon}', '${numeroSet}', '${urlCarta}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function adicionarNaColecao(usuario, carta, quantidade, precoCompra, precoLigaPkmn) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario, carta, quantidade, precoCompra, precoLigaPkmn);
    var instrucaoSql = `
        INSERT INTO colecao (fk_usuario, fk_carta, quantidade, preco_compra, preco_ligaPkmn) VALUES ('${usuario}', '${carta}', '${quantidade}', '${precoCompra}', '${precoLigaPkmn}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// ----- IMPLEMENTAÇÕES KPS: -----
function buscarValorTotalColecao (usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
        SELECT SUM(c.preco_ligaPkmn * c.quantidade) AS valor_total_colecao FROM colecao c JOIN usuario u ON u.id = c.fk_usuario WHERE c.fk_usuario = '${usuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarValorTotalCompra (usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
        SELECT SUM(c.preco_compra * c.quantidade) AS valor_total_compra FROM colecao c JOIN usuario u ON u.id = c.fk_usuario WHERE c.fk_usuario = '${usuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTotalCartas (usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
    SELECT SUM(quantidade) AS total_cartas_fisicas FROM colecao WHERE fk_usuario = '${usuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarCartaMaisCara (usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
    SELECT b.nome_pokemon, b.set_nome, b.url_imagem, c.preco_ligaPkmn FROM colecao AS c JOIN base_cards AS b ON c.fk_carta = b.id WHERE c.fk_usuario = '${usuario}' ORDER BY c.preco_ligaPkmn DESC LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function salvarSnapshot (usuario, valorTotal) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario, valorTotal);
    var instrucaoSql = `
    INSERT INTO snapshots_colecao (fk_usuario, valor_total) VALUES ('${usuario}', '${valorTotal}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarSnapshots(usuario, intervalo) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
    SELECT data_snapshot, valor_total FROM snapshots_colecao WHERE fk_usuario = '${usuario}' AND data_snapshot >= DATE_SUB(NOW(), INTERVAL ${intervalo}) AND id IN (     SELECT MAX(id)      FROM snapshots_colecao      WHERE fk_usuario = '${usuario}'     GROUP BY data_snapshot ) ORDER BY data_snapshot ASC     `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarColecao(usuario) {
    console.log("ACESSEI O CARDS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", usuario);
    var instrucaoSql = `
    select b.url_imagem, b.nome_pokemon, b.set_nome, b.numero_set, c.quantidade, c.preco_compra, c.preco_ligaPkmn from base_cards b inner join colecao c on c.fk_carta = b.id inner join usuario u on c.fk_usuario = u.id where u.id = '${usuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
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
    buscarColecao
};