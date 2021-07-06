const express = require('express');
const postsRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');
const {logger} = require('./middleware.js');

const server = express();

server.use(express.json());

server.use(logger);
server.use('/api/posts/', postsRouter);
server.use('/api/users/', userRouter);



module.exports = server;