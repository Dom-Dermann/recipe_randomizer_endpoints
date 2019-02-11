const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const {recipeSchema, Recipe} = require('../models/recipe');

route.get('/', async (req, res) => {
    Recipe.find()
        .then( (r) => res.send(r))
        .catch( (err) => res.send(err))
});

route.post('/recipe', async (req, res) => {
    const recipe = new Recipe(req.body);
    await recipe.save()
        .then( (r) => res.send(r))
        .catch( (err) => res.status(501).send(err))
});

module.exports = route;