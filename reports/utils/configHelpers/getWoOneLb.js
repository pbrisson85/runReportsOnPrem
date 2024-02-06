const getMiscSettings_production = require('../../filters/data/getMiscSettings_production')

const getWoOneLb = reqBody => {
  let include1lbWOs
  let includeGreaterlbWOs

  console.log('reqBody.miscFilter_production: ', reqBody.miscFilter_production)

  if (!reqBody.miscFilter_production) {
    console.log('\nreqBody.miscFilter_production NOT passed in... get defaults...\n')

    const miscSettings_production = getMiscSettings_production()

    include1lbWOs = miscSettings_production.filter(option => option.include1lbWOs).map(option => option.default)[0]
    includeGreaterlbWOs = miscSettings_production.filter(option => option.includeGreaterlbWOs).map(option => option.default)[0]
  } else {
    console.log('\nreqBody.miscFilter_production IS passed in... used passed in values...\n')

    include1lbWOs = reqBody.miscFilter_production.filter(option => option.include1lbWOs).map(option => option.value)[0]
    includeGreaterlbWOs = reqBody.miscFilter_production.filter(option => option.includeGreaterlbWOs).map(option => option.value)[0]
  }

  console.log('include1lbWOs: ', include1lbWOs)
  console.log('includeGreaterlbWOs: ', includeGreaterlbWOs)

  return {
    include1lbWOs,
    includeGreaterlbWOs,
  }
}

module.exports = getWoOneLb
