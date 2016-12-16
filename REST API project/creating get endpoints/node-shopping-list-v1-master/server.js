
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {ShoppingList} = require('./models');
const {Recipes} = require('./models')
const jsonParser = bodyParser.json();
const app = express();
console.log(Recipes);
// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', true);
ShoppingList.create('tomatoes', false);
ShoppingList.create('peppers', false);
Recipes.create('chocolatemilk',['cocoa','milk','sugar']);
Recipes.create('coffee',['coffee beans','cheap labor','transportation']);
Recipes.create('web developer',['struggle','bootcamp','internet connection']);
// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
