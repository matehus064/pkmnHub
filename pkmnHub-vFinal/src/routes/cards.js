var express = require("express");
var router = express.Router();

var cardsController = require("../controllers/cardsController");

router.post("/cadastrar", function (req, res) {
    cardsController.cadastrar(req, res);
})

router.get("/buscarColecao", function (req, res) {
    cardsController.buscarColecao(req, res);
})

module.exports = router;