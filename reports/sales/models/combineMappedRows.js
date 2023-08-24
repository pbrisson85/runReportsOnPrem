const combineMappedRows = (mappedSales, mappedInven) => {
  const combinedRows = {}

  Object.keys(mappedSales).forEach(rowKey => {
    combinedRows[rowKey] = {
      ...mappedSales[rowKey],
      ...mappedInven[rowKey],
    }
  })

  return combinedRows
}

module.exports = combineMappedRows
