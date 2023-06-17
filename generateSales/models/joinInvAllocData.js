const joinInvAllocData = (inAllocData, genTblOthp_unflat) => {
  const mapped = inAllocData.map(row => {
    return {
      ...row,
      contra: genTblOthp_unflat[row.EXPENSE_CODE][0].GL_CODE,
    }
  })

  return mapped
}

module.exports = joinInvAllocData
