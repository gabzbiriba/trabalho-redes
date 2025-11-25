const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./db');

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/meu-perfil');
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { login, senha } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE login = ?', [login]);
    if (!rows || rows.length === 0) return res.render('login', { error: 'Credenciais inválidas' });
    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) return res.render('login', { error: 'Credenciais inválidas' });

    req.session.user = { id: user.id, nome: user.nome, login: user.login };
    req.session.loginAt = new Date().toISOString();

    await req.session.save();
    res.redirect('/meu-perfil');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro no servidor' });
  }
});

router.get('/meu-perfil', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const loginAt = req.session.loginAt;
  let dataLoginFormatada = loginAt;
  try {
    const d = new Date(loginAt);
    const dateStr = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d).replace(/\//g, '-');
    const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    dataLoginFormatada = `${dateStr} às ${timeStr}`;
  } catch (err) {
    // se parsing falhar, deixamos o valor original para evitar quebra
    dataLoginFormatada = loginAt;
  }

  res.render('perfil', {
    usuario: req.session.user,
    sessaoID: req.sessionID,
    sessao: { dataLogin: dataLoginFormatada },
    hostname: res.locals.hostname
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;