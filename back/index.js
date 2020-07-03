const _bonds = require('./models/bond');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
(async () => {
    app.get('/', async (req, res) => {
        const bonds = await _bonds.find().sort({dateToClient: 1});
        console.log('request');
        res.json(bonds);
    });

    app.listen(3003, function () {
        console.log('Example app listening on port 3003!');
    });
})();
