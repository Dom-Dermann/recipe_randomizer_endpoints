const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 3000;

//middleware 
app.use(express.json());
app.use(cors());

//mongoDB
mongoose.connect(config.get('db.host'))
    .then(() => { console.log('Connected to Mongo DB.')})
    .catch((err) => { console.log(err)});

//routes
const recipes = require('./routes/recipes');

// routing
app.use('/',recipes);

app.listen(port, () => { console.log(`Listening on ${port}`) });