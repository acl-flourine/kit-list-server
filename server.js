require('dotenv').config();
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const superAgent = require('superagent');

app.use(express.static('/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.post('/api/v1/kitlist', (req, res) => {
    client.query(
        `INSERT INTO
    users(name, household, numberdays, heat, cold, infant, child, meds, pets, base, userState, userCity)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING user_id;`,
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
            true,
            req.body.userState,
            req.body.userCity
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
                        if (data.rows[0][0] === true) {
                            client.query(`SELECT item_id FROM items WHERE listtype = $1;`, [ele])
                                .then(got => {
                                    itemIds = got.rows.map(item => item.item_id);
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
            res.sendStatus(500).send(err);
        });
});

app.get('/api/v1/kitlist/:user_id', (req, res) => {
    client.query(`SELECT items.item, items.amount, items.category, items_by_user.added_on
        FROM items
        INNER JOIN items_by_user ON items.item_id = items_by_user.item_id
        WHERE items_by_user.user_id = $1;`,
        [req.params.user_id])
        .then(data => {
            res.send(data.rows);
        })
        .catch(console.error);
});

app.get('/api/v1/kitlist/users/:name', (req, res) => {
    client.query(`SELECT * FROM users WHERE name = $1;`, [req.params.name])
        .then(data => {
            res.send(data.rows);
        });
});

app.get('/test', (req, res) => {
    res.send('test passed');
});

app.get('/api/v1/weather', (req, res) => {
    client.query(`SELECT "userstate", "usercity" FROM users WHERE user_id = $1`, [req.query.id])
        .then(data => {
            const userState = data.rows[0].userstate;
            const userCity = data.rows[0].usercity;
            const apiURL = 'http://api.wunderground.com/api/';
            const apiTest = `${apiURL}${API_KEY}/conditions/q/${userState}/${userCity}.json`;

            superAgent
                .get(apiTest)
                .end((err, resp) => {
                    const temp = resp.body.current_observation.temp_f;
                    const wind = resp.body.current_observation.wind_string;
                    const weatherStatus = resp.body.current_observation.weather;
                    const location = resp.body.current_observation.display_location.full;
                    res.send([location.toString(), temp.toString(), wind.toString(), weatherStatus.toString()]); // failing to send response info back to client side
                });
        });
});

app.listen(PORT);