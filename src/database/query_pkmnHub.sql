create database if not exists pkmnhub;

use pkmnhub;

-- 1. Tabela de Fotos (Deve vir primeiro para ser referenciada)
CREATE TABLE foto_perfil (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL -- Ex: 'Pikachu', 'Bulbasaur'
);

INSERT INTO foto_perfil (nome) VALUES ('May'), ('Dawn'), ('Lyra'), ('Hilda'), ('Rosa'), ('Selene');

-- 2. Tabela de Usuários
CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) NOT NULL UNIQUE,
    email VARCHAR(65) NOT NULL UNIQUE,
    senha VARCHAR(255), -- Aumentado para hashes seguros (bcrypt/argon2)
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Chave Estrangeira para a foto
    fk_fotoPerfil INT,
    CONSTRAINT fk_usuario_foto FOREIGN KEY (fk_fotoPerfil) 
        REFERENCES foto_perfil(id)
);


-- 2. Dicionário de Cartas (Referência Global)
-- Aqui ficam os dados fixos da carta. Evita repetição de texto.
CREATE TABLE base_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_pokemon VARCHAR(45) NOT NULL,
    tipo VARCHAR(20),      -- Ex: Fogo, Água, Teratipo
    set_nome VARCHAR(45),  -- Ex: Heróis Excelsos
    raridade VARCHAR(35),  -- Aumentei um pouco o tamanho por segurança
    numero_set VARCHAR(10), -- Ex: 054/191
    url_imagem VARCHAR(255), -- O novo campo entra aqui!
    
    -- Correção da Constraint: especifique a coluna 'raridade' antes do IN
    CONSTRAINT chk_raridade CHECK (raridade IN (
        'Common', 
        'Uncommon', 
        'Rare', 
        'Double Rare', 
        'Ultra Rare', 
        'Illustration Rare', 
        'Special Illustration Rare', 
        'ACE SPEC rare', 
        'Hyper Rare', 
        'Promo'
    ))
);

-- 3. A Coleção do Usuário (Relacionamento N:N puro)
-- Agora a identificação única da linha é o par (fk_usuario, fk_carta)
CREATE TABLE colecao (
    fk_usuario INT,
    fk_carta INT,
    quantidade INT DEFAULT 1,
    preco_compra DECIMAL(10, 2),
    preco_ligaPkmn DECIMAL(10, 2),
    data_adicao DATE DEFAULT (CURRENT_DATE),
    
    -- Definindo a Chave Primária Composta
    PRIMARY KEY (fk_usuario, fk_carta),

    -- Chaves Estrangeiras
    CONSTRAINT fk_colecao_usuario FOREIGN KEY (fk_usuario) 
        REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_colecao_carta FOREIGN KEY (fk_carta) 
        REFERENCES base_cards(id)
);

CREATE TABLE transacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    fk_carta INT,
    tipo_movimentacao ENUM('compra', 'venda', 'troca'),
    valor_transacao DECIMAL(10, 2),
    preco_ligaPkmn DECIMAL(10, 2),
    data_movimento DATE DEFAULT (CURRENT_DATE), 
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id),	
    FOREIGN KEY (fk_carta) REFERENCES base_cards(id)
);

CREATE TABLE snapshots_colecao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    valor_total DECIMAL(10, 2),
    data_snapshot DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);


-- ----- SELECTS PARA A API: -----

