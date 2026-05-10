var express = require("express");
var router = express.Router();

var cardsController = require("../controllers/cardsController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    cardsController.cadastrar(req, res);
})

module.exports = router;