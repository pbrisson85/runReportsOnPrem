const queryFilters = {
  programFilter: program => `${program ? sql`AND ms.program = ${program}` : sql``}`,
}

module.exports = queryFilters
