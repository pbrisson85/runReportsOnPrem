const getWeeklySalesByProgram = require('../queries/postgres/getSalesByWeekByProgram')

const getWeeklyProgramSales = async (program, fy) => {
  const weeklyProgramSalesTotal = await getWeeklySalesByProgram(program, fy)

  return weeklyProgramSalesTotal
}

module.exports = getWeeklyProgramSales
