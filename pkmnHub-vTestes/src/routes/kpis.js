var express = require("express");
var router = express.Router();

var kpisController = require("../controllers/kpisController");

router.get("/buscarKpis", function (req, res) {
    kpisController.buscarKpis(req, res);
})

module.exports = router;