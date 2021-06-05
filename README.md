# Pdfbix - Convert HTML & URL to High Quality PDF

<div align="center">
<img src="https://pdfbix.s3.ap-south-1.amazonaws.com/pdfbix-logo-750x250.png" width="350" height="auto"/>
</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/pdfbix.svg?label=version)](https://www.npmjs.com/package/pdfbix)
[![NPM Licence](https://img.shields.io/npm/l/pdfbix)](https://www.npmjs.com/package/pdfbix)
[![Snyk Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/uibix/pdfbix)](https://www.npmjs.com/package/pdfbix)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)
[![NPM downloads](https://img.shields.io/npm/dt/pdfbix)](https://www.npmjs.com/package/pdfbix)

</div>

Nodejs client SDK for [Pdfbix](https://www.pdfbix.com/)

Pdfbix is one of the cheapest tool to convert your HTML or URL to pdf. You can generate pdf at the cost of setting up your own server. It's a tool developed by developers for developer so that they can focus on business logic & forget about all the hassle of maintaing & scaling servers for generating pdf.

## Installation

Download the NPM module

```javascript
npm install pdfbix --save
```

## Authorization

Create an account at [Pdfbix](https://www.pdfbix.com/signup) to get your API key.

## Usage

### Initialize the Client

Require the package in your code & create a pdfbix object.

```javascript
const { Pdfbix } = require('pdfbix');
const pdfbix = new Pdfbix({ authKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' });
```

#### All options that can be passed while creating object

| Key        | Value  | Required/Optional |         Default          |                               Description |
| :--------- | :----: | :---------------: | :----------------------: | ----------------------------------------: |
| authKey    | String |     required      |                          | Required to validate request made via sdk |
| baseUrl    | String |     optional      | <https://api.pdfbix.com> |            Used as base URL for all calls |
| apiVersion | String |     optional      |            v1            |   Changed when breaking changes are added |

### Convert URL to PDF

```javascript
// All options mentioned later in doc
const args = { fileName: 'example.pdf' }

pdfbix.convertUrlToPdf('https://example.com', args).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
```

### Convert HTML to PDF

```javascript
// All options mentioned later in doc
const args = { fileName: 'example.pdf' }

pdfbix.convertHtmlToPdf('https://example.com', args).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
```

### Async-Await Implementation

Above result can also be achieved by using `async` & `await`

```javascript
try {
    const result = await pdfbix.convertUrlToPdf('https://example.com', args)
} catch (error) {
    console.log(error)
}
```

#### All options that can be passed in `args`

| Key                 |  Value  | Required/Optional |            Default            | Description                                                                           |
| :------------------ | :-----: | :---------------: | :---------------------------: | ------------------------------------------------------------------------------------- |
| toUrl               | Boolean |     optional      |             true              | `true`: return a link to download pdf; `false`: return base64 representation of pdf   |
| fileName            | String  |     optional      | {requestId}_{currentDatetime} | Custom file name given to file                                                        |
| enableCustomStorage | Boolean |     optional      |             false             | If enabled all files will be saved to configured s3 bucket in dashboard               |
| customStorage       | String  |     optional      |                               | Will only work if `enableCustomStorage` is enabled. Valid options are `aws` and `gcp` |
| **pdfOpts**         | Object  |     optional      |              {}               | Puppeteer options that can be passed, to configure final pdf                          |

All options that can be passed into `pdfOpts` [can be found here](https://pptr.dev/#?product=Puppeteer&version=main&show=api-pagepdfoptions)

## Responses

It's recommended to enclose pdfbix call into `try-catch` block to handle unexpected response. Here are possible result format you can expect.

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "content": "https://pdfbix.s3.ap-south-1.amazonaws.com/8Cdq8LGPQOSF1vUpTlOwqQ-0000002962-1610833500980.pdf",
    "isBase64Encoded": false,
    "fileSize": 35.14258,
    "timeTaken": 6.409,
    "cost": 0.00446
  }
}
```

If `isBase64Encoded` is true then `content` will contain base64 string representing final pdf, you might need to parse that base64 String. `isBase64Encoded` will be true when you set `toUrl` as false in **args** while calling `convertHtmlToPdf` or `convertUrlToPdf`.

### Error Response

```json
{
  "statusCode": 401,
  "error": {
    "name": "BackendClientError",
    "code": "ERR_INVALID_TOKEN",
    "message": "Token you're passing is invalid.",
    "statusCode": 401,
    "errorData": {}
  },
  "message": "Token you're passing is invalid."
}
```

#### Possible Error Code

| Code                  | Status Code | Description                                                                        |
| :-------------------- | :---------: | ---------------------------------------------------------------------------------- |
| ERR_INVALID_TOKEN     |     401     | When token you're passing is not correct                                           |
| BAD_REQUEST_DATA      |     400     | Sent for any request which server can't parse or any required parameter is missing |
| NO_AUTH_KEY           |     411     | When you're not passing any authKey while initializing SDK                         |
| NEGATIVE_BALANCE      |     415     | Balance is negative in your wallet, Please recharge                                |
| INACTIVE_ACCOUNT      |     416     | Account is inactive or suspended by Admin                                          |
| BLOCKED_ACCOUNT       |     417     | Account is blocked by Admin                                                        |
| INACTIVE_APPLICATION  |     418     | Application is inactive or suspended by Admin                                      |
| BLOCKED_APPLICATION   |     419     | Application is blocked by Admin                                                    |
| NO_URL_PROVIDED       |     421     | You forget to pass url to function `convertUrlToPdf`                               |
| NO_HTML_PROVIDED      |     422     | You forget to pass HTML String to function `convertHtmlToPdf`                      |
| NO_STORAGE_CONFIGURED |     427     | You need to configure your custom storage first (currently S3 supported)           |
| EMAIL_NOT_VERIFIED    |     428     | Email is not verified. Please verify your email                                    |

## Custom Storage Configuration

### Enable s3 Storage

It's very easy to confugure your own s3 bucket, you just need to generate your [aws programmatic keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys). Its recommended to create a separate user for your project with right S3 programmatic access.

### Enable google cloud Storage

You need to create bucket in GCP using console or cli. To do so, you can follow the steps mentioned [here](https://cloud.google.com/storage/docs/quickstart-console).

To enable upload using code you need to genreate credentials or a role with `storage.objects.create` permission. You can follow the [steps in this guide](https://cloud.google.com/storage/docs/uploading-objects) to upload objects into bucket.

***Note:*** After you have generated your keys you can configure them on our Customer panel under **Account -> Custom Storage**. Your keys are stored in encrypted format, So you don't have to worry about any privacy loss.
