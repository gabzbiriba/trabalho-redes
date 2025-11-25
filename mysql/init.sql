CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (login, senha_hash, nome) VALUES
  ('aluno1', '$2b$10$snwJQy.Jz7RSB5hgtNoWeu3PcqNM4GVutT4.QRhPSkM8lhIK3Iv7K', 'Aluno Um'),
  ('aluno2', '$2b$10$snwJQy.Jz7RSB5hgtNoWeu3PcqNM4GVutT4.QRhPSkM8lhIK3Iv7K', 'Aluno Dois'),
  ('aluno3', '$2b$10$snwJQy.Jz7RSB5hgtNoWeu3PcqNM4GVutT4.QRhPSkM8lhIK3Iv7K', 'Aluno Três')
ON DUPLICATE KEY UPDATE
  senha_hash = VALUES(senha_hash),
  nome = VALUES(nome);