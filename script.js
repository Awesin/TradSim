// script.js
// Calculate the desired width and height for the chart container based on screen size
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const desiredWidth = screenWidth * 0.75; // 75% of screen width
const desiredHeight = screenHeight * 0.75; // 75% of screen height

// Constants
const maxTime = 100; // in seconds
const maxX = 100; // Maximum X-axis value
const maxY = 120; // Maximum Y-axis value

// Initial values
let currentTime = 0;
let chartData = [];
let chart = null;
let simulationInterval = null;

// HTML Elements
const tradingChart = document.getElementById('trading_chart');
const startSimulationButton = document.getElementById('startSimulation');
const stopSimulationButton = document.getElementById('stopSimulation');

// Buy and Sell buttons, input fields, and output elements
const buyButton = document.getElementById('buyButton');
const sellButton = document.getElementById('sellButton');
const buyQuantityInput = document.getElementById('buyQuantity');
const sellQuantityInput = document.getElementById('sellQuantity');
const buyOutput = document.getElementById('buyOutput');
const sellOutput = document.getElementById('sellOutput');
const differenceOutput = document.getElementById('differenceOutput');

// Function to update the trading chart
async function updateChart() {
    // Destroy the previous chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Fetch the CSV data from GitHub
    const csvUrl = 'https://raw.githubusercontent.com/Awesin/TFC/main/Book2.csv';
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    // Parse the CSV data to extract x and y values for the current time
    const lines = csvData.split('\n');
    if (currentTime < lines.length) {
        const values = lines[currentTime].trim().split(',');
        const x = currentTime + 1; // X value increases by 1 with each data point
        const y = parseFloat(values[1]);
        chartData.push({ x, y });
    }

    // Create and update the line chart
    const ctx = tradingChart.getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map((dataPoint) => dataPoint.x),
            datasets: [{
                label: 'Stock Price',
                data: chartData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    min: 1,
                    max: maxX, // Set the maximum X value
                    title: {
                        display: true,
                        text: 'Custom X-Axis Title'
                    },
                    ticks: {
                        stepSize: 2, // Adjust the stepSize as needed
                    }
                },
                y: {
                    type: 'linear',
                    min: 1,
                    max: maxY, // Set the maximum Y value
                    title: {
                        display: true,
                        text: 'Stock Price'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false, // Set this to false to allow dynamic sizing
        }
    });

    // Move to the next second
    currentTime++;

    // Check if the simulation should stop
    if (currentTime > maxTime || currentTime >= lines.length) {
        stopSimulation();
    }
}

// Function to start the simulation
function startSimulation() {
    if (!simulationInterval) {
        simulationInterval = setInterval(updateChart, 1000);
    }
}

// Function to stop the simulation
function stopSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
}

// Event listener for starting the simulation
startSimulationButton.addEventListener('click', startSimulation);

// Event listener for stopping the simulation
stopSimulationButton.addEventListener('click', stopSimulation);

// Event listener for the buy button
buyButton.addEventListener('click', () => {
    // Get the current stock price and quantity
    const currentStockPrice = chartData[chartData.length - 1].y;
    const buyQuantity = parseFloat(buyQuantityInput.value);

    // Check if the quantity is valid
    if (buyQuantity > 0) {
        buyOutput.textContent = `Buy Price: $${currentStockPrice.toFixed(2)} | Quantity: ${buyQuantity}`;
    } else {
        alert('Invalid quantity. Please enter a valid quantity.');
    }
});

// Event listener for the sell button
sellButton.addEventListener('click', () => {
    // Get the current stock price, buy quantity, and sell quantity
    const currentStockPrice = chartData[chartData.length - 1].y;
    const buyQuantity = parseFloat(buyQuantityInput.value);
    const sellQuantity = parseFloat(sellQuantityInput.value);

    // Check if the quantities are valid
    if (buyQuantity > 0 && sellQuantity > 0 && sellQuantity <= buyQuantity) {
        sellOutput.textContent = `Sell Price: $${currentStockPrice.toFixed(2)} | Quantity: ${sellQuantity}`;
        const difference = currentStockPrice * sellQuantity;
        differenceOutput.textContent = `Difference: $${difference.toFixed(2)}`;
    } else {
        alert('Invalid quantities. Please enter valid quantities. Sell quantity must be less than or equal to buy quantity.');
    }
});

// Set the dimensions of the chart container dynamically
tradingChart.width = desiredWidth;
tradingChart.height = desiredHeight;

// Load chart data when the page loads
updateChart(); // This will load and display the data from the GitHub-hosted CSV when the page is refreshed
