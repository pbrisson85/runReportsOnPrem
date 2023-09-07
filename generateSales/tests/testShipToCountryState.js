// NET while other places using NLD)

const sql = require('../../server')
const requestEmailNotification = require('../../requests/requestEmail')

const runShipToTests = async () => {
  // state should never be blank wih a USA ship to
  const blankState = await sql`
    SELECT customer_code, customer_name, shipto_code, address_source
    FROM "salesReporting".sales_line_items
    WHERE (state = '' OR sales_line_items.state IS NULL) AND country = 'USA'
    GROUP BY customer_code, customer_name, shipto_code, address_source
    `

  console.log('blankState: ', blankState)

  if (blankState.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(blankState)}`
    )
  }

  // country should never be blank
  const blankCountry = await sql`
    SELECT customer_code, customer_name, shipto_code, address_source
    FROM "salesReporting".sales_line_items
    WHERE country = '' OR country IS NULL
    GROUP BY customer_code, customer_name, shipto_code, address_source
    `

  console.log('blankCountry: ', blankCountry)

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

  console.log('outSideUsaState: ', outSideUsaState)

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

  console.log('outSideUsaCountry: ', outSideUsaCountry)

  if (outSideUsaCountry.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(outSideUsaCountry)}`
    )
  }
}

module.exports = runShipToTests
