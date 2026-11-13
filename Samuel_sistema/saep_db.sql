CREATE DATABASE IF NOT EXISTS saep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saep_db;

DROP TABLE IF EXISTS transacoes;
DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    cliente_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    data_entrada DATETIME NOT NULL,
    data_saida DATETIME NULL,
    status ENUM('Em Aberto', 'Concluído', 'Cancelado') DEFAULT 'Em Aberto',
    valor DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (veiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

INSERT INTO clientes (nome, cpf, telefone) VALUES
('João Silva', SHA2('12345678901', 256), '(81) 99999-1111'),
('Maria Santos', SHA2('98765432100', 256), '(81) 98888-2222'),
('Pedro Lima', SHA2('45678912345', 256), '(81) 97777-3333'),
('Ana Beatriz Rocha', SHA2('11122233344', 256), '(81) 99123-4567'),
('Carlos Eduardo Souza', SHA2('55566677788', 256), '(81) 98765-4321'),
('Fernanda Oliveira', SHA2('99988877766', 256), '(81) 99654-3210'),
('Lucas Gabriel Mendes', SHA2('33344455566', 256), '(81) 98111-2233'),
('Mariana Costa', SHA2('77788899900', 256), '(81) 99444-5566'),
('Roberto Alves', SHA2('22233344455', 256), '(81) 98777-8899'),
('Juliana Barbosa', SHA2('88899900011', 256), '(81) 99222-3344');

INSERT INTO vehiculos (placa, modelo, cor, cliente_id) VALUES
('ABC-1A23', 'Toyota Corolla', 'Preto', 1),
('XYZ-9B87', 'Honda Civic', 'Prata', 2),
('KML-4C56', 'Fiat Uno', 'Branco', 3),
('JKL-8D90', 'Chevrolet Onix', 'Cinza', 4),
('MNO-2E34', 'Hyundai HB20', 'Vermelho', 5),
('PQR-5F67', 'Jeep Compass', 'Preto', 6),
('STU-9G01', 'Volkswagen Gol', 'Azul', 7),
('VWX-3H45', 'Nissan Kicks', 'Branco', 8),
('YZA-7I89', 'Renault Kwid', 'Verde', 9),
('BCD-1J23', 'Ford Ka', 'Prata', 10);

INSERT INTO transacoes (cliente_id, veiculo_id, data_entrada, data_saida, status, valor) VALUES
(1, 1, '2026-09-26 08:30:00', NULL, 'Em Aberto', 0.00),
(2, 2, '2026-09-26 09:15:00', '2026-09-26 11:30:00', 'Concluído', 15.00),
(3, 3, '2026-09-26 10:00:00', NULL, 'Em Aberto', 0.00),
(4, 4, '2026-09-26 10:45:00', '2026-09-26 12:00:00', 'Concluído', 10.00),
(5, 5, '2026-09-26 11:20:00', NULL, 'Em Aberto', 0.00),
(6, 6, '2026-09-26 12:00:00', '2026-09-26 13:30:00', 'Concluído', 20.00),
(7, 7, '2026-09-26 13:10:00', NULL, 'Em Aberto', 0.00);