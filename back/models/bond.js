const uuid = require('shortid');
const mongoose = require('../libs/mongoose');

const bondSchema = new mongoose.Schema({
    uuid: {
        default: uuid.generate,
        index: true,
        type: String,
        unique: true,
    },
    endDate: Number,
    dateToClient: Number,
    figi: String,
    ticker: String,
    isin: String,
    name: String,
    currency: String,
    type: String,
    faceValue: Number,
    lot: Number,
    minPriceIncrement: Number,
    lastPrice: Number,
    couponPeriodDays: Number,
    totalYield: Number,
    yieldToClient: Number,
    floatingCoupon: Boolean,
}, { timestamps: true, id: false });

module.exports = mongoose.model('bond', bondSchema);