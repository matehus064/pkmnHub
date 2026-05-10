var cardsModel = require("../models/cardsModel");
var transacoesModel = require("../models/transacoesModel");

function buscarKpis(req, res) {
    var usuarioServer = req.query.usuarioServer;
    Promise.all([
        cardsModel.buscarValorTotalColecao(usuarioServer),
        cardsModel.buscarTotalCartas(usuarioServer),
        cardsModel.buscarCartaMaisCara(usuarioServer),
        transacoesModel.buscarTotalRetorno(usuarioServer),
        transacoesModel.buscarTotalGasto(usuarioServer)
    ]).then(function (resultados) {
        res.json({
            valorTotalColecao: resultados[0],
            totalCartas: resultados[1],
            cartaMaisCara: resultados[2],
            totalRetorno: resultados[3],
            totalGasto: resultados[4]
        })
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar ao buscar as kpis! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

module.exports = {
    buscarKpis
};

