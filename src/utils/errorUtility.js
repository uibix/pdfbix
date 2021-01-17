'use strict'

const { inherits, format } = require('util')
const errorCodes = {}

requestError('BAD_REQUEST_DATA', '%s', 400)
requestError('NO_AUTH_KEY', 'You need to pass Pdfbix auth key.', 411)
requestError('NO_URL_PROVIDED', 'Please pass a url starting with \'http\' or \'https\'.', 421)
requestError('NO_HTML_PROVIDED', 'Please pass HTML string', 422)

function requestError (code, message, statusCode = 400, errorData = {}, Base = Error) {
  if (!code) throw new Error('Backend error code must not be empty')
  if (!message) throw new Error('Backend error message must not be empty')

  code = code.toUpperCase()

  function RequestError (a, b, c) {
    Error.captureStackTrace(this, RequestError)

    this.name = 'PdfBixError'
    this.code = `${code}`

    // more performant than spread (...) operator
    if (a && b && c) { this.message = format(message, a, b, c) } else if (a && b) { this.message = format(message, a, b) } else if (a) { this.message = format(message, a) } else { this.message = message }

    this.message = `${this.message}`.replace('_', ' ')
    this.statusCode = statusCode || undefined
    this.errorData = errorData
    this.toJson = () => {
      return {
        name: this.name,
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        errorData: this.errorData
      }
    }
  }

  RequestError.prototype[Symbol.toStringTag] = 'Error'

  inherits(RequestError, Base)

  errorCodes[code] = RequestError

  return errorCodes[code]
}

module.exports = { errorCodes, requestError }
