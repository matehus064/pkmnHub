var cardsModel = require("../models/cardsModel");
var transacoesModel = require("../models/transacoesModel");

function cadastrar(req, res) {
    var nomeCartaServer = req.body.nomeCartaServer;
    var setCartaServer = req.body.setCartaServer;
    var numeroCartaServer = req.body.numeroCartaServer;
    var qntCartaServer = req.body.qntCartaServer;
    var valorCompraServer = req.body.valorCompraServer;
    var menorLigaServer = req.body.menorLigaServer;
    var imagemCartaServer = req.body.imagemCartaServer;
    var tipoCartaServer = req.body.tipoCartaServer;
    var raridadeCartaServer = req.body.raridadeCartaServer;
    var usuarioServer = req.body.usuarioServer;

    if (nomeCartaServer == undefined) {
        res.status(400).send("O nome do Pokémon não foi definido!");
    } else if (setCartaServer == undefined) {
        res.status(400).send("A coleção (set) da carta não foi definida!");
    } else if (numeroCartaServer == undefined) {
        res.status(400).send("O número da carta no set não foi definido!");
    } else if (qntCartaServer == undefined) {
        res.status(400).send("A quantidade de cartas não foi definida!");
    } else if (valorCompraServer == undefined) {
        res.status(400).send("O valor de compra da carta não foi definido!");
    } else if (menorLigaServer == undefined) {
        res.status(400).send("O preço de mercado (Liga Pokémon) não foi definido!");
    } else if (imagemCartaServer == undefined) {
        res.status(400).send("A URL da imagem da carta está faltando!");
    } else if (tipoCartaServer == undefined) {
        res.status(400).send("O tipo do Pokémon (Fogo, Água, etc.) não foi definido!");
    } else if (raridadeCartaServer == undefined) {
        res.status(400).send("A raridade da carta não foi definida!");
    } else {
        cardsModel.existeCarta(nomeCartaServer, numeroCartaServer)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    let idCarta = resultado[0].id;
                    cardsModel.adicionarNaColecao(usuarioServer, resultado[0].id, qntCartaServer, valorCompraServer, menorLigaServer)
                        .then(function (resultado) {
                            cardsModel.buscarValorTotalColecao(usuarioServer)
                                .then(function (resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    cardsModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                            res.json(resultado);
                            transacoesModel.registrarTransacao(usuarioServer, idCarta, 'compra', valorCompraServer, menorLigaServer)
                        }).catch(function (erro) {
                            console.log(erro);
                            res.status(500).json(erro.sqlMessage);
                        });
                } else if (resultado.length == 0) {
                    cardsModel.cadastrar(nomeCartaServer, tipoCartaServer, setCartaServer, raridadeCartaServer, numeroCartaServer, imagemCartaServer)
                        .then(function (resultadoCadastro) {
                            cardsModel.adicionarNaColecao(usuarioServer, resultadoCadastro.insertId, qntCartaServer, valorCompraServer, menorLigaServer)
                                .then(function (resultado) {
                                    cardsModel.buscarValorTotalColecao(usuarioServer)
                                        .then(function (resultadoValor) {
                                            let valorTotal = resultadoValor[0].valor_total_colecao;
                                            cardsModel.salvarSnapshot(usuarioServer, valorTotal);
                                        });
                                    res.json(resultado);
                                    transacoesModel.registrarTransacao(usuarioServer, resultadoCadastro.insertId, 'compra', valorCompraServer, menorLigaServer)
                                }).catch(function (erro) {
                                    console.log(erro);
                                    res.status(500).json(erro.sqlMessage);
                                });
                        });
                }
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    cadastrar
};