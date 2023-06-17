const joinInvAllocData = (inAllocData, genTblOthp_unflat) => {
  const mapped = inAllocData.map(row => {
    const contra = genTblOthp_unflat[row.EXPENSE_CODE][0]?.GL_CODE

    return {
      ...row,
      contra,
    }
  })

  return mapped
}

module.exports = joinInvAllocData
