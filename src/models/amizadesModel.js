var database = require("../database/config");

function solicitar(solicitanteId, receptorId) {
    var verificar = `
        SELECT id, status FROM amizades
        WHERE (fk_solicitante = ? AND fk_receptor = ?)
           OR (fk_solicitante = ? AND fk_receptor = ?)
        LIMIT 1;
    `;
    return database.executar(verificar, [solicitanteId, receptorId, receptorId, solicitanteId])
        .then(function (rows) {
            if (rows.length > 0) {
                var err = new Error("Já existe uma relação entre esses usuários.");
                err.code = 'JA_EXISTE';
                err.status = rows[0].status;
                throw err;
            }
            var instrucaoSql = `
                INSERT INTO amizades (fk_solicitante, fk_receptor, status)
                VALUES (?, ?, 'pendente');
            `;
            return database.executar(instrucaoSql, [solicitanteId, receptorId]);
        });
}

function responder(amizadeId, status) {
    var instrucaoSql = `
        UPDATE amizades SET status = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [status, amizadeId]);
}

function cancelar(solicitanteId, receptorId) {
    var instrucaoSql = `
        DELETE FROM amizades
        WHERE fk_solicitante = ? AND fk_receptor = ? AND status = 'pendente';
    `;
    return database.executar(instrucaoSql, [solicitanteId, receptorId]);
}

function listarAmigos(usuarioId) {
    var instrucaoSql = `
        SELECT
            u.username,
            u.fk_fotoPerfil AS foto
        FROM amizades a
        JOIN usuario u ON u.id = CASE
            WHEN a.fk_solicitante = ? THEN a.fk_receptor
            ELSE a.fk_solicitante
        END
        WHERE a.status = 'aceito'
          AND (a.fk_solicitante = ? OR a.fk_receptor = ?)
        ORDER BY u.username ASC;
    `;
    return database.executar(instrucaoSql, [usuarioId, usuarioId, usuarioId]);
}

function listarPendentes(receptorId) {
    var instrucaoSql = `
        SELECT
            a.id,
            u.username,
            u.fk_fotoPerfil AS foto,
            a.data_solicitacao
        FROM amizades a
        JOIN usuario u ON u.id = a.fk_solicitante
        WHERE a.fk_receptor = ? AND a.status = 'pendente'
        ORDER BY a.data_solicitacao DESC;
    `;
    return database.executar(instrucaoSql, [receptorId]);
}

function verificarStatus(usuarioAId, usuarioBId) {
    var instrucaoSql = `
        SELECT id, status, fk_solicitante
        FROM amizades
        WHERE (fk_solicitante = ? AND fk_receptor = ?)
           OR (fk_solicitante = ? AND fk_receptor = ?)
        LIMIT 1;
    `;
    return database.executar(instrucaoSql, [usuarioAId, usuarioBId, usuarioBId, usuarioAId]);
}

function remover(usuarioAId, usuarioBId) {
    var instrucaoSql = `
        DELETE FROM amizades
        WHERE (fk_solicitante = ? AND fk_receptor = ?)
           OR (fk_solicitante = ? AND fk_receptor = ?)
           AND status = 'aceito';
    `;
    return database.executar(instrucaoSql, [usuarioAId, usuarioBId, usuarioBId, usuarioAId]);
}

module.exports = {
    solicitar,
    responder,
    cancelar,
    listarAmigos,
    listarPendentes,
    verificarStatus,
    remover
};