var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/blog.html')).listen(8080)
const express = require('express');
const router = express.Router();
// const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {blogPosts} = require('./models');
const app = express();
// log the http layer
app.use(morgan('common'));
// app.use(winston('public'));
// we're going to add some items to ShoppingList
// so there's some data to look at
blogPosts.create('title', 'content', 'author', 'publishDate');

// adding some recipes to `Recipes` so there's something
// to retrieve.
// blogPosts.create('title1', 'content1', 'author1', 'publishDate1');
// blogPosts.create('title2', 'content2', 'author2', 'publishDate2');

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/blog-posts', (req, res) => {
    res.json(blogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = blogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
app.put('/blog-posts/:id', jsonParser, (req, res) => {
    var requiredFields;
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog-post list \`${req.params.id}\``);
    const updatedItem = blogPosts.update({
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).json(updatedItem);
});

app.delete('/blog-posts/:id', (req, res) => {
    blogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});


// when new recipe added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
app.post('/blog-posts', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = blogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});


app.get('/blog-posts', (req, res) => {
    res.json(blogPosts.get());
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
