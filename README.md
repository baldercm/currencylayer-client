[![Build Status](https://travis-ci.org/baldercm/currencylayer-client.svg?branch=master)](https://travis-ci.org/baldercm/currencylayer-client)
[![Coverage Status](https://coveralls.io/repos/github/baldercm/currencylayer-client/badge.svg?branch=master)](https://coveralls.io/github/baldercm/currencylayer-client?branch=master)

baldercm/currencylayer-client
==============

A nodejs client to consume the CurrencyLayer API for exchange rates & currency conversion.

See https://currencylayer.com/documentation for further details.

## Installation

Install the module using npm:

```bash
npm i --save currencylayer-client
```

## Basic Usage

You can instantiate the client passing your API key:

```javascript
const CurrencyLayerClient = require('currencylayer-client')

// for FREE plans, will use HTTP endpoints
let client = new CurrencyLayerClient({apiKey: 'YOURAPIKEY'})

// for NON FREE plans, will use HTTPS endpoints
let client = new CurrencyLayerClient({apiKey: 'YOURAPIKEY', free: false})
```

All client methods return a (bluebird) Promise:

- a promise resolved with the full response body for `success=true` responses

```javascript
// succesfull response resolves with body
{
  "success": true,
  "terms": "https://currencylayer.com/terms",
  "privacy": "https://currencylayer.com/privacy",
  "timestamp": 1432400348,
  "source": "USD",
  "quotes": {
    "USDAUD": 1.278342,
    "USDEUR": 0.908019,
    "USDGBP": 0.645558,
    "USDPLN": 3.731504
  }
}
```

- a promise rejected with an error holding the code and info for `success=false` responses

```javascript
// fail response rejects with error
{
  "success": false,
  "error": {
    "code": 104,
    "info": "Your monthly usage limit has been reached. Please upgrade your subscription plan."    
  }
}

client.live()
.catch(err => {
  console.log(err.code)    // 104
  console.log(err.message) // Your monthly usage limit has been reached...
})
```


### `live({currencies, source})`

Will get the live rate for the given currencies and source.

All parameters are optional.

Remember source param is only available for non-free plans.

```javascript
client.live()

// currencies as string
client.live({currencies: 'GBP,USD', source: 'EUR'})

// currencies as array
client.live({currencies: ['GBP', 'USD'], source: 'EUR'})
```


### `historical({date, currencies, source})`

Will get the historical rate for the given date, currencies and source.

All parameters are optional.

Remember source param is only available for non-free plans.

```javascript
// date default to current day
client.historical()

// currencies as string, date as string
client.historical({date: '2000-01-01', currencies: 'GBP,USD', source: 'EUR'})

// currencies as array, date as date
client.historical({date: new Date(2000, 0, 1), currencies: ['GBP', 'USD'], source: 'EUR'})
```


### `convert({from, to, amount, date})`

Will convert the given amount.

`from`, `to` and `amount` are required, `date` is optional.

Remember `convert()` is only available for non-free plans.

```javascript
// date default to current day
client.convert({from: 'EUR', to: 'USD', amount: 10})

// date as string
client.convert({date: '2000-01-01', from: 'EUR', to: 'USD', amount: 10})

// date as date
client.convert({date: new Date(2000, 0, 1), from: 'EUR', to: 'USD', amount: 10})
```


## Contributing

```bash
git clone https://github.com/baldercm/currencylayer-client
npm install
npm test
npm run lint
```


## License
[MIT](LICENSE)
