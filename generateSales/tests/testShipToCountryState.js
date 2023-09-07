// NET while other places using NLD)

const sql = require('../../server')
const requestEmailNotification = require('../../requests/requestEmail')

const runShipToTests = async () => {
  console.log('running ship to country state tests...')

  let errors = []

  // state should never be blank wih a USA ship to
  const blankState = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE (sl.state = '' OR sl.state IS NULL) AND sl.country = 'USA'
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  if (blankState.length) {
    let err = `Data testing exception: BLANK STATE found in salesReporting.sales_line_items: ${JSON.stringify(blankState)}`
    errors.push(err)
    await requestEmailNotification(err)
  }

  // country should never be blank
  const blankCountry = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE sl.country = '' OR sl.country IS NULL
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  if (blankCountry.length) {
    let err = `Data testing exception: BLANK COUNTRY found in salesReporting.sales_line_items: ${JSON.stringify(blankCountry)}`
    errors.push(err)
    await requestEmailNotification(err)
  }

  // state should always read 'OUTSIDE USA' with a non USA ship to
  const outSideUsaState = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE sl.state <> 'OUTSIDE USA' AND sl.country <> 'USA'
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  if (outSideUsaState.length) {
    let err = `Data testing exception: missing 'OUTSIDE USA' in state field for foreign country code found in salesReporting.sales_line_items: ${JSON.stringify(
      outSideUsaState
    )}`
    errors.push(err)
    await requestEmailNotification(err)
  }

  // state should never say 'OUTSIDE USA' with a USA ship to
  const outSideUsaCountry = await sql`
    SELECT sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    FROM "salesReporting".sales_line_items AS sl
    WHERE sl.state = 'OUTSIDE USA' AND sl.country = 'USA'
    GROUP BY sl.customer_code, sl.customer_name, sl.shipto_code, sl.address_source
    `

  if (outSideUsaCountry.length) {
    let err = `Data testing exception: 'OUTSIDE USA' in state field for 'USA' country code found in salesReporting.sales_line_items: ${JSON.stringify(
      outSideUsaCountry
    )}`
    errors.push(err)
    await requestEmailNotification(err)
  }

  if (!errors.length) {
    errors.push('No errors found in ship to country state tests')
  }

  return errors
}

module.exports = runShipToTests
