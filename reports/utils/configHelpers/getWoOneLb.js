const getMiscSettings_production = require('../../filters/data/getMiscSettings_production')

const getWoOneLb = reqBody => {
  let include1lbWOs
  let includeGreaterlbWOs

  if (!reqBody.miscFilter_production) {
    const miscSettings_production = getMiscSettings_production()

    include1lbWOs = miscSettings_production.filter(option => option.include1lbWOs).map(option => option.default)[0]
    includeGreaterlbWOs = miscSettings_production.filter(option => option.includeGreaterlbWOs).map(option => option.default)[0]
  } else {
    include1lbWOs = reqBody.miscFilter_production.filter(option => option.include1lbWOs).map(option => option.value)[0]
    includeGreaterlbWOs = reqBody.miscFilter_production.filter(option => option.includeGreaterlbWOs).map(option => option.value)[0]
  }

  return {
    include1lbWOs: { value: include1lbWOs, lessThan: 10 },
    includeGreaterlbWOs: { value: includeGreaterlbWOs, greaterEqual: 10 },
  }
}

module.exports = getWoOneLb
