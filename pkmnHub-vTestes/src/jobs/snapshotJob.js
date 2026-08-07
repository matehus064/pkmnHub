//var cron = require('node-cron');
//var database = require('../database/config');
//var cardsModel = require('../models/cardsModel');
//
//function buscarUsuariosAtivos() {
//    var instrucaoSql = `
//        SELECT DISTINCT fk_usuario FROM transacoes 
//        WHERE data_movimento >= DATE_SUB(NOW(), INTERVAL 3 MONTH);
//    `;
//    return database.executar(instrucaoSql, []);
//}
//
//// Roda todo dia à meia-noite e um minuto
//cron.schedule('1 0 * * *', function() {
//    console.log('[snapshotJob] Rodando snapshot diário...');
//
//    buscarUsuariosAtivos()
//        .then(function(usuarios) {
//            usuarios.forEach(function(row) {
//                var usuario = row.fk_usuario;
//
//                cardsModel.buscarValorTotalColecao(usuario)
//                    .then(function(resultadoValor) {
//                        let valorTotal = resultadoValor[0].valor_total_colecao || 0;
//
//                        cardsModel.buscarSnapshotHoje(usuario)
//                            .then(function(snapshotHoje) {
//                                if (snapshotHoje.length > 0) {
//                                    cardsModel.atualizarSnapshot(snapshotHoje[0].id, valorTotal);
//                                } else {
//                                    cardsModel.salvarSnapshot(usuario, valorTotal);
//                                }
//                            });
//                    });
//            });
//        })
//        .catch(function(erro) {
//            console.log('[snapshotJob] Erro:', erro);
//        });
//});
//
//// Roda todo dia à meia-noite e dois minutos
//cron.schedule('2 0 * * *', function() {
//    console.log('[snapshotJob] Limpando snapshots antigos...');
//
//    var instrucaoSql = `
//        DELETE FROM snapshots_colecao 
//        WHERE data_snapshot < DATE_SUB(NOW(), INTERVAL 1 YEAR);
//    `;
//
//    database.executar(instrucaoSql, [])
//        .then(function(resultado) {
//            console.log(`[snapshotJob] ${resultado.affectedRows} snapshots deletados.`);
//        })
//        .catch(function(erro) {
//            console.log('[snapshotJob] Erro na limpeza:', erro);
//        });
//});

var database = require('../database/config');
var cardsModel = require('../models/cardsModel');

function rodarSnapshotDiario() {
    console.log('[snapshotJob] Rodando snapshot diário...');

var instrucaoSql = `
    SELECT DISTINCT t.fk_usuario FROM transacoes t
    INNER JOIN usuario u ON u.id = t.fk_usuario
    WHERE t.data_movimento >= DATE_SUB(NOW(), INTERVAL 3 MONTH);
`;

    database.executar(instrucaoSql, [])
        .then(function(usuarios) {
            usuarios.forEach(function(row) {
                var usuario = row.fk_usuario;

                cardsModel.buscarValorTotalColecao(usuario)
                    .then(function(resultadoValor) {
                        let valorTotal = resultadoValor[0].valor_total_colecao || 0;

                        cardsModel.buscarSnapshotHoje(usuario)
                            .then(function(snapshotHoje) {
                                if (snapshotHoje.length > 0) {
                                    cardsModel.atualizarSnapshot(snapshotHoje[0].id, valorTotal);
                                } else {
                                    cardsModel.salvarSnapshot(usuario, valorTotal);
                                }
                            });
                    });
            });
        })
        .catch(function(erro) {
            console.log('[snapshotJob] Erro no snapshot:', erro);
        });
}

function rodarLimpeza() {
    console.log('[snapshotJob] Limpando snapshots antigos...');

    var instrucaoSql = `
        DELETE FROM snapshots_colecao 
        WHERE data_snapshot < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    `;

    database.executar(instrucaoSql, [])
        .then(function(resultado) {
            console.log(`[snapshotJob] ${resultado.affectedRows} snapshots deletados.`);
        })
        .catch(function(erro) {
            console.log('[snapshotJob] Erro na limpeza:', erro);
        });
}

rodarSnapshotDiario();
rodarLimpeza();