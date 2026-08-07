var perfilModel = require("../models/perfilModel");

function buscarPerfil(req, res) {
    var username = req.query.username;
    if (!username) return res.status(400).send("Username não informado.");

    perfilModel.buscarDadosPerfil(username)
        .then(function (resultado) {
            if (resultado.length === 0) return res.status(404).send("Usuário não encontrado.");
            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarColecao(req, res) {
    var username = req.query.username;
    if (!username) return res.status(400).send("Username não informado.");

    perfilModel.buscarColecaoPorUsername(username)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarUsuarios(req, res) {
    var query = req.query.q;
    if (!query || query.length < 2) return res.status(400).send("Query muito curta.");

    perfilModel.buscarUsuarios(query)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = { buscarPerfil, buscarColecao, buscarUsuarios };