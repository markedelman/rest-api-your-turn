const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');
const app = express();
// log the http layer
app.use(morgan('common'));
// we're going to add some items to ShoppingList
// so there's some data to look at
BlogPosts.create('title', 'content', 'author name');

// adding some recipes to `Recipes` so there's something
// to retrieve.
BlogPosts.create('random title1', ['something about life1', 'random new author1']);
BlogPosts.create('random title2', ['something about life2', 'random new author2']);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
    res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['name', 'budget'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = ShoppingList.create(req.body.name, req.body.budget);
    res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
app.put('/shopping-list/:id', jsonParser, (req, res) => {
    const requiredFields = ['name', 'checked', 'id'];
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
    console.log(`Updating shopping list item \`${req.params.id}\``);
    const updatedItem = ShoppingList.update({
        id: req.params.id,
        name: req.body.name,
        checked: req.body.checked
    });
    res.status(204).json(updatedItem);
});

app.delete('/shopping-list/:id', (req, res) => {
    ShoppingList.delete(req.params.id);
    console.log(`Deleted shopping list item \`${req.params.id}\``);
    res.status(204).end();
});

app.delete('/recipes/:id', (req, res) => {
    Recipes.delete(req.params.id);
    console.log(`Deleted recipe list item \`${req.params.id}\``);
    res.status(204).end();
});
// when new recipe added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
app.post('/recipes', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['name', 'ingredients'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = Recipes.create(req.body.name, req.body.ingredients);
    res.status(201).json(item);
});


app.get('/recipes', (req, res) => {
    res.json(Recipes.get());
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
