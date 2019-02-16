const mongoose = require('mongoose');
const Joi = require('joi');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        maxlength: 250
    },
    rating: {
        type: Number, 
        min: 1, 
        max: 5,
        required: true
    },
    timesCooked: {
        type: Number,
        default: 0
    }, 
    lastCooked: {
        type: Date,
        default: Date.now()
    }
});

const Recipe = new mongoose.model('Recipe', recipeSchema);

module.exports.recipeSchema = recipeSchema;
module.exports.Recipe = Recipe;