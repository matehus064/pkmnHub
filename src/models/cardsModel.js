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

module.exports = {
    existeCarta,
    cadastrar,
    adicionarNaColecao
};