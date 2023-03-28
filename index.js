const usdEurHistory = require('./data/usd-eur-history-2022.json');

// balances in millions
var euroBalance = 0;
var totalEuroBalance = euroBalance; // for tracking total
var usdBalance = 0;

// daily euro revenue in millions
const dailyEuroRevenue = 10;

// how often we should convert to USD in days (can't go lower than 1 day because dataset isn't that granular)
const convertRate = 1;

// used to calculate what the total revenue would have been worth if converted at an optimal price
const targetPrice = 1.1847;

usdEurHistory.forEach((h, i) => {

    // increment balance
    euroBalance += dailyEuroRevenue;
    totalEuroBalance += dailyEuroRevenue;

    // if specified, convert to USD
    if (i % convertRate == 0) {
        usdBalance += (euroBalance * h.value);
        euroBalance = 0;
    }
});

// convert remaining balance
usdBalance += (euroBalance * usdEurHistory.pop().value);
euroBalance = 0;

console.log('Final USD balance: $' + (usdBalance) + 'M');
console.log('USD balance at target price: $' + (totalEuroBalance * targetPrice) + 'M');