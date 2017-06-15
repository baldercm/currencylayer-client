'use strict'

const moment              = require('moment')
const request             = require('request-promise')
const sinon               = require('sinon')
const chai                = require('chai')
const expect              = chai.expect
const CurrencyLayerClient = require('../')
const CurrencyLayerError  = require('../lib/error').CurrencyLayerError
chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

describe('CurrencyLayerClient', () => {

  describe('constructor', () => {
    it('should construct FREE plan clients by default', () => {
      let client = new CurrencyLayerClient({apiKey: API_KEY})
      expect(client.client).to.exist
      expect(client.free).to.be.true
      expect(client.baseUrl).to.equal('http://apilayer.net/api')
    })

    it('should construct NON FREE plan clients when free is false', () => {
      let client = new CurrencyLayerClient({apiKey: API_KEY, free: false})
      expect(client.client).to.exist
      expect(client.free).to.be.false
      expect(client.baseUrl).to.equal('https://apilayer.net/api')
    })

    it('should throw error on missing API KEY', () => {
      try {
        new CurrencyLayerClient()
      } catch (err) {
        expect(err.message).to.equal('apiKey must be provided')
      }
    })
  })

  describe('live()', () => {
    beforeEach(() => {
      sinon.stub(request, 'get').returns(Promise.resolve(RESPONSE_OK))
    })

    afterEach(() => {
      request.get.restore()
    })

    it('should work with empty args', () => {
      let client = new CurrencyLayerClient({apiKey: API_KEY})

      return client.live()
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/live',
          qs: { access_key: API_KEY },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={currencies(array)}', () => {
      let client      = new CurrencyLayerClient({apiKey: API_KEY})
      let currencies  = ['EUR', 'USD']

      return client.live({currencies})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/live',
          qs: { access_key: API_KEY, currencies: 'EUR,USD' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={currencies(string)}', () => {
      let client      = new CurrencyLayerClient({apiKey: API_KEY})
      let currencies  = 'EUR,USD'

      return client.live({currencies})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/live',
          qs: { access_key: API_KEY, currencies: 'EUR,USD' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={source}', () => {
      let client = new CurrencyLayerClient({apiKey: API_KEY})
      let source = 'EUR'

      return client.live({source})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/live',
          qs: { access_key: API_KEY, source: 'EUR' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={currencies,source}', () => {
      let client      = new CurrencyLayerClient({apiKey: API_KEY})
      let currencies  = ['EUR', 'USD']
      let source      = 'EUR'

      return client.live({source, currencies})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/live',
          qs: { access_key: API_KEY, source: 'EUR', currencies: 'EUR,USD' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    context('responses with success=false', () => {
      beforeEach(() => {
        request.get.returns(Promise.resolve(RESPONSE_FAIL))
      })
      it('should be rejected and properly handled', () => {
        let client = new CurrencyLayerClient({apiKey: API_KEY})

        return client.live()
        .then(() => {
          throw new Error('CurrencyLayerError expected')
        })
        .catch((err) => {
          expect(err).to.be.an.instanceof(CurrencyLayerError)
          expect(err.code).to.equal(100)
          expect(err.message).to.equal('Error message')
        })
      })
    })
  })

  describe('historical()', () => {
    beforeEach(() => {
      sinon.stub(request, 'get').returns(Promise.resolve(RESPONSE_OK))
    })

    afterEach(() => {
      request.get.restore()
    })

    it('should work with empty args (default date is now)}', () => {
      let client = new CurrencyLayerClient({apiKey: API_KEY})

      return client.historical()
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/historical',
          qs: { access_key: API_KEY, date: moment().format('YYYY-MM-DD') },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={date(string)}', () => {
      let date    = '2000-01-01'
      let client  = new CurrencyLayerClient({apiKey: API_KEY})

      return client.historical({date})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/historical',
          qs: { access_key: API_KEY, date: '2000-01-01' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={date(date)}', () => {
      let date    = new Date(2000, 0, 1)
      let client  = new CurrencyLayerClient({apiKey: API_KEY})

      return client.historical({date})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/historical',
          qs: { access_key: API_KEY, date: '2000-01-01' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={date, source}', () => {
      let date    = new Date(2000, 0, 1)
      let source  = 'EUR'
      let client  = new CurrencyLayerClient({apiKey: API_KEY})

      return client.historical({date, source})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/historical',
          qs: { access_key: API_KEY, date: '2000-01-01', source: 'EUR' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={date, currencies}', () => {
      let date        = new Date(2000, 0, 1)
      let currencies  = ['EUR', 'USD']
      let client      = new CurrencyLayerClient({apiKey: API_KEY})

      return client.historical({date, currencies})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/historical',
          qs: { access_key: API_KEY, date: '2000-01-01', currencies: 'EUR,USD' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={date, source, currencies}', () => {
      let date        = new Date(2000, 0, 1)
      let source      = 'EUR'
      let currencies  = ['EUR', 'USD']
      let client      = new CurrencyLayerClient({apiKey: API_KEY})

      return client.historical({date, source, currencies})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/historical',
          qs: { access_key: API_KEY, date: '2000-01-01', source: 'EUR', currencies: 'EUR,USD' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    context('responses with success=false', () => {
      beforeEach(() => {
        request.get.returns(Promise.resolve(RESPONSE_FAIL))
      })
      it('should be rejected and properly handled', () => {
        let client = new CurrencyLayerClient({apiKey: API_KEY})

        return client.historical()
        .then(() => {
          throw new Error('CurrencyLayerError expected')
        })
        .catch((err) => {
          expect(err).to.be.an.instanceof(CurrencyLayerError)
          expect(err.code).to.equal(100)
          expect(err.message).to.equal('Error message')
        })
      })
    })
  })

  describe('convert()', () => {
    beforeEach(() => {
      sinon.stub(request, 'get').returns(Promise.resolve(RESPONSE_OK))
    })

    afterEach(() => {
      request.get.restore()
    })

    it('should work with args={from, to, amount}', () => {
      let amount      = 10
      let from        = 'EUR'
      let to          = 'USD'
      let client      = new CurrencyLayerClient({apiKey: API_KEY})

      return client.convert({from, to, amount})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/convert',
          qs: { access_key: API_KEY, from: 'EUR', to: 'USD', amount: 10 },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    it('should work with args={from, to, amount, date}', () => {
      let amount      = 10
      let from        = 'EUR'
      let to          = 'USD'
      let date        = new Date(2000, 0, 1)
      let client      = new CurrencyLayerClient({apiKey: API_KEY})

      return client.convert({from, to, amount, date})
      .then((res) => {
        expect(res).to.equal(RESPONSE_OK)
        expect(request.get).to.have.been.calledWith({
          baseUrl: 'http://apilayer.net/api',
          uri: '/convert',
          qs: { access_key: API_KEY, from: 'EUR', to: 'USD', amount: 10, date: '2000-01-01' },
          json: true,
          method: 'GET',
          pool: undefined,
        })
      })
    })

    context('responses with success=false', () => {
      beforeEach(() => {
        request.get.returns(Promise.resolve(RESPONSE_FAIL))
      })
      it('should be rejected and properly handled', () => {
        let client = new CurrencyLayerClient({apiKey: API_KEY})

        return client.convert()
        .then(() => {
          throw new Error('CurrencyLayerError expected')
        })
        .catch((err) => {
          expect(err).to.be.an.instanceof(CurrencyLayerError)
          expect(err.code).to.equal(100)
          expect(err.message).to.equal('Error message')
        })
      })
    })
  })

  const API_KEY = 'dummyap1k3y'

  const RESPONSE_OK = {
    success: true,
  }

  const RESPONSE_FAIL = {
    success: false,
    error: {
      code: 100,
      info: 'Error message',
    }
  }
})
