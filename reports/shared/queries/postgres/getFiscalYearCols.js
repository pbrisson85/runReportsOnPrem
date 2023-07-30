const getFiscalYearCols = async () => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for fiscal years in sales subledger ...`)

  const fys = await pgClient.query(
    `SELECT 
      DISTINCT(sl.fiscal_year) AS dataName, 
      sl.fiscal_year AS displayName, TRUE AS showFyTrendflag
    FROM "salesReporting".sales_line_items AS sl 
    
    ORDER BY sl.fiscal_year ASC`
  )

  await pgClient.end()

  return fys.rows
}

const getFiscalYearYtdCols = async () => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for fiscal years in sales subledger ...`)

  const fys = await pgClient.query(
    `SELECT 
      DISTINCT(sl.fiscal_year) || '_ytd' AS dataName, 
      sl.fiscal_year  || ' YTD' AS displayName, TRUE AS showFyTrendflag
    FROM "salesReporting".sales_line_items AS sl 
    
    ORDER BY sl.fiscal_year || '_ytd' ASC`
  )

  await pgClient.end()

  return fys.rows
}

module.exports.getFiscalYearCols = getFiscalYearCols
module.exports.getFiscalYearYtdCols = getFiscalYearYtdCols
