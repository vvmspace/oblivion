const mongoose = require('./libs/mongoose');
const _bond = require('./models/bond');
// const

const OpenAPI = require('@tinkoff/invest-openapi-js-sdk');
const puppeteer = require('puppeteer')
const config = require('./config');
const apiURL = 'https://api-invest.tinkoff.ru/openapi';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = process.env.JSBOND_TOKEN; // токен для сандбокса
const api = new OpenAPI({ apiURL, secretToken, socketURL });

const parse = async (count, _bonds = null) => {
    const bonds = (Math.random() > 0.001)
        && _bonds
        && _bonds.instruments
        && (_bonds.instruments.length)
        && (_bonds.instruments.length > 0)
        && _bonds || await api.bonds();
    let args = ['--no-sandbox', '--disable-setuid-sandbox'];
    if (config.proxy && config.proxy.port && config.proxy.host) {
        args.push(`--proxy-server=http://${config.proxy.host}:${config.proxy.port}`);
    }
    const browser = await puppeteer.launch({
        args
    })
    const page = await browser.newPage()
        await page.goto(`https://2ip.ru`, {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: '/exchange/sh.png'});
        for (let i = 0; i < count; i++) {
            try {
            const bondData = bonds.instruments[Math.floor(Math.random() * bonds.instruments.length)]
            console.log({bondData})
            const {figi, ticker, isin, faceValue, lot, name, type, currency} = bondData
            // const orderbook = await api.orderbookGet({figi, depth: 2});
            const search = await api.searchOne({figi});
            // const info = await api.instrumentInfo({figi});
            // console.log({search, ticker});
            await page.goto(`ht${''}tps://www${''}.ti${''}nk${''}off.ru/in${''}ves${''}t/b${''}on${''}ds/${ticker}`, {waitUntil: 'domcontentloaded'});
            // await page.waitForNavigation();
            await page.screenshot({path: '/exchange/bond.png'});
            const initialState = await page.evaluate(() => initialState);
            const data = JSON.parse(initialState).stores.investSecurity[ticker];
            const {endDate, dateToClient, price} = data;
            if(price) {
                console.log({data, endDate, dateToClient});
                let bond = await _bond.findOne({figi}).catch(e => e);
                console.log(bond);
                if (!bond) {
                    bond = new _bond();
                    console.log(`New bond: ${ticker} ${name}`);
                } else {
                    console.log(`Updating bond: ${ticker} ${name}`);
                }
                console.log(bond);
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
                await bond.save();
            } else {
                console.log('NO PRICE', ticker)
            }
            } catch (e) {
                console.log('Error in iteration', e.message);
            }
            console.log(count, i, count - i);
        }
    await page.close();
    await browser.close();
    return bonds;
}

if (!module.parent) {
    parse(5).then(() => process.exit());
}

module.exports = parse;