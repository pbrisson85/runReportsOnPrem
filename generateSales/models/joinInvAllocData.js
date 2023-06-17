const joinInvAllocData = (inAllocData, genTblOthp_unflat) => {
  const mapped = inAllocData.map(row => {
    return {
      ...row,
      contra: genTblOthp_unflat[row.OTHP_CODE][0].GL_CODE,
    }
  })

  return mapped
}
