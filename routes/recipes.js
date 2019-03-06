const express = require('express');
const route = express.Router();
const {recipeSchema, Recipe} = require('../models/recipe');
const path = require('path');
const {spawn} = require('child_process');
const sql = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname +'/../Database/recipes.db');
const db = db_open();

function db_open() {
    const db = new sql.Database(dbPath, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Successfully connected to SQLite Database');
    });

    return db;
}

function db_close() {
    db.close((err) => {
        if(err) {
            return console.error(err.message)
        }
        console.log('Closed Database connection.');
    });
}

route.get('/', async (req, res) => {

    const db = await db_open();

    // query all recipes in DB
    const sql = 'SELECT name, rating, timesCooked, lastCooked FROM recipes';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        return res.send(rows);
    });

    db_close();
});

route.post('/recipe', (req, res) => {

    let changes = 'No changes detected';

    const db = db_open();

    db.run('CREATE TABLE IF NOT EXISTS recipes(name TEXT, rating INTEGER, timesCooked INTEGER, lastCooked TEXT)');

    // add recipe to table
    db.run(`INSERT INTO recipes(name, rating, timesCooked, lastCooked) VALUES(?, ?, ?, ?)`, [req.body.name, req.body.rating, req.body.timesCooked, req.body.lastCooked], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // display latest ID
        console.log(`A row has been inserted with rowid ${this.lastID}`)
        changes = this.changes;
    });

    db_close();
    res.status(200).send(changes);
});

route.get('/random', async(req, res) => {

    function runScript(){
        return spawn('python', [
          "-u", 
          path.join(__dirname, 'randomizer.py'),
          "--path", "path_to_csv.path",
        ]);
    };

    const subprocess = runScript()

    // print output of script
    subprocess.stdout.on('data', (data) => {
        // return the data as json and display random choice in UI
        console.log(data);
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