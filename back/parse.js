const mongoose = require('./libs/mongoose');
const _bond = require('./models/bond');
// const

const OpenAPI = require('@tinkoff/invest-openapi-js-sdk');
const puppeteer = require('puppeteer')

const apiURL = 'https://api-invest.tinkoff.ru/openapi';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = process.env.token; // токен для сандбокса
const api = new OpenAPI({ apiURL, secretToken, socketURL });

!(async function run() {
    const _bonds = await api.bonds();
    // console.log(_bonds.instruments[0]);
    const bonds = [
        _bonds.instruments[Math.floor(Math.random() * _bonds.instruments.length)],
        _bonds.instruments[Math.floor(Math.random() * _bonds.instruments.length)],
        _bonds.instruments[Math.floor(Math.random() * _bonds.instruments.length)],
    ];
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    for (let i = 0; i < bonds.length; i++) {
        const bondData = bonds[i];
        console.log({bondData})
        const {figi, ticker, isin, faceValue, lot, name, type, currency} = bondData
        // const orderbook = await api.orderbookGet({figi, depth: 2});
        const search = await api.searchOne({figi});
        // const info = await api.instrumentInfo({figi});
        console.log({search, ticker});
        await page.goto(`https://www.tinkoff.ru/invest/bonds/${ticker}`, { waitUntil: 'domcontentloaded' });
        // await page.waitForNavigation();
        const initialState = await page.evaluate(() => initialState);
        const data = JSON.parse(initialState).stores.investSecurity[ticker];
        const {endDate, dateToClient} = data;
        console.log({data, endDate, dateToClient});
        let bond = await _bond.findOne({figi}).catch(e => e);
        console.log(bond);
        if (!bond) {
            bond = new _bond();
            console.log('New bond');
        }
        bond.endDate = new Date(data.endDate).getTime();
        bond.dateToClient = new Date(data.dateToClient).getTime();
        bond.figi = figi;
        bond.ticker = ticker;
        bond.isin = isin;
        bond.lot = lot;
        bond.faceValue = faceValue;
        bond.currency = currency;
        bond.name = name;
        bond.type = type;
        bond.floatingCoupon = data.floatingCoupon;
        bond.lastPrice = data.price.value;
        bond.couponPeriodDays = data.couponPeriodDays;
        bond.totalYield = data.totalYield;
        bond.yieldToClient = data.yieldToClient;
        console.log(bond);
        await bond.save();




        //     totalYield: Number,
        //     yieldToClient: Number,


    }
    process.exit();
})();