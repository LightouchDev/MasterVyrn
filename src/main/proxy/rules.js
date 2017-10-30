// import {URL} from 'url'

// FIXME: no hardcoded rule, use object instead.
export default {
  summary: 'GBF resource monitor',
  * beforeSendResponse (requestDetail, responseDetail) {
    /*
    let url = new URL(requestDetail.url)
    if (url.hostname === 'game.granbluefantasy.jp') {
      // some data listener here
    }
    */
    return null // keep response clean if target not found.
  }
}
