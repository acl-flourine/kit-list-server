require('dotenv').config();
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
// const superAgent = require('superagent');

app.use(express.static('/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

app.get('/monkeys', (req, res) => {
    res.send('got moneky')
})

app.post('/api/v1/kitlist', (req, res) => {
    console.log(req.body.types)
    console.log(req.body.days);
    client.query(
        `INSERT INTO
    users(name, household, numberdays, heat, snow, infant, child, meds, pets)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
            req.body.name,
            req.body.household,
            req.body.days,
            req.body.types.includes('heat'),
            req.body.types.includes('snow'),
            req.body.types.includes('infant'),
            req.body.types.includes('child'),
            req.body.types.includes('meds'),
            req.body.types.includes('pets')
        ]
    )
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
