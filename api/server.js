const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require("express-session");

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

const sessionConfig = {
    name: 'monster',
    secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
    resave: false,
    saveUninitialized: process.env.SEND_COOKIES || true,
    cookie: {
      maxAge: 1000 * 10, //good for 10 min in ms
      secure: process.env.USE_SECURE_COOKIES || false, //used over https only
      httpOnly: true, //true means JS can NOT acces the cookie
    },
}

server.use(helmet());
server.use(cors({ credentials: true, origin: "http://localhost:3000" }));
server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
