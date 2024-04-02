const unflattenByCompositKey = require('../../../../utils/unflattenByCompositKey')
const getOthpDefinitions = require('../helperQueries/getOthpDefinitions')
const getUniqueOthpGlsFromMaster = require('../helperQueries/getUniqueOthpGlsFromMaster')

const buildOthpMenuOptions = async () => {
  // if there is a date range that does not have any othp gl's, return the master othp gl's
  const uniqueOthpGls = await getUniqueOthpGlsFromMaster()

  const othpDefinitions = await getOthpDefinitions()
  const othpDef_unflat = unflattenByCompositKey(othpDefinitions, { 1: 'othp_gl' })
  const menu = uniqueOthpGls.map(gl => {
    let display_name = othpDef_unflat?.[gl.othp_gl]?.display_name

    return {
      label: display_name ? `othp_${display_name.toUpper()} $` : `othp_${gl.othp_gl} $`,
      dataName: display_name ? `othp_${display_name}` : `othp_${gl.othp_gl}`,
      decimals: 0,
      cols: [],
      default: false,
    }
  })

  return menu
}

module.exports = buildOthpMenuOptions
