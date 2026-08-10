var cardsModel = require("../models/cardsModel");
var transacoesModel = require("../models/transacoesModel");
var precoLigaLogModel = require("../models/precoLigaLogModel");

function salvarOuAtualizarSnapshot(usuario) {
    cardsModel.buscarValorTotalColecao(usuario)
        .then(function(resultadoValor) {
            let valorTotal = resultadoValor[0].valor_total_colecao;

            cardsModel.buscarSnapshotHoje(usuario)
                .then(function(snapshotHoje) {
                    if (snapshotHoje.length > 0) {
                        cardsModel.atualizarSnapshot(snapshotHoje[0].id, valorTotal);
                    } else {
                        cardsModel.salvarSnapshot(usuario, valorTotal);
                    }
                });
        });
}

function sincronizarColecaoSet(usuario, setId, numeroCartaServer) {
    if (!setId) return;
    var num = parseInt(numeroCartaServer.split('/')[0], 10);
    cardsModel.salvarColecaoSet(usuario, setId, num, 1, 0);
}

function cadastrar(req, res) {
    var nomeCartaServer   = req.body.nomeCartaServer;
    var setCartaServer    = req.body.setCartaServer;
    var setIdServer       = req.body.setIdServer;
    var numeroCartaServer = req.body.numeroCartaServer;
    var qntCartaServer    = req.body.qntCartaServer;
    var valorCompraServer = req.body.valorCompraServer;
    var menorLigaServer   = req.body.menorLigaServer;
    var imagemCartaServer = req.body.imagemCartaServer;
    var tipoCartaServer   = req.body.tipoCartaServer;
    var raridadeCartaServer = req.body.raridadeCartaServer;
    var usuarioServer     = req.body.usuarioServer;

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
                                return cardsModel.somarQuantidadeCompra(usuarioServer, idCarta, qntCartaServer, valorCompraServer);
                            } else {
                                return cardsModel.adicionarNaColecao(usuarioServer, idCarta, qntCartaServer, valorCompraServer);
                            }
                        })
                        .then(function(resultadoAcao) {
                            res.json(resultadoAcao);
                            transacoesModel.registrarTransacao(usuarioServer, idCarta, 'compra', valorCompraServer, menorLigaServer);
                            precoLigaLogModel.atualizarPreco(idCarta, usuarioServer, menorLigaServer);
                            salvarOuAtualizarSnapshot(usuarioServer);
                            sincronizarColecaoSet(usuarioServer, setIdServer, numeroCartaServer);
                        })
                        .catch(function(erro) {
                            console.log("Erro na coleção:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });

                // ----- CARTA NÃO EXISTE NA BASE, CADASTRA E ADICIONA: -----
                } else if (resultado.length == 0) {
                    let idCartaNova;

                    cardsModel.cadastrar(nomeCartaServer, tipoCartaServer, setCartaServer, raridadeCartaServer, numeroCartaServer, imagemCartaServer)
                        .then(function(resultadoCadastro) {
                            idCartaNova = resultadoCadastro.insertId;
                            return cardsModel.adicionarNaColecao(usuarioServer, idCartaNova, qntCartaServer, valorCompraServer);
                        })
                        .then(function(resultadoAcao) {
                            res.json(resultadoAcao);
                            transacoesModel.registrarTransacao(usuarioServer, idCartaNova, 'compra', valorCompraServer, menorLigaServer);
                            precoLigaLogModel.atualizarPreco(idCartaNova, usuarioServer, menorLigaServer);
                            salvarOuAtualizarSnapshot(usuarioServer);
                            sincronizarColecaoSet(usuarioServer, setIdServer, numeroCartaServer);
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

function buscarColecaoSet(req, res) {
    var usuarioServer = req.query.usuarioServer;
    var setId = req.query.setId;

    cardsModel.buscarColecaoSet(usuarioServer, setId)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function salvarColecaoSet(req, res) {
    var usuarioServer = req.body.usuarioServer;
    var setId = req.body.setId;
    var numeroCarta = req.body.numeroCarta;
    var temNormal = req.body.temNormal;
    var temReverse = req.body.temReverse;

    // Se os dois estão desmarcados, deleta a linha
    if (!temNormal && !temReverse) {
        cardsModel.deletarColecaoSet(usuarioServer, setId, numeroCarta)
            .then(function(resultado) { res.json(resultado); })
            .catch(function(erro) { res.status(500).json(erro.sqlMessage); });
    } else {
        cardsModel.salvarColecaoSet(usuarioServer, setId, numeroCarta, temNormal, temReverse)
            .then(function(resultado) { res.json(resultado); })
            .catch(function(erro) { res.status(500).json(erro.sqlMessage); });
    }
}

function atualizarItem(req, res) {
    var usuarioServer = req.body.usuarioServer;
    var cartaServer = req.body.cartaServer;
    var quantidadeServer = req.body.quantidadeServer;
    var precoCompraServer = req.body.precoCompraServer;
    var precoLigaServer = req.body.precoLigaServer;

    if (usuarioServer == undefined || cartaServer == undefined) {
        res.status(400).send("Usuário ou carta não definidos!");
    } else if (quantidadeServer == undefined || precoCompraServer == undefined || precoLigaServer == undefined) {
        res.status(400).send("Quantidade, valor pago ou valor real não definidos!");
    } else {
        cardsModel.atualizarItemColecao(usuarioServer, cartaServer, quantidadeServer, precoCompraServer)
            .then(function(resultado) {
                res.json(resultado);
                return precoLigaLogModel.atualizarPreco(cartaServer, usuarioServer, precoLigaServer);
            })
            .then(function() {
                salvarOuAtualizarSnapshot(usuarioServer);
            })
            .catch(function(erro) {
                console.log("Erro ao atualizar item:", erro);
                if (!res.headersSent) {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

module.exports = {
    cadastrar,
    buscarColecao,
    buscarColecaoSet,
    salvarColecaoSet,
    atualizarItem
};