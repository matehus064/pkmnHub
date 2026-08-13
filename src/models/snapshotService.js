var cardsModel = require("../models/cardsModel");

function salvarOuAtualizarSnapshot(usuario) {
    return cardsModel.buscarValorTotalColecao(usuario)
        .then(function (resultadoValor) {
            let valorTotal = resultadoValor[0].valor_total_colecao;

            return cardsModel.buscarSnapshotHoje(usuario)
                .then(function (snapshotHoje) {
                    if (snapshotHoje.length > 0) {
                        return cardsModel.atualizarSnapshot(snapshotHoje[0].id, valorTotal);
                    } else {
                        return cardsModel.salvarSnapshot(usuario, valorTotal);
                    }
                });
        });
}

module.exports = {
    salvarOuAtualizarSnapshot
};