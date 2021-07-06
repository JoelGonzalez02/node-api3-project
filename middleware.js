const Posts = require('./posts/postDb.js');
const Users = require('./users/userDb.js');

module.exports = {

  logger: function (req, res, next) {
    console.log(`${req.method} Request, ${req.url}, ${Date()}`);
    next();
  },

  validateUserID: function (req, res, next) {
    Users.getById(req.params.id)
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Not a valid user" })
      });
  },

  validateUser: function (req, res, next) {
    const UserInfo = Object.keys(req.body);
    UserInfo.length === 0 || UserInfo === {} ?
    res.status(400).json({ message: 'Missing user data' }) : !req.body.name || req.body.name === '' ? res.status(400).json({ message: 'Missing required name field' }) :
    next();
  },

  validatePost: function (req, res, next) {
    const PostInfo = Object.keys(req.body);

    PostInfo.length === 0 || PostInfo === {} ? res.status(400).json({ message: 'Missing post data' }) : !req.body.text || PostInfo.text === '' ? res.status(400).json({ message: 'Missing required text field'}) : next();
  },

  validatePostID: function (req, res, next) {
    Posts.getById(req.params.id)
    .then(post=> {
      if(post) {
        req.post = post
        next()
      } else {
        res.status(404).json({message: 'The post with the specified ID does not exist'})
      }
    })
    .catch(err => {
      res.status(500).json({errorMessage: 'There was a problem with the post'})
    })
  }
};