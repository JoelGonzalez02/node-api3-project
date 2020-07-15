// const express = require('express');


// const userRouter = require('./users/userRouter');
// const postRouter = require('./posts/postRouter');

// const server = express();

// server.use(express.json());

// server.use('/api/users', userRouter);
// server.use('/api/posts', postRouter);



// server.get('/', (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`);
// });

// //custom middleware

// function logger(req, res, next) {
//     console.log(`Request : ${req.method} Url: ${req.url} Created: ${new Date()} `)
// }
// module.exports = server;


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