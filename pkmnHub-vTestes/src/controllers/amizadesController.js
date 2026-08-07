var amizadesModel = require("../models/amizadesModel");
var perfilModel = require("../models/perfilModel");

function solicitar(req, res) {
    var solicitanteId = req.body.solicitanteId;
    var receptorUsername = req.body.receptorUsername;
    if (!solicitanteId || !receptorUsername) return res.status(400).send("Parâmetros incompletos.");

    perfilModel.buscarUsuarioPorUsername(receptorUsername)
        .then(function (resultado) {
            if (resultado.length === 0) return res.status(404).send("Usuário não encontrado.");
            var receptorId = resultado[0].id;
            if (String(solicitanteId) === String(receptorId)) return res.status(400).send("Você não pode adicionar a si mesmo.");
            return amizadesModel.solicitar(solicitanteId, receptorId)
                .then(function (r) { res.json(r); });
        })
        .catch(function (erro) {
            console.log(erro);
            if (erro.code === 'JA_EXISTE') {
                return res.status(409).send(`Já existe uma relação com status: ${erro.status}`);
            }
            if (erro.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("Solicitação já enviada.");
            }
            res.status(500).json(erro.sqlMessage);
        });
}

function responder(req, res) {
    var amizadeId = req.body.amizadeId;
    var status = req.body.status;
    if (!amizadeId || !status) return res.status(400).send("Parâmetros incompletos.");
    if (status !== 'aceito' && status !== 'recusado') return res.status(400).send("Status inválido.");

    amizadesModel.responder(amizadeId, status)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cancelar(req, res) {
    var solicitanteId = req.body.solicitanteId;
    var receptorUsername = req.body.receptorUsername;
    if (!solicitanteId || !receptorUsername) return res.status(400).send("Parâmetros incompletos.");

    perfilModel.buscarUsuarioPorUsername(receptorUsername)
        .then(function (resultado) {
            if (resultado.length === 0) return res.status(404).send("Usuário não encontrado.");
            var receptorId = resultado[0].id;
            return amizadesModel.cancelar(solicitanteId, receptorId)
                .then(function (r) { res.json(r); });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarAmigos(req, res) {
    var usuarioId = req.query.usuarioId;
    if (!usuarioId) return res.status(400).send("usuarioId não informado.");

    amizadesModel.listarAmigos(usuarioId)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarPendentes(req, res) {
    var receptorId = req.query.receptorId;
    if (!receptorId) return res.status(400).send("receptorId não informado.");

    amizadesModel.listarPendentes(receptorId)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function verificarStatus(req, res) {
    var usuarioAId = req.query.usuarioAId;
    var usuarioBUsername = req.query.usuarioBUsername;
    if (!usuarioAId || !usuarioBUsername) return res.status(400).send("Parâmetros incompletos.");

    perfilModel.buscarUsuarioPorUsername(usuarioBUsername)
        .then(function (resultado) {
            if (resultado.length === 0) return res.json({ status: 'none' });
            var usuarioBId = resultado[0].id;
            return amizadesModel.verificarStatus(usuarioAId, usuarioBId)
                .then(function (rows) {
                    if (rows.length === 0) return res.json({ status: 'none' });
                    var row = rows[0];
                    if (row.status === 'pendente') {
                        var foiEuQueSolicitei = String(row.fk_solicitante) === String(usuarioAId);
                        return res.json({ status: 'pendente', foiEuQueSolicitei, amizadeId: row.id });
                    }
                    return res.json({ status: row.status, amizadeId: row.id });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function remover(req, res) {
    var usuarioAId = req.body.usuarioAId;
    var usuarioBUsername = req.body.usuarioBUsername;
    if (!usuarioAId || !usuarioBUsername) return res.status(400).send("Parâmetros incompletos.");

    perfilModel.buscarUsuarioPorUsername(usuarioBUsername)
        .then(function (resultado) {
            if (resultado.length === 0) return res.status(404).send("Usuário não encontrado.");
            var usuarioBId = resultado[0].id;
            return amizadesModel.remover(usuarioAId, usuarioBId)
                .then(function (r) { res.json(r); });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = { solicitar, responder, cancelar, listarAmigos, listarPendentes, verificarStatus, remover };