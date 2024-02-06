const getMiscSettings_production = require('../../filters/data/getMiscSettings_production')

const getWoOneLb = reqBody => {
  let include1lbWOs
  let includeGreaterlbWOs

  console.log('reqBody.miscFilter_production: ', reqBody.miscFilter_production)

  if (!reqBody.miscFilter_production) {
    const miscSettings_production = getMiscSettings_production()

    include1lbWOs = miscSettings_production.filter(option => option.include1lbWOs).map(option => option.default)
    includeGreaterlbWOs = miscSettings_production.filter(option => option.includeGreaterlbWOs).map(option => option.default)
  } else {
    include1lbWOs = reqBody.miscFilter_production.filter(option => option.include1lbWOs).map(option => option.value)
    includeGreaterlbWOs = reqBody.miscFilter_production.filter(option => option.includeGreaterlbWOs).map(option => option.value)
  }

  return {
    include1lbWOs,
    includeGreaterlbWOs,
  }
}

module.exports = getWoOneLb
