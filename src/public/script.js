const stockTableBody = document.querySelector('#stock-table');
const eventSource = new EventSource('/events');

eventSource.onmessage = function (event) {
	const stocks = JSON.parse(event.data);
	renderStocks(stocks);
};

eventSource.onerror = function (error) {
	console.error('SSE error:', error);
};

function renderStocks(stocks) {
	stockTableBody.innerHTML = '';

	stocks.forEach((stock) => {
		const row = document.createElement('tr');
   row.innerHTML = `
      <td class="border px-4 py-2">${stock.name}</td>
      <td class="border px-4 py-2">${stock.symbol}</td>
      <td class="border px-4 py-2">${stock.price}</td>
    `;
		stockTableBody.appendChild(row);
	});
}
