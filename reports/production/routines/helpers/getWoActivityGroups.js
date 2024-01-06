const sql = require('../../../../server')

const getWoActivityGroups = async config => {
  try {
    console.log(`${config.user} - getWoActivityGroups ...`)

    const response = await sql`
        SELECT 
            DISTINCT(ms.wo_group) AS wo_group 
        FROM "invenReporting".master_supplement AS ms 
        WHERE ms.wo_group IS NOT NULL
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWoActivityGroups
