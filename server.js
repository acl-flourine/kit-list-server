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

app.post('/api/v1/kitlist', (req, res) => {
    console.log(req.body.types);
    console.log(req.body.days);
    client.query(
        `INSERT INTO
    users(name, household, numberdays, heat, cold, infant, child, meds, pets, base)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING user_id;`,
        [
            req.body.name,
            req.body.household,
            req.body.days,
            req.body.types.includes('heat'),
            req.body.types.includes('cold'),
            req.body.types.includes('infant'),
            req.body.types.includes('child'),
            req.body.types.includes('meds'),
            req.body.types.includes('pets'),
            true
        ]
    )
        .then(function (result){
            const currentId = result.rows[0].user_id;
            const itemTypes = ['heat', 'cold', 'infant', 'child', 'pets', 'base'];
            let itemIds = null;
            itemTypes.forEach(function(ele) {
                const query = {
                    text: `SELECT ${ele} FROM users WHERE users.user_id = $1;`,
                    values: [currentId],
                    rowMode: 'array',
                };
                client.query(query)
                    .then( data => {
                        console.log('********DATA: ', data.rows[0][0]);
                        if (data.rows[0][0] === true) {
                            client.query(`SELECT item_id FROM items WHERE listtype = $1;`, [ele])
                                .then(got => {
                                    itemIds = got.rows.map(item => item.item_id);
                                    console.log('**********Item ids for user: ',itemIds);
                                    itemIds.forEach(function(element) {
                                        client.query(`INSERT INTO items_by_user(user_id, item_id) VALUES (${currentId}, ${element});`)
                                            .catch(err => console.log(err));
                                    });
                                }).catch(err => console.log(err));
                        }
                    });
            });
            res.status(200).send(currentId.toString());
        })
        .catch ((err) => {
            console.log('Error on insert:', err);
            res.sendStatus(500).send(err);
        });
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


app.get('/api/v1/kitlist/users/:name', (req, res) => { // how do we send database info to listView.existingUser
    client.query(`SELECT * FROM users WHERE name = $1;`, [req.params.name])
        .then(data => {
            res.send(data.rows); // <<< decide where to put data
        });
});


app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});
