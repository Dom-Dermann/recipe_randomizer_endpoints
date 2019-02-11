const mongoose = require('mongoose');
const Joi = require('joi');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        maxlength: 250
    }
});

const Recipe = new mongoose.model('Recipe', recipeSchema);

module.exports.recipeSchema = recipeSchema;
module.exports.Recipe = Recipe;