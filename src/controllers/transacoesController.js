var transacoesModel = require("../models/transacoesModel");
var cardsModel = require("../models/cardsModel");
var precoLigaLogModel = require("../models/precoLigaLogModel");
var snapshotService = require("../models/snapshotService");

function venda(req, res) {
    var nomeCartaServer = req.body.nomeCartaServer;
    var numeroCartaServer = req.body.numeroCartaServer;
    var qntCartaServer = req.body.qntCartaServer;
    var valorVendaServer = req.body.valorVendaServer;
    console.log("valorVendaServer:", valorVendaServer);
    var menorLigaServer = req.body.menorLigaServer;
    var usuarioServer = req.body.usuarioServer;

    if (nomeCartaServer == undefined) {
        res.status(400).send("O nome do Pokémon não foi definido!");
    } else if (numeroCartaServer == undefined) {
        res.status(400).send("O número da carta no set não foi definido!");
    } else if (qntCartaServer == undefined) {
        res.status(400).send("A quantidade de cartas não foi definida!");
    } else if (valorVendaServer == undefined) {
        res.status(400).send("O valor de venda da carta não foi definido!");
    } else if (menorLigaServer == undefined) {
        res.status(400).send("O preço de mercado (Liga Pokémon) não foi definido!");
    } else {
        transacoesModel.buscarCartaNaColecao(usuarioServer, nomeCartaServer, numeroCartaServer)
            .then(function (resultado) {
                let carta = resultado[0].fk_carta;
                if (resultado.length == 1) { // carta está na coleção do usuário
                    var acaoColecao = (resultado[0].quantidade - qntCartaServer > 0)
                        ? transacoesModel.atualizarQuantidade(usuarioServer, resultado[0].fk_carta, qntCartaServer)
                        : transacoesModel.removerDaColecao(usuarioServer, carta);

                    acaoColecao
                        .then(function (resultadoAcao) {
                            res.json(resultadoAcao);
                            return transacoesModel.registrarTransacao(usuarioServer, carta, 'venda', valorVendaServer, menorLigaServer)
                                .then(function () {
                                    return precoLigaLogModel.atualizarPreco(carta, usuarioServer, menorLigaServer);
                                });
                        })
                        .then(function () {
                            return snapshotService.salvarOuAtualizarSnapshot(usuarioServer);
                        })
                        .catch(function (erro) {
                            console.log(erro);
                            if (!res.headersSent) {
                                res.status(500).json(erro.sqlMessage);
                            }
                        });
                } else if (resultado.length == 0) { // carta não está na coleção do usuário
                    res.status(404).send("Carta não encontrada na sua coleção!");
                }
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    venda
};