var database = require("../database/config")

function registrar(carta, usuario, preco) {
    var instrucaoSql = `
        INSERT INTO preco_liga_log (fk_carta, fk_usuario, preco) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [carta, usuario, preco]);
}

function buscarPrecoAtual(carta) {
    var instrucaoSql = `
        SELECT preco_ligaPkmn FROM base_cards WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [carta]);
}

function atualizarPrecoBaseCard(carta, preco) {
    var instrucaoSql = `
        UPDATE base_cards SET preco_ligaPkmn = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [preco, carta]);
}

function atualizarPreco(carta, usuario, preco) {
    return buscarPrecoAtual(carta)
        .then(function(resultado) {
            var precoAtual = resultado[0] ? resultado[0].preco_ligaPkmn : null;
            var precoNovo = parseFloat(preco);

            // sem preço registrado ainda -> sempre grava
            if (precoAtual == null) {
                return registrar(carta, usuario, precoNovo)
                    .then(function() {
                        return atualizarPrecoBaseCard(carta, precoNovo);
                    });
            }

            // variação menor que 1 real -> ignora
            var diferenca = Math.abs(precoNovo - parseFloat(precoAtual));
            if (diferenca < 1) {
                return Promise.resolve();
            }

            return registrar(carta, usuario, precoNovo)
                .then(function() {
                    return atualizarPrecoBaseCard(carta, precoNovo);
                });
        });
}

module.exports = {
    registrar,
    buscarPrecoAtual,
    atualizarPrecoBaseCard,
    atualizarPreco
};