const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');
const {validateUser} = require('../middleware.js');
const {validatePost} = require('../middleware.js');
const {validateUserID} = require('../middleware.js');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  const user = await Users.insert(req.body)
  res.status(200).json(user);
});



router.post('/:id/posts', validatePost, async (req,res) => {


  try {

  const id = req.params.id;
  const post = {user_id: id, text: '', ...req.body}
  const user = await Users.getById(id);


      if (user) {
          if (post.text !== '') {
              const newPost = await Posts.insert(post)
              res.status(201).json(newPost)
          } else {
              res.status(400).json({message: 'Please enter text for the post'})
          }
      } else {
          res.status(404).json({message: 'The user with the specified ID does not exist'})
      }
  } catch(e) {
      console.log(e)
      res.status(500).json({errorMessage: 'There was an error saving your post to the database'})
  }

});

router.get('/', async (req, res) => {

  try {

     const users = await Users.get();

        if (users.length > 0) {
          res.status(200).json(users);
        } else {
          res.status(500).json({errorMessage: 'There was a problem getting the users from the database'})
        }

  } catch {
    res.status(500).json({errorMessage: 'There was an error getting the users'})
  }

});

router.get('/:id',validateUserID, async (req, res) => {

  try {

    const id = req.params.id;
    const user = await Users.getById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'The user with the specified ID does not exist'})
    }
  } catch {
    res.status(500).json({errorMessage: 'There was a problem with the database'})
  }
  
});


router.get('/:id/posts', async (req, res) => {
  
  try {
    const id = req.params.id;
    const posts = await Users.getUserPosts(id)

  if (posts) {
    res.status(200).json(posts)
  } else {
    res.status(404).json({message: 'The post with the specified ID does not exist'})
  }
  } catch {
    res.status(500).json({errorMessage: 'There was a problem retrieving the post from the database'})
  }

});

router.delete('/:id', validateUserID, async (req, res) => {

const { id } = req.params; 
const deletedUser = await Users.remove(id);

if (deletedUser) {
  res.status(200).json(deletedUser)
} else {
  res.status(500).json({message: 'The user could not be deleted'})
}

});

router.put('/:id', validateUserID, async (req, res) => {

  const userInfo = req.body;
  const id = req.params.id;
  const user = await Users.getById(id);

  try {

      if (user) {
          if (userInfo) {
              const editedUser = await Users.update(id, userInfo)
              res.status(200).json(editedUser)
          } else {
              res.status(400).json({message: 'Please provide a name to edit'})
          }
      } else {
          res.status(404).json({message: 'The user with the specified ID does not exist'})
      }
  } catch {
      res.status(500).json({errorMessage: 'The user information could not be updated'})
  }

})
//custom middleware

module.exports = router;