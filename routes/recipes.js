const express = require('express');
const route = express.Router();
const {recipeSchema, Recipe} = require('../models/recipe');
const path = require('path');
const {spawn} = require('child_process');

route.get('/', async (req, res) => {
    Recipe.find()
        .then( (r) => {
            res.send(r)
        })
        .catch( (err) => res.send(err))
});

route.post('/recipe', async (req, res) => {
    let recipe = new Recipe(req.body);
    recipe.lastCooked = Date.now();
    await recipe.save()
        .then( (r) => res.send(r))
        .catch( (err) => res.status(501).send(err))
});

route.get('/random', async(req, res) => {

    function runScript(){
        return spawn('python', [
          "-u", 
          path.join(__dirname, 'hello.py'),
          "--path", "path_to_csv.path",
        ]);
    };

    const subprocess = runScript()

    // print output of script
    subprocess.stdout.on('data', (data) => {
        return res.send(data);
    });

    subprocess.stderr.on('data', (data) => {
        console.log(data);
    });
    
    subprocess.stderr.on('close', () => {
        console.log('Process finished.');
    });
  
    // count all recipes
    // Recipe.count().exec(function (err, count) {

    //     // get a random number within count
    //     var random = Math.floor(Math.random()* count);

    //     // get one user, offset by random amount
    //     Recipe.findOne().skip(random).exec( (err, recipe) => {
    //         if (err) {
    //             return res.status(501).send(err);
    //         }
    //         res.send(recipe);
    //     })
    // });
});

route.get('/cooked/:id', async(req, res) => {
    const recipe_id = req.params.id;
    let recipe = await Recipe.findOne({
        _id: recipe_id
    });
    console.log(recipe);
    const timesCooked = recipe.timesCooked + 1;
    recipe.lastCooked = Date.now();
    recipe.timesCooked = timesCooked;
    await recipe.save();
    return res.send(recipe);
});

module.exports = route;