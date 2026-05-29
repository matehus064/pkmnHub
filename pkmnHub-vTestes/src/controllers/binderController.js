var binderModel = require("../models/binderModel");

function criarBinder(req, res) {
    var usuarioServer = req.body.usuarioServer;
    var nomeBinderServer = req.body.nomeBinderServer;
    var tipoBinderServer = req.body.tipoBinderServer;
    let totalSlots = 0;

    if (tipoBinderServer == "2x2") {
        totalSlots = 160;
    } else if (tipoBinderServer == "3x3") {
        totalSlots = 360;
    } else if (tipoBinderServer == "4x3") {
        totalSlots = 480;
    } else {
        console.log("Erro do tipo")
        return;
    }

    if (nomeBinderServer == undefined) {
        res.status(400).send("O nome do binder não foi definido!");
    } else if (tipoBinderServer == undefined) {
        res.status(400).send("O tipo do binder não foi definido!");
    } else {
        binderModel.criarBinder(usuarioServer, nomeBinderServer, tipoBinderServer)
            .then(function (resultadoBinder) {
                binderModel.criarSlots(resultadoBinder.insertId, totalSlots)
                    .then(function (resultado) {
                        res.json(resultado);
                    }).catch(function (erro) {
                        console.log(erro);
                        res.status(500).json(erro.sqlMessage);
                    });
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarBinders(req, res) {
    var usuarioServer = req.query.usuarioServer;

    binderModel.buscarBinders(usuarioServer)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarBindersPorUsername(req, res) {
    var usernameServer = req.query.usernameServer;

    if (!usernameServer) {
        return res.status(400).send("Username não informado.");
    }

    binderModel.buscarBindersPorUsername(usernameServer)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarSlots(req, res) {
    var binders = req.query.binderServer;

    binderModel.buscarSlots(binders)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.json({ meta: null, slots: [] });
            }
            res.json({
                meta: { nome: resultado[0].nome, tipo: resultado[0].tipo },
                slots: resultado
            });
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarSlot(req, res) {
    var slotServer = req.body.slotServer;
    var imagemCartaServer = req.body.imagemCartaServer;

    binderModel.atualizarSlot(slotServer, imagemCartaServer)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function limparSlot(req, res) {
    var slotServer = req.body.slotServer;

    binderModel.limparSlot(slotServer)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletarBinder(req, res) {
    var idBinderServer = req.body.idBinderServer;

    if (idBinderServer == undefined) {
        res.status(400).send("O ID do binder está undefined!");
        return;
    }

    binderModel.deletarBinder(idBinderServer)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function alternarPosseCarta(req, res) {
    var slotServer = req.body.slotServer;
    var estadoAtual = req.body.estadoAtual; // Recebe se atualmente a carta está opaca ou não

    binderModel.alternarPosseCarta(slotServer, estadoAtual)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    criarBinder,
    buscarBinders,
    buscarSlots,
    atualizarSlot,
    limparSlot,
    deletarBinder,
    alternarPosseCarta,
    buscarBindersPorUsername
};