var express = require("express");
var router = express.Router();

var transacoesController = require("../controllers/transacoesController");

router.post("/venda", function (req, res) {
    transacoesController.venda(req, res);
})

module.exports = router;