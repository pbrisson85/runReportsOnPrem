const queryFilters = {
  programFilter: (program, sql) => `${program ? sql`AND ms.program = ${program}` : sql``}`,
}

module.exports = queryFilters
