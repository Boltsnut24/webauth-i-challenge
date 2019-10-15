const express = require('express');
const session = require('express-session');

const KnexSessionStore = require('connect-session-knex')(session);

const dbConnection = require('./data/db-config');
const server = express();

const sessionConfig = {
    name: 'sessionCookie',
    secret: process.env.SESSION_SECRET || 'Keep it safe, keep it secret.',
    cookie: {
        maxAge: 1000 * 60 * 60 ,
        secure: false,
        httpOnly: true,
        store: new KnexSessionStore({
            knex: dbConnection,
            tablename: 'knexsession',
            sidfieldname: 'sessionid',
            createtable: true,
            clearInterval: 1000 * 60 * 30,
        }),
        resave: false,
        saveUninitialzed: true,
    }
}

server.use(express.json());
server.use(session(sessionConfig));

const usersRouter =require('./routes/users-router.js');
server.use('/api/users', usersRouter);

server.get('/', (req, res)=>{
    res.send(`testing webauth-i-project`);
})  

module.exports = server;