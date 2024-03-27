const openPoCols = require('./colsOpenPo')
const allCashPoCols = require('./colsAllCashPo')
const apPoCols = require('./colsApPo')
const unvoucheredPoCols = require('./colsUnvouchPo')

// Note that the key of this map matches the colType of the col
const detailColsMap = {
  ap: apPoCols,
  purchaseOrder: openPoCols,
  allPoCash: allCashPoCols,
  unvouchered: unvoucheredPoCols,
}

module.exports = detailColsMap
