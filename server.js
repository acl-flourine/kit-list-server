<<<<<<< HEAD
'use strict';
=======
require('dotenv').config();
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
// const superAgent = require('superagent');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('/'));
app.use(cors());

const PORT = process.env.PORT || 3000;
const conString = 'postgres://postgres:perezed11@localhost:5432/kitlist';
// const conString = 'postgres://postgres:jenny@localhost:5432/items';
// const conString = 'postgres://@localhost:5432/kitlist';
// const conString = 'postgres://@localhost:5432/items';

const client = new pg.Client(process.env.DATABASE_URL || conString);
client.connect();

///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/v1/kitlist', (req, res) => {
    client.query(`SELECT * FROM items;`)
        .then(data => res.send(data.rows));
        console.log('test');
});

app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});
>>>>>>> f3018aaa5455627e51dfbd6fae6dcf3dbde67a51
