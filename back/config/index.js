module.exports = {
    mongodb: {
        db: process.env.DB_NAME || "oblivion",
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        options: {
            autoReconnect: true,
            reconnectTries: 1000,
            reconnectInterval: 100,
            useNewUrlParser: true,
        },
    }
};
