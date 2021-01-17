/**
 * @author: Sumeet Kumar (sumitsk20@gmail.com)
 * @description: This file contain utility function to promisify request.
 */

'use strict'

const http = require('http')
const https = require('https')
const qs = require('querystring')
const urlUtil = require('url')

const { errorCodes } = require('./errorUtility')

const makeRequest = async ({ url, method = 'GET', params, headers = {}, postData }) => {
  const lib = url.startsWith('https://') ? https : http

  let { hostname, port, pathname } = new urlUtil.URL(url)

  if (!port) { port = url.startsWith('https://') ? 443 : 80 }

  const options = {
    hostname,
    port: port,
    path: params ? `${pathname}?${qs.encode(params)}` : pathname || '/',
    method: method.toUpperCase(),
    headers
  }
  return new Promise((resolve, reject) => {
    const req = lib.request(options, result => {
      const data = []

      result.on('data', chunk => {
        data.push(chunk)
      })

      result.on('end', () => {
        const jsonResult = JSON.parse(Buffer.concat(data).toString())
        if (jsonResult.statusCode < 200 && jsonResult.statusCode > 299) return reject(new errorCodes.BAD_REQUEST_DATA(jsonResult.message))
        resolve(jsonResult)
      })
    })

    req.on('error', reject)

    if (postData) { req.write(postData) }

    req.end()
  })
}

module.exports = makeRequest
