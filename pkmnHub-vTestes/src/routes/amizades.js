var express = require("express");
var router = express.Router();
var amizadesController = require("../controllers/amizadesController");

router.post("/solicitar", function (req, res) { amizadesController.solicitar(req, res); });
router.put("/responder", function (req, res) { amizadesController.responder(req, res); });
router.delete("/cancelar", function (req, res) { amizadesController.cancelar(req, res); });
router.get("/listarAmigos", function (req, res) { amizadesController.listarAmigos(req, res); });
router.get("/listarPendentes", function (req, res) { amizadesController.listarPendentes(req, res); });
router.get("/verificarStatus", function (req, res) { amizadesController.verificarStatus(req, res); });
router.delete("/remover", function (req, res) { amizadesController.remover(req, res); });

module.exports = router;