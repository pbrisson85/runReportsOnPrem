const getReportFormats_sales = require('../../filters/data/getReportFormats_sales')
const getReportFormats_inven = require('../../filters/data/getReportFormats_inven')
const getReportFormats_production = require('../../filters/data/getReportFormats_production')

const getBaseFormatDefault = reqBody => {
  // If there is an L1 field then reqBody has the format and the default is not needed
  if (typeof reqBody?.reportFormat?.l1_field !== 'undefined') return null

  let reportFormats

  switch (reqBody.module) {
    case 'inven':
      reportFormats = getReportFormats_inven()
      break
    case 'sales':
      reportFormats = getReportFormats_sales()
      break
    case 'production':
      reportFormats = getReportFormats_production()
      break
    default:
      reportFormats = getReportFormats_sales()
      break
  }

  const defaultFormat = reportFormats.filter(format => format.default)

  return defaultFormat[0] // should only be one default
}

module.exports = getBaseFormatDefault
