// const express = require('express');

// const router = express.Router();

// const userDb = require('./userDb');
// const postDb = require('../posts/postDb');

// router.post('/', validateUser, (req, res) => {

//   const id = req.params.id;
//   const info = req.body;

//   if(info.name) {
//      userDb.insert(id, info)
//     .then(user => {
//       res.status(201).json(user)
//     })
//     .catch(err => {
//       console.log(error);
//       res.status(400).json({message: 'There was an error creating the user'})
//     })
//   } else {
//     res.status(400).json({message: 'Please enter a valid name'})
//   }
 
// });

// router.post('/:id/posts', validatePost, async (req, res) => {

//   try {
//     const id = req.params;
//     const info = req.body;
    
//     if (info.text || info.text !== {}) {
//       const newPost = await postDb.insert(id, info);
//       res.status(201).json(newPost)
//     } else {
//       res.status(400).json({message: 'Please enter text for the post'})
//     }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem adding your post to the database'})
//   }
  
  
// });

// router.get('/', (req, res) => {

//   const users = userDb.get();

//   if (users) {
//     res.status(200).json(users);
//   } else {
//     res.status(500).json({errorMessage: 'There was a problem getting the users from the database'})
//   }

// });

// router.get('/:id',validateUserId, async (req, res) => {

//   try {

//     const id = req.params.id;
//     const user = await userDb.getById(id);

//     if (user.length > 0) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({message: 'The user with the specified ID does not exist'})
//     }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem with the database'})
//   }
  
// });

// router.get('/:id/posts', async (req, res) => {
  
//   try {
//     const id = req.params.id;
//     const post = await postDb.getById(id)

//   if (post.length > 0) {
//     res.status(200).json(post)
//   } else {
//     res.status(404).json({message: 'The post with the specified ID does not exist'})
//   }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem retrieving the post from the database'})
//   }

// });

// router.delete('/:id', validateUserId, async (req, res) => {
  
//   try {

//     const id = req.params.id;
//     const user = await userDb.getById(id)

//     if (user) {
//       const deletedUser = await userDb.remove(user)
//       res.status(200).json(deletedUser)
//     } else {
//       res.status(404).json({message: 'The user with the specified ID does not exist'})
//     }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem deleting the user from the database'})
//   }

// });

// router.put('/:id', validateUserId, async (req, res) => {
  
//   try {
//     const info = req.body;
//     const id = req.params.id;
//     const user = await userDb.getById(id);

//     if (user) {
//       if(info.name) {
//         const updatedUser = await userDb.update(id, info)
//         res.status(200).json(updatedUser);
//       } else {
//         res.status(400).json({message: 'Please enter a new name'})
//       }
//     } else {
//       res.status(404).json({message: 'The user with the specified ID does not exist'})
//     }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem while trying to update the user'})
//   }

// });

// //custom middleware

// function validateUserId(req, res, next) {
//   const { id } = req.params;
//   userDb.getById(id)
//     .then(user => {
//       if (user) {
//         req.user = user;
//         next();
//       } else {
//         res.status(404).json({message: 'The user does not exist'})
//       }
//     })
//     .catch(err => {
//       res.status(500).json({errorMessage: 'Something went wrong', err})
//     })
// }

// function validateUser(req, res, next) {

//   const info = req.body;

//   if (info.name || info.name !== {}) {
//     next();
//   } else {
//     res.status(400).json({message: 'Please include a user name'})
//   }
  
// }

// function validatePost(req, res, next) {
//  const body = req.body;

//  !body.text || body.text === {} ? 
//     res.status(400).json({message: 'Please include text for your post'})
//     : next();

// }

// module.exports = router;


const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');
const {validateUser} = require('../middleware.js');
const {validatePost} = require('../middleware.js');
const {validateUserID} = require('../middleware.js');

const router = express.Router();

router.post('/', validateUser, async (req, res, next) => {
  const user = await Users.insert(req.body)
  res.status(200).json(user);
});

router.post('/:id/posts', validatePost, async (req, res) => {

  try {
    const id = req.params;
    const info = req.body;
    
    if (info.text || info.text !== {}) {
      const newPost = await postDb.insert(id, info);
      res.status(201).json(newPost)
    } else {
      res.status(400).json({message: 'Please enter text for the post'})
    }
  } catch {
    res.status(500).json({errorMessage: 'There was a problem adding your post to the database'})
  }
  
  
});

router.get('/', async (req, res, next) => {
  try{

    const users = await Users.get();
    if(users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({
        message: "There are no users" });
      }
    } catch(error) {
        next(error)
    }
});

router.get('/:id', validateUserID, async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);
        if (user) {
          res.status(200).json(user);
        } else {
    console.log(error);
    res.status(500).json({
      error: "User information could not be retreived"
    });
  }
  } catch {
    res.status(500).json({errorMessage: 'There was a problem finding the user'})
  }
  
});

router.get('/:id/posts', validateUserID, async (req, res, next) => {
  // do your magic!
  const userPosts = await Users.getUserPosts(req.params.id);
  if (userPosts) {
    res.status(200).json(userPosts);
  } else {
    console.log(error);
    res.status(500).json({
      error: "User's Posts information could not be retreived"
    });
  }
});

router.delete('/:id', validateUserID, async (req, res, next) => {
  const user = await Users.remove(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    console.log(error);
    res.status(500).json({
      error: "User could not be deleted"
    });
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