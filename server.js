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

const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/v1/kitlist', (req, res) => {
    client.query(`SELECT * FROM items;`)
        .then(data => res.send(data.rows));
        console.log('test');
});

// *******************REFERENCE THIS FOR JOIN TABLE**********************************
// app.get('/articles', (request, response) => {
//     client.query(`
//     SELECT * FROM articles
//     INNER JOIN authors
//       ON articles.author_id=authors.author_id;`
//     )
//         .then(result => response.send(result.rows))
//         .catch(console.error);
// });


app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});
