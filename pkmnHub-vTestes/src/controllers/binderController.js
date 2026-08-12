var binderModel = require("../models/binderModel");

var TIPOS_VALIDOS = ["2x2", "3x3", "4x3", "4x4"];

function criarBinder(req, res) {
    var usuarioServer = req.body.usuarioServer;
    var nomeBinderServer = req.body.nomeBinderServer;
    var tipoBinderServer = req.body.tipoBinderServer;

    if (nomeBinderServer == undefined) return res.status(400).send("O nome do binder não foi definido!");
    if (!TIPOS_VALIDOS.includes(tipoBinderServer)) return res.status(400).send("Tipo de binder inválido!");

    binderModel.buscarProximaOrdem(usuarioServer)
        .then(function (resultado) {
            var proximaOrdem = resultado[0].proximaOrdem;
            return binderModel.criarBinder(usuarioServer, nomeBinderServer, tipoBinderServer, proximaOrdem);
        })
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function buscarBinders(req, res) {
    var usuarioServer = req.query.usuarioServer;
    binderModel.buscarBinders(usuarioServer)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function buscarBindersPorUsername(req, res) {
    var usernameServer = req.query.usernameServer;
    if (!usernameServer) return res.status(400).send("Username não informado.");

    binderModel.buscarBindersPorUsername(usernameServer)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function buscarSlots(req, res) {
    var binders = req.query.binderServer;

    binderModel.buscarSlots(binders)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.json({ meta: null, slots: [] });
            }
            // Com LEFT JOIN, binder sem nenhuma carta ainda vem com uma linha
            // "fantasma" (bs.id null) — filtra isso fora da lista de slots
            var slotsPreenchidos = resultado.filter(function (linha) { return linha.id !== null; });
            res.json({
                meta: { nome: resultado[0].nome, tipo: resultado[0].tipo },
                slots: slotsPreenchidos
            });
        }).catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function atualizarSlot(req, res) {
    var binderServer = req.body.binderServer;
    var slotNumeroServer = req.body.slotNumeroServer;
    var imagemCartaServer = req.body.imagemCartaServer;
    var obtidaServer = req.body.obtidaServer;

    binderModel.atualizarSlot(binderServer, slotNumeroServer, imagemCartaServer, obtidaServer)
        .then(function (resultado) {
            res.json({ id: resultado.insertId });
        }).catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function limparSlot(req, res) {
    var binderServer = req.body.binderServer;
    var slotNumeroServer = req.body.slotNumeroServer;

    binderModel.limparSlot(binderServer, slotNumeroServer)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function deletarBinder(req, res) {
    var idBinderServer = req.body.idBinderServer;
    if (idBinderServer == undefined) return res.status(400).send("O ID do binder está undefined!");

    binderModel.deletarBinder(idBinderServer)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function alternarPosseCarta(req, res) {
    var binderServer = req.body.binderServer;
    var slotNumeroServer = req.body.slotNumeroServer;
    var estadoAtual = req.body.estadoAtual;

    binderModel.alternarPosseCarta(binderServer, slotNumeroServer, estadoAtual)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { res.status(500).json(erro.sqlMessage); });
}

var TOTAL_SLOTS_POR_TIPO = { "2x2": 160, "3x3": 360, "4x3": 480, "4x4": 1024 };

function atualizarBinder(req, res) {
    var idBinderServer = req.body.idBinderServer;
    var nomeBinderServer = req.body.nomeBinderServer;
    var tipoBinderServer = req.body.tipoBinderServer;

    if (idBinderServer == undefined) return res.status(400).send("O ID do binder não foi definido!");
    if (nomeBinderServer == undefined || !nomeBinderServer.trim()) return res.status(400).send("O nome do binder não foi definido!");
    if (!TIPOS_VALIDOS.includes(tipoBinderServer)) return res.status(400).send("Tipo de binder inválido!");

    var novoLimite = TOTAL_SLOTS_POR_TIPO[tipoBinderServer];

    binderModel.buscarPrimeiroSlotForaDoLimite(idBinderServer, novoLimite)
        .then(function (resultado) {
            var primeiroSlot = resultado[0] ? resultado[0].primeiroSlot : null;
            if (primeiroSlot) {
                return res.status(409).json({
                    erro: "slots_fora_do_limite",
                    mensagem: "A partir do slot #" + primeiroSlot + " existem cartas que ficariam fora do novo tipo. Mova ou remova antes de trocar."
                });
            }
            binderModel.atualizarBinder(idBinderServer, nomeBinderServer.trim(), tipoBinderServer)
                .then(function (resultado) { res.json(resultado); })
                .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
        }).catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function reordenarBinders(req, res) {
    var usuarioServer = req.body.usuarioServer;
    var idsOrdenadosServer = req.body.idsOrdenadosServer;

    if (usuarioServer == undefined) return res.status(400).send("O usuário não foi definido!");
    if (!Array.isArray(idsOrdenadosServer) || !idsOrdenadosServer.length) return res.status(400).send("A lista de ids não foi definida!");

    binderModel.reordenarBinders(usuarioServer, idsOrdenadosServer)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

module.exports = {
    criarBinder,
    buscarBinders,
    buscarSlots,
    atualizarSlot,
    limparSlot,
    deletarBinder,
    alternarPosseCarta,
    buscarBindersPorUsername,
    atualizarBinder,
    reordenarBinders
};