const _bonds = require('./models/bond');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const parse = require('./parse');

const app = express();
app.use(cors());
(async () => {

    var bonds;

    setInterval(async () => {
        try {
            bonds = await parse(5, bonds);
        } catch (e) {
            console.log(e.message);
        }
    }, 300000);

    app.get('/bonds', async (req, res) => {
        const bonds = await _bonds.find().sort({dateToClient: 1});
        console.log('request');
        res.json(bonds);
    });

    app.listen(config.server.port, function () {
        console.log(`Example app listening on port ${config.server.port}!`);
    });
})();
