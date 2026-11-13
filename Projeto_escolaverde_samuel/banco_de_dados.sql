CREATE DATABASE IF NOT EXISTS escola_verde;
USE escola_verde;

-- Limpa as tabelas anteriores
DROP TABLE IF EXISTS registro_acao;
DROP TABLE IF EXISTS turma;

-- Recria as tabelas
CREATE TABLE turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL
);

CREATE TABLE registro_acao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    pontos INT NOT NULL,
    data_registro DATE NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE CASCADE
);

-- Insere turmas do SESI e Cursos Técnicos do SENAI
INSERT INTO turma (nome_turma, periodo) VALUES
('1º Ano - SESI', 'Manhã'),
('2º Ano - SESI', 'Tarde'),
('3º Ano - SESI', 'Tarde'),
('Téc. em Mecânica - SENAI', 'Manhã'),
('Téc. em Metalurgia - SENAI', 'Tarde'),
('Téc. em Eletrotécnica - SENAI', 'Manhã'),
('Téc. em Automação Industrial - SENAI', 'Tarde'),
('Téc. em Desenvol. de Sistemas - SENAI', 'Manhã');

-- Insere ações de reciclagem ajustadas
INSERT INTO registro_acao (turma_id, descricao, pontos, data_registro) VALUES
(1, 'Coleta seletiva de garrafas PET e papéis', 55, '2026-08-10'),
(2, 'Arrecadação de pilhas e baterias usadas', 65, '2026-08-11'),
(3, 'Compostagem e reciclagem de embalagens', 80, '2026-08-12'),
(4, 'Descarte correto de limalha de ferro e retalhos metálicos', 95, '2026-08-13'),
(5, 'Coleta e separação de Sucata Metálica da oficina', 85, '2026-08-14'),
(6, 'Descarte adequado de fios de cobre e eletrônicos', 75, '2026-08-15'),
(7, 'Reciclagem de carcaças plásticas e peças automotivas', 60, '2026-08-16'),
(8, 'Descarte de e-waste (placas, cabos e teclados)', 90, '2026-08-17');

-- Consulta para testar o ranking
SELECT 
    t.id,
    t.nome_turma,
    t.periodo,
    COALESCE(SUM(r.pontos), 0) AS total_pontos
FROM turma t
LEFT JOIN registro_acao r ON t.id = r.turma_id
GROUP BY t.id, t.nome_turma, t.periodo
ORDER BY total_pontos DESC;