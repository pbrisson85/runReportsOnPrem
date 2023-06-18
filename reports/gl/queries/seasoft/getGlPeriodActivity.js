const { createConnection } = require('../../../../database/seasoftODBC')

const getGlPeriodActivity = async fy => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for General Table OTHP ...`)

    const queryString = "SELECT \"GL Period Activity\".ACCOUNT_NUMBER, \"GL Period Activity\".DEPARTMENT_CODE, \"GL Period Activity\".NET_AMOUNTS_1 AS P1, \"GL Period Activity\".NET_AMOUNTS_2 AS P2, \"GL Period Activity\".NET_AMOUNTS_3 AS P3, \"GL Period Activity\".NET_AMOUNTS_4 AS P4, \"GL Period Activity\".NET_AMOUNTS_5 AS P5, \"GL Period Activity\".NET_AMOUNTS_6 AS P6, \"GL Period Activity\".NET_AMOUNTS_7 AS P7, \"GL Period Activity\".NET_AMOUNTS_8 AS P8, \"GL Period Activity\".NET_AMOUNTS_9 AS P9, \"GL Period Activity\".NET_AMOUNTS_10 AS P10, \"GL Period Activity\".NET_AMOUNTS_11 AS P11, \"GL Period Activity\".NET_AMOUNTS_12 AS P12 FROM 'GL Period Activity' WHERE \"GL Period Activity\".COMPANY_NUMBER = ? AND \"GL Period Activity\".FISCAL_YEAR = ?" //prettier-ignore

    const data = await odbcConn.query(queryString, ['0001', fy])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGlPeriodActivity
