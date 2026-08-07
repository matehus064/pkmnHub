var database = require("../database/config");

function buscarDadosPerfil(username) {
    var instrucaoSql = `
        SELECT
            u.id,
            u.username,
            u.fk_fotoPerfil AS foto,
            COALESCE(SUM(c.preco_ligaPkmn * c.quantidade), 0) AS valor_colecao,
            COALESCE(SUM(c.quantidade), 0) AS total_cartas,
            (
                SELECT COUNT(*) FROM amizades a
                WHERE a.status = 'aceito'
                  AND (a.fk_solicitante = u.id OR a.fk_receptor = u.id)
            ) AS total_amigos
        FROM usuario u
        LEFT JOIN colecao c ON c.fk_usuario = u.id
        WHERE u.username = ?
        GROUP BY u.id;
    `;
    return database.executar(instrucaoSql, [username]);
}

function buscarColecaoPorUsername(username) {
    var instrucaoSql = `
        SELECT
            bc.id,
            bc.url_imagem,
            bc.nome_pokemon,
            bc.set_nome,
            bc.numero_set,
            bc.raridade,
            c.quantidade,
            c.data_adicao
        FROM base_cards bc
        INNER JOIN colecao c ON c.fk_carta = bc.id
        INNER JOIN usuario u ON c.fk_usuario = u.id
        WHERE u.username = ?
        ORDER BY c.data_adicao DESC;
    `;
    return database.executar(instrucaoSql, [username]);
}

function buscarUsuarioPorUsername(username) {
    var instrucaoSql = `
        SELECT id FROM usuario WHERE username = ?;
    `;
    return database.executar(instrucaoSql, [username]);
}

function buscarUsuarios(query) {
    var instrucaoSql = `
        SELECT username, fk_fotoPerfil AS foto
        FROM usuario
        WHERE username LIKE ?
        LIMIT 10;
    `;
    return database.executar(instrucaoSql, [`%${query}%`]);
}

module.exports = {
    buscarDadosPerfil,
    buscarColecaoPorUsername,
    buscarUsuarioPorUsername,
    buscarUsuarios
};