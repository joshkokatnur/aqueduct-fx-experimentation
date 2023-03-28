const usdEurHistory = require('./data/usd-eur-history-2022.json');

// balances in millions
var euroBalance = 0;
var totalEuroBalance = euroBalance; // for tracking total
var usdBalance = 0;
var totalUsdBalance = usdBalance; // for tracking total

// daily euro revenue in millions
const dailyEuroRevenue = 10;

// how often we should convert to USD in days (can't go lower than 1 day because dataset isn't that granular)
const convertRate = 90000000;

// used to calculate what the total revenue would have been worth if converted at an optimal price
const targetPrice = 1.1847;

// hedging by LPing on Aqueduct (flowrate per day)
const flowUsd = 571.95 * 1.0429; //1 * 10;
const flowEur = 571.95; //1.1847 * 10;
//const flowUsd = 1 * 10.54;
//const flowEur = 1.1847 * 10.54;
const initialEuroBalance = 10000;
const initialUsdBalance = 10000;
var lpEuroBalance = initialEuroBalance;
var lpUsdBalance = initialUsdBalance;

usdEurHistory.forEach((h, i) => {

    // increment balance
    euroBalance += dailyEuroRevenue;
    totalEuroBalance += dailyEuroRevenue;

    // calc LP position
    lpEuroBalance += dailyEuroRevenue;
    lpEuroBalance -= flowEur;
    lpUsdBalance -= flowUsd;
    lpEuroBalance += flowUsd / h.value;
    lpUsdBalance += flowEur * h.value;

    // if specified, convert to USD
    if (i % convertRate == 0) {
        usdBalance += (euroBalance * h.value);
        euroBalance = 0;
    }
});

// convert remaining balance
usdBalance += (euroBalance * usdEurHistory.pop().value);
euroBalance = 0;

// convert remaining LP balance
console.log('LP Euro balance: ' + lpEuroBalance);
console.log('LP USD balance: ' + lpUsdBalance);
lpUsdBalance += (lpEuroBalance * usdEurHistory.pop().value);
lpEuroBalance = 0;

console.log('LP Euro balance: ' + lpEuroBalance);
//console.log('LP Usd balance: ' + lpUsdBalance);
//console.log('Final USD balance: $' + usdBalance + 'M');
console.log('Final USD balance: $' + (usdBalance) + 'M');
console.log('USD balance at target price: $' + (((totalEuroBalance + initialEuroBalance) * targetPrice) + initialUsdBalance) + 'M');

// base: $3528.0729999999994M
// $3571.466706765274M @ 89.7,89.7
// $3596.947624847963M @ 136.35 * 1.0429, 136.35
//   / $3708.1110000000003M

// $5746.103542428699M / $5892.811000000001M @ 179.9 * 1.0429, 179.9