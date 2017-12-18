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

app.post('/api/v1/user', (req, res) => {
    console.log(req.body.types);
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
    );
});

app.post('/api/v1/kitlist/:user_id', (req, res) => {
    const itemTypes = ['heat', 'snow', 'infant', 'child', 'pets'];
    console.log(req.params);
    let itemIds = null;

    itemTypes.forEach(function(ele) {
        const queryString = `SELECT ${ele} FROM users WHERE users.user_id = ${req.params.user_id};`;
        console.log(queryString);
        console.log(typeof ele);
        if (client.query (queryString)) { // add array request.body something; to access user id
            console.log('we got');
            client.query(`SELECT item_id FROM items WHERE listType=${ele};`)
                .then(got => {
                    console.log('++++++++++++++++====++we have: ' + got);
                    itemIds = got;
                    itemIds.forEach(function(element) {
                        client.query(`INSERT INTO items_by_user(user_id, item_id) VALUES (${req.params.user_id}, ${element});`);
                        console.log(element);
                    });
                }).catch(err => console.log(err));

        }
    });
    res.status(200).send('Success' + 'username=' + req.params);
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
