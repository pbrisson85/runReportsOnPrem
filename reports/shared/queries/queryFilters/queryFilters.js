const queryFilters = {
  programFilter: `${program ? sql`AND ms.program = ${program}` : sql``}`,
}

module.exports = queryFilters
