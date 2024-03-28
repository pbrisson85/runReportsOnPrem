const sql = require('../../../../../server')

const getOthpDefinitions = async () => {
  try {
    console.log(`${config.user} - getOthpDefinitions ...`)

    const response = await sql
      `
      SELECT othp_gl, display_name
      FROM masters.othp_names
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = getOthpDefinitions
