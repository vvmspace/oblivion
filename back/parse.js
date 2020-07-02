// require('./sideeffects/array');
const OpenAPI = require('@tinkoff/invest-openapi-js-sdk');
const puppeteer = require('puppeteer')

const apiURL = 'https://api-invest.tinkoff.ru/openapi';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = process.env.token; // токен для сандбокса
const api = new OpenAPI({ apiURL, secretToken, socketURL });

!(async function run() {
    const _bonds = await api.bonds();
    // console.log(_bonds.instruments[0]);
    const bonds = [_bonds.instruments[Math.floor(Math.random() * _bonds.instruments.length)]];
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    for (let i = 0; i < bonds.length; i++) {
        const bond = bonds[i];
        const {figi, ticker} = bond
        // const orderbook = await api.orderbookGet({figi, depth: 2});
        const search = await api.searchOne({figi});
        // const info = await api.instrumentInfo({figi});
        console.log({search, ticker});
        await page.goto(`https://www.tinkoff.ru/invest/bonds/${ticker}`, { waitUntil: 'domcontentloaded' });
        // await page.waitForNavigation();
        const initialState = await page.evaluate(() => initialState);
        const data = JSON.parse(initialState).stores.investSecurity[ticker];
        const {endDate, dateToClient} = data;
        console.log({endDate, dateToClient});

    }
    process.exit();
})();