const mongoose = require('mongoose');
// const mongooseCachebox = require('mongoose-cachebox');
//
// const cache_options = {
//     cache: true, // start caching
//     ttl: 30, // 30 seconds
//     engine: 'redis',
//     host: '127.0.0.1',
//     port: '6379',
// };
//
// mongooseCachebox(mongoose, cache_options);

const log = require('./log');
const config = require('../config');

const waitPort = require('wait-port');

// const CONNECTION_STRING = `${config.mongodb.host}/${config.mongodb.db}`;
//`mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27018}`
const CONNECTION_STRING = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
log({CONNECTION_STRING});
require('mongoose-double')(mongoose);
mongoose.Promise = require('bluebird');
mongoose.set('useCreateIndex', true);

if (process.env.NODE_ENV !== 'test') {
    waitPort({
        host: config.mongodb.host,
        port: parseInt(config.mongodb.port),
    }).then(() => mongoose
        .connect(CONNECTION_STRING, config.mongodb.options)
        .then(() => log(`:: MONGOOSE CONNECTED > ${CONNECTION_STRING}`)))
        .catch(error => log(error));
}

module.exports = mongoose;
