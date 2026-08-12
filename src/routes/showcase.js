var express = require("express");
var router = express.Router();
var showcaseController = require("../controllers/showcaseController");

router.get("/buscar", function (req, res) { showcaseController.buscarShowcase(req, res); });
router.put("/salvarSlot", function (req, res) { showcaseController.salvarSlot(req, res); });
router.delete("/limparSlot", function (req, res) { showcaseController.limparSlot(req, res); });

module.exports = router;