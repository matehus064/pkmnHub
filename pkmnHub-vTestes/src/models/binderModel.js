var database = require("../database/config")

function criarBinder(usuario, nomeBinder, tipoBinder) {
    var instrucaoSql = `
        INSERT INTO binder (fk_usuario, nome, tipo) VALUES ('${usuario}', '${nomeBinder}', '${tipoBinder}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarSlots(idBinder, totalSlots) {
    let valores = [];
    for (let i = 1; i <= totalSlots; i++) {
        valores.push(`('${idBinder}', ${i}, NULL)`);
    }
    var instrucaoSql = `
        INSERT INTO binder_slots (fk_binder, slot, url_imagem) VALUES ${valores.join(', ')};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarBinders(usuario) {
    var instrucaoSql = `
        SELECT id, fk_usuario, nome, tipo FROM binder WHERE fk_usuario = '${usuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarBindersPorUsername(username) {
    var instrucaoSql = `
        SELECT b.id, b.nome, b.tipo 
        FROM binder b
        JOIN usuario u ON u.id = b.fk_usuario
        WHERE u.username = '${username}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarSlots(idBinder) {
    var instrucaoSql = `
        SELECT 
            b.nome, b.tipo,
            bs.id, bs.slot, bs.url_imagem, bs.obtida
        FROM binder b
        JOIN binder_slots bs ON bs.fk_binder = b.id
        WHERE b.id = '${idBinder}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarSlot(idSlot, urlImagem) {
    var instrucaoSql = `
    update binder_slots set url_imagem = '${urlImagem}' where id = ${idSlot};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function limparSlot(idSlot) {
    var instrucaoSql = `
    update binder_slots set url_imagem = null where id = ${idSlot};
        `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarBinder(idBinder) {
    var instrucaoSql = `
        DELETE FROM binder WHERE id = ${idBinder};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function alternarPosseCarta(idSlot, estadoAtual) {
    // Se era 1 (true), vira 0. Se era 0, vira 1.
    var novoEstado = estadoAtual == 1 ? 0 : 1;
    
    var instrucaoSql = `
        UPDATE binder_slots SET obtida = ${novoEstado} WHERE id = ${idSlot};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    criarBinder,
    criarSlots,
    buscarBinders,
    buscarSlots,
    atualizarSlot,
    limparSlot,
    deletarBinder,
    alternarPosseCarta,
    buscarBindersPorUsername
};