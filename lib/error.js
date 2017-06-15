'use strict'

class CurrencyLayerError extends Error {
  constructor({code, message}) {
    super()
    this.name     = 'CurrencyLayerError'
    this.code     = code
    this.message  = message
  }
}

function handleErrors(res) {
  if (!res.success) {
    throw new CurrencyLayerError({code: res.error.code, message: res.error.info})
  }

  return res
}

exports.CurrencyLayerError  = CurrencyLayerError
exports.handleErrors        = handleErrors
