const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { blogPosts } = require('./models');
const app = express();
app.use(morgan('common'));
blogPosts.create('title', 'content', 'author', 'publishDate');

//to add more objects in the API
// blogPosts.create('Name1', 'content1', 'author1', 'publishDate1');
// blogPosts.create('title2', 'content2', 'author2', 'publishDate2');





app.get('/blog-posts', (req, res) => {
    res.json(blogPosts.get());
});




//post is the option, where you or the outside user can add objects into the API
app.post('/blog-posts', jsonParser, (req, res) => {

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
            `Request path id (${req.params.id}) and request body id ` 
            `(${req.body.id}) must match`);
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






app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

