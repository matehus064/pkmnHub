var express = require("express");
var router = express.Router();
var perfilController = require("../controllers/perfilController");

router.get("/buscarPerfil", function (req, res) { perfilController.buscarPerfil(req, res); });
router.get("/buscarColecao", function (req, res) { perfilController.buscarColecao(req, res); });
router.get("/buscarUsuarios", function (req, res) { perfilController.buscarUsuarios(req, res); });

module.exports = router;