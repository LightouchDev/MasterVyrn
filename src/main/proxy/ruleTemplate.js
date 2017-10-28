export default {
  // introduction
  summary: 'my customized rule for AnyProxy',
  // intercept before send request to server
  * beforeSendRequest (requestDetail) { /* ... */ },
  // deal response before send to client
  * beforeSendResponse (requestDetail, responseDetail) { /* ... */ },
  // if deal https request
  * beforeDealHttpsRequest (requestDetail) { /* ... */ },
  // error happened when dealing requests
  * onError (requestDetail, error) { /* ... */ },
  // error happened when connect to https server
  * onConnectError (requestDetail, error) { /* ... */ }
}