-- function existeCarta(nomePokemon, numeroSet) {
	SELECT id, nome_pokemon, numero_set FROM base_cards
		WHERE nome_pokemon = '${nomePokemon}' AND numero_set = '${numeroSet}';

-- function cadastrar(nomePokemon, tipoPokemon, nomeSet, raridadePokemon, numeroSet, urlCarta) {
	INSERT INTO base_cards (nome_pokemon, tipo, set_nome, raridade, numero_set, url_imagem) 
		VALUES ('${nomePokemon}', '${tipoPokemon}', '${nomeSet}', '${raridadePokemon}', '${numeroSet}', '${urlCarta}');
        
-- function adicionarNaColecao(usuario, carta, quantidade, precoCompra, precoLigaPkmn) {
	INSERT INTO colecao (fk_usuario, fk_carta, quantidade, preco_compra, preco_ligaPkmn) 
        VALUES ('${usuario}', '${carta}', '${quantidade}', '${precoCompra}', '${precoLigaPkmn}');

-- function buscarValorTotalColecao (usuario) {
SELECT SUM(c.preco_ligaPkmn * c.quantidade) AS valor_total_colecao FROM colecao c 
	INNER JOIN usuario u 
	ON u.id = c.fk_usuario 
    WHERE c.fk_usuario = '${usuario}';

-- function buscarValorTotalCompra (usuario) {
	SELECT SUM(c.preco_compra * c.quantidade) AS valor_total_compra FROM colecao c 
    INNER JOIN usuario u 
    ON u.id = c.fk_usuario 
    WHERE c.fk_usuario = '${usuario}';

-- function buscarTotalCartas (usuario) {
    SELECT SUM(quantidade) AS total_cartas_fisicas FROM colecao 
    WHERE fk_usuario = '${usuario}';

-- function buscarCartaMaisCara (usuario) {
    SELECT b.nome_pokemon, b.set_nome, b.url_imagem, c.preco_ligaPkmn 
    FROM colecao AS c JOIN base_cards AS b 
    ON c.fk_carta = b.id 
    WHERE c.fk_usuario = '${usuario}' 
    ORDER BY c.preco_ligaPkmn DESC LIMIT 1;

-- function salvarSnapshot (usuario, valorTotal) {
    INSERT INTO snapshots_colecao (fk_usuario, valor_total) 
    VALUES ('${usuario}', '${valorTotal}');

-- function buscarSnapshots(usuario, intervalo) {
    SELECT data_snapshot, valor_total FROM snapshots_colecao 
    WHERE fk_usuario = '${usuario}' 
		AND data_snapshot >= DATE_SUB(NOW(), INTERVAL ${intervalo}) 
        AND id IN (
			SELECT MAX(id) FROM snapshots_colecao 
            WHERE fk_usuario = '${usuario}' 
			GROUP BY data_snapshot
		)
    ORDER BY data_snapshot ASC;
    
-- function buscarColecao(usuario) {
    SELECT b.url_imagem, b.nome_pokemon, b.set_nome, b.numero_set, c.quantidade, c.preco_compra, c.preco_ligaPkmn from base_cards b 
    INNER JOIN colecao c 
    ON c.fk_carta = b.id 
    INNER JOIN usuario u 
    ON c.fk_usuario = u.id 
    WHERE u.id = '${usuario}';

-- function buscarCartaNaColecao(usuario, nomePokemon, numeroSet) {
    SELECT fk_usuario, fk_carta, quantidade, preco_compra, preco_ligaPkmn, data_adicao FROM colecao c 
    INNER JOIN base_cards bc 
    ON c.fk_carta = bc.id 
    WHERE fk_usuario = '${usuario}' AND bc.nome_pokemon = '${nomePokemon}' AND bc.numero_set = '${numeroSet}';

-- function atualizarQuantidade(usuario, carta, quantidade) {
    UPDATE colecao 
    SET quantidade = quantidade - '${quantidade}' 
    WHERE fk_usuario = '${usuario}' AND fk_carta = '${carta}';

-- function removerDaColecao(usuario, carta) {
    DELETE FROM colecao 
    WHERE fk_usuario = '${usuario}' AND fk_carta = '${carta}';

-- function registrarTransacao(usuario, carta, tipoMovimentacao, valorVenda, precoLigaPkmn) {
	INSERT INTO transacoes (fk_usuario, fk_carta, tipo_movimentacao, valor_transacao, preco_ligaPkmn) 
	VALUES ('${usuario}', '${carta}', '${tipoMovimentacao}', '${valorVenda}', '${precoLigaPkmn}');

-- function buscarTotalGasto(usuario) {
	SELECT SUM(valor_transacao) AS total_investido FROM transacoes 
	WHERE fk_usuario = '${usuario}' AND tipo_movimentacao = 'compra';

-- function buscarTotalRetorno(usuario) {
	SELECT SUM(valor_transacao) AS total_retorno FROM transacoes 
	WHERE fk_usuario = '${usuario}' AND tipo_movimentacao = 'venda';
        
-- function buscarEvolucaoColecao(usuario, intervalo) 
	SELECT data_adicao, SUM(preco_ligaPkmn * quantidade) AS valor_total FROM colecao 
	WHERE fk_usuario = '${usuario}' AND data_adicao >= DATE_SUB(NOW(), INTERVAL ${intervalo}) 
	GROUP BY data_adicao 
	ORDER BY data_adicao;