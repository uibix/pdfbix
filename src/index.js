/**
 * @author: Sumeet Kumar (sumitsk20@gmail.com)
 * @description: This file is responsible for code sending, resending and verifying the otp by calling MSG91 APIs.
 */

'use strict'

const makeRequest = require('./utils/requestUtility')
const { errorCodes } = require('./utils/errorUtility')

class Pdfbix {
  /**
   * Creates a new Pdfbix instance
   * @param {string} authKey Authentication key.
   */

  constructor (args = {}) {
    if (!args.authKey) throw new errorCodes.NO_AUTH_KEY()
    this.authKey = args.authKey
    this.baseUrl = args.baseUrl || 'https://api.pdfbix.com'
    this.apiVersion = args.apiVersion || 'v1'

    this.APIs = {
      convertUrlToPdf: { url: `${this.baseUrl}/${this.apiVersion}/convert-url`, method: 'POST' },
      convertHtmlToPdf: { url: `${this.baseUrl}/${this.apiVersion}/convert-html`, method: 'POST' }
    }

    this.convertUrlToPdf = this.convertUrlToPdf.bind(this)
    this.convertHtmlToPdf = this.convertHtmlToPdf.bind(this)
  }

  /**
   * Convert provided URL to PDF
   * @param {string} url URL that will be fetched & converted to pdf
   * @param {object, optional} args
   * Return promise
   */

  async convertUrlToPdf (url = '', args = {}) {
    url = String(url)
    if (url.length < 1 || !(url.startsWith('http://') || (url.startsWith('https://')))) throw new errorCodes.NO_URL_PROVIDED()
    const postData = JSON.stringify({
      url: url,
      pdfOpts: args.pdfOpts,
      fileName: args.fileName,
      toUrl: args.toUrl
    })
    const options = {
      url: this.APIs.convertUrlToPdf.url,
      method: this.APIs.convertUrlToPdf.method,
      headers: {
        authorization: this.authKey,
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      postData: postData
    }
    return await makeRequest(options)
  }

  /**
   * Convert provided HTML to PDF
   * @param {string} html receiver's mobile number along with country code
   * @param {object, optional} args
   * Return promise
   */

  async convertHtmlToPdf (html = '', args = {}) {
    html = String(html)
    if (html.length < 1) throw new errorCodes.NO_HTML_PROVIDED()
    const postData = JSON.stringify({
      html: html,
      pdfOpts: args.pdfOpts,
      fileName: args.fileName,
      toUrl: args.toUrl
    })
    const options = {
      url: this.APIs.convertHtmlToPdf.url,
      method: this.APIs.convertHtmlToPdf.method,
      headers: {
        authorization: this.authKey,
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      postData: postData
    }
    return await makeRequest(options)
  }
}

module.exports = Pdfbix
