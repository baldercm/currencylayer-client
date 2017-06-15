'use strict'

const _             = require('lodash')
const request       = require('request-promise')
const moment        = require('moment')
const handleErrors  = require('./error').handleErrors

const BASE_URL_HTTP   = 'http://apilayer.net/api'
const BASE_URL_HTTPS  = 'https://apilayer.net/api'

class CurrencyLayerClient {
  constructor({apiKey='', free=true} = {}) {
    if (_.isEmpty(apiKey)) {
      throw new Error('apiKey must be provided')
    }

    this.free     = free
    this.baseUrl  = this.free ? BASE_URL_HTTP : BASE_URL_HTTPS

    this.client = request.defaults({
      baseUrl: this.baseUrl,
      qs: {
        access_key: apiKey,
      },
      json: true,
    })
  }

  live({currencies, source} = {}) {
    if (_.isArray(currencies)) {
      currencies = _.join(currencies, ',')
    }

    return this.client.get({
      uri: '/live',
      qs: {currencies, source},
    })
    .then(handleErrors)
  }

  historical({date, currencies, source} = {}) {
    if (_.isArray(currencies)) {
      currencies = _.join(currencies, ',')
    }

    if (!_.isString(date)) {
      date = moment(date).format('YYYY-MM-DD')
    }

    return this.client.get({
      uri: '/historical',
      qs: {date, currencies, source},
    })
    .then(handleErrors)
  }

  convert({from, to, amount, date} = {}) {
    if (date && !_.isString(date)) {
      date = moment(date).format('YYYY-MM-DD')
    }

    return this.client.get({
      uri: '/convert',
      qs: {from, to, amount, date},
    })
    .then(handleErrors)
  }
}

module.exports = CurrencyLayerClient
