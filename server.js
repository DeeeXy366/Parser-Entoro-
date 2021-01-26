const puppeteer = require('puppeteer');
const http = require('http');
const fs = require("fs");

// Function for generate data everyday
async function  generateData(number) {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({width: 800, height: 600});

    // 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
    // '(KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41'

    await page.setUserAgent('Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36');
    await page.goto('http://www.etoro.com/discover/people/results?copyblock=' +
        'false&period=OneMonthAgo&page=1&sort=-gain&pagesize=20', { waitUntil: 'networkidle2'});
    console.log('Страница открыта');

    await page.waitForTimeout(20000);

    const mounthList = 'body > ui-layout > div > div > div.main-app-view.ng-scope > ' +
        'et-discovery-people-results > div > et-people-results-header > et-ui-header > div > ' +
        'div.top-inner-header-actions > et-ui-header-actions > div > div.mobile-view-off.ng-star-inserted > a > div';
    await page.waitForSelector(mounthList, { timeout: 0});
    await page.click(mounthList);
    console.log('список изменен');

    await page.waitForTimeout(6000);

    const copiers = 'body > ui-layout > div > div > div.main-app-view.ng-scope > ' +
        'et-discovery-people-results > div > div > et-discovery-people-results-list > ' +
        'div > et-table > div.et-table-head > div.et-table-head-slot > div:nth-child(3) > span > span';
    await page.waitForSelector(copiers, { timeout: 0});
    await page.click(copiers);
    console.log('выбраны те у кого больше всего копирований');

    await page.waitForTimeout(7000);

    // const elem = await page.$('body > ui-layout > div > div > div.main-app-view.ng-scope > ' +
    //     'et-discovery-people-results > div > div > et-discovery-people-results-list > ' +
    //     'div > et-table > div.et-table-body');
    // const boundingBox = await elem.boundingBox();
    let usersSelector = '';
    let usersUrls = [];

    for (let i = 1; i <= 100; i++) {
        usersSelector = 'body > ui-layout > div > div > div.main-app-view.ng-scope ' +
            '> et-discovery-people-results > div > div > et-discovery-people-results-list ' +
            '> div > et-table > div.et-table-body > div:nth-child(' + i + ') > div.et-table-first-cell.ng-star-inserted > a';
        await page.waitForSelector(usersSelector, { timeout: 0 });
        usersUrls.push(await page.$eval(usersSelector, el => el.href));

        await page.mouse.move(
            700, 200
            // boundingBox.x + boundingBox.width / 2,
            // boundingBox.y + boundingBox.height / 2
        );
        await page.mouse.wheel({ deltaY: -100 })

        await page.waitForTimeout(5000);
        console.log('добавил ссылку в массив')
    }

    console.log(usersUrls);
    await page.waitForTimeout(6000);

    let userTotalSelector = 'body > ui-layout > div > div > div.main-app-view.ng-scope > ' +
        'et-user > div > div > div > div.instrument-body-wrapper.minimize > div > et-user-stats > ' +
        'et-user-performance-chart > et-card > section > et-card-content > div.performance-info.ng-star-inserted > ' +
        'div.performance-chart-info.positive.active.ng-star-inserted > div:nth-child(1)';
    let userTotalTradesSelector = 'body > ui-layout > div > div > div.main-app-view.ng-scope > ' +
        'et-user > div > div > div > div.instrument-body-wrapper.minimize > div > et-user-stats > div > ' +
        'et-user-performance-trading > et-card > section > et-card-content > div.performance-trades-main-info > ' +
        'div.performance-total-trades > div'
    let userProfitSelector = 'body > ui-layout > div > div > div.main-app-view.ng-scope > ' +
        'et-user > div > div > div > div.instrument-body-wrapper.minimize > div > et-user-stats > div > ' +
        'et-user-performance-trading > et-card > section > et-card-content > div.performance-trades-main-info > ' +
        'div.top-trading-colum.top-pie > div.top-trade-profit > span.top-trade-profit-procent'
    let usersData = [];
    for (const m of usersUrls) {
        await page.goto(m, { waitUntil: 'networkidle2'});
        await page.waitForTimeout(4000);
        usersData.push([
                m,
                await page.$eval(userTotalSelector, el => el.value),
                await page.$eval(userTotalTradesSelector, el => el.value),
                await page.$eval(userProfitSelector, el => el.value)
            ]);
        await page.waitForTimeout(5000);
        console.log('добавил данные в массив')
    }

    console.log(usersData);
    await page.waitForTimeout(40000);

    await browser.close()
}

// по нажатию на опред кнопку генерирует файл
// async function  generateData(number) {
//     console.log(number);
//     return number;
// }

// функция отдающая определенное кол-во имен файлов для генерации кнопок
async function puppet(data) {
    let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
    return arr.slice(0, data);
}

http.createServer(async (req, res) => {
    switch (req.url) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(fs.readFileSync('./index.html', 'utf-8'));
            break;
        case '/app.css':
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(fs.readFileSync('./app.css', 'utf-8'));
            break;
        case '/app.js':
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(fs.readFileSync('./app.js', 'utf-8'));
            break;
        case '/generateData':
            let number = '';
            if(req.method === 'POST') {
                await req.on('data', function (data) {
                    number = JSON.parse(data);
                });
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(await generateData(number.data)));
            break;
        case '/puppeteer':
            let queryData = '';
            if(req.method === 'POST') {
                await req.on('data', function (data) {
                    queryData = JSON.parse(data);
                });
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(await puppet(queryData.data)));
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not found');
            break;
    }
}).listen(9876, () => console.log('server work'));