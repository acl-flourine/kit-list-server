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

// app.get('/api/v1/kitlist', (req, res) => {
//     client.query(`SELECT * FROM items;`)
//         .then(data => res.send(data.rows));
//     console.log('test');
// });


app.post('/api/v1/kitlist', (req, res) => {
    console.log(req.body.types);
    console.log(req.body.days);
    client.query(
        `INSERT INTO
    users(name, household, numberdays, heat, snow, infant, child, meds, pets, base)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [
            req.body.name,
            req.body.household,
            req.body.days,
            req.body.types.includes('heat'),
            req.body.types.includes('snow'),
            req.body.types.includes('infant'),
            req.body.types.includes('child'),
            req.body.types.includes('meds'),
            req.body.types.includes('pets'),
            true
        ]
    );
    res.status(200).send('Success');
});

app.post('/api/v1/kitlist/:user_id', (req, res) => {
    const itemTypes = ['heat', 'snow', 'infant', 'child', 'pets', 'base'];
    console.log(req.params);
    let itemIds = null;
    itemTypes.forEach(function(ele) {
        if (client.query (`SELECT $1 FROM users WHERE users.user_id = $2;`, [ele, req.params.user_id])) {
            client.query(`SELECT item_id FROM items WHERE listtype = $1;`, [ele])
                .then(got => {
                    itemIds = got.rows.map(item => item.item_id);
                    itemIds.forEach(function(element) {
                        client.query(`INSERT INTO items_by_user(user_id, item_id) VALUES (${req.params.user_id}, ${element});`);
                        console.log(element);
                    });
                }).catch(err => console.log(err));
        }
    });
    res.status(200).send('Success' + 'username=' + req.params);
});


app.get('/api/v1/kitlist/:user_id', (req, res) => {
    client.query(`SELECT items.item, items.amount, items_by_user.added_on
        FROM items
        INNER JOIN items_by_user ON items.item_id = items_by_user.item_id
        WHERE items_by_user.user_id = $1;`,
        [req.params.user_id])
        .then(data => {
            res.send(data.rows);
            console.log(data);})
        .catch(console.error);
});
app.get('/api/v1/kitlist/:name', (req, res) => { // how do we send database info to listView.existingUser
    client.query(`SELECT * FROM users WHERE name === $1;`, [req.params.name]) // <<< decide proper form input
        .then(data => {
            res.send(data.rows); // <<< decide where to put data
        });
});


app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});
