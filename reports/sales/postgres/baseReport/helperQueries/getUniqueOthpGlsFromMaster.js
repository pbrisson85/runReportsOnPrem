const sql = require('../../../../../server')

const getUniqueOthpGlsFromMaster = async config => {
  try {
    console.log(`${config?.user ?? null} - getUniqueOthpGlsFromMaster ...`)

    const response = await sql
      `
      SELECT othp_gl
      FROM masters.othp_names
      GROUP BY othp_gl
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = getUniqueOthpGlsFromMaster
