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
            .then(function(resultado) {

                // ----- CARTA JÁ EXISTE NA BASE: -----
                if (resultado.length == 1) {
                    let idCarta = resultado[0].id;

                    cardsModel.verificarCartaNaColecaoPorId(usuarioServer, idCarta)
                        .then(function(resultadoColecao) {
                            if (resultadoColecao.length > 0) {
                                return cardsModel.somarQuantidadeCompra(usuarioServer, idCarta, qntCartaServer, valorCompraServer, menorLigaServer);
                            } else {
                                return cardsModel.adicionarNaColecao(usuarioServer, idCarta, qntCartaServer, valorCompraServer, menorLigaServer);
                            }
                        })
                        .then(function(resultadoAcao) {
                            res.json(resultadoAcao);
                            transacoesModel.registrarTransacao(usuarioServer, idCarta, 'compra', valorCompraServer, menorLigaServer);

                            cardsModel.buscarValorTotalColecao(usuarioServer)
                                .then(function(resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    cardsModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                        })
                        .catch(function(erro) {
                            console.log("Erro na coleção:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });

                // ----- CARTA NÃO EXISTE NA BASE, CADASTRA E ADICIONA: -----
                } else if (resultado.length == 0) {
                    let idCartaNova; // ✅ guarda o ID real da carta

                    cardsModel.cadastrar(nomeCartaServer, tipoCartaServer, setCartaServer, raridadeCartaServer, numeroCartaServer, imagemCartaServer)
                        .then(function(resultadoCadastro) {
                            idCartaNova = resultadoCadastro.insertId; // ✅ ID da base_cards
                            return cardsModel.adicionarNaColecao(usuarioServer, idCartaNova, qntCartaServer, valorCompraServer, menorLigaServer);
                        })
                        .then(function(resultadoAcao) {
                            res.json(resultadoAcao);
                            transacoesModel.registrarTransacao(usuarioServer, idCartaNova, 'compra', valorCompraServer, menorLigaServer); // ✅ ID correto

                            cardsModel.buscarValorTotalColecao(usuarioServer)
                                .then(function(resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    cardsModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                        })
                        .catch(function(erro) {
                            console.log("Erro no cadastro:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });
                }
            })
            .catch(function(erro) {
                console.log("Erro ao buscar carta:", erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarColecao(req, res) {
    var usuarioServer = req.query.usuarioServer;

    cardsModel.buscarColecao(usuarioServer)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrar,
    buscarColecao
};