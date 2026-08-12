create database if not exists pkmnhub;

use pkmnhub;

-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pkmnhub
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `amizades`
--

DROP TABLE IF EXISTS `amizades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amizades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_solicitante` int NOT NULL,
  `fk_receptor` int NOT NULL,
  `status` enum('pendente','aceito','recusado') DEFAULT 'pendente',
  `data_solicitacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unico_par` (`fk_solicitante`,`fk_receptor`),
  KEY `fk_receptor` (`fk_receptor`),
  CONSTRAINT `amizades_ibfk_1` FOREIGN KEY (`fk_solicitante`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `amizades_ibfk_2` FOREIGN KEY (`fk_receptor`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_cards`
--

DROP TABLE IF EXISTS `base_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_pokemon` varchar(45) NOT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `set_nome` varchar(45) DEFAULT NULL,
  `raridade` varchar(35) DEFAULT NULL,
  `numero_set` varchar(10) DEFAULT NULL,
  `url_imagem` varchar(255) DEFAULT NULL,
  `preco_ligaPkmn` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_raridade` CHECK ((`raridade` in (_utf8mb4'ACE SPEC Rare',_utf8mb4'Amazing Rare',_utf8mb4'Black White Rare',_utf8mb4'Classic Collection',_utf8mb4'Common',_utf8mb4'Double Rare',_utf8mb4'Hyper Rare',_utf8mb4'Illustration Rare',_utf8mb4'LEGEND',_utf8mb4'MEGA_ATTACK_RARE',_utf8mb4'Mega Hyper Rare',_utf8mb4'Promo',_utf8mb4'Radiant Rare',_utf8mb4'Rare',_utf8mb4'Rare ACE',_utf8mb4'Rare BREAK',_utf8mb4'Rare Holo',_utf8mb4'Rare Holo EX',_utf8mb4'Rare Holo GX',_utf8mb4'Rare Holo LV.X',_utf8mb4'Rare Holo Star',_utf8mb4'Rare Holo V',_utf8mb4'Rare Holo VMAX',_utf8mb4'Rare Holo VSTAR',_utf8mb4'Rare Prime',_utf8mb4'Rare Prism Star',_utf8mb4'Rare Rainbow',_utf8mb4'Rare Secret',_utf8mb4'Rare Shining',_utf8mb4'Rare Shiny',_utf8mb4'Rare Shiny GX',_utf8mb4'Rare Ultra',_utf8mb4'Shiny Rare',_utf8mb4'Shiny Ultra Rare',_utf8mb4'Special Illustration Rare',_utf8mb4'Trainer Gallery Rare Holo',_utf8mb4'Ultra Rare',_utf8mb4'Uncommon')))
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `binder`
--

DROP TABLE IF EXISTS `binder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `binder` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_usuario` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `tipo` enum('2x2','3x3','4x3','4x4') NOT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ordem` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_usuario` (`fk_usuario`),
  CONSTRAINT `binder_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `binder_slots`
--

DROP TABLE IF EXISTS `binder_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `binder_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_binder` int NOT NULL,
  `slot` int NOT NULL,
  `url_imagem` varchar(255) DEFAULT NULL,
  `obtida` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unico_slot_binder` (`fk_binder`,`slot`),
  KEY `fk_binder` (`fk_binder`),
  CONSTRAINT `binder_slots_ibfk_1` FOREIGN KEY (`fk_binder`) REFERENCES `binder` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3023 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `colecao`
--

DROP TABLE IF EXISTS `colecao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colecao` (
  `fk_usuario` int NOT NULL,
  `fk_carta` int NOT NULL,
  `quantidade` int DEFAULT '1',
  `preco_compra` decimal(10,2) DEFAULT NULL,
  `data_adicao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fk_usuario`,`fk_carta`),
  KEY `fk_colecao_carta` (`fk_carta`),
  CONSTRAINT `fk_colecao_carta` FOREIGN KEY (`fk_carta`) REFERENCES `base_cards` (`id`),
  CONSTRAINT `fk_colecao_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `colecao_sets`
--

DROP TABLE IF EXISTS `colecao_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colecao_sets` (
  `fk_usuario` int NOT NULL,
  `set_id` varchar(20) NOT NULL,
  `numero_carta` int NOT NULL,
  `tem_normal` tinyint(1) DEFAULT '0',
  `tem_reverse` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`fk_usuario`,`set_id`,`numero_carta`),
  CONSTRAINT `colecao_sets_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `foto_perfil`
--

DROP TABLE IF EXISTS `foto_perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foto_perfil` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `preco_liga_log`
--

DROP TABLE IF EXISTS `preco_liga_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preco_liga_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_carta` int NOT NULL,
  `fk_usuario` int DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `data_hora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_carta` (`fk_carta`),
  KEY `fk_usuario` (`fk_usuario`),
  CONSTRAINT `preco_liga_log_ibfk_1` FOREIGN KEY (`fk_carta`) REFERENCES `base_cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preco_liga_log_ibfk_2` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `showcase`
--

DROP TABLE IF EXISTS `showcase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `showcase` (
  `fk_usuario` int NOT NULL,
  `slot` tinyint NOT NULL,
  `fk_carta` int DEFAULT NULL,
  PRIMARY KEY (`fk_usuario`,`slot`),
  KEY `fk_carta` (`fk_carta`),
  CONSTRAINT `showcase_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `showcase_ibfk_2` FOREIGN KEY (`fk_carta`) REFERENCES `base_cards` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `snapshots_colecao`
--

DROP TABLE IF EXISTS `snapshots_colecao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `snapshots_colecao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_usuario` int DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  `data_snapshot` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `fk_usuario` (`fk_usuario`),
  CONSTRAINT `snapshots_colecao_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transacoes`
--

DROP TABLE IF EXISTS `transacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_usuario` int DEFAULT NULL,
  `fk_carta` int DEFAULT NULL,
  `tipo_movimentacao` enum('compra','venda','troca') DEFAULT NULL,
  `valor_transacao` decimal(10,2) DEFAULT NULL,
  `preco_ligaPkmn` decimal(10,2) DEFAULT NULL,
  `data_movimento` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `fk_usuario` (`fk_usuario`),
  KEY `fk_carta` (`fk_carta`),
  CONSTRAINT `transacoes_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transacoes_ibfk_2` FOREIGN KEY (`fk_carta`) REFERENCES `base_cards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=409 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(65) NOT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fk_fotoPerfil` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_foto` (`fk_fotoPerfil`),
  CONSTRAINT `fk_usuario_foto` FOREIGN KEY (`fk_fotoPerfil`) REFERENCES `foto_perfil` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10  3:23:33
