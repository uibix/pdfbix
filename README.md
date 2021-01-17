# Pdfbix - Convert HTML & URL to High Quality PDF

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

| Key                 |  Value  | Required/Optional |            Default            | Description                                                                         |
| :------------------ | :-----: | :---------------: | :---------------------------: | ----------------------------------------------------------------------------------- |
| toUrl               | Boolean |     optional      |             true              | `true`: return a link to download pdf; `false`: return base64 representation of pdf |
| fileName            | String  |     optional      | {requestId}_{currentDatetime} | Custom file name given to file                                                      |
| enableCustomStorage | Boolean |     optional      |             false             | If enabled all files will be saved to configured s3 bucket in dashboard             |
| **pdfOpts**         | Object  |     optional      |              {}               | Puppeteer options that can be passed, to configure final pdf                        |

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

| Code                 | Status Code | Description                                                                        |
| :------------------- | :---------: | ---------------------------------------------------------------------------------- |
| ERR_INVALID_TOKEN    |     401     | When token you're passing is not correct                                           |
| BAD_REQUEST_DATA     |     400     | Sent for any request which server can't parse or any required parameter is missing |
| NO_AUTH_KEY          |     411     | When you're not passing any authKey while initializing SDK                         |
| NEGATIVE_BALANCE     |     415     | Balance is negative in your wallet, Please recharge                                |
| INACTIVE_ACCOUNT     |     416     | Account is inactive or suspended by Admin                                          |
| BLOCKED_ACCOUNT      |     417     | Account is blocked by Admin                                                        |
| INACTIVE_APPLICATION |     418     | Application is inactive or suspended by Admin                                      |
| BLOCKED_APPLICATION  |     419     | Application is blocked by Admin                                                    |
| NO_URL_PROVIDED      |     421     | You forget to pass url to function `convertUrlToPdf`                               |
| NO_HTML_PROVIDED     |     422     | You forget to pass HTML String to function `convertHtmlToPdf`                      |
| EMAIL_NOT_VERIFIED   |     428     | Email is not verified. Please verify your email                                    |