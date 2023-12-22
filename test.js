const { subWeeks, addDays } = require('date-fns')

const getTrailingWeeksStartDate = (weeks, endDate) => {
  const startDate = addDays(subWeeks(endDate, weeks), 1)

  return startDate
}

const endDate = new Date('12-23-2023')

const startDate = getTrailingWeeksStartDate(2, endDate)

console.log('startDate: ', startDate)
console.log('endDate: ', endDate)
