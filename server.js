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
    console.log(req.body);
    console.log(req.body.days);
    console.log(req.body.userState);
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
                        console.log(data.rows[0][0]);
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


// Steps for adding the API
// 1. Put HTML element on page
// 2. Call  API (server.js), should be inside a named function
// 3. With data from API, populate HTML element (using Handlebars)
// 4. Make a template for handlebars to use (index.html)
// 5. Usage of data will be done asynchronously


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////*********WEATHER***********////////////////////////////////////////////////

// app.get('/api/v1/weather', (req, res) => {
//     const locationString = 'WA/Olympia';
//     const apiURL = 'http://api.wunderground.com/api/';
//     const apiTest = `${apiURL}${API_KEY}/conditions/q/${locationString}.json`;

//     console.log(apiTest);

//     superAgent
//         .get(apiTest)
//         .end((err, resp) => {
//             const temp = resp.body.current_observation.temp_f;
//             console.log(resp.body.current_observation.wind_string);
//             console.log(resp.body.current_observation.weather);
//             console.log(resp.body.current_observation.forecast_url);
//             console.log(resp.body.current_observation.image.url);
//             // GOAL: return weatherInfo object that contains location, temp, weahter
//             res.send(temp); // failing to send response info back to client side
//         });
// });


app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});