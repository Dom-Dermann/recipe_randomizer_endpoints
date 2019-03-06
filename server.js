const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;

//middleware 
app.use(express.json());
app.use(cors());

//routes
const recipes = require('./routes/recipes');

// routing
app.use('/',recipes);

app.listen(port, () => { console.log(`Listening on ${port}`) });