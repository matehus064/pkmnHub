var database = require("../database/config")

function registrar(carta, usuario, preco) {
    var instrucaoSql = `
        INSERT INTO preco_liga_log (fk_carta, fk_usuario, preco) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [carta, usuario, preco]);
}

function buscarPrecoAtual(carta) {
    var instrucaoSql = `
        SELECT preco_ligaPkmn FROM base_cards WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [carta]);
}

function atualizarPrecoBaseCard(carta, preco) {
    var instrucaoSql = `
        UPDATE base_cards SET preco_ligaPkmn = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [preco, carta]);
}

function atualizarPreco(carta, usuario, preco) {
    return buscarPrecoAtual(carta)
        .then(function(resultado) {
            var precoAtual = resultado[0] ? resultado[0].preco_ligaPkmn : null;
            var precoNovo = parseFloat(preco);

            // sem preço registrado ainda -> sempre grava
            if (precoAtual == null) {
                return registrar(carta, usuario, precoNovo)
                    .then(function() {
                        return atualizarPrecoBaseCard(carta, precoNovo);
                    });
            }

            // variação menor que 1 real -> ignora
            var diferenca = Math.abs(precoNovo - parseFloat(precoAtual));
            if (diferenca < 1) {
                return Promise.resolve();
            }

            return registrar(carta, usuario, precoNovo)
                .then(function() {
                    return atualizarPrecoBaseCard(carta, precoNovo);
                });
        });
}

function buscarHistorico(carta, intervalo) {
    var intervalosValidos = {
        '30 DAY': '30 DAY',
        '3 MONTH': '3 MONTH',
        '6 MONTH': '6 MONTH',
        '1 YEAR': '1 YEAR'
    };
    var intervaloSql = intervalosValidos[intervalo] || '30 DAY';

    var instrucaoSql = `
        SELECT preco, data_hora
        FROM preco_liga_log
        WHERE fk_carta = ?
          AND data_hora >= DATE_SUB(NOW(), INTERVAL ${intervaloSql})
        ORDER BY data_hora ASC;
    `;
    return database.executar(instrucaoSql, [carta]);
}

function compactarPorMes() {
    var instrucaoSql = `
        DELETE t1 FROM preco_liga_log t1
        JOIN (
            SELECT id FROM (
                SELECT id,
                    ROW_NUMBER() OVER (
                        PARTITION BY fk_carta, YEAR(data_hora), MONTH(data_hora)
                        ORDER BY preco DESC, data_hora DESC
                    ) AS rn
                FROM preco_liga_log
                WHERE data_hora < DATE_SUB(NOW(), INTERVAL 6 MONTH)
            ) ranqueado
            WHERE rn > 1
        ) t2 ON t1.id = t2.id;
    `;
    return database.executar(instrucaoSql);
}

function compactarPorSemana(intervaloInicio, intervaloFim, manterQtd) {
    var instrucaoSql = `
        DELETE t1 FROM preco_liga_log t1
        JOIN (
            SELECT id FROM (
                SELECT id,
                    ROW_NUMBER() OVER (
                        PARTITION BY fk_carta, YEARWEEK(data_hora, 3)
                        ORDER BY preco DESC, data_hora DESC
                    ) AS rn
                FROM preco_liga_log
                WHERE data_hora < DATE_SUB(NOW(), INTERVAL ${intervaloInicio})
                  AND data_hora >= DATE_SUB(NOW(), INTERVAL ${intervaloFim})
            ) ranqueado
            WHERE rn > ${manterQtd}
        ) t2 ON t1.id = t2.id;
    `;
    return database.executar(instrucaoSql);
}

function compactarDiaAnterior(limiteDesvio) {
    limiteDesvio = limiteDesvio || 0.3;

    var instrucaoSql = `
        DELETE t1 FROM preco_liga_log t1
        JOIN (
            SELECT id FROM (
                SELECT id,
                    ROW_NUMBER() OVER (
                        PARTITION BY fk_carta, DATE(data_hora)
                        ORDER BY
                            CASE WHEN ABS(preco - mediana) <= mediana * ${limiteDesvio} THEN 0 ELSE 1 END,
                            preco DESC
                    ) AS rn
                FROM (
                    SELECT l.id, l.fk_carta, l.data_hora, l.preco, m.mediana
                    FROM preco_liga_log l
                    JOIN (
                        SELECT fk_carta, AVG(preco) AS mediana
                        FROM (
                            SELECT fk_carta, preco,
                                ROW_NUMBER() OVER (PARTITION BY fk_carta ORDER BY preco) AS rn_asc,
                                ROW_NUMBER() OVER (PARTITION BY fk_carta ORDER BY preco DESC) AS rn_desc
                            FROM preco_liga_log
                            WHERE DATE(data_hora) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))
                        ) ranqueado
                        WHERE rn_asc BETWEEN rn_desc - 1 AND rn_desc + 1
                        GROUP BY fk_carta
                    ) m ON m.fk_carta = l.fk_carta
                    WHERE DATE(l.data_hora) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))
                ) comMediana
            ) rankeado
            WHERE rn > 1
        ) t2 ON t1.id = t2.id;
    `;
    return database.executar(instrucaoSql);
}

function preencherLacunasDoDiaAnterior() {
    var instrucaoSql = `
        INSERT INTO preco_liga_log (fk_carta, fk_usuario, preco, data_hora)
        SELECT ultimo.fk_carta, NULL, ultimo.preco, DATE_SUB(NOW(), INTERVAL 1 DAY)
        FROM (
            SELECT l.fk_carta, l.preco,
                ROW_NUMBER() OVER (PARTITION BY l.fk_carta ORDER BY l.data_hora DESC) AS rn
            FROM preco_liga_log l
            WHERE DATE(l.data_hora) < DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))
        ) ultimo
        WHERE ultimo.rn = 1
          AND NOT EXISTS (
              SELECT 1 FROM preco_liga_log l2
              WHERE l2.fk_carta = ultimo.fk_carta
                AND DATE(l2.data_hora) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))
          );
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    registrar,
    buscarPrecoAtual,
    atualizarPrecoBaseCard,
    atualizarPreco,
    buscarHistorico,
    compactarPorMes,
    compactarPorSemana,
    compactarDiaAnterior,
    preencherLacunasDoDiaAnterior
};