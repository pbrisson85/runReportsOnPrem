// NET while other places using NLD)

const sql = require('../../server')
const requestEmailNotification = require('../../requests/requestEmail')

const runShipToTests = async () => {
  // state should never be blank wih a USA ship to
  const blankState = await sql`
    SELECT customer_code, customer_name, shipto_code, address_source
    FROM "salesReporting".sales_line_items
    WHERE state = '' AND country = 'USA'
    GROUP BY customer_code, customer_name, shipto_code, address_source
    `

  if (blankState.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(blankState)}`
    )
  }

  // country should never be blank
  const blankCountry = await sql`
    SELECT customer_code, customer_name, shipto_code, address_source
    FROM "salesReporting".sales_line_items
    WHERE country = ''
    GROUP BY customer_code, customer_name, shipto_code, address_source
    `

  if (blankCountry.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(blankCountry)}`
    )
  }

  // state should always read 'OUTSIDE USA' with a non USA ship to
  const outSideUsaState = await sql`
    SELECT customer_code, customer_name, shipto_code, address_source
    FROM "salesReporting".sales_line_items
    WHERE state <> 'OUTSIDE USA' AND country <> 'USA'
    GROUP BY customer_code, customer_name, shipto_code, address_source
    `

  if (outSideUsaState.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(outSideUsaState)}`
    )
  }

  // state should never say 'OUTSIDE USA' with a USA ship to
  const outSideUsaCountry = await sql`
    SELECT customer_code, customer_name, shipto_code, address_source
    FROM "salesReporting".sales_line_items
    WHERE state = 'OUTSIDE USA' AND country = 'USA'
    GROUP BY customer_code, customer_name, shipto_code, address_source
    `

  if (outSideUsaCountry.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(outSideUsaCountry)}`
    )
  }
}

module.exports = runShipToTests
