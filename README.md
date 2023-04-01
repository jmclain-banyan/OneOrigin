# OneOrigin

Interview technical assessment

## Round One

node script: run command

```bash
npm run roundOne
```

[source code](./refactorRoundOne.ts)

### Issue

Make a 1000 API calls to an endpoint that has a rate limit of 100 requests per 1 minute.

### Solution

Create a function that will dispatch total required requests with in the restrictions set.

### Code Explanation

My approach is to break down the steps of the process and build out as if each function is a shared utility to eliminate the overhead of repeated code blocks.

- First create a function (`getRequest`) that makes a single request and returns a response.
- Next create a function (`batchRequests`) that will make multiple requests.
- Last create a function (`sendBatch`) that will make interval requests in respect of arguments passed.

The `getRequest` function uses a predefined domain for our API service (global `API_DOMAIN`) and passing a parameter during call it ping desired endpoint. Here I added a increment to a global variable `REQUESTS_SENT` for verification of action later.

The `batchRequests` function makes multiple GET requests in a single call, passing a parameter to ping desired endpoint and amount of requests per function call. I choose recursion because of readability and time complexity. May not make much difference at 100 requests per function call, but 1000+ there may be a measurable difference.

The `sendBatch` function handles the batch of requests made withing various rate limit restrictions. Does take four arguments, The endpoint the batch of requests will be sent to, the max number of requests per batch, and the number of seconds between batches of requests, (thought seconds to be best for use in any testing suites) and last argument for the total number of requests desired. Utilizing closure, lexical scope, IIFE and recursion. I tried catch edge cases that may had been unaccounted for. Such as the first batch of requests should run with no delay (handled by `initSend ? 0 : delaySeconds * 1000`), or a use where the max number of requests per batch does't factor in to the total number of requests in to a whole number (handle by `maxRatePer > remainingTotal ? remainingTotal : maxRatePer`)

For the purposes of running in node environment vs web, consoled out running timestamps and assertion if global `REQUESTS_SENT` matches the total number of requests passed as an parameter. Areas for improvement, instead of mutating a global variable, maybe making the functions asynchronous, adding custom resolve and reject handling and  returning a `Promise` along with collected response data of batched requests. I think that would be an improvement and much more reliable and easier for debugging.
