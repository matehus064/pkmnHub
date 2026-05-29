var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var emailServer = req.body.emailServer;
    var senhaServer = req.body.senhaServer;

    if (emailServer == undefined) {
        res.status(400).send("O e-mail do usuário não foi definido!");
    } else if (senhaServer == undefined) {
        res.status(400).send("A senha não foi definida!");
    } else {

        usuarioModel.autenticar(emailServer, senhaServer)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json({
                            id: resultadoAutenticar[0].id,
                            usernameServer: resultadoAutenticar[0].username,
                            emailServer: resultadoAutenticar[0].email,
                            numFotoPerfilServer: resultadoAutenticar[0].fk_fotoPerfil
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    var usernameServer = req.body.usernameServer;
    var emailServer = req.body.emailServer;
    var senhaServer = req.body.senhaServer;
    var confirmacaoServer = req.body.confirmacaoServer;
    var numFotoPerfilServer = req.body.numFotoPerfilServer;

    if (usernameServer == undefined) {
        res.status(400).send("O nome de usuário (username) não foi definido!");
    } else if (emailServer == undefined) {
        res.status(400).send("O e-mail do usuário não foi definido!");
    } else if (senhaServer == undefined) {
        res.status(400).send("A senha não foi definida!");
    } else if (confirmacaoServer == undefined) {
        res.status(400).send("A confirmação de senha não foi definida!");
    } else if (numFotoPerfilServer == undefined) {
        res.status(400).send("A foto de perfil (id da foto) não foi selecionada!");
    } else if (senhaServer !== confirmacaoServer) {
        res.status(400).send("As senhas não coincidem!");
    } else {
        usuarioModel.cadastrar(usernameServer, emailServer, senhaServer, numFotoPerfilServer)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {

                    if (erro.code == 'ER_DUP_ENTRY') {
                        res.status(409).send("Username ou email já cadastrado!");
                    } else {
                        res.status(500).json(erro.sqlMessage);
                    }
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}