const puppeteer = require('puppeteer');
const http = require('http');
const fs = require("fs");

// функция которая будет выгружать файлы раз в день
async function  generateData(number) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.etoro.com/discover/people/results?copyblock=false&period
        =OneMonthAgo&gainmin=10&hasavatar&maxmonthlyriskscoremax=6&dailyddmin=-5&verified&isfund
        =false&maxmonthlyriskscoremin=1&tradesmin=5&weeklyddmin=-15&profitablemonthspctmin
        =50&lastactivitymax=30&sort=-copiers&page=1&pagesize=20`, {waitUntil: 'networkidle2'});

        console.log('Страница открыта');
    } catch (error) {
        console.log(`Не удалось открыть страницу из-за ошибки: ${error}`);
    }

    const usersSelector = 'body > ui-layout > div > div > div.main-app-view.ng-scope ' +
        '> et-discovery-people-results > div > div > et-discovery-people-results-list ' +
        '> div > et-table > div.et-table-body > div:nth-child(1) > div.et-table-first-cell.ng-star-inserted > a';

    const aaa = await page.waitForSelector(usersSelector, { timeout: 0 });
    console.log(aaa);
    // const UsersUrls = await page.$$eval(
    //     usersSelector, usersLinks => usersLinks.map(link => link.href)
    // );

    // console.log(aaa);
    // const CLICKHERE_SELECTOR = '#post-2068 > div > div.entry-content > p:nth-child(2) > a:nth-child(1)';
    // await page.click(CLICKHERE_SELECTOR);
    // const data = await page.content();
    await browser.close();
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
}).listen(3000, () => console.log('server work'));