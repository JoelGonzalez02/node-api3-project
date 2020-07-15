// const express = require('express');

// const router = express.Router();

// const postDb = require('./postDb');

// router.get('/', (req, res) => {
  
//   const posts = postDb.get();

//   if (posts) {
//     res.status(200).json(posts)
//   } else {
//     res.status(500).json({errorMessage: 'There was a problem retrieving the posts from the database'})
//   }
  
// });

// router.get('/:id', validatePostId, async (req, res) => {
  
//   try {
//     const { id } = req.params;
//     const post = await postDb.getById(id);

//     if(post.length > 0) {
//       res.status(200).json(post)
//     } else {
//       res.status(404).json({message: 'The post with the specified ID does not exist'})
//     }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem getting the post from the database'})
//   }

// });

// router.delete('/:id', validatePostId, async (req, res) => {
  
//   try {
//     const { id } = req.params;
//     const post = await postDb.getById(id);

//     if (post) {
//       const deletedPost = await postDb.remove(post)
//       res.status(200).json(deletedPost)
//     } else {
//       res.status(404).json({message: 'The post with the specified ID does not exist'})
//     }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem deleting the post from the database'})
//   }

// });

// router.put('/:id', validatePostId, async (req, res) => {

//   try {
//      const { id } = req.params;
//      const { body } = req;
//      const post = await postDb.getById(id);

//      if (post) {
//        if (body.text || body.text !== {}) {
//           const updatedPost = await postDb.update(body)
//        } else {
//          res.status(400).json({message: 'Please enter some new text to edit your post'})
//        }
//      } else {
//        res.status(404).json({message: 'The post with the specified ID does not exist'})
//      }
//   } catch {
//     res.status(500).json({errorMessage: 'There was a problem updating your post'})
//   }
 
// });

// // custom middleware

// function validatePostId(req, res, next) {
//   const { id } = req.params;
//   postDb.getById(id)
//     .then(post => {
//       if (post) {
//         req.post = post;
//         next();
//       } else {
//         res.status(404).json({message: 'The post does not exist'})
//       }
//     })
//     .catch(err => {
//       res.status(500).json({errorMessage: 'Something went wrong while tryin to retrive the post from the database'})
//     })
// }

// module.exports = router;


const express = require('express');
const Posts = require('./postDb.js');
const {validatePost} = require('../middleware.js');
const {validatePostID} = require('../middleware.js');





const router = express.Router();

router.get('/', async (req, res, next) => {
  try{
    const posts = await Posts.get();
    if(posts.length > 0) {
      res.status(200).json(posts);
    } else {res.status(404).json({
      message: 'No posts available' });
    }
  } catch (error) {
    next (error)
  }
});

router.get('/:id', validatePostID, async (req, res, next) => {
    const post = await Posts.getById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retreived"
      });
    }
  });

router.delete('/:id', validatePostID, async (req, res, next) => {
    const post = await Posts.remove(req.params.id);
    if (post) {
      res.status(200).json(req.body)
    } else {
      console.log(error);
      res.status(500).json({ error: "The post could not be removed"
      });
    }
  });

router.put('/:id', validatePostID, validatePost, async (req, res, next) => {
    if (req.body.text){
      const editPostInfo = await Posts.update(req.params.id, req.body)
      res.status(201).json(editPostInfo);
    }
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;