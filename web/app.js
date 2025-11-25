const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const routes = require('./routes');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: 6379
  }
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

async function init() {
  const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'segredo_super',
    resave: false,
    saveUninitialized: false,
    // cookie options will be set below so we can conditionally apply domain/secure
    cookie: { }
  };

  try {
    await redisClient.connect();
    console.log('Redis conectado');
    const redisStore = new RedisStore({ client: redisClient, prefix: 'sess:' });
    sessionOptions.store = redisStore;
  } catch (err) {
    console.error('Não foi possível conectar ao Redis, usando store em memória:', err);
  }

  // Configure cookie options depending on environment
  const cookieOptions = {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: 'lax'
  };

  // Only set a custom domain when explicitly configured (e.g. production)
  if (process.env.SESSION_COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.SESSION_COOKIE_DOMAIN;
  }

  // secure should be true only when running over HTTPS (production)
  cookieOptions.secure = process.env.NODE_ENV === 'production';

  sessionOptions.cookie = cookieOptions;

  app.use(session(sessionOptions));

  app.use(express.static(path.join(__dirname, 'public')));

  const os = require('os');
  app.use((req, res, next) => {
    res.locals.hostname = os.hostname();
    next();
  });

  app.use('/', routes);

  const port = 3000;
  app.listen(port, () => {
    console.log(`App rodando na porta ${port} - hostname: ${require('os').hostname()}`);
  });
}

init().catch((err) => console.error('Erro na inicialização do app:', err));

const os = require('os');