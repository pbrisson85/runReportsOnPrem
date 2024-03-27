const sql = require('../../../server')

const getPoCashStart = async () => {
  try {
    const response = await sql`SELECT MIN(pmt.payment_due_use) AS payment_due_use FROM "purchaseReporting".payments AS pmt`

    return response[0].payment_due_use
  } catch (error) {
    console.error(error)
    return error
  }
}

const getPoCashEnd = async () => {
  try {
    const response = await sql`SELECT MAX(pmt.payment_due_use) AS payment_due_use FROM "purchaseReporting".payments AS pmt`

    return response[0].payment_due_use
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getPoCashStart = getPoCashStart
module.exports.getPoCashEnd = getPoCashEnd
