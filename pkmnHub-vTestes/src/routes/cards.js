var express = require("express");
var router = express.Router();

var cardsController = require("../controllers/cardsController");

router.post("/cadastrar", function (req, res) {
    cardsController.cadastrar(req, res);
})

router.get("/buscarColecao", function (req, res) {
    cardsController.buscarColecao(req, res);
})

router.get("/buscarColecaoSet", function (req, res) {
    cardsController.buscarColecaoSet(req, res);
});

router.post("/salvarColecaoSet", function (req, res) {
    cardsController.salvarColecaoSet(req, res);
});

module.exports = router;