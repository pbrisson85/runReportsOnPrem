const getWklySalesByProg = require('../queries/postgres/getFgSales/byWkForProg')
const getWklySalesByProcLevel = require('../queries/postgres/getFgSales/byWkForProgByProcLevel')
const getDistinctProcLevels = require('../queries/postgres/getDisctinctProcLevels')
const unflattenRowTemplate = require('../utils/unflattenRowTemplate')

const getWeeklyProgramSales = async (program, fy) => {
  /* FG SALES FOR PROGRAM (NO WIP, RM, BY-PROD) = total row */
  const wklyProgSalesTotal = await getWklySalesByProg(program, fy)
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
  const wklyProgSalesByProcLevel = await getWklySalesByProcLevel(program, fy)
  /*
  [
    {
        "week_serial": "2022-W01",
        "fg_treatment": "DRY",
        "lbs": 33859.6992,
        "sales": 140138.62999999998,
        "cogs": 91929.54999999999,
        "othp": 12357.330000000002
    },
    {
        "week_serial": "2022-W01",
        "fg_treatment": "PROCESSED",
        "lbs": 1930,
        "sales": 8922.5,
        "cogs": 7067.250000000001,
        "othp": 0
    },
  */

  // get row templates to group data by
  const rowTemplate = await getDistinctProcLevels(program)
  /*
  [
    {
        "row": "PROCESSED",
    },
        {
        "row": "DRY",
    },
  */

  // add total row to row template
  rowTemplate.push({ row: 'TOTAL' })

  // map data into row template
  const rowTemplate_unflat = unflattenRowTemplate(rowTemplate)

  return rowTemplate_unflat
}

module.exports = getWeeklyProgramSales
