var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao, valores = []) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.query(instrucao, valores, function (erro, resultados) {
            conexao.end();
            if (erro) {
                console.log("ERRO NO MySQL:", erro.sqlMessage || erro);
                return reject(erro);
            }
            console.log(resultados);
            resolve(resultados);
        });
        conexao.on('error', function (erro) {
            console.log("ERRO NO MySQL SERVER:", erro.sqlMessage || erro);
        });
    });
}

module.exports = {
    executar
};