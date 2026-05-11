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