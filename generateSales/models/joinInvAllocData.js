const joinInvAllocData = (inAllocData, genTblOthp_unflat) => {
  const mapped = inAllocData.map(row => {
    let contra = 9999

    if (typeof genTblOthp_unflat[row.EXPENSE_CODE] !== 'undefined') {
      contra = genTblOthp_unflat[row.EXPENSE_CODE][0].GL_CODE
    }

    return {
      ...row,
      contra,
    }
  })

  return mapped
}

module.exports = joinInvAllocData
