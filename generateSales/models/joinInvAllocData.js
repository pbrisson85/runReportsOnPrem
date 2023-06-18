const joinInvAllocData = (inAllocData, genTblOthp_unflat, deletedOthp_unflat) => {
  const mapped = inAllocData.map(row => {
    let contra = 9999

    if (typeof genTblOthp_unflat[row.EXPENSE_CODE] !== 'undefined') {
      contra = genTblOthp_unflat[row.EXPENSE_CODE][0].GL_CODE
    } else {
      // if undefined then likely the opthp code was deleted form the general file. look at the deleted othp code table in postgres:
      if (typeof deletedOthp_unflat[row.EXPENSE_CODE] !== 'undefined') {
        contra = deletedOthp_unflat[row.EXPENSE_CODE][0].contra
      }
    }

    return {
      ...row,
      contra,
    }
  })

  return mapped
}

module.exports = joinInvAllocData
