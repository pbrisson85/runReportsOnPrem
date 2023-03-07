const getWklySalesByProg = require('../queries/postgres/getFgSales/byWkForProg')
const getWklySalesByProcLevel = require('../queries/postgres/getFgSales/byWkForProgByProcLevel')
const getDistinctProcLevels = require('../queries/postgres/getDisctinctProcLevels')
const unflattenRowTemplate = require('../models/unflattenRowTemplate')
const mapDataToRowTemplates = require('../models/mapDataToRowTemplates')
const { getDateEndPerWeek } = require('../queries/postgres/getDateEndPerWeek')

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
  /*
  {
    "research": {
        "row": "research"
    },
    "PROCESSED": {
        "row": "PROCESSED"
    },
    "DRY": {
        "row": "DRY"
    },
    "TOTAL": {
        "row": "TOTAL"
    }
  }
  */

  const mappedSales = mapDataToRowTemplates([...wklyProgSalesTotal, ...wklyProgSalesByProcLevel], rowTemplate_unflat)
  /*
  mappedSales
{
 "PROCESSED": {
        "row": "PROCESSED",
        "2022-W01": {
            "weight": 1930,
            "revenue": 8922.5,
            "cogs": 7067.25,
            "othp": 0,
            "netSales": 8922.5,
            "grossMargin": 1855.25,
            "revenuePerLb": 4.62,
            "cogsPerLb": 3.66,
            "othpPerLb": 0,
            "netSalesPerLb": 4.62,
            "grossMarginPerLb": 0.96
        },
        "2022-W02": {
            "weight": 12560,
            "revenue": 57672,
            "cogs": 43752.26,
            "othp": 3895.99,
            "netSales": 53776.01,
            "grossMargin": 10023.75,
            "revenuePerLb": 4.59,
            "cogsPerLb": 3.48,
            "othpPerLb": 0.31,
            "netSalesPerLb": 4.28,
            "grossMarginPerLb": 0.8
        },
  */

  const flattenedMappedSales = Object.values(mappedSales)

  // get data column names
  const dataCols = await getDateEndPerWeek(fy)
  /*
   "cols": [
        {
            "dataname": "2022-W01",
            "displayname": "4/9/2022"
        },
        {
            "dataname": "2022-W02",
            "displayname": "4/16/2022"
        },
        {
            "dataname": "2022-W03",
            "displayname": "4/23/2022"
        },
  */

  // return
  return { data: flattenedMappedSales, cols: dataCols }
}

module.exports = getWeeklyProgramSales
