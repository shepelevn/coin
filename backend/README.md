# Coin. Backend

The backend part of the banking system for storing and operating on
cryptocurrency assets.

## Installation and launch

1. Before you launch the project, you need Node.js and npm
2. Clone the repository to your disk and run `npm i` to install
   dependencies, then run `npm start` to run the dev server
3. By default the server listens to `http://localhost:3000`

## Username and password

At the moment there is only one account available:

* Username: `developer`
* Password: `skillbox`

For more details about how to authenticate, see the API documentation below.

## Existing accounts

Right after server starts, the following accounts exist:

1. Your user account with a long history of transfers (regular incoming
   transfers from arbitrary accounts will be received by this account):
   * 74213041477477406320783754
2. A set of other accounts that do not belong to the user, but are
   guaranteed to exist. You can use them to test the functionality of
   transferring funds from one account to another:
   * 61253747452820828268825011
   * 05168707632801844723808510
   * 17307867273606026235887604
   * 27120208050464008002528428
   * 2222400070000005
   * 5555341244441115

## API response format

All API methods respond with an object of the following general format:

```js
{
 /*
   any arbitrary value returned by the API method (null if an error occurred 
   or it is impossible to return any meaningful data)
 */
 payload,
 /*
   text description/error code of the occurred error; filled only 
   if an error occurred. In case of successful execution of the method, 
   this will always be an empty string.
 */
 error
}
```

## API methods

### GET /login

User authentication.
At this moment, the method allows signing in only for the following user:

```js
{
 login: 'developer',
 password: 'skillbox'
}
```

The method will return a payload of the following format:

```js
{ token }
```

where token - is a string, containing information to access methods
requiring authorization

**Possible errors:**

* `Invalid password` — trying to sign in with incorrect password
* `No such user` — user with such username doesn't exist

After that token is specified in `Authorization` header for methods,
which require authorization: `Authorization: Basic TOKEN`, where TOKEN
should be replaced to received token value.

If you request some method and it returns `Unauthorized` error, it means
that you forgot to put header with token inside request.

### GET /accounts

Returns array of user accounts.  
The response will be an array with information about the user's accounts
in approximately the following format:

```js
[
 {
  "account": "74213041477477406320783754",
  "balance": 0,
  "transactions": [
   {
    "amount": 1234,
    "date": "2021-09-11T23:00:44.486Z",
    "from": "61253747452820828268825011",
    "to": "74213041477477406320783754"
   }
  ]
 }
]
```

**Note:** This method returns only the last transaction from the
transaction history.

### GET /account/{id}

Method returns detailed information about user account, where {id} in the
method address is the account number.

Response format:

```js
[
 {
  "account": "74213041477477406320783754",
  "balance": 0,
  "transactions": [
   {
    "amount": 1234,
    "date": "2021-09-11T23:00:44.486Z",
    "from": "61253747452820828268825011",
    "to": "74213041477477406320783754"
   }
  ]
 }
]
```

**Note:** this method returns full transactions history for this account.

### POST /create-account

Method creates new account for user, response body content doesn't matter.

Returns object with information about created account:

```js
 "43123747452820828268825011": {
  "account": "43123747452820828268825011",
  "balance": 0,
  "mine": false,
  "transactions": []
 },
```

### POST /transfer-funds

This method transfers funds from one account to another.

Response body:

```js
{
 from, // account from which funds are debited
 to, // account to which funds are credited
 amount // amount to transfer
}
```

The method responds with an account object, from which funds were debited.

**Possible errors:**

* `Invalid account from` — the withdrawal account address is not
  specified, or this account does not belong to us
* `Invalid account to` — the deposit account is not specified, or this
  account does not exist
* `Invalid amount` — the transfer amount is not specified, or it is
  negative
* `Overdraft prevented` — you attempted to transfer more money than is
  available in the withdrawal account

### GET /all-currencies

The method's response is an array with a list of codes of all currencies used
by backend at this moment, for example:

```js
[ 'ETH', 'BTC', 'USD' ]
```

### GET /currencies

Method returns a list of currency accounts of the current user.
Response is an object with information about balance of currency account
of this user:

```js
{
 "AUD": {
  "amount": 22.16,
  "code": "AUD"
 },
 "BTC": {
  "amount": 3043.34,
  "code": "BTC"
 },
 "BYR": {
  "amount": 48.75,
  "code": "BYR"
 },
}
```

### POST /currency-buy

This method is used for performing currency exchanges.

Response body:

```js
{
 from, // currency account code from which funds are debited
 to, // currency account code to which funds are credited
 /*
  the amount that is debited, conversion is calculated automatically by 
  the server based on the current exchange rate for the given currency pair
 */
 amount
}
```

The method's response is an object with information about a balance of currency
accounts of the current user (see `/currencies`).

**Possible errors:**

* `Unknown currency code` — an incorrect currency code was provided or
  the code is not supported by the system (either the debit currency code
  or the credit currency code)
* `Invalid amount` — the transfer amount is not specified, or it is negative
* `Not enough currency` — there are no funds on the debit currency account
* `Overdraft prevented` — an attempt was made to transfer more than is
  available in the debit account.

### WebSocket /currency-feed

It's a WebSocket stream, which will send messages about currency rate changes.

Message format:

```js
{
 "type":"EXCHANGE_RATE_CHANGE",
 "from":"NZD",
 "to":"CHF",
 "rate":62.79,
 "change":1
}
```

where:

* `type` — the type of message, which can be used to filter this
  message from any other types of messages, if they are sent
* `from` — the currency code from which the conversion is made
* `to` — the currency code to which the conversion is made
* `rate` — the exchange rate of the aforementioned currencies
* `change` — the change in rate relative to the previous value:
  `1` — increase in rate, `-1` — decrease in rate,
  `0` — the rate has not changed

### GET /banks

Method returns a list of points, marking the locations of ATMs:

```js
[
  { lat: 44.878414, lon: 39.190289 },
  { lat: 44.6098268, lon: 40.1006606 }
]
```

where `lat` — latitude, `lon` — longitude.
