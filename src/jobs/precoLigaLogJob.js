var precoLigaLogModel = require("../models/precoLigaLogModel");

function limparHistoricoPrecos() {
    console.log("[precoLigaLogJob] Preenchendo lacunas do dia anterior...");
    precoLigaLogModel.preencherLacunasDoDiaAnterior()
        .then(function(resultado) {
            console.log(`[precoLigaLogJob] ${resultado.affectedRows} lacunas preenchidas.`);
            return precoLigaLogModel.compactarDiaAnterior();
        })
        .then(function(resultado) {
            console.log(`[precoLigaLogJob] ${resultado.affectedRows} registros compactados do dia anterior.`);
            return precoLigaLogModel.compactarPorSemana('3 MONTH', '6 MONTH', 2);
        })
        .then(function(resultado) {
            console.log(`[precoLigaLogJob] ${resultado.affectedRows} registros compactados (3-6 meses).`);
            return precoLigaLogModel.compactarPorSemana('30 DAY', '3 MONTH', 3);
        })
        .then(function(resultado) {
            console.log(`[precoLigaLogJob] ${resultado.affectedRows} registros compactados (30 dias-3 meses).`);
            return precoLigaLogModel.compactarPorMes();
        })
        .then(function(resultado) {
            console.log(`[precoLigaLogJob] ${resultado.affectedRows} registros compactados (>6 meses).`);
        })
        .catch(function(erro) {
            console.log("[precoLigaLogJob] Erro ao limpar historico de precos:", erro);
        });
}

limparHistoricoPrecos();