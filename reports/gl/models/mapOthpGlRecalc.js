const mapOthpGlRecalc = (othpGl, contraSalesGlMap_unflat, majCodeGlMap_unflat) => {
  const mapped = othpGl.map(othp => {
    // Find OTHP type (rebate, commission, discount, outbound)
    let othpType = 'OTHER' // example: OTHP mapped to 9010 extended terms
    let allocationGl = '9999' // example: OTHP mapped to 9010 extended terms

    if (typeof contraSalesGlMap_unflat[othp.othp_gl] !== 'undefined') {
      othpType = contraSalesGlMap_unflat[othp.othp_gl].category
      allocationGl = contraSalesGlMap_unflat[othp.othp_gl].allocation
    }

    // Find OTHP allocation GL accounts
    let allocattedGl = '9999' // example: OTHP mapped to 9010 extended terms

    if (typeof majCodeGlMap_unflat[othp.major_code_name] !== 'undefined') {
      allocattedGl = majCodeGlMap_unflat[othp.major_code_name][othpType]
    }

    return {
      ...othp,
      othpType,
      allocationGl,
      allocattedGl,
    }
  })

  return mapped
}

module.exports = mapOthpGlRecalc
