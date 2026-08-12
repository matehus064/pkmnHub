var database = require("../database/config");

function buscarShowcase(username) {
    var instrucaoSql = `
        SELECT s.slot, bc.id, bc.url_imagem, bc.nome_pokemon, bc.set_nome, bc.numero_set
        FROM showcase s
        JOIN base_cards bc ON bc.id = s.fk_carta
        JOIN usuario u ON u.id = s.fk_usuario
        WHERE u.username = ?
        ORDER BY s.slot ASC;
    `;
    return database.executar(instrucaoSql, [username]);
}

function salvarSlot(usuarioId, slot, cartaId) {
    var instrucaoSql = `
        INSERT INTO showcase (fk_usuario, slot, fk_carta)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE fk_carta = VALUES(fk_carta);
    `;
    return database.executar(instrucaoSql, [usuarioId, slot, cartaId]);
}

function limparSlot(usuarioId, slot) {
    var instrucaoSql = `
        DELETE FROM showcase WHERE fk_usuario = ? AND slot = ?;
    `;
    return database.executar(instrucaoSql, [usuarioId, slot]);
}

module.exports = {
    buscarShowcase,
    salvarSlot,
    limparSlot
};