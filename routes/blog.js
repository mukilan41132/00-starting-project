const express = require('express');
const Mongodb = require('mongodb');
const db = require('../Data/MongodbConnection')
const router = express.Router();
const ObjectId = Mongodb.ObjectId;
router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', function (req, res) {
  res.render('posts-list');
});

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