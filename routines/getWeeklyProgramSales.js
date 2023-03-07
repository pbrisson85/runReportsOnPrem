const getWeeklySalesByProgram = require('../queries/postgres/getFgSales/byWeekForProg')
const getWklySalesByProcessingLevel = require('../queries/postgres/getFgSales/byWeekForProgByProcLevel')

const getWeeklyProgramSales = async (program, fy) => {
  /* FG SALES FOR PROGRAM (NO WIP, RM, BY-PROD) = total row */
  const wklyProgSalesTotal = await getWeeklySalesByProgram(program, fy)
  /*
  [
    {
        "week_serial": "2022-W01",
        "lbs": -3660,
        "sales": -17245,
        "cogs": -13828.28,
        "othp": 100.26999999999998
    },
    {
        "week_serial": "2022-W02",
        "lbs": 35178,
        "sales": 116087.4,
        "cogs": 110577.4,
        "othp": 534.7099999999919
    },
  */

  /* FG SALES BY PROCESSING LEVEL FOR PROGRAM (NO WIP, RM, BY-PROD) = detail row */
  const wklyProgSalesByProcLevel = await getWklySalesByProcessingLevel(program, fy)

  return wklyProgSalesByProcLevel
}

module.exports = getWeeklyProgramSales
