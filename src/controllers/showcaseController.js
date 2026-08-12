var showcaseModel = require("../models/showcaseModel");

function buscarShowcase(req, res) {
    var username = req.query.username;
    if (!username) return res.status(400).send("Username não informado.");

    showcaseModel.buscarShowcase(username)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function salvarSlot(req, res) {
    var usuarioId = req.body.usuarioId;
    var slot = req.body.slot;
    var cartaId = req.body.cartaId;

    if (usuarioId === undefined || slot === undefined || cartaId === undefined)
        return res.status(400).send("Parâmetros incompletos.");
    if (slot < 0 || slot > 4)
        return res.status(400).send("Slot inválido. Use valores entre 0 e 4.");

    showcaseModel.salvarSlot(usuarioId, slot, cartaId)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function limparSlot(req, res) {
    var usuarioId = req.body.usuarioId;
    var slot = req.body.slot;

    if (usuarioId === undefined || slot === undefined)
        return res.status(400).send("Parâmetros incompletos.");

    showcaseModel.limparSlot(usuarioId, slot)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = { buscarShowcase, salvarSlot, limparSlot };