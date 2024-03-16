import express, { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import http from 'http';
import path from 'path';
import { engine } from 'express-handlebars';

const app = express();
const server = http.createServer(app);

app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/events', (req: Request, res: Response) => {
	console.log('Client Connected!');
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	});

	const intervalId = setInterval(() => {
		const stocks = updateStockPrices();
		res.write(`data: ${JSON.stringify(stocks)}\n\n`);
	}, 750);

	req.on('close', () => {
		clearInterval(intervalId);
		console.log('Client disconnected');
	});
});

app.get('/', (req: Request, res: Response) => {
	res.render('index');
});

let stocks = generateStocks();

function updateStockPrices() {
	stocks.forEach((stock) => {
		stock.price = Math.floor(Math.random() * 480);
	});
	return stocks;
}

function generateStocks() {
	const stocks = [];
	for (let i = 0; i < 5000; i++) {
		const stock = {
			name: faker.company.name(),
			symbol: faker.finance.currencyCode(),
			price: Math.floor(Math.random() * 485),
		};
		stocks.push(stock);
	}
	return stocks;
}

const PORT = process.env.PORT || 1337;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
