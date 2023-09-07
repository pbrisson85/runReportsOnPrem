// NET while other places using NLD)

const sql = require('../../server')
const requestEmailNotification = require('../../requests/requestEmail')

const runShipToTests = async () => {
  // state should never be blank wih a USA ship to
  const blankState = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE (sl.state = '' OR sl.state = 'NULL' OR sl.state IS NULL) AND sl.country = 'USA'
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  console.log('blankState: ', blankState)

  if (blankState.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(blankState)}`
    )
  }

  // country should never be blank
  const blankCountry = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE sl.country = '' OR sl.country IS NULL
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  console.log('blankCountry: ', blankCountry)

  if (blankCountry.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(blankCountry)}`
    )
  }

  // state should always read 'OUTSIDE USA' with a non USA ship to
  const outSideUsaState = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE sl.state <> 'OUTSIDE USA' AND sl.country <> 'USA'
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  console.log('outSideUsaState: ', outSideUsaState)

  if (outSideUsaState.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(outSideUsaState)}`
    )
  }

  // state should never say 'OUTSIDE USA' with a USA ship to
  const outSideUsaCountry = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE sl.state = 'OUTSIDE USA' AND sl.country = 'USA'
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  console.log('outSideUsaCountry: ', outSideUsaCountry)

  if (outSideUsaCountry.length) {
    await requestEmailNotification(
      `Data testing exception: Blank states found in salesReporting.sales_line_items: ${JSON.stringify(outSideUsaCountry)}`
    )
  }
}

module.exports = runShipToTests
