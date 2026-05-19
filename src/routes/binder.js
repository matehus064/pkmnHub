var express = require("express");
var router = express.Router();

var binderController = require("../controllers/binderController");

router.post("/criarBinder", function (req, res) {
    binderController.criarBinder(req, res);
})

router.get("/buscarBinders", function (req, res) {
    binderController.buscarBinders(req, res);
})

router.get("/buscarSlots", function (req, res) {
    binderController.buscarSlots(req, res);
})

router.put("/atualizarSlot", function (req, res) {
    binderController.atualizarSlot(req, res);
})

router.put("/limparSlot", function (req, res) {
    binderController.limparSlot(req, res);
})

router.delete("/deletarBinder", function (req, res) {
    binderController.deletarBinder(req, res);
});

router.put("/alternarPosseCarta", function (req, res) {
    binderController.alternarPosseCarta(req, res);
});

router.get("/buscarBindersPorUsername", function (req, res) {
    binderController.buscarBindersPorUsername(req, res);
});

module.exports = router;