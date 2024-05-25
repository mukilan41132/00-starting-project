const express = require('express');
const Mongodb = require('mongodb');
const db = require('../Data/MongodbConnection')
const router = express.Router();
const ObjectId = Mongodb.ObjectId;
router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
  const postsgetdata = await db
    .checkconnection()
    .collection('posts')
    .find({}, { title: 1, summary: 1, 'author.name': 1 })
    .toArray();
  res.render('posts-list', { postsdata: postsgetdata });
});


router.get('/posts/:id', async function (req, res) {
  const postid = req.params.id;
  const post = await db
    .checkconnection()
    .collection('posts')
    .findOne({ _id: new ObjectId(postid) }, { summary: 0 });

  if (!post) {
    return res.status(404).render('404');
  }
  post.humanReadableDate = post.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  post.date = post.date.toISOString()
  res.render('post-detail', { post: post })
})

router.get('/posts/:id/edit', async function (req, res) {
  const postid = req.params.id;
  const post = await db
    .checkconnection()
    .collection('posts')
    .findOne({ _id: new ObjectId(postid) },
      { title: 1, summary: 1, body: 1 });
  if (!post) {
    return res.status(404).render('404');
  }
  res.render('update-post', { post: post })
})

router.post('/posts/:id/edit', async function (req, res) {
  const postid = new ObjectId(req.params.id);
  const updatepostdata = await db
    .checkconnection()
    .collection('posts')
    .updateOne({ _id: postid }, {
      $set: {
        title: req.body.title,
        summary: req.body.summary,
        body: req.body.content
      }
    });
  res.redirect('/posts')
})
router.post('/posts/:id/delete', async function (req, res) {
  const deletePost = new ObjectId(req.params.id);
  const deletePosts = await db
    .checkconnection()
    .collection('posts')
    .deleteOne({ _id: deletePost })
res.redirect('/posts')
})
router.get('/new-post', async function (req, res) {
  const authors = await db.checkconnection().collection('authors').find().toArray();

  res.render('create-post', { author: authors });
});

router.post('/posts', async function (req, res) {
  const authorid = new ObjectId(req.body.author);
  const author = await db.checkconnection().collection('authors').findOne({ _id: authorid })
  const postnew = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorid,
      name: author.name,
      email: author.email
    }
  }

  const result = await db.checkconnection().collection('posts').insertOne(postnew);
  console.log(result);
  res.redirect('/posts');

})
module.exports = router;